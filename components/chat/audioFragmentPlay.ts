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

  onPositionChange: (dur: number, total: number) => void
  getSound: (sound) => void
  finish: () => void

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
      Audio.Sound.createAsync({ uri: this.base64 }, { shouldPlay: false, progressUpdateIntervalMillis: 16 }, status => {
        // 多加10早点回调下一个
        if (
          status.isLoaded &&
          !this.isAddFinish &&
          status.positionMillis - status.durationMillis >= 0 &&
          status.durationMillis
        ) {
          this.playing = false
          this.playNextUrl()
        }
        if (status.isLoaded && status.isPlaying) {
          // -20 防止回不到最初
          if (status.positionMillis > 0 && status.positionMillis < this.totalDurMill - 20) {
            this.addCurrentDurMill(status.positionMillis)
          }
        }
      })
        .then(async res => {
          this.currentSound = res.sound
          this.getSound(res.sound)
          if (this.soundUrls.length > 1) return
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
                }
              )
              this.playing = true
              this.isLoading = false
            } catch (error) {}
          }
        })
        .catch(e => {
          this.isLoading = false
        })
    } else {
      if (this.isAddFinish && this.isLoadFinsh) {
        const playRes = await AudioPayManagerSingle().play(
          this.currentSound,
          () => {
            this.playing = false
          },
          () => {}
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
      return
    }
    this.isLoading = true
    try {
      await this.currentSound.stopAsync()
      await this.currentSound.unloadAsync()
    } catch (error) {}

    this.playing = true
    this.currentSound
      .loadAsync(
        { uri: this.base64 },
        { shouldPlay: false, positionMillis: this.currentDur, progressUpdateIntervalMillis: 16 }
      )
      .then(async res => {
        // 如果当前加载的音频和上次加载的一样返回，说明都加载完了
        // @ts-ignore
        if (this.totalDurMill === res.durationMillis) {
          // 以防加载完毕没法进行二次播放
          this.isLoading = false
          this.isLoadFinsh = true
          AudioPayManagerSingle().pause()
          this.currentSound.setPositionAsync(0)
          this.addCurrentDurMill(0)
          this.finish()
          this.playing = false
          return
        }
        if (res.isLoaded && res.durationMillis) {
          this.totalDurMill = res.durationMillis
          // this.addTotalDurMill(res.durationMillis)
          // this.currentSound.playAsync()

          const playRes = await AudioPayManagerSingle().play(
            this.currentSound,
            () => {},
            () => {}
          )
          this.isLoading = false
          this.playing = playRes
        }
      })
      .catch(e => {
        this.isLoading = false
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
    try {
      this.currentSound?.stopAsync()
    } catch (error) {}
  }
}
