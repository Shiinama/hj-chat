import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'

export const imageDir = FileSystem.documentDirectory + 'image/'

export async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(imageDir)
  if (!dirInfo.exists) {
    console.log("Gif directory doesn't exist, creating...")
    await FileSystem.makeDirectoryAsync(imageDir, { intermediates: true })
  }
  return dirInfo.exists
}

const { StorageAccessFramework } = FileSystem

async function migrateAlbum(albumName: string) {
  // Gets SAF URI to the album
  const albumUri = StorageAccessFramework.getUriForDirectoryInRoot(albumName)

  // Requests permissions
  const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(albumUri)
  if (!permissions.granted) {
    return
  }

  const permittedUri = permissions.directoryUri
  // Checks if users selected the correct folder
  if (!permittedUri.includes(albumName)) {
    return
  }

  const mediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync()
  if (!mediaLibraryPermissions.granted) {
    return
  }

  // Moves files from external storage to internal storage
  await StorageAccessFramework.moveAsync({
    from: permittedUri,
    to: FileSystem.documentDirectory!,
  })

  const outputDir = FileSystem.documentDirectory! + albumName
  const migratedFiles = await FileSystem.readDirectoryAsync(outputDir)

  // Creates assets from local files
  const [newAlbumCreator, ...assets] = await Promise.all(
    migratedFiles.map<Promise<MediaLibrary.Asset>>(
      async fileName => await MediaLibrary.createAssetAsync(outputDir + '/' + fileName)
    )
  )

  // Album was empty
  if (!newAlbumCreator) {
    return
  }

  // Creates a new album in the scoped directory
  const newAlbum = await MediaLibrary.createAlbumAsync(albumName, newAlbumCreator, false)
  if (assets.length) {
    await MediaLibrary.addAssetsToAlbumAsync(assets, newAlbum, false)
  }
}
