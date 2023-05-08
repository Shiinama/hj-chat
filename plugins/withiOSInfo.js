const withMySDK = (config) => {
    // Ensure the objects exist
    if (!config.ios) {
        config.ios = {};
    }
    if (!config.ios.infoPlist) {
        config.ios.infoPlist = {};
    }


    config.ios.infoPlist['PROJECT_UUID'] = 'c135c555-a871-4ec2-ac8c-5209ded4bfd1';
    config.ios.infoPlist['PROJECT_CLIENT_KEY'] = 'clAJtavacSBZtWHNVrxYA8aXXk4dgO7azAMTd0eI'
    config.ios.infoPlist['PROJECT_APP_UUID'] = '564dc005-2f20-40a1-8082-c8634cdafd0b'

    return config;
};

/// Create a config
const config = {
    name: 'my app',
};

/// Use the plugin
module.exports = withMySDK;

