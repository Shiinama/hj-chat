// 多环境变量
const envConfig = {
  dev: {
    PARTICLE_PROJECT_ID: 'c9aa126d-8db2-45cc-8898-60e3a69d5050',
    PARTICLE_CLIENT_ID: 'cOyQSJfazQ5zu32GwvW7AvBz0f7q0RWUIULWMZhk',
    PARTICLE_APP_ID: '6b6a232e-973a-405c-969a-a546189fda16',
    baseUrl: 'https://api-staging.myshell.ai',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeVNoZWxsU3RhZ2luZyIsInN1YiI6MzA2LCJhdWQiOiJNeVNoZWxsU3RhZ2luZyIsIm5iZiI6MCwiaWF0IjoxNjg0NTA3MTE1NTk4LCJqdGkiOiIxMWNmNjFhNTY5Yzc0MjRlOTVlMzYxNTg1OTNmZjc1ZSIsInNlY3VyaXR5U3RhbXAiOiJmOTRkMDE5OGY2OTA0ODUwODIwYjJjMDkxYTFiODQwNCIsImV4cCI6MTY4NDUwOTcwNzU5OH0.nNaN7MafVAr8XF5XLz0JOAfjvRQgOBRcpnQOn9Gt7ig',
    authKey: 'Authorization',
    downloadHost: 'https://share.vinstic.com/share/',
    shareLink: 'https://api-staging.myshell.ai/share/',
    avatarImgHost: 'https://d33slbe5e7735s.cloudfront.net/',
  },
  test: {
    PARTICLE_PROJECT_ID: 'c9aa126d-8db2-45cc-8898-60e3a69d5050',
    PARTICLE_CLIENT_ID: 'cOyQSJfazQ5zu32GwvW7AvBz0f7q0RWUIULWMZhk',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeVNoZWxsVGVzdCIsInN1YiI6MzA2LCJhdWQiOiJNeVNoZWxsVGVzdCIsIm5iZiI6MCwiaWF0IjoxNjg0OTEzMzIxNTc1LCJqdGkiOiI1ZGM5Zjg4YmQ5MmQ0MmVkODgyMmZiYjU3OWY5MzUzNyIsInNlY3VyaXR5U3RhbXAiOiI1NGMwYWY2Mzk5NTQ0M2EzYjViNGU0MzU4MGNhYjU3NSIsImV4cCI6MTY4NDkxNTkxMzU3NX0.TfJXgyB_m4LO9-L_yDAIYkjBWsx83xyRNBX8luc6EW4',
    PARTICLE_APP_ID: '6b6a232e-973a-405c-969a-a546189fda16',
    baseUrl: 'https://api-test.myshell.ai',
    authKey: 'Authorization',
    botShareLink: 'https://app-test.myshell.ai/en/bot/',
    inviteLink: 'https://app-test.myshell.ai/invite/',
    downloadHost: 'https://share.vinstic.com/share/',
    shareLink: 'https://app-test.myshell.ai/share/',
    avatarImgHost: 'https://d33slbe5e7735s.cloudfront.net/',
  },
  prod: {
    PROJECT_UUID: 'cb5e91db-f37b-4e53-8107-b97e36f78072',
    PROJECT_CLIENT_KEY: 'cPllcC2s2NmUZKJLmdzKyJZDIzz70Vasg5kwTsrx',
    PROJECT_APP_UUID: 'f34c6ee8-a870-447e-aa86-3400c12c8f22',
    // PARTICLE_PROJECT_ID: 'c9aa126d-8db2-45cc-8898-60e3a69d5050',
    // PARTICLE_CLIENT_ID: 'cOyQSJfazQ5zu32GwvW7AvBz0f7q0RWUIULWMZhk',
    // PARTICLE_APP_ID: '6b6a232e-973a-405c-969a-a546189fda16',
    baseUrl: 'https://api.myshell.ai',
    inviteLink: 'https://app.myshell.ai/invite/',
    botShareLink: 'https://app.myshell.ai/en/bot/',
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
  splash: {
    image: './assets/images/inch.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  jsEngine: 'hermes',
  assetBundlePatterns: ['**/*'],
  ios: {
    icon: './assets/iOS/App Store - 1x.png',
    associatedDomains: ['pn6b6a232e-973a-405c-969a-a546189fda16'],
    supportsTablet: true,
    bundleIdentifier: 'ai.myshell.app',
    infoPlist: {
      UIBackgroundModes: ['audio'],
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
