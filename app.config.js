// 多环境变量
const envConfig = {
  dev: {
    baseUrl: 'https://api.myshell.ai',
    authKey: 'Authorization',
    downloadHost: 'https://html2img.myshell.ai/share/',
    shareLink: 'https://app.myshell.ai/share/',
    avatarImgHost: 'https://d6phagtfbtco7.cloudfront.net/',
  },
  test: {
    baseUrl: 'https://api-staging.myshell',
    authKey: 'Authorization',
    // socketIoUrl: 'https://relay.walletconnect.com',
    // HOST: 'https://api-staging.myshell.ai',
    downloadHost: 'https://share.vinstic.com/share/',

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
    downloadHost: 'https://html2img.myshell.ai/share/',
    shareLink: 'https://app.myshell.ai/share/',
    avatarImgHost: 'https://d6phagtfbtco7.cloudfront.net/',
  },
}
export default {
  name: 'MyShell',
  slug: 'yu-chat',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/myshell.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    icon: './assets/iOS/App Store - 1x.png',
    associatedDomains: ['pnf34c6ee8-a870-447e-aa86-3400c12c8f22'],
    supportsTablet: true,
    bundleIdentifier: 'ai.myshell.app',
    infoPlist: {
      //       PARTICLE_PROJECT_ID=cb5e91db-f37b-4e53-8107-b97e36f78072
      // PARTICLE_CLIENT_ID=cPllcC2s2NmUZKJLmdzKyJZDIzz70Vasg5kwTsrx
      // PARTICLE_APP_ID=f34c6ee8-a870-447e-aa86-3400c12c8f22
      PROJECT_UUID: 'cb5e91db-f37b-4e53-8107-b97e36f78072',
      PROJECT_CLIENT_KEY: 'cPllcC2s2NmUZKJLmdzKyJZDIzz70Vasg5kwTsrx',
      PROJECT_APP_UUID: 'f34c6ee8-a870-447e-aa86-3400c12c8f22',
    },
  },
  android: {
    icon: './assets/Android/Play_Store/App_Icon_512x512.png',
    adaptiveIcon: {
      foregroundImage: './assets/Android/Adaptive_Icon/Foreground.png',
      backgroundImage: './assets/Android/Adaptive_Icon/Background.png',
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
      ...(envConfig?.[process.env.REACT_APP_ENV] || envConfig.prod),
    },
  },
}
