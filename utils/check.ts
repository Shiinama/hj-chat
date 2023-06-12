import { Alert } from 'react-native'
import { getUserEnergyInfo } from '../api'

export async function checkEnergy(fn, ...args): Promise<boolean> {
  try {
    const { energy } = await getUserEnergyInfo()
    if (energy > 0) {
      return fn(...args)
    } else {
      Alert.alert('You have no energy left, please recharge')
      return true
    }
  } catch (e) {
    Alert.alert('Please check your network connection or server error')
    return false
  }
}
