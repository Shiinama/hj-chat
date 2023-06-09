import * as FileSystem from 'expo-file-system'

export const audioDir = FileSystem.cacheDirectory + 'streamAudio/'

export const saveAudio = async (params: { audio: string; index?: number; botId: number; replyUid: string }) => {
  const fileName = `${params.botId}_${params.replyUid}_${params.index}.mp3`
  if (!params.audio || params?.audio?.length === 0) {
    return
  }
  const dirInfo = await FileSystem.getInfoAsync(audioDir)
  if (!dirInfo.exists) {
    try {
      await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true })
    } catch (error) {}
  }

  try {
    await FileSystem.writeAsStringAsync(audioDir + fileName, params.audio, { encoding: 'base64' })
    return audioDir + fileName
  } catch (e) {
    return undefined
  }
}

export const deleteAudio = (url: string) => {
  return FileSystem.deleteAsync(url)
}

export const deleteAll = async () => {
  try {
    await FileSystem.deleteAsync(audioDir)
    return true
  } catch (error) {
    return false
  }
}

export const getAudioFileUrl = (botId: number, replyUid: string) => {
  return `${audioDir}${botId}_${replyUid}.mp3`
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
