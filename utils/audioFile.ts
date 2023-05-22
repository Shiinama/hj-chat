import * as FileSystem from 'expo-file-system'
export const audioDir = FileSystem.documentDirectory + 'streamAudio/'

export const saveAudio = async (params: { audio: ArrayBuffer; botId: number; replyUid: string }) => {
  const fileName = `${params.botId}_${params.replyUid}.mp3`
  try {
    FileSystem.makeDirectoryAsync(audioDir)
  } catch (error) {}
  try {
    await FileSystem.writeAsStringAsync(audioDir + fileName, arrayBufferToBase64(params.audio))
    return audioDir + fileName
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export const getStreamAudio = async (botId: number, replyUid: string) => {
  const fileName = `${botId}_${replyUid}.mp3`
  try {
    const res = await FileSystem.getInfoAsync(audioDir + fileName)
    return audioDir + fileName
  } catch (error) {
    return undefined
  }
}

export function arrayBufferToBase64(buffer) {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}
