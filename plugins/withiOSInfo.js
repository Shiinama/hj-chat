const withMySDK = config => {
  // Ensure the objects exist
  if (!config.ios) {
    config.ios = {}
  }
  if (!config.ios.infoPlist) {
    config.ios.infoPlist = {}
  }

  config.ios.infoPlist['PROJECT_UUID'] = 'cb5e91db-f37b-4e53-8107-b97e36f78072'
  config.ios.infoPlist['PROJECT_CLIENT_KEY'] = 'cPllcC2s2NmUZKJLmdzKyJZDIzz70Vasg5kwTsrx'
  config.ios.infoPlist['PROJECT_APP_UUID'] = 'f34c6ee8-a870-447e-aa86-3400c12c8f22'

  return config
}

/// Create a config
const config = {
  name: 'my app',
}

/// Use the plugin
module.exports = withMySDK
