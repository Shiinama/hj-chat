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

  onPositionChange: (dur: number) => void

  private forward = 0

  replyUid: string

  isPlaying() {
    return this.playing
  }

  async addSoundUrl(url: string) {
    if (!url || url?.length === 0) {
      return
    }
    this.soundUrls.push(url)
    const startPlay = this.soundUrls.length === 1 || (this.soundUrls.length > 0 && this.isPlayed && !this.playing)
    console.log('addSoundUrl:', this.soundUrls)
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
      this.totalDurMill = 0
    }
    console.log('resetPlayIndex:', this.currentIndex)
  }

  isLoading = false
  playSingleSound() {
    if (!this.currentSound && !this.isLoading) {
      this.isLoading = true
      this.currentIndex = 0
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
        .then(res => {
          this.isLoading = false
          this.currentSound = res.sound
          this.currentIndex += 1
          if (res.status.isLoaded && res.status.durationMillis) {
            this.addTotalDurMill(res.status.durationMillis)
            this.playing = true
            // this.currentSound.playAsync()
            // AudioPayManagerSingle().currentSound = this.currentSound
            AudioPayManagerSingle().play(
              this.currentSound,
              () => {
                console.log('then被停止')
                this.playing = false
              },
              () => {
                console.log('then重新播放')
              }
            )
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
    console.log('playNextUrl true')
    try {
      await this.currentSound.stopAsync()
      await this.currentSound.unloadAsync()
    } catch (error) {
      console.log('stop current error:', error)
    }

    this.playing = true
    this.currentSound
      .loadAsync({ uri: this.soundUrls[this.currentIndex] }, { shouldPlay: false })
      .then(async res => {
        this.currentIndex += 1
        this.isLoading = false
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
            }
          )
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
    this.onPositionChange?.(this.currentDur > this.totalDurMill ? this.totalDurMill : this.currentDur)
    this.forward = duration
  }

  clear() {
    this.soundUrls = []
    this.currentIndex = -1
    try {
      this.currentSound?.stopAsync()
    } catch (error) {}
  }

  // 多个播放开始
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
      if (status.isLoaded && status.positionMillis >= status.durationMillis) {
        this.playing = false
        this.playNext()
      } else if (
        status.isLoaded &&
        status.positionMillis &&
        status.positionMillis !== status.durationMillis &&
        status.isPlaying
      ) {
        console.log(status)
        this.addCurrentDurMill(status.positionMillis)
      }
    })
      .catch(e => {
        console.log('loaderror:', e)
        return e
      })
      .then((res: { sound: Audio.Sound; status: AVPlaybackStatus }) => {
        const { status } = res
        console.log('then:', res)
        if (status.isLoaded && status.positionMillis === 0 && !this.playing) {
          console.log('then开始播放:', status, this.currentSound)
          this.currentSound = res.sound
          this.isPlayed = true
          this.playing = true
          AudioPayManagerSingle().play(
            this.currentSound,
            () => {
              console.log('then被停止')
              this.playing = false
            },
            () => {
              console.log('then重新播放')
            }
          )
        }
        return res
      })
  }

  private async playNext() {
    if (this.currentIndex >= this.soundUrls.length) {
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
      console.log('开始播放---')
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
  // 多个播放结束
}
