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
  const userStore = uInfo().profile
  const isMine = userStore?.id === botInfo?.userId
  let shabitags =
    botInfo?.tags?.length &&
    botInfo.tags.map(i => {
      if (i.label === 'tools') {
        return {
          name: i.label,
          id: 5,
          bgColor: '#DCF9F7',
          tagColor: '#055752',
          childrenEmoji: '🔨',
        }
      }
      if (i.label === 'Entertainment') {
        return {
          name: i.label,
          id: 7,
          bgColor: '#FDF5DA',
          tagColor: '#5F5207',
          childrenEmoji: '🎮',
        }
      }
      if (i.label === 'Education') {
        return {
          name: i.label,
          id: 8,
          bgColor: '#FDF5EA',
          tagColor: '#5F5307',
          childrenEmoji: '🏫',
        }
      }
    })
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
  ]
  let AllTags = tags.concat(shabitags).filter(Boolean)
  if (type === TagFromType.AllBot || type === TagFromType.MyBot) {
    AllTags = AllTags.slice(0, 3)
  }
  return AllTags
}
