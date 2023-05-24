import './shim.js'
// import crypto from 'crypto'
import 'expo-router/entry'
import 'react-native-get-random-values'
// import './tmp/pollify'
import './utils/shadow-polyfill'
//test particle
import { ParticleInfo } from './tmp/NetService/ParticleInfo'

import * as particleAuth from 'react-native-particle-auth'
import { ChainInfo, Env } from 'react-native-particle-auth'
import { setCustomText } from './utils/font'

// PARTICLE_PROJECT_ID=c9aa126d-8db2-45cc-8898-60e3a69d5050
// PARTICLE_CLIENT_ID=cOyQSJfazQ5zu32GwvW7AvBz0f7q0RWUIULWMZhk
// PARTICLE_APP_ID=6b6a232e-973a-405c-969a-a546189fda16
const init = async () => {
  // Get your project id and client from dashboard,
  // https://dashboard.particle.network/
  // 生产
  ParticleInfo.projectId = 'cb5e91db-f37b-4e53-8107-b97e36f78072' // your project id
  ParticleInfo.clientKey = 'cPllcC2s2NmUZKJLmdzKyJZDIzz70Vasg5kwTsrx' // your client key
  // ParticleInfo.projectId = 'c9aa126d-8db2-45cc-8898-60e3a69d5050' // your project id
  // ParticleInfo.clientKey = 'cOyQSJfazQ5zu32GwvW7AvBz0f7q0RWUIULWMZhk' // your client key

  if (ParticleInfo.projectId == '' || ParticleInfo.clientKey == '') {
    throw new Error('You need set project info')
  }

  const chainInfo = ChainInfo.EthereumGoerli
  // const chainInfo = EvmService.currentChainInfo;
  const env = Env.Production
  particleAuth.init(chainInfo, env)
}
setCustomText()
setTimeout(() => {
  init()
}, 3000)
