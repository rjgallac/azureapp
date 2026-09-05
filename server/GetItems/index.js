const { randomUUID } = require('crypto');
const https = require('https');
const { TableClient } = require('@azure/data-tables');

module.exports = async function (context, req) {
    const connectionString = process.env.StorageConnectionString;
    const tableName = process.env.TABLE_NAME || "Todos";
    // Initialize the table-specific client instead of the general storage client.
    const tableClient = TableClient.fromConnectionString(connectionString, tableName, { allowInsecureConnection: true });

    try {
        if (req.method === 'GET') {
            // Fetch all items, filtering for incomplete todos.
            const entities = await tableClient.listEntities({ filter: 'completed eq false' });
            items = [];
            for await (const entity of entities) {
                items.push({
                    id: entity.rowKey,
                    text: entity.text,
                    completed: entity.completed,
                    createdAt: entity.createdAt
                });
            }
            
            context.res = { body: items };
            return;
        }

        if (req.method === 'POST') {
            const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
            if (!text) {
                context.res = { status: 400, body: { message: 'Todo text is required.' } };
                return;
            }


            
            const item = {
                text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            // Use a unique ID as the Row Key.
            const rowKey = randomUUID();
            // Use a fixed partition key for all todos.
            const partitionKey = "Todos"; 
            
            await tableClient.createEntity({partitionKey: partitionKey,rowKey, text, completed: false, createdAt: new Date().toISOString()});
            context.res = { status: 201, body: item };
            return;
        }

        if (req.method === 'PUT') {
            const rowKey = req.body?.id;
            console.log(`Updating entity with RowKey: ${rowKey}`);

            let completed = req.body?.completed;

            // Coerce completed to boolean if it's a string representation of boolean
            if (typeof completed === 'string') {
                completed = completed.toLowerCase() === 'true';
            }

            if (!rowKey || typeof completed === 'undefined') {
                context.res = {
                    status: 400,
                    body: { message: 'Todo id and completed value are required.' }
                };
                return;
            }

            // Assuming all todos share the same partition key for simplicity.
            const partitionKey = "Todos"; 
            console.log(`PartitionKey: ${partitionKey}, RowKey: ${rowKey}, Completed: ${completed}`);
            // 1. Check if the item exists
            const existingItem = await tableClient.getEntity(partitionKey, rowKey).catch(err => {
                if (err.statusCode === 404) {
                    return null; // Item not found
                }
                throw err; // Rethrow other errors
            });
            if (!existingItem) {
                context.res = { status: 404, body: { message: 'Todo not found.' } };

                return;
            }

            // 2. Update the entity
            const updatedItem = {partitionKey, rowKey, completed };
            console.log(`Updating entity: ${JSON.stringify(updatedItem)}`);
            await tableClient.updateEntity( updatedItem, "Merge" );
            context.res = { body: existingItem };
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