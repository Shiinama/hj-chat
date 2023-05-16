import RNStorage from '@react-native-async-storage/async-storage'

const botListLocalKey = 'BotListLocal'

export const getBotListLocal = async () => {
  let localBotList = undefined
  try {
    const localStr = await RNStorage.getItem(botListLocalKey)
    if (localStr) {
      localBotList = JSON.parse(localStr)
    }
  } catch (e) {
    console.log(e)
  }

  return localBotList
}

export const setBotListLocal = (value: any) => {
  try {
    RNStorage.setItem(botListLocalKey, JSON.stringify(value))
  } catch (e) {}
}

export const removeBotListLocal = async () => {
  try {
    RNStorage.removeItem(botListLocalKey)
  } catch (e) {}
}
