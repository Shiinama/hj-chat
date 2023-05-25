import { useRef } from 'react'
import AudioFragmentPlay from './audioFragmentPlay'

export const testPlay = () => {
  const playFragment = new AudioFragmentPlay()

  playFragment.addSoundUrl(
    `file:///data/user/0/ai.myshell.app/files/streamAudio/6_eed05e98dfa24c24982ef5d1efc7f3d5_${0}.mp3`
  )
  // playFragment.addSoundUrl(
  //   `file:///data/user/0/ai.myshell.app/files/streamAudio/6_eed05e98dfa24c24982ef5d1efc7f3d5_${1}.mp3`
  // )
  // setTimeout(() => {
  //   console.log('4秒后加载')
  //   for (let i = 2; i < 15; i++) {
  //     playFragment.addSoundUrl(
  //       `file:///data/user/0/ai.myshell.app/files/streamAudio/6_eed05e98dfa24c24982ef5d1efc7f3d5_${i}.mp3`
  //     )
  //   }
  // }, 10000)
}
