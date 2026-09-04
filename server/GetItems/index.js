// This function is triggered by an HTTP request
module.exports = async function (context, req) {
    // 1. Initialize Cosmos DB client (Connection string stored in Application Settings)
    const { CosmosClient } = require("@azure/cosmos");
    const client = new CosmosClient(process.env.CosmosDBConnectionString);
    const dbName = process.env.DB_NAME || "YourDatabase";
    const containerName = process.env.CONTAINER_NAME || "YourContainer";
    const containerClient = client.database(dbName).container(containerName);
    context.log(process.env.CosmosDBConnectionString)
    context.log('Starting database query for items...');

    try {
        // 2. Perform the read operation
        const { resources: items } = await containerClient.items.query({ query: 'SELECT * FROM c' });
        
        // Safely default items to an empty array if the query returns no resources
        const retrievedItems = items || [];
        
        context.log(`Successfully retrieved ${retrievedItems.length} items.`);
        
        context.res = {
            // 3. Return the data formatted as JSON
            body: retrievedItems
        };
    } catch (err) {
        context.log.error(`Database query failed: ${err.message}`);
        context.res = {
            status: 500,
            body: { message: "Database query failed.", details: err.message }
        };
    }
};