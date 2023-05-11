import systemConfig from '../../constants/System'
import DefaultAvatar from '../../assets/images/chat/defaultAvatar.svg'
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
