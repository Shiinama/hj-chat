//import './shim.js'
//import crypto from 'crypto'
import 'expo-router/entry'
import 'react-native-get-random-values'
import './tmp/pollify'


//test particle 
import { ParticleInfo } from './tmp/NetService/ParticleInfo';

import * as particleAuth from 'react-native-particle-auth';
import { ChainInfo, Env } from 'react-native-particle-auth';

console.log('particle test init...')

const init = async () => {
    // Get your project id and client from dashboard,  
    // https://dashboard.particle.network/
    ParticleInfo.projectId = 'c135c555-a871-4ec2-ac8c-5209ded4bfd1'; // your project id
    ParticleInfo.clientKey = 'clAJtavacSBZtWHNVrxYA8aXXk4dgO7azAMTd0eI'; // your client key 

    if (ParticleInfo.projectId == "" || ParticleInfo.clientKey == "") {
        throw new Error('You need set project info');
    }

    console.log('sdk init...');
    const chainInfo = ChainInfo.EthereumGoerli;
    // const chainInfo = EvmService.currentChainInfo;
    const env = Env.Production;
    particleAuth.init(chainInfo, env);
};



console.log('3s 后test sdk init结果')
setTimeout(() => {
    init();
}, 3000)

