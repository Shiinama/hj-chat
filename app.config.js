// 多环境变量
const envConfig = {
  dev: {
    baseUrl: 'https://api-staging.myshell.ai',
    authKey: 'Authorization',
    // socketIoUrl: 'https://relay.walletconnect.com',
    // HOST: 'https://api-staging.myshell.ai',
    downloadHost: 'https://share.vinstic.com/share',

    shareLink: 'https://api-staging.myshell/share/',
    avatarImgHost: 'https://d33slbe5e7735s.cloudfront.net/',
  },
  test: {
    baseUrl: 'https://api-staging.myshell',
    authKey: 'Authorization',
    // socketIoUrl: 'https://relay.walletconnect.com',
    // HOST: 'https://api-staging.myshell.ai',
    downloadHost: 'https://share.vinstic.com/share',

    shareLink: 'https://api-staging.myshell/share/',
    avatarImgHost: 'https://d33slbe5e7735s.cloudfront.net/',
  },
  demo: {
    baseUrl: 'https://api-staging.myshell.ai',
    authKey: 'Authorization',
    // socketIoUrl: 'https://relay.walletconnect.com',
    // HOST: 'https://api-staging.myshell.ai',
    downloadHost: 'https://share.vinstic.com/share/',

    shareLink: 'https://api-staging.myshell.ai/share/',
    avatarImgHost: 'https://d33slbe5e7735s.cloudfront.net/',
  },
  prod: {
    baseUrl: 'https://api.myshell.ai',
    authKey: 'Authorization',
    downloadHost: 'https://html2img.myshell.ai/',
    shareLink: 'https://app.myshell.ai/share/',
    avatarImgHost: 'https://d6phagtfbtco7.cloudfront.net/',
  },
}
export default {
  name: 'MyShell',
  slug: 'yu-chat',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/myshell.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/myshell.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    associatedDomains: ['pn6b6a232e-973a-405c-969a-a546189fda16'],
    supportsTablet: true,
    bundleIdentifier: 'ai.myshell.app',
    infoPlist: {
      PROJECT_UUID: 'c9aa126d-8db2-45cc-8898-60e3a69d5050',
      PROJECT_CLIENT_KEY: 'cOyQSJfazQ5zu32GwvW7AvBz0f7q0RWUIULWMZhk',
      PROJECT_APP_UUID: '6b6a232e-973a-405c-969a-a546189fda16',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/myshell.png',
      backgroundColor: '#ffffff',
    },
    package: 'ai.myshell.app',
    permissions: ['android.permission.RECORD_AUDIO'],
  },
  plugins: [
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 33,
          targetSdkVersion: 31,
          minSdkVersion: 24,
          buildToolsVersion: '31.0.0',
        },
        ios: {
          useFrameworks: 'static',
          deploymentTarget: '13.0',
        },
      },
    ],
    [
      '@config-plugins/ffmpeg-kit-react-native',
      {
        package: 'min',
        ios: {
          package: 'audio',
        },
        android: {
          package: 'audio',
        },
      },
    ],
    ['./plugins/withAndroidNamespace.ts'],
    ['./plugins/withAndroidGradeModifed.ts'],
    [
      'expo-image-picker',
      {
        photosPermission: 'The app accesses your photos to let you share them with your friends.',
      },
    ],
    ['./plugins/withiOSInfo'],
  ],
  extra: {
    eas: {
      projectId: '1cabf0b0-1fb1-435a-9c9e-8c1ca5c75c72',
    },
    isLogin: process.env.REACT_APP_ENV === 'dev',
    systemConfig: {
      ...(envConfig?.demo || envConfig.prod),
    },
  },
}
