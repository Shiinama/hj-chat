import { Audio } from 'expo-av'
import AudioPayManagerSingle from './audioPlayManager'

/**
 * @author lewin
 * 多个音频文件轮流播放类
 * 1. 有一个url数组
 * 2. 两个sound类，一个是当前播放的，一个是下一个待播放的片段sound，就是类似喊121212这种口号一样，播放完url数组就停止
 */
export default class AudioFragmentPlay {
  private soundUrls: Array<string> = []
  private currentSound: Audio.Sound
  private nextSound: Audio.Sound

  private totalDurMill: number = 0
  private currentIndex: number = 0

  private currentDur: number = 0

  private playing: boolean = false

  private isPlayed: boolean = false

  onPositionChange: (dur: number) => void

  replyUid: string

  isPlaying() {
    return this.playing
  }

  async addSoundUrl(url: string) {
    this.soundUrls.push(url)
    if (this.soundUrls.length === 1 || (this.soundUrls.length > 0 && this.isPlayed && !this.playing)) {
      // const audio = await Audio.Sound.createAsync({ uri: url })
      // audio.sound.playAsync()
      this.play()
    }
  }

  addTotalDurMill(duration: number) {
    this.totalDurMill += duration
  }

  private forward = 0
  addCurrentDurMill(duration: number) {
    if (duration < this.forward) {
      this.forward = 0
    }
    this.currentDur += duration - this.forward
    this.onPositionChange?.(this.currentDur)
    this.forward = duration
  }

  async play() {
    if (this.soundUrls.length === 0 || this.currentIndex >= this.soundUrls.length) {
      console.log('结束播放', this)
      return
    }

    const audio = await this.createAudio(this.soundUrls[this.currentIndex])
    this.currentSound = audio.sound
    this.addTotalDurMill(audio.status?.durationMillis || 0)
    console.log('currentIndex:', this.currentIndex)

    if (this.currentIndex >= this.soundUrls.length) {
      return
    }
    const audioNext = await this.createAudio(this.soundUrls[this.currentIndex + 1])
    this.nextSound = audioNext.sound
    this.addTotalDurMill(audioNext.status?.durationMillis || 0)
  }

  private createAudio(url: string) {
    return Audio.Sound.createAsync({ uri: url }, null, status => {
      if (status.isLoaded && status.positionMillis === 0 && !this.playing) {
        setTimeout(() => {
          AudioPayManagerSingle().play(
            this.currentSound,
            () => {
              console.log('被停止')
              this.playing = false
            },
            () => {
              console.log('重新播放')
            }
          )
          console.log('开始播放:', status, this.currentSound)
        }, 100)
        this.isPlayed = true
        this.playing = true
      } else if (status.isLoaded && status.positionMillis >= status.durationMillis) {
        this.playing = false
        this.playNext()
      }
      if (
        status.isLoaded &&
        status.positionMillis &&
        status.positionMillis !== status.durationMillis &&
        status.isPlaying
      ) {
        console.log(status)
        this.addCurrentDurMill(status.positionMillis)
      }
    }).catch(e => {
      console.log('loaderror:', e)
      return e
    })
  }

  private async playNext() {
    if (this.currentIndex + 1 >= this.soundUrls.length) {
      console.log('结束播放', this)
      return
    }
    console.log('播放下一个')
    if (this.nextSound) {
      if (this.currentSound) {
        try {
          this.currentSound?.stopAsync()
        } catch (error) {}
        try {
          await this.currentSound?.unloadAsync()
        } catch (error) {}
      }
      this.currentSound = this.nextSound

      await AudioPayManagerSingle().play(
        this.currentSound,
        () => {
          this.playing = false
          console.log('被停止')
        },
        () => {
          console.log('重新播放')
        }
      )
      this.playing = true
      console.log('currentIndex:', this.currentIndex)
      this.currentIndex += 1
      const audioNext = await this.createAudio(this.soundUrls[this.currentIndex])
      this.nextSound = audioNext.sound
      this.addTotalDurMill(audioNext.status?.durationMillis || 0)
    } else {
      this.play()
    }
  }

  clear() {
    this.soundUrls = []
    this.currentIndex = -1
    try {
      this.currentSound?.stopAsync()
    } catch (error) {}
  }
}
