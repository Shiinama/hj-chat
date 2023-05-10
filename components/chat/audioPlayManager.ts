import { Audio } from "expo-av";

export class AudioPayManager {
  private currentSound: Audio.Sound;
  private currentSoundStopMethod;

  async pause(isCallBack?: boolean) {
    if (this.currentSound) {
      try {
        isCallBack && this.currentSoundStopMethod?.()
        await this.currentSound.pauseAsync()
      } catch (error) {
        
      }
    }
    
  }

  async play(sound: Audio.Sound, callBack: Function) {
    if (this.currentSound) {
      try {
        this.currentSoundStopMethod?.()
        await this.currentSound.pauseAsync()
      } catch(e) {

      }
    }
    this.currentSound = sound;
    this.currentSoundStopMethod = callBack;
    try {
      await sound.playAsync()
    } catch (e) {

    }

  }

}

const AudioPayManagerSingle = (function(){
  let instance:AudioPayManager;
  return function() {
    if (instance) return instance;
    instance = new AudioPayManager()
    return instance;
  }
})()

export default AudioPayManagerSingle