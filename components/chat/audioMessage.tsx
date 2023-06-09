import Messagepause from "@assets/images/chat/message_pause.svg";
import MessagePlay from "@assets/images/chat/message_play.svg";
import { Slider } from "@miblanchard/react-native-slider";
import CallBackManagerSingle from "@utils/CallBackManager";
import { formatTime } from "@utils/time";
import { useMemoizedFn } from "ahooks";
import { Audio } from "expo-av";
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MessageDetail } from "../../types/MessageTyps";
import ShellLoading from "../common/loading";
import AudioPayManagerSingle from "./audioPlayManager";
import SocketStreamManager from "./socketManager";
type AudioType = {
  showControl?: boolean;
  isDone?: boolean;
  item?: MessageDetail;
};

const AudioMessage = forwardRef(
  ({ item, isDone, showControl = true }: AudioType, ref) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    // 两种Audio都共用一个Uri和Sound，因为要多条消息的管理，所以单例很难做，
    // 每个AudioMessage里面有一个，然后外层去统一管理，就会很方便，
    // 因此分为两部分一部分是需要统一管理的使用soundManager，一部分是组件内统一去维护的使用SoundObj
    const SoundObj = useRef<{
      Sound: Audio.Sound | null;
      uri: string;
      positionMillis: number;
      durationMillis: number;
      isFinish: boolean;
      canLoadNextStream: boolean;
    }>({
      Sound: null,
      uri: "",
      isFinish: false,
      positionMillis: 0,
      durationMillis: 0,
      canLoadNextStream: false,
    });
    const [positionMillis, setPositionMillis] = useState<number>(0);
    const [durationMillis, setDurationMillis] = useState<number>(0);
    const refPlaying = useRef<boolean>(false);
    const [loadFail, setLoadFail] = useState(false);
    // 全局录音单点播放控制
    const soundManager = useRef(AudioPayManagerSingle());
    useImperativeHandle(ref, () => ({
      uri: SoundObj.current.uri,
    }));
    const key = item.botId + "&BOT&" + item.replyUid;
    const loadNext = async () => {
      // 这里需要拿Ref上的
      const { Sound, uri, positionMillis } = SoundObj.current;
      if (Sound && uri) {
        try {
          console.log("loadNext");
          await Sound.unloadAsync();
          // shouldPlay 当前正在播放的流才自动播放
          await Sound.loadAsync(
            { uri: uri },
            {
              positionMillis,
              progressUpdateIntervalMillis: 24,
              shouldPlay: true,
            },
          );

          if (SoundObj.current.isFinish) {
            SoundObj.current.canLoadNextStream = true;
          }
        } catch (e) {}
      }
    };

    const fLoadSteam = useMemoizedFn(async () => {
      refPlaying.current = true;
      await loadSound();
      CallBackManagerSingle().add("play_" + key, () => {
        setIsPlaying(true);
        // 第一次由控制中心开启
        playSound();
      });
      if (!SocketStreamManager().isPlayStreaming()) {
        SocketStreamManager().playStreamNext();
      }
    });

    // TODO 这里简单做一个可以加减少资源加载的频次，比如后端发3次合并后再进行一次加载，然后让给一个Loading
    const [isTimeout, setIsTimeout] = useState(false);
    useEffect(() => {
      if (item.type === "LOADING" && item.replyUid) {
        SocketStreamManager().addAudioStreamCallBack(
          key,
          (msg, uri, timeout) => {
            SoundObj.current.isFinish = msg.isFinal;
            if (!timeout) {
              SoundObj.current.uri = uri;
              if (!SoundObj.current.Sound) {
                fLoadSteam();
              }
            } else {
              // 超时了就移除
              SocketStreamManager().removeresMessagesCallBack(key);
              SocketStreamManager().removeAudioStreamCallBack(key);
            }
            setIsTimeout(timeout);
          },
        );
      }
      return () => {
        SocketStreamManager().removeresMessagesCallBack(key);
        SocketStreamManager().removeAudioStreamCallBack(key);
      };
    }, [item, fLoadSteam, key]);

    const time = useMemo(
      () => formatTime(positionMillis) + "/" + formatTime(durationMillis),
      [positionMillis, durationMillis],
    );

    const setSlideFnc = useMemoizedFn((status) => {
      if (status.isLoaded) {
        setDurationMillis(status.durationMillis || 0);
        SoundObj.current.durationMillis = status.durationMillis || 0;
      }
      // 100ms执行一次，获取时间也需要加100，遇到一秒钟的录音播放有将近50的误差，再加50
      if (
        status.isLoaded &&
        refPlaying.current &&
        status.positionMillis - status.durationMillis + 50 >= 0
      ) {
        setIsPlaying(() => false);
        soundManager.current.stop();
        setPositionMillis(0);
      } else if (status.isLoaded && status.isPlaying) {
        setPositionMillis(status.positionMillis || 0);
        SoundObj.current.positionMillis = status.positionMillis || 0;
      }
    });

    const setStreamSlideFnc = useMemoizedFn((status) => {
      if (!status.isLoaded) {
        return;
      }
      if (status.isLoaded) {
        setDurationMillis(status.durationMillis || 0);
        SoundObj.current.durationMillis = status.durationMillis || 0;
      }
      if (
        status.isLoaded &&
        status.positionMillis - status.durationMillis >= 0
      ) {
        setPositionMillis(status.positionMillis || 0);
        if (!SoundObj.current.canLoadNextStream) {
          loadNext();
        } else {
          setIsPlaying(() => false);
          soundManager.current.stop();
          setPositionMillis(0);
          SocketStreamManager().playStreamNextDouble();
        }
      } else if (status.isLoaded && status.isPlaying) {
        setPositionMillis(status.positionMillis || 0);
        SoundObj.current.positionMillis = status.positionMillis || 0;
      }
    });
    const loadSound = useMemoizedFn(async () => {
      const { uri } = SoundObj.current;
      if (!uri) return;
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          {
            progressUpdateIntervalMillis: 24,
            positionMillis: SoundObj.current.positionMillis || 0,
          },
          (status) => {
            if (item.voiceUrl) {
              setSlideFnc(status);
            } else {
              setStreamSlideFnc(status);
            }
          },
        );
        soundManager.current.currentAutoPlayUrl = uri;
        SoundObj.current.Sound = sound;
        setLoading(false);
      } catch (e) {
        // load sound fail [Error: com.google.android.exoplayer2.audio.AudioSink$InitializationException: AudioTrack init failed 0 Config(22050, 4, 11026)]
        /**
         * 音频解码错误，源于无法创建音轨。手机的音轨资源是有限的，如果每个视频都占用一个音轨并且不释放的话，就会导致上述问题。
         * https://zhuanlan.zhihu.com/p/627702119
         */
        setLoading(false);
        setLoadFail(true);
      }
    });

    useEffect(() => {
      item.voiceUrl && (SoundObj.current.uri = item.voiceUrl);
      loadSound();
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        SoundObj.current?.Sound && SoundObj.current?.Sound.unloadAsync();
      };
    }, [item.voiceUrl, loadSound]);

    const playSound = async () => {
      setLoading(false);
      let opSuccess = false;
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      opSuccess = await soundManager.current.play(
        SoundObj.current.Sound,
        function () {
          setIsPlaying(() => false);
        },
        function () {
          setIsPlaying(() => true);
        },
      );
      return opSuccess;
    };

    const handlePlayPause = async () => {
      SocketStreamManager().resetPlayStream();
      if (SoundObj.current.Sound !== null) {
        if (isPlaying) {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
          });
          soundManager.current.pause();
          // 加个延迟，播放中会设置为true，停止需要一点时间
          setIsPlaying(() => false);
        } else {
          const canPlay = await playSound();
          if (!canPlay) {
            setLoadFail(true);
          } else {
            setIsPlaying(() => true);
          }
        }
      }
    };

    useEffect(() => {
      refPlaying.current = isPlaying;
    }, [isPlaying]);

    const handleChange = async (value: number) => {
      if (SoundObj.current.Sound !== null) {
        await soundManager.current.currentSound.setPositionAsync(value);
      }
    };
    // 已经完成了，却没有给Uri赋值
    if (isDone && !SoundObj.current.uri) return null;
    if (loadFail || isTimeout)
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          style={{ paddingHorizontal: 15 }}
          onPress={() => {
            loadSound();
          }}
        >
          <Text style={{ color: "#333" }}>
            {isTimeout ? "Connection timed out" : "AudioCannotPlay"}
          </Text>
        </TouchableOpacity>
      );

    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showControl && (
            <TouchableOpacity onPress={handlePlayPause}>
              {loading ? (
                <ShellLoading
                  backgroundColor={!item.replyUid && "#F1EAFE"}
                ></ShellLoading>
              ) : isPlaying ? (
                <Messagepause height={32} width={32} />
              ) : (
                <MessagePlay height={32} width={32} />
              )}
            </TouchableOpacity>
          )}
          <Text style={styles.time}>{time}</Text>
        </View>
        <View
          style={{
            flex: 1,
            marginRight: 20,
          }}
        >
          <Slider
            minimumValue={0}
            minimumTrackTintColor={"black"}
            thumbTintColor={"black"}
            maximumValue={durationMillis}
            value={positionMillis}
            thumbStyle={{ width: 5, height: 5 }}
            trackStyle={{ height: 2 }}
            onValueChange={(value) => {
              handleChange(value[value.length - 1]);
            }}
          />
        </View>
      </View>
    );
  },
);

AudioMessage.displayName = "AudioMessage";
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
    paddingLeft: 15,
    width: 263,
    borderColor: "#E2E8F0",
    borderBottomWidth: 1,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    maxHeight: 38,
  },
  slider: {
    height: 5,
    width: 250,
  },
  time: {
    marginHorizontal: 8,
    fontSize: 12,
  },
});

export default memo(AudioMessage);
