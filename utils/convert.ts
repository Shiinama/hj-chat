import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native'
import * as FileSystem from 'expo-file-system'

export const convert4amToMp3 = async (uri: string) => {
  const outPutUri = `${FileSystem.documentDirectory}${'convert' + Math.random()}.mp3`
  const session = await FFmpegKit.execute(`-i ${uri} -acodec libmp3lame -ab 256k ${outPutUri}`)
  const returnCode = await session.getReturnCode()
  if (ReturnCode.isSuccess(returnCode)) {
    console.log('SUCCESS')
  } else if (ReturnCode.isCancel(returnCode)) {
    console.log('CANCEL')
  } else {
    console.log('ERROR')
  }
  return outPutUri
}
