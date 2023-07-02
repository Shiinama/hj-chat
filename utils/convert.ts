import { FFmpegKit } from 'ffmpeg-kit-react-native'
import * as FileSystem from 'expo-file-system'

export const convert4amToMp3 = async (uri: string) => {
  const outPutUri = `${FileSystem.documentDirectory}${'convert' + Math.random()}.mp3`
  await FFmpegKit.execute(`-i ${uri} -acodec libmp3lame -ab 256k ${outPutUri}`)
  return outPutUri
}
