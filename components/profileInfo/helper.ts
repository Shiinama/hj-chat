import systemConfig from '../../constants/System'
export const genAvatarUrl = (avatar: string) => {
  if (!avatar)
    return 'https://pics1.baidu.com/feed/55e736d12f2eb938661c830c4aa69e39e4dd6f28.jpeg@f_auto?token=b6ef42f11710ef742c703790f2a85d2b'
  return avatar?.startsWith('avatar/') ? `${systemConfig?.avatarImgHost}${avatar}` : avatar
}

export const genBotUrl = (avatar: string) => {
  if (!avatar)
    return 'https://pics1.baidu.com/feed/55e736d12f2eb938661c830c4aa69e39e4dd6f28.jpeg@f_auto?token=b6ef42f11710ef742c703790f2a85d2b'
  return avatar?.startsWith('bot-logo/') ? `${systemConfig?.avatarImgHost}${avatar}` : avatar
}

export const genBotLogo = (avatar: string) => {
  if (!avatar)
    return 'https://pics1.baidu.com/feed/55e736d12f2eb938661c830c4aa69e39e4dd6f28.jpeg@f_auto?token=b6ef42f11710ef742c703790f2a85d2b'
  return avatar?.startsWith('bot/') ? `${systemConfig?.avatarImgHost}${avatar}` : avatar
}
