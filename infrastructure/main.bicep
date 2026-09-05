targetScope = 'subscription'
// az deployment sub create --name todos --template-file infrastructure/main.bicep -l uksouth


@description('The location where all resources will be deployed.')
param location string = 'uksouth'

// --- 1. Resource Group ---
resource resourceGroup 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: '${prefix}-${location}'
  location: location
}

module backendResources './modules/backend-resources.bicep' = {
  scope: resourceGroup
  params: {
    location: location
    prefix: prefix
  }
}


// --- Outputs ---
output subscriptionId string = subscription().id
output storageAccountName string = backendResources.outputs.storageAccountName
output resourceGroupName string = resourceGroup.name
param prefix string = 'rg-todos'
