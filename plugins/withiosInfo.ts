const { IOSConfig, withInfoPlist } = require('@expo/config-plugins')
const appendScheme = IOSConfig.Scheme.appendScheme
const setInfoPilist = config => {
  const infoList = appendScheme('pn$(PROJECT_APP_UUID)', config.ios.infoPlist)
  return infoList
}

const withIosInfo = config =>
  withInfoPlist(config, async config => {
    config.modResults = await setInfoPilist(config)
    return config
  })

module.exports = withIosInfo
