import Store from '../store/botStore'
import Wang from '../assets/images/setting/wang.svg'
import Flash from '../assets/images/tabbar/flash.svg'
import Huatong from '../assets/images/setting/huatong.svg'
import Mime from '../assets/images/setting/mime.svg'
export const useTagList = () => {
  const botStore = Store.getState()
  let tags = [
    {
      id: 1,
      name: botStore.energyPerChat,
      bgColor: '#FDF5CA',
      tagColor: '#5F5107',
      childrenIcon: <Flash width={14} height={14} />,
    },
    {
      id: 2,
      bgColor: '#F1EAFE',
      tagColor: '#7A2EF6',
      name: 'Mine',
      childrenIcon: <Mime width={14} height={14} />,
    },
    {
      id: 3,
      name: botStore.privateBotId ? (botStore.status === 'Public' ? 'Mainnet' : 'Hidden') : 'Testnet',
      bgColor: botStore.privateBotId ? (botStore.status === 'Public' ? '#CAF1B7' : '#d1d5db') : '#FAF4E1',
      tagColor: botStore.privateBotId ? (botStore.status === 'Public' ? '#165B0B' : '#6b7280') : '#705A0C',
      childrenIcon: <Wang width={14} height={14} />,
    },
    {
      id: 4,
      name: botStore.language,
      bgColor: '#E7EFFF',
      tagColor: '#05286F',
      childrenIcon: <Huatong width={14} height={14} />,
    },
  ]
  return tags
}
