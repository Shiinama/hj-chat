import Wang from '../assets/images/setting/wang.svg'
import Flash from '../assets/images/tabbar/flash.svg'
import Huatong from '../assets/images/setting/huatong.svg'
import Mime from '../assets/images/setting/mime.svg'
import uInfo from '../store/userStore'
import { BotInfo } from '../types/BotTypes'
export enum TagFromType {
  AllBot = 'AllBot',
  MyBot = 'MyBot',
  Chat = 'Chat',
  Robot = 'Robot',
}

export const useTagList = (botInfo?: BotInfo, type?: TagFromType) => {
  // console.log(botInfo, 111)
  const userStore = uInfo().profile
  const isMine = userStore?.id === botInfo?.userId
  const isRobotandChat = type === TagFromType.Chat || type === TagFromType.Robot
  let tags = [
    (type === TagFromType.AllBot || isRobotandChat) && {
      id: 1,
      name: botInfo?.energyPerChat,
      bgColor: '#FDF5CA',
      tagColor: '#5F5107',
      childrenIcon: <Flash width={14} height={14} />,
    },
    isMine &&
      (type === TagFromType.AllBot || isRobotandChat) && {
        id: 2,
        bgColor: '#F1EAFE',
        tagColor: '#7A2EF6',
        name: 'Mine',
        childrenIcon: <Mime width={14} height={14} />,
      },
    (type === TagFromType.MyBot || isRobotandChat) && {
      id: 3,
      name: botInfo?.privateBotId ? (botInfo?.status === 'Public' ? 'Mainnet' : 'Hidden') : 'Testnet',
      bgColor: botInfo?.privateBotId ? (botInfo?.status === 'Public' ? '#CAF1B7' : '#d1d5db') : '#FAF4E1',
      tagColor: botInfo?.privateBotId ? (botInfo?.status === 'Public' ? '#165B0B' : '#6b7280') : '#705A0C',
      childrenIcon: <Wang width={14} height={14} />,
    },
    (type === TagFromType.AllBot || isRobotandChat) &&
      botInfo?.language && {
        id: 4,
        name: botInfo?.language,
        bgColor: '#E7EFFF',
        tagColor: '#05286F',
        childrenIcon: <Huatong width={14} height={14} />,
      },
  ].filter(Boolean)
  return tags
}
