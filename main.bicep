param location string = resourceGroup().location
param appName string = ''

//blob Storage for Word/txt Documents
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: '${appName}store'
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

//Azure SQL Database for version metadata
resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: '${appName}-sqlserver'
  location: location
  properties: {
    administratorLogin: ''
    administratorLoginPassword: '' 
  }
}

//Azure App Service for Frontend & API
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '${appName}-plan'
  location: location
  sku: { name: 'F1' } // Free tier for project testing
}

resource webApplication 'Microsoft.Web/sites@2022-03-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
  }
}
