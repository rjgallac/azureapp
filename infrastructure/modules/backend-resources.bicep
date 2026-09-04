param location string
// Using the Core API as requested.
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
  name: 'todos-cosmos-db' // Using a unique name
  location: location
  sku: {
    name: 'Standard'
    family: '4'
  }
  properties: {
    databaseAccountOfferType: 'Standard'
    databaseAccountKind: 'Global'
    locations: [
      {
        locationName: location
        failoverPriority: 0
      }
    ]
  }
}

// --- 3. Cosmos DB Database ---
resource todoDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2021-10-15' = {
  parent: cosmosAccount
  name: 'todos'
  properties: {
    databaseName: 'todos'
    resource: {
      id: '${parent.id}/sqlDatabases/todos'
    }
  }
}

// --- Outputs ---
output cosmosDbEndpoint string = cosmosAccount.properties.documentEndpoint
