# 下载

`npm install -g expo`

# 依赖

`yarn install`

`expo install`

# 现在目前开始项目

`expo build:ios`

`expo build:android`

`expo start`

# 开始项目

清除缓存的开始项目

`expo start -c`

直接开始

`expo start`

跑在隧道里扫码 ngork 远程分享

`expo start --tunnel`

指定邮箱分享

`expo start --offline`

打安卓 dev 包

`eas build --platform android --local --profile development`

打安卓 release

`eas build --platform android --local --profile preview`

跑设备 debug 包 就是后面加 -d 直接可以选择链接设备跑（自动签名）

`cross-env REACT_APP_ENV=test expo run:ios -d`

云构建（但我们项目应该不需要，这个就是给没有 xcode 用）

`eas build -p ios`

跑 debug 包或者生产包(同理可以加 -d)

`npx expo run:android --variant debug`

`npx expo run:android --variant release`

`npx expo run:ios --configuration Release`(无签名)

导出 js-bundler

`npx expo export`

The project base architecture to do

- ios/android fastlane to testflight or google bate
- eas update or CodePush
- github ci/cd
- audio？
