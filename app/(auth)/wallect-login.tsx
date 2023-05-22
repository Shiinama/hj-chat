import { useState, useEffect, useMemo } from 'react'
import { View, Alert } from 'react-native'
import { useWeb3Modal, Web3Button, Web3Modal } from '@web3modal/react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { AccountCtrl } from '@web3modal/react-native/src/controllers/AccountCtrl'
import { useSnapshot } from 'valtio'
import { ethers } from 'ethers'
import { utf8ToHex } from '@walletconnect/encoding'
import { recoverAddress } from '@ethersproject/transactions'
import { hashMessage } from '@ethersproject/hash'
import type { Bytes, SignatureLike } from '@ethersproject/bytes'
import { generateNonce, verifySignature } from '../../api/auth'
import { useAuth } from '../../context/auth'
import { WallectButton } from './wallect-button'

export function WallectConnectView() {
  const providerMetadata = {
    name: 'React Native V2 dApp',
    description: 'RN dApp by WalletConnect',
    url: 'app-test.myshell.ai',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  }
  const sessionParams = {
    namespaces: {
      eip155: {
        methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
        chains: ['eip155:1'],
        events: ['chainChanged', 'accountsChanged'],
        rpcMap: {},
      },
    },
  }

  const { signIn } = useAuth()
  const { isConnected, provider } = useWeb3Modal()
  const { address } = useSnapshot(AccountCtrl.state)

  const onCopy = (value: string) => {
    Clipboard.setString(value)
    Alert.alert('Copied to clipboard')
  }
  const web3Provider = useMemo(() => (provider ? new ethers.providers.Web3Provider(provider) : undefined), [provider])

  const signMessage = async (web3Provider?: ethers.providers.Web3Provider, msg: string = 'Hello World') => {
    if (!web3Provider) {
      throw new Error('web3Provider not connected')
    }
    // const msg = 'Hello World';
    const hexMsg = utf8ToHex(msg, true)
    const [address] = await web3Provider.listAccounts()
    if (!address) {
      throw new Error('No address found')
    }

    const signature = await web3Provider.send('personal_sign', [hexMsg, address])
    const valid = verifyEip155MessageSignature(msg, signature, address)
    return {
      method: 'personal_sign',
      address,
      valid,
      result: signature,
    }
  }

  const verifyEip155MessageSignature = (message: string, signature: string, address: string) =>
    verifyMessage(message, signature).toLowerCase() === address.toLowerCase()

  function verifyMessage(message: Bytes | string, signature: SignatureLike): string {
    return recoverAddress(hashMessage(message), signature)
  }

  useEffect(() => {
    async function getClientId() {
      if (provider && isConnected) {
        // const _clientId = await provider?.client?.core.crypto.getClientId()
        console.log('我链接了')
        setTimeout(() => {
          generateNonce({
            publicAddress: address,
          }).then(msg => {
            signMessage(web3Provider, msg.nonce).then(res => {
              const signature = res['result']
              console.log('address=' + address)
              console.log('signature=' + signature)
              verifySignature({
                invitationCode: '',
                publicAddress: address,
                signature: signature,
              }).then(res => {
                const info = res
                signIn(info)
              })
            })
          })
        }, 100)
      } else {
        console.log('还没链接')
      }
    }
    getClientId()

    return () => {
      if (provider && isConnected) {
        console.log('disconnect被调用了')
        provider.disconnect()
      }
    }
  }, [isConnected, provider])

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'center',
        }}
      >
        <WallectButton
          style={{
            width: 200,
          }}
        ></WallectButton>
        <Web3Modal
          projectId={'c92c0eff30f8f19ef515ef7a86200fd7'}
          providerMetadata={providerMetadata}
          sessionParams={sessionParams}
          onCopyClipboard={onCopy}
        />
      </View>
    </>
  )
}
