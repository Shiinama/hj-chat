function appendScheme(scheme, infoPlist) {
  if (!scheme) {
    return infoPlist
  }

  const existingSchemes = infoPlist.CFBundleURLTypes

  return {
    ...infoPlist,
    CFBundleURLTypes: [
      ...(existingSchemes ?? []),
      {
        CFBundleURLSchemes: [scheme],
      },
    ],
  }
}

const withMySDK = config => {
  // Ensure the objects exist
  console.log('config.ios.infoPlist', config.ios.infoPlist)
  if (!config.ios) {
    config.ios = {}
  }
  if (!config.ios.infoPlist) {
    config.ios.infoPlist = {}
  }
  config.ios.infoPlist['PROJECT_UUID'] = '$(PROJECT_UUID)'
  config.ios.infoPlist['PROJECT_CLIENT_KEY'] = '$(PROJECT_CLIENT_KEY)'
  config.ios.infoPlist['PROJECT_APP_UUID'] = '$(PROJECT_APP_UUID)'
  config.ios.infoPlist = appendScheme('pn$(PROJECT_APP_UUID)', config.ios.infoPlist)
  return config
}

/// Use the plugin
module.exports = withMySDK
