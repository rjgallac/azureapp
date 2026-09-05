param location string
param prefix string

// --- 1. Storage Account (Required for Azure Functions) ---
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'st${uniqueString(resourceGroup().id)}' // Using unique string based on RG ID for better uniqueness
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
resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: '${prefix}-func-plan'
  location: location
  sku: {
    tier: 'P1v3'  // Premium Plan supports all deployment methods
    name: 'P1V3'  // Or 'B1' / 'B2' / 'B3' for cheaper option
    size: 'P1V3'
    family: 'P'
  }
  properties: {
    reserved: true
    isXenon: false
    capabilities: []
    operatingSystem: 'Linux'
    provisioningState: 'Succeeded'
  }
}

// =================================================================================
// --- 3. Function App Resource (Node.js) ---
// =================================================================================
// Deploys the Function App itself, linking it to the App Service Plan.
 resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: '${prefix}-func-app'
  location: location
  dependsOn: [
    appServicePlan
  ]
  kind: 'functionapp,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    appSettings: [
      {
        name: 'FUNCTIONS_EXTENSION_VERSION'
        value: '~4'
      }
    ]
    identity: {
      type: 'SystemAssigned'
    }
  }
}

// --- Outputs ---
output storageAccountName string = storageAccount.name
output functionAppName string = functionApp.name
output functionAppUrl string = 'https://${functionApp.name}.azurewebsites.net'
output storageConnectionString string = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${listKeys(storageAccount.id, '2023-01-01').keys[0].value};EndpointSuffix=core.windows.net'
