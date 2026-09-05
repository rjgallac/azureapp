param location string
param prefix string

// --- 1. Storage Account (Table Storage) ---
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: uniqueString(location) // Use only uniqueString(location) for the name
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

// --- 2. Table Service ---
resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2021-06-01' = {
  parent: storageAccount
  name: 'default'
}

// --- 3. Todos Table ---
resource todosTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2021-06-01' = {
  name: 'todos' // The name of the table
  parent: tableService
}


// =================================================================================
// --- 2. App Service Plan for Function App ---
// =================================================================================
// Defines the underlying compute resources for the Function App.
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: '${prefix}-func-plan'
  location: location
  sku: {
    name: 'FC1'
    tier: 'FlexConsumption'
  }
  properties: {
    reserved: true
  }
  kind: 'functionapp'
}

// =================================================================================
// --- 3. Function App Resource (Node.js) ---
// =================================================================================
// Deploys the Function App itself, linking it to the App Service Plan.
resource functionApp 'Microsoft.Web/sites@2022-09-01' = {
  name: '${prefix}-func-app'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      // Specify the runtime stack
      linuxFxVersion: 'NODE|18-v4' // Use the appropriate Node.js version
      appSettings: [
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        // Add other necessary settings here, e.g., Connection Strings
        // {
        //   name: 'CosmosDbConnection'
        //   value: 'YOUR_CONNECTION_STRING' // Replace with actual secret/parameter
        // }
      ]
    }
  }
}

// --- Outputs ---
output storageAccountName string = storageAccount.name
