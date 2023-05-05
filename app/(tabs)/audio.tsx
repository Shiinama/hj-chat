import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import * as FileSystem from 'expo-file-system'

const renameAudioFile = async () => {
  const cacheDirectory = `${FileSystem.cacheDirectory}AV/`
  const fileName = 'recording-1e1c5c4a-0b3a-4b3a-9b0a-2b0a0e2b0b0e.m4a'

  // 将录音文件从缓存目录复制到应用程序文档目录中
  const fileUri = `${cacheDirectory}${fileName}`
  const docsDirectory = FileSystem.documentDirectory + 'audio/'
  await FileSystem.makeDirectoryAsync(docsDirectory, { intermediates: true })
  const newFileUri = `${docsDirectory}${fileName}`
  await FileSystem.copyAsync({ from: fileUri, to: newFileUri })

  // 将新文件重命名为 WAV 格式
  const newFileName = 'new-recording.wav'
  const newFilePath = `${docsDirectory}${newFileName}`
  await FileSystem.moveAsync({
    from: newFileUri,
    to: newFilePath,
  })

  console.log(`已将文件从[${fileUri}]重命名为[${newFileName}]，新路径为[${newFilePath}]`)
}

export default function App() {
  useEffect(() => {
    renameAudioFile().then(console.log).catch(console.error)
  }, [])
  return (
    <View style={styles.container}>
      {/* <Popup title="123" content="3123"></Popup> */}
      {/* <BlurText text="这是一段模糊的文本" blurRadius={10} fontSize={24} fontWeight="bold" /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 50,
    marginVertical: 150,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue',
    marginTop: 10,
  },
})
