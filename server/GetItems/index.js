const { randomUUID } = require('crypto');
const https = require('https');
const { CosmosClient } = require('@azure/cosmos');

module.exports = async function (context, req) {
    const connectionString = process.env.CosmosDBConnectionString;
    const useLocalEmulator = process.env.CosmosDBAllowInsecureTLS === 'true'
        && connectionString?.includes('https://localhost:8081');
    const client = useLocalEmulator
        ? new CosmosClient({
            connectionString,
            agent: new https.Agent({ rejectUnauthorized: false })
        })
        : new CosmosClient(connectionString);
    const dbName = process.env.DB_NAME || "YourDatabase";
    const containerName = process.env.CONTAINER_NAME || "YourContainer";
    const containerClient = client.database(dbName).container(containerName);

    try {
        if (req.method === 'GET') {
            const { resources: items } = await containerClient.items.query({
                query: 'SELECT * FROM c ORDER BY c.createdAt DESC'
            });
            context.res = { body: items || [] };
            return;
        }

        if (req.method === 'POST') {
            const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
            if (!text) {
                context.res = { status: 400, body: { message: 'Todo text is required.' } };
                return;
            }

            const item = {
                id: randomUUID(),
                text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            const { resource } = await containerClient.items.create(item);
            context.res = { status: 201, body: resource || item };
            return;
        }

        if (req.method === 'PUT') {
            const id = typeof req.body?.id === 'string' ? req.body.id : '';
            if (!id || typeof req.body?.completed !== 'boolean') {
                context.res = {
                    status: 400,
                    body: { message: 'Todo id and completed value are required.' }
                };
                return;
            }

            const { resources: matches } = await containerClient.items.query({
                query: 'SELECT * FROM c WHERE c.id = @id',
                parameters: [{ name: '@id', value: id }]
            }).fetchAll();
            const existingItem = matches[0];
            if (!existingItem) {
                context.res = { status: 404, body: { message: 'Todo not found.' } };
                return;
            }

            const { resource: containerDefinition } = await containerClient.read();
            const partitionKeyPath = containerDefinition?.partitionKey?.paths?.[0];
            const partitionKeyValue = partitionKeyPath
                ?.replace(/^\//, '')
                .split('/')
                .reduce((value, property) => value?.[property], existingItem);
            const updatedItem = { ...existingItem, completed: req.body.completed };
            const { resource } = await containerClient.item(id, partitionKeyValue).replace(updatedItem);
            context.res = { body: resource || updatedItem };
            return;
        }

        context.res = { status: 405, body: { message: 'Method not allowed.' } };
    } catch (err) {
        context.log.error(`Todo request failed: ${err.message}`);
        context.res = {
            status: 500,
            body: { message: 'Todo request failed.', details: err.message }
        };
    }
};