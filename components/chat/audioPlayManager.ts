import { Audio } from "expo-av";
import { AppState, NativeEventSubscription } from "react-native";

export class AudioPayManager {
  private currentSound: Audio.Sound;
  private currentSoundStopMethod;
  private currentSoundRePlayMethod;
  private pauseAppInBackground = false;

  private appStateListener: NativeEventSubscription;
  private appPreState = "";

  currentAutoPlayUrl = undefined

  constructor() {
    this.appStateListener = AppState.addEventListener("change", (state)=> {
      if (state === "background") {
        this.appInBackground();
      } else if (state === "active" && this.appPreState === 'background') {
        this.appReActive()
      }
      this.appPreState = state;
    })
  }

  

  async destory() {
    if (this.currentSound) {
      try {
        await this.currentSound.unloadAsync();
      } catch (error) {
      }
      try {
        this.currentSound = undefined;
        this.appStateListener?.remove();
        this.currentSoundStopMethod = undefined;
        this.currentSoundRePlayMethod = undefined;
      } catch (error) {
      }
    }
  }

  appInBackground() {
    this.pauseAppInBackground = true;
    this.pause(true);
  }

  async appReActive() {
    
    if (this.pauseAppInBackground) {
      this.pauseAppInBackground = false;
      if (this.currentSound) {
        try {
          this.currentSoundRePlayMethod?.();
          await this.currentSound.playAsync();
        } catch (error) {
          console.log("appReActive", error);
        }
      }
    }
  }

  async pause(isCallBack?: boolean) {
    if (this.currentSound) {
      try {
        isCallBack && this.currentSoundStopMethod?.();
        await this.currentSound.pauseAsync();
      } catch (error) {
        console.log("pause", error);
      }
    }
  }

  async stop(isCallBack?: boolean) {
    if (this.currentSound) {
      try {
        // 如果进入后台刚好播放完 再次进入就不再重新播放
        this.pauseAppInBackground = false;
        isCallBack && this.currentSoundStopMethod?.();
        await this.currentSound.stopAsync();
      } catch (error) {
        console.log("stop", error);
      }
    }
  }

  async play(sound: Audio.Sound, callBack: Function, rePlay?: Function) {
    if (this.currentSound) {
      try {
        this.currentSoundStopMethod?.();
        await this.currentSound.pauseAsync().catch(e=>{
          console.log("play-pauseAsync-catch",e);
        })
      } catch(e) {
        console.log("play-pauseAsync",e);
      }
    }
    this.currentSound = sound;
    this.currentSoundStopMethod = callBack;
    this.currentSoundRePlayMethod = rePlay;
    try {
      await sound.playAsync();
    } catch (e) {
      console.log("play",e);
    }

  }

}

const AudioPayManagerSingle = (function(){
  let instance:AudioPayManager;
  return function() {
    if (instance) return instance;
    instance = new AudioPayManager();
    return instance;
  }
})()

export default AudioPayManagerSingle