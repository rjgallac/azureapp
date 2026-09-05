param location string

// --- 1. Storage Account (Table Storage) ---
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: uniqueString(location) // Use only uniqueString(location) for the name
  location: location
  sku: {
    name: 'Standard_LRS'
    family: 'Standard'
  }
  kind: 'StorageV2'
}



// --- Outputs ---
output storageAccountName string = storageAccount.name
