import { AVPlaybackStatus, Audio } from 'expo-av'
import AudioPayManagerSingle from './audioPlayManager'

/**
 * @author lewin
 * 多个音频文件轮流播放类
 * 1. 有一个url数组
 * 2. 两个sound类，一个是当前播放的，一个是下一个待播放的片段sound，就是类似喊121212这种口号一样，播放完url数组就停止
 * 3. 一个Sound类，播放完加载下一个播放
 */
export default class AudioFragmentPlay {
  private soundUrls: Array<string> = []
  currentSound: Audio.Sound
  private nextSound: Audio.Sound

  private totalDurMill: number = 0
  private currentIndex: number = 0

  private currentDur: number = 0

  private playing: boolean = false

  private isPlayed: boolean = false

  private isAddFinish = false

  onPositionChange: (dur: number, total: number) => void

  private forward = 0

  replyUid: string

  isPlaying() {
    return this.playing
  }

  async addSoundUrl(url: string, isFinal?: boolean) {
    if (!url || url?.length === 0) {
      return
    }
    if (this.soundUrls.length === 0) {
      this.currentIndex = 0
    }
    const newUrl = `data:audio/mp3;base64,${url}`
    if (url && !this.soundUrls.includes(newUrl)) {
      this.soundUrls.push(newUrl)
    }

    const startPlay = this.soundUrls.length === 1 || (this.soundUrls.length > 0 && this.isPlayed && !this.playing)
    // console.log('addSoundUrl:', this.soundUrls)
    // 使用多个来播放
    // if (startPlay) {
    //   this.play()
    // }
    // 使用单个sound来播放
    this.playSingleSound()
  }

  resetPlayIndex() {
    if (this.currentIndex >= this.soundUrls.length - 1) {
      this.currentIndex = 0
      this.currentDur = 0
    }
    console.log('resetPlayIndex:', this.currentIndex)
  }

  isLoading = false
  playSingleSound() {
    if (!this.currentSound && !this.isLoading) {
      this.isLoading = true

      Audio.Sound.createAsync({ uri: this.soundUrls[this.currentIndex] }, { shouldPlay: false }, status => {
        const offDur = this.currentIndex < this.soundUrls.length ? 800 : 150
        // console.log(status, offDur)

        if (status.isLoaded && status.positionMillis - status.durationMillis >= 0 && status.durationMillis) {
          this.playing = false

          this.playNextUrl()
          if (this.forward) {
            this.addCurrentDurMill(status.positionMillis)
          }

          this.forward = 0
        }
        if (status.isLoaded && status.isPlaying) {
          this.addCurrentDurMill(status.positionMillis)
        }
      })
        .then(async res => {
          this.currentSound = res.sound
          this.currentIndex += 1
          if (res.status.isLoaded && res.status.durationMillis) {
            this.addTotalDurMill(res.status.durationMillis)

            // this.currentSound.playAsync()
            // AudioPayManagerSingle().currentSound = this.currentSound
            await AudioPayManagerSingle().play(
              this.currentSound,
              () => {
                console.log('then被停止')
                this.playing = false
              },
              () => {
                console.log('then重新播放')
              }
            )
            this.playing = true
            this.isLoading = false
          }
        })
        .catch(e => {
          this.isLoading = false
          console.log('createAsync-error:', e)
        })
    } else {
      this.playNextUrl()
    }
  }

  async playNextUrl() {
    console.log('playNextUrl:', this.currentIndex)
    if (this.currentIndex >= this.soundUrls.length || this.playing || this.isLoading) {
      console.log('playNextUrl false')

      return
    }
    this.isLoading = true
    console.log('playNextUrl true', this.currentIndex, new Date())
    try {
      this.currentSound.unloadAsync()
    } catch (error) {
      console.log('stop current error:', error)
    }
    this.currentSound = undefined
    console.log('playNextUrl true--unload', this.currentIndex, new Date())
    this.playing = true
    this.isLoading = false
    this.playSingleSound()
    return
    this.currentSound
      .loadAsync({ uri: this.soundUrls[this.currentIndex] }, { shouldPlay: false })
      .then(async res => {
        this.currentIndex += 1
        console.log('playNextUrl true加载下一个开始播放：', res, this.totalDurMill, new Date())
        if (res.isLoaded && res.durationMillis) {
          this.addTotalDurMill(res.durationMillis)
          // this.currentSound.playAsync()

          const playRes = await AudioPayManagerSingle().play(
            this.currentSound,
            () => {
              console.log('then被停止')
              this.playing = false
            },
            () => {
              console.log('then重新播放')
              this.playing = true
            }
          )
          this.isLoading = false
          this.playing = playRes
        }
      })
      .catch(e => {
        this.isLoading = false
        this.playing = false
        console.log('加载下一个失败：', e)
      })
  }

  addTotalDurMill(duration: number) {
    this.totalDurMill += duration
  }

  addCurrentDurMill(duration: number) {
    this.currentDur += duration - this.forward
    console.log('this.currentDur:', this.currentDur)
    this.onPositionChange?.(this.currentDur, this.totalDurMill)
    this.forward = duration
  }

  clear() {
    this.soundUrls = []
    this.currentIndex = 0
    try {
      this.currentSound?.stopAsync()
    } catch (error) {}
  }
}
