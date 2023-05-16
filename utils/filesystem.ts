import * as FileSystem from 'expo-file-system'
export const imageDir = FileSystem.documentDirectory + 'image/'

export async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(imageDir)
  if (!dirInfo.exists) {
    console.log("Gif directory doesn't exist, creating...")
    await FileSystem.makeDirectoryAsync(imageDir, { intermediates: true })
  }
  return dirInfo.exists
}
