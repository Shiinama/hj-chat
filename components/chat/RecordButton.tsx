import { Toast } from "@fruits-chain/react-native-xiaoshu";
import { useMemoizedFn } from "ahooks";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Delete from "../../assets/images/chat/delete.svg";
import Huatong from "../../assets/images/chat/huatong.svg";
import Pause from "../../assets/images/chat/pause.svg";
import Play from "../../assets/images/chat/play.svg";
import Send from "../../assets/images/chat/send.svg";
import CallBackManagerSingle from "../../utils/CallBackManager";
import AudioPayManagerSingle from "./audioPlayManager";
import SocketStreamManager from "./socketManager";
const RecordButton = ({
  audioFileUri,
  startRecording,
  stopRecording,
  setIsShow,
  setAuInfo,
  setShowAni,
  setAudioFileUri,
  recordMaxSecond,
  isShow,
  AnimationRef,
}) => {
  const [sound, setSound] = useState(null);
  const [buttonState, setButtonState] = useState("penddingRecording");
  const [isSound, setIsSound] = useState(false);
  const playing = useRef(false);
  async function handlestartRecording() {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      alert(
        "Please allow access to the microphone to record audio! Please go to Settings",
      );
    } else {
      AudioPayManagerSingle().pause(true);
      const success = await startRecording();
      if (success) {
        AudioPayManagerSingle().isRecording = true;
        setShowAni(false);
        setButtonState("recording");
        setTimeout(() => {
          AnimationRef?.current?.startAnimation();
        }, 100);
      }
    }
  }
  useEffect(() => {
    playing.current = isSound;
  }, [isSound]);

  const stopRecord = useMemoizedFn(async () => {
    AudioPayManagerSingle().isRecording = false;
    const uri = await stopRecording();
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      {},
      (status: any) => {
        if (
          status.positionMillis >= status.durationMillis &&
          status.durationMillis > 0
        ) {
          try {
            setIsSound(false);
            AnimationRef?.current?.stopAnimation?.();
            AnimationRef?.current?.updateDurationMillis?.(
              status.durationMillis,
            );
            AudioPayManagerSingle().stop();
          } catch (error) {}
        }
      },
    );
    try {
      setSound(sound);
      setAudioFileUri(uri);
      setButtonState("playing");
      SocketStreamManager().resetPlayStream();
      AnimationRef?.current?.stopAnimation?.();
    } catch (error) {}
  });

  useEffect(() => {
    const appState = AppState.addEventListener("change", (state) => {
      if (state === "background" && buttonState === "recording") {
        stopRecord();
      }
    });
    CallBackManagerSingle().add(
      "recordingChangeBtn",
      (durationMill: number) => {
        AnimationRef?.current?.updateDurationMillis?.(durationMill);
        if (
          durationMill &&
          recordMaxSecond &&
          durationMill >= recordMaxSecond * 1000
        ) {
          CallBackManagerSingle().remove("recordingChangeBtn");
          stopRecord();
        }
      },
    );
    return () => {
      CallBackManagerSingle().remove("recordingChangeBtn");
      appState.remove();
    };
  }, [buttonState, AnimationRef, recordMaxSecond, stopRecord]);

  const playSound = () => {
    if (!isSound) {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      AudioPayManagerSingle().play(sound, () => {
        setIsSound(() => false);
        AnimationRef?.current?.stopAnimation?.();
      });
      AnimationRef?.current?.startAnimation?.();
    } else {
      AudioPayManagerSingle().pause();
      AnimationRef?.current?.stopAnimation?.();
    }
    setIsSound(!isSound);
  };

  const playOrPauseIcon = () => {
    switch (buttonState) {
      case "penddingRecording":
        return (
          <>
            <Text
              style={{ color: "#A0AEC0", paddingTop: 20, paddingBottom: 5 }}
            >
              Tap to record
            </Text>
            <TouchableOpacity
              style={styles.recordButton}
              onPress={handlestartRecording}
            >
              <Huatong height={40} width={40} color="red" />
            </TouchableOpacity>
          </>
        );
      case "recording":
        return (
          <TouchableOpacity
            style={{ ...styles.recordButton, marginTop: 32 }}
            onPress={async () => {
              stopRecord();
            }}
          >
            <View
              style={{
                backgroundColor: "red",
                width: 14,
                height: 14,
                borderRadius: 2,
              }}
            ></View>
          </TouchableOpacity>
        );
      case "playing":
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 32,
            }}
          >
            <TouchableOpacity
              style={styles.smallButton}
              onPress={async () => {
                try {
                  if (isSound) {
                    AudioPayManagerSingle().stop();
                    AnimationRef?.current?.stopAnimation?.();
                  }
                } catch (error) {}
                const { exists } = await FileSystem.getInfoAsync(audioFileUri);
                if (exists) {
                  try {
                    await FileSystem.deleteAsync(audioFileUri);
                    Toast("Deleted recording file");
                  } catch (error) {
                    Toast("Failed to delete recording file");
                  }
                }
                setButtonState("penddingRecording");
                setAudioFileUri("");
                setIsShow(true);
                setShowAni(true);
              }}
            >
              <Delete height={20} width={20}></Delete>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.palyButton, marginHorizontal: 30 }}
              onPress={async () => {
                playSound();
              }}
            >
              {!isSound ? <Pause></Pause> : <Play></Play>}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={async () => {
                if (!AudioPayManagerSingle().netInfo?.isConnected) {
                  Alert.alert("Please check your network connection");
                  return;
                }
                if (isShow) return;
                setButtonState("penddingRecording");
                setShowAni(true);
                setIsShow(true);
                setAuInfo();
              }}
            >
              <Send height={20} width={20}></Send>
            </TouchableOpacity>
          </View>
        );
    }
  };
  if (isShow) return null;
  return <View style={styles.container}>{playOrPauseIcon()}</View>;
};

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    height: 50,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 40,
    flexDirection: "row",
    backgroundColor: "rgba(255, 59, 48, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  palyButton: {
    width: 50,
    height: 50,
    borderRadius: 40,
    flexDirection: "row",
    backgroundColor: "#e7d9f7",
    alignItems: "center",
    justifyContent: "center",
  },
  smallButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  // isRecording: {
  //   backgroundColor: '#F44336',
  // },
  recordingIndicator: {
    marginTop: 20,
    fontSize: 20,
  },
});

export default React.memo(RecordButton);
