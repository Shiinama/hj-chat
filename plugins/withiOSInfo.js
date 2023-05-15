const withMySDK = config => {
  console.log(config)
  const myConfg = JSON.parse(JSON.stringify(config))
  // Ensure the objects exist
  if (!config.ios) {
    config.ios = {}
  }
  if (!config.ios.infoPlist) {
    config.ios.infoPlist = {}
  }
  config.ios.infoPlist['PROJECT_UUID'] = myConfg.extra.systemConfig.PARTICLE_PROJECT_ID
  config.ios.infoPlist['PROJECT_CLIENT_KEY'] = myConfg.extra.systemConfig.PARTICLE_CLIENT_ID
  config.ios.infoPlist['PROJECT_APP_UUID'] = myConfg.extra.systemConfig.PARTICLE_APP_ID
  return config
}

/// Use the plugin
module.exports = withMySDK
