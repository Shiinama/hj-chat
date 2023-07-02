const { withAndroidManifest } = require('@expo/config-plugins')

function addAttributesToMainActivity(androidManifest, attributes) {
  const { manifest } = androidManifest

  if (!Array.isArray(manifest['application'])) {
    return androidManifest
  }

  const application = manifest['application'].find(item => item.$['android:name'] === '.MainApplication')
  if (!application) {
    return androidManifest
  }

  if (!Array.isArray(application['activity'])) {
    return androidManifest
  }

  const activity = application['activity'].find(item => item.$['android:name'] === '.MainActivity')
  if (!activity) {
    return androidManifest
  }

  activity.$ = { ...activity.$, ...attributes }

  return androidManifest
}

module.exports = function withAndroidMainActivityAttributes(config, attributes) {
  return withAndroidManifest(config, config => {
    config.modResults = addAttributesToMainActivity(config.modResults, attributes)
    return config
  })
}
