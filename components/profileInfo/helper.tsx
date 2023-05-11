import { Image } from 'react-native'
import systemConfig from '../../constants/System'
import defaultAvatar from '../../assets/images/defaultAvatar.png'

export const genAvatarUrl = (avatar: string) => {
  if (!avatar)
    return 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5049cfd8aca04680b5d1acb9d8b32cc1~tplv-k3u1fbpfcp-watermark.image?)'
  return avatar?.startsWith('avatar/') ? `${systemConfig?.avatarImgHost}${avatar}` : avatar
}

export const genBotUrl = (avatar: string) => {
  if (!avatar)
    return 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5049cfd8aca04680b5d1acb9d8b32cc1~tplv-k3u1fbpfcp-watermark.image?)'
  return avatar?.startsWith('bot-logo/') ? `${systemConfig?.avatarImgHost}${avatar}` : avatar
}

export const renderImage = (avatar: string, style) => {
  if (!avatar) return <Image style={style} source={defaultAvatar}></Image>
  if (avatar?.startsWith('bot-logo/') || avatar?.startsWith('avatar/')) {
    return <Image style={style} source={{ uri: `${systemConfig?.avatarImgHost}${avatar}` }}></Image>
  }
  return <Image style={style} source={{ uri: `${avatar}` }}></Image>
}
