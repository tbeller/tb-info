// Parameters
@description('The name of the Azure Static Web App.')
param staticSites_name string = 'staticWebApp'

@description('The name of the Azure Storage Account. Must be globally unique.')
param storageAccounts_name string = 'storageAccount'

@description('The Azure region for the resources.')
param location string = 'Central US'

@description('The URL of the GitHub repository for the Static Web App.')
param repositoryUrl string = 'https://github.com/example/repository'

@description('The branch of the repository to deploy.')
param branch string = 'main'

// Resources

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccounts_name
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2023-05-01' = {
  name: 'default'
  parent: storageAccount
  properties: {
    cors: {
      corsRules: []
    }
  }
}

resource visitorCounterTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-05-01' = {
  name: 'VisitorCounter'
  parent: tableService
}

resource staticWebApp 'Microsoft.Web/staticSites@2024-04-01' = {
  name: staticSites_name
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: branch
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2022-09-01' = {
  name: 'appsettings'
  parent: staticWebApp
  properties: {
    STORAGE_CONNECTION_STRING: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=core.windows.net;AccountKey=${storageAccount.listkeys().keys[0].value}'
  }
}

// Outputs
output defaultHostName string = staticWebApp.properties.defaultHostname
