param location string

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



// --- Outputs ---
output storageAccountName string = storageAccount.name
