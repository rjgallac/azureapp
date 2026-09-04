// This function is triggered by an HTTP request
module.exports = async function (context, req) {
    // 1. Initialize Cosmos DB client (Connection string stored in Application Settings)
    const { CosmosClient } = require("@azure/cosmos");
    const client = new CosmosClient({ endpoint: process.env.COSMOS_ENDPOINT, key: process.env.COSMOS_KEY });
    const container = client.database('YourDatabase').container('YourContainer');

    try {
        // 2. Perform the read operation
        const { resources: items } = await container.items.query({ query: 'SELECT * FROM c' });
        
        context.res = {
            // 3. Return the data formatted as JSON
            body: items
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: { message: "Database query failed." }
        };
    }
};