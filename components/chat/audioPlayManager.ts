import { NetInfoState } from '@react-native-community/netinfo'
import { Audio } from 'expo-av'
import { AppState, NativeEventSubscription } from 'react-native'

export class AudioPayManager {
  currentSound: Audio.Sound
  private currentSoundStopMethod
  private currentSoundRePlayMethod
  private pauseAppInBackground = false

  private appStateListener: NativeEventSubscription
  private appPreState = ''
  private isPlay = false

  isRecording = false

  currentAutoPlayUrl = undefined

  netInfo: NetInfoState

  constructor() {
    this.appStateListener = AppState.addEventListener('change', state => {
      if (state === 'background') {
        this.appInBackground()
      } else if (state === 'active' && this.appPreState === 'background') {
        this.appReActive()
      }
      this.appPreState = state
    })
  }

  setIsPlay(isPlay: boolean) {
    this.isPlay = isPlay
  }

  getIsPlay() {
    return this.isPlay
  }

  async destory() {
    this.isRecording = false
    this.currentAutoPlayUrl = undefined
    if (this.currentSound) {
      try {
        await this.currentSound.unloadAsync()
      } catch (error) {}
      try {
        this.currentSound = undefined
        this.appStateListener?.remove()
        this.currentSoundStopMethod = undefined
        this.currentSoundRePlayMethod = undefined
      } catch (error) {}
    }
  }

  appInBackground() {
    if (this.isPlay) {
      this.pauseAppInBackground = true
      this.pause(true)
    }
  }

  async appReActive() {
    if (this.pauseAppInBackground) {
      this.pauseAppInBackground = false
      if (this.currentSound) {
        try {
          this.currentSoundRePlayMethod?.()
          await this.currentSound.playAsync()
        } catch (error) {
          // console.log('appReActive', error)
        }
      }
    }
  }

  async pause(isCallBack?: boolean) {
    this.isPlay = false
    if (this.currentSound) {
      try {
        isCallBack && this.currentSoundStopMethod?.()
        await this.currentSound.pauseAsync()
      } catch (error) {
        // console.log('pause', error)
      }
    }
  }

  async stop(isCallBack?: boolean) {
    this.isPlay = false
    if (this.currentSound) {
      try {
        // 如果进入后台刚好播放完 再次进入就不再重新播放
        this.pauseAppInBackground = false
        isCallBack && this.currentSoundStopMethod?.()
        await this.currentSound.stopAsync()
      } catch (error) {
        console.log('stop', error)
      }
    }
  }

  async play(sound: Audio.Sound, callBack: Function, rePlay?: Function) {
    if (this.isRecording) {
      return false
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      })
    } catch (error) {}
    if (this.currentSound) {
      try {
        console.log('currentSoundStopMethod 停止当前：')
        this.currentSoundStopMethod?.()
        await this.currentSound.pauseAsync().catch(e => {
          // console.log('play-pauseAsync-catch', e)
        })
      } catch (e) {
        // console.log('play-pauseAsync', e)
      }
    }
    this.isPlay = true
    this.currentSound = sound
    this.currentSoundStopMethod = callBack
    this.currentSoundRePlayMethod = rePlay
    try {
      await sound.playAsync()
      return true
    } catch (e) {
      // console.log('playerror', e)
      return false
    }
  }
}

const AudioPayManagerSingle = (function () {
  let instance: AudioPayManager
  return function () {
    if (instance) return instance
    instance = new AudioPayManager()
    return instance
  }
})()

export default AudioPayManagerSingle
