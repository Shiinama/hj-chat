import { Button, StyleSheet } from "react-native";

import { Text, View } from "../../components/Themed";
import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import { useState } from "react";
export default function TabAudioScreen() {
  const [audioUrl, setAudioUrl] = useState<string>(
    "file:///Users/ming/Library/Developer/CoreSimulator/Devices/61070C05-05D9-4967-A9B0-990857999838/data/Containers/Data/Application/50A988C4-34DB-4AB6-890C-D45497EF76F9/Library/Caches/AV/recording-30F4A45F-35B9-4041-ADF6-9E9B11A117CB.m4a"
  );
  const [recording, setRecording] = useState<Recording>();
  /** 录音 */
  async function startRecording() {
    try {
      /** 获取权限 */
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  /** 录音结束 */
  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setAudioUrl(uri);
  }

  async function playSounds(url) {
    const { sound: playbackObject } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );
    playbackObject.playAsync();
  }
  return (
    <View style={styles.container}>
      {audioUrl ? (
        <View>
          <Text style={styles.title}>{audioUrl}</Text>
          <Button
            title="播放"
            onPress={() => {
              playSounds(audioUrl);
            }}
          />
        </View>
      ) : null}

      <Button
        title={recording ? "录音结束" : "开始录音"}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
