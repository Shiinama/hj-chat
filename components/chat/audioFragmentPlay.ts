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

  private currentDur: number = 0

  private playing: boolean = false

  private isPlayed: boolean = false

  onPositionChange: (dur: number, total: number) => void
  getSounds: (sounds) => void

  base64: string = ''

  private isAddFinish = false

  private isLoadFinsh = false

  private forward = 0

  replyUid: string

  isPlaying() {
    return this.playing
  }

  async addSoundUrl(url: string, finish?: boolean) {
    if (!url || url?.length === 0) {
      return
    }
    this.isAddFinish = finish
    this.base64 = url
    this.isLoadFinsh = false
    this.playSingleSound()
  }

  resetPlayIndex() {
    this.currentDur = 0
  }

  isLoading = false
  async playSingleSound() {
    if (!this.currentSound && !this.isLoading) {
      this.isLoading = true
      Audio.Sound.createAsync({ uri: this.base64 }, { shouldPlay: false }, status => {
        // console.log('--:', status)

        if (status.isLoaded && status.positionMillis - status.durationMillis >= 0 && status.durationMillis) {
          this.playing = false

          this.playNextUrl()
          this.addCurrentDurMill(status.positionMillis)
          // if (this.forward) {
          // }
          // this.forward = 0
        }
        if (status.isLoaded && status.isPlaying) {
          // console.log(status.positionMillis, 'loading')
          if (status.positionMillis > 0) {
            this.addCurrentDurMill(status.positionMillis)
          }
        }
      })
        .then(async res => {
          this.currentSound = res.sound

          if (res.status.isLoaded && res.status.durationMillis) {
            this.totalDurMill = res.status.durationMillis
            try {
              await AudioPayManagerSingle().play(
                this.currentSound,
                () => {
                  this.playing = false
                },
                () => {
                  this.playing = true
                  console.log('then重新播放')
                }
              )
              this.playing = true
              this.isLoading = false
            } catch (error) {}
          }
        })
        .catch(e => {
          this.isLoading = false
          console.log('createAsync-error:', e)
        })
    } else {
      if (this.isAddFinish && this.isLoadFinsh) {
        const playRes = await AudioPayManagerSingle().play(
          this.currentSound,
          () => {
            this.playing = false
          },
          () => {
            console.log('then重新播放')
          }
        )
        this.isLoading = false
        this.playing = playRes
      } else {
        this.playNextUrl()
      }
    }
  }

  async playNextUrl() {
    if (this.playing || this.isLoading) {
      console.log('playNextUrl false', this.soundUrls.length, this.playing, this.isLoading)
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
      .loadAsync({ uri: this.base64 }, { shouldPlay: false, positionMillis: this.currentDur })
      .then(async res => {
        // 如果当前加载的音频和上次加载的一样返回，说明都加载完了
        if (this.totalDurMill === res.durationMillis) {
          this.isLoadFinsh = true
          AudioPayManagerSingle().pause()
          this.playing = false
          this.addCurrentDurMill(0)
          return
        }
        if (res.isLoaded && res.durationMillis) {
          this.totalDurMill = res.durationMillis
          // this.addTotalDurMill(res.durationMillis)
          // this.currentSound.playAsync()

          const playRes = await AudioPayManagerSingle().play(
            this.currentSound,
            () => {
              console.log('then被停止')
            },
            () => {
              console.log('then重新播放')
            }
          )
          this.isLoading = false
          this.playing = playRes
        }
      })
      .catch(e => {
        this.isLoading = false
        console.log('加载下一个失败：', e)
      })
  }

  addTotalDurMill(duration: number) {
    this.totalDurMill += duration
  }

  addCurrentDurMill(duration: number) {
    this.currentDur = duration
    this.onPositionChange?.(this.currentDur, this.totalDurMill)
  }

  clear() {
    this.soundUrls = []
    try {
      this.currentSound?.stopAsync()
    } catch (error) {}
  }
}
