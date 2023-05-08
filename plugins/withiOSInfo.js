const withMySDK = config => {
  // Ensure the objects exist
  if (!config.ios) {
    config.ios = {}
  }
  if (!config.ios.infoPlist) {
    config.ios.infoPlist = {}
  }

  config.ios.infoPlist['PROJECT_UUID'] = 'c9aa126d-8db2-45cc-8898-60e3a69d5050'
  config.ios.infoPlist['PROJECT_CLIENT_KEY'] = 'cOyQSJfazQ5zu32GwvW7AvBz0f7q0RWUIULWMZhk'
  config.ios.infoPlist['PROJECT_APP_UUID'] = '6b6a232e-973a-405c-969a-a546189fda16'

  return config
}

/// Create a config
const config = {
  name: 'my app',
}

/// Use the plugin
module.exports = withMySDK
