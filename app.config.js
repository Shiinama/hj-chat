// 多环境变量
const envConfig = {
  dev: {
    PROJECT_UUID: 'c9aa126d-8db2-45cc-8898-60e3a69d5050',
    PROJECT_CLIENT_KEY: 'cOyQSJfazQ5zu32GwvW7AvBz0f7q0RWUIULWMZhk',
    PROJECT_APP_UUID: '6b6a232e-973a-405c-969a-a546189fda16',
    baseUrl: 'https://api-staging.myshell.ai',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeVNoZWxsU3RhZ2luZyIsInN1YiI6MzA2LCJhdWQiOiJNeVNoZWxsU3RhZ2luZyIsIm5iZiI6MCwiaWF0IjoxNjg0NTA3MTE1NTk4LCJqdGkiOiIxMWNmNjFhNTY5Yzc0MjRlOTVlMzYxNTg1OTNmZjc1ZSIsInNlY3VyaXR5U3RhbXAiOiJmOTRkMDE5OGY2OTA0ODUwODIwYjJjMDkxYTFiODQwNCIsImV4cCI6MTY4NDUwOTcwNzU5OH0.nNaN7MafVAr8XF5XLz0JOAfjvRQgOBRcpnQOn9Gt7ig',
    authKey: 'Authorization',
    downloadHost: 'https://share.vinstic.com/share/',
    shareLink: 'https://api-staging.myshell.ai/share/',
    avatarImgHost: 'https://d33slbe5e7735s.cloudfront.net/',
  },
  test: {
    name: 'MyShellTest',
    bundleIdentifier: 'ai.myshell.app3',
    PROJECT_UUID: 'c9aa126d-8db2-45cc-8898-60e3a69d5050',
    PROJECT_CLIENT_KEY: 'cOyQSJfazQ5zu32GwvW7AvBz0f7q0RWUIULWMZhk',
    PROJECT_APP_UUID: '6b6a232e-973a-405c-969a-a546189fda16',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeVNoZWxsVGVzdCIsInN1YiI6MzA2LCJhdWQiOiJNeVNoZWxsVGVzdCIsIm5iZiI6MCwiaWF0IjoxNjg0OTEzMzIxNTc1LCJqdGkiOiI1ZGM5Zjg4YmQ5MmQ0MmVkODgyMmZiYjU3OWY5MzUzNyIsInNlY3VyaXR5U3RhbXAiOiI1NGMwYWY2Mzk5NTQ0M2EzYjViNGU0MzU4MGNhYjU3NSIsImV4cCI6MTY4NDkxNTkxMzU3NX0.TfJXgyB_m4LO9-L_yDAIYkjBWsx83xyRNBX8luc6EW4',
    baseUrl: 'https://api-test.myshell.ai',
    authKey: 'Authorization',
    botShareLink: 'https://app-test.myshell.ai/en/bot/',
    inviteLink: 'https://app-test.myshell.ai/invite/',
    downloadHost: 'https://share.vinstic.com/share/',
    shareLink: 'https://app-test.myshell.ai/share/',
    avatarImgHost: 'https://d33slbe5e7735s.cloudfront.net/',
  },
  prod: {
    name: 'MyShell',
    bundleIdentifier: 'ai.myshell.app',
    PROJECT_UUID: 'cb5e91db-f37b-4e53-8107-b97e36f78072',
    PROJECT_CLIENT_KEY: 'cPllcC2s2NmUZKJLmdzKyJZDIzz70Vasg5kwTsrx',
    PROJECT_APP_UUID: 'f34c6ee8-a870-447e-aa86-3400c12c8f22',
    baseUrl: 'https://api.myshell.ai',
    inviteLink: 'https://app.myshell.ai/invite/',
    botShareLink: 'https://app.myshell.ai/en/bot/',
    authKey: 'Authorization',
    downloadHost: 'https://html2img.myshell.ai/share/',
    shareLink: 'https://app.myshell.ai/share/',
    avatarImgHost: 'https://d6phagtfbtco7.cloudfront.net/',
  },
}[process.env.REACT_APP_ENV]

export default {
  name: envConfig?.name,
  slug: 'yu-chat',
  scheme: 'myapp',
  version: '1.1.7',
  orientation: 'portrait',
  updates: {
    url: 'https://u.expo.dev/1cabf0b0-1fb1-435a-9c9e-8c1ca5c75c72',
  },
  runtimeVersion: '1.1.7',
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
    supportsTablet: false,
    bundleIdentifier: envConfig?.bundleIdentifier,
    infoPlist: {
      PROJECT_UUID: envConfig?.PROJECT_UUID,
      PROJECT_CLIENT_KEY: envConfig?.PROJECT_CLIENT_KEY,
      PROJECT_APP_UUID: envConfig?.PROJECT_APP_UUID,
      NSMicrophoneUsageDescription: 'The app uses the microphone to send voice messages',
    },
  },
  android: {
    icon: './assets/Android/Play_Store/App_Icon_512x512.png',
    versionCode: 5,
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
    ['./plugins/withiosInfo.ts'],
  ],
  extra: {
    eas: {
      projectId: '1cabf0b0-1fb1-435a-9c9e-8c1ca5c75c72',
    },
    isLogin: process.env.REACT_APP_ENV === 'dev' || process.env.REACT_APP_ENV === 'test',
    systemConfig: {
      ...envConfig,
    },
  },
}
