import { useState, useEffect, useMemo } from 'react'
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking
} from 'react-native'

import { styles } from './style'
import userLogo from '../../assets/images/login_icon.png'
import walletLogo from '../../assets/images/wallet_icon.png'
import facebookLogo from '../../assets/images/facebook_icon.png'
import googleLogo from '../../assets/images/google_icon.png'
import { Button, TextInput, Toast } from '@fruits-chain/react-native-xiaoshu'
import { useAuth } from '../../context/auth'
import { ChainInfo, LoginType, SupportAuthType, iOSModalPresentStyle, Env } from 'react-native-particle-auth'
import * as particleAuth from 'react-native-particle-auth'
import useUserStore from '../../store/userStore'
import { useWeb3Modal, Web3Button, Web3Modal } from '@web3modal/react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { AccountCtrl } from "@web3modal/react-native/src/controllers/AccountCtrl"
import {useSnapshot} from "valtio"
import { ethers } from 'ethers';
import { utf8ToHex } from '@walletconnect/encoding';
import {recoverAddress} from '@ethersproject/transactions';
import {hashMessage} from '@ethersproject/hash';
import type {Bytes, SignatureLike} from '@ethersproject/bytes';

// import { createWeb3 } from '../../tmp/web3Demo'
import { generateNonce, particleLogin, verifySignature } from '../../api/auth'
// const web3 = createWeb3('c135c555-a871-4ec2-ac8c-5209ded4bfd1', 'clAJtavacSBZtWHNVrxYA8aXXk4dgO7azAMTd0eI')

import MetaMaskSDK from '@metamask/sdk';
import BackgroundTimer from 'react-native-background-timer';

export default function SignIn() {
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

  const [clientId, setClientId] = useState<string>()
  const { isConnected, provider } = useWeb3Modal()
  const { address } = useSnapshot(AccountCtrl.state);

  const sdk = new MetaMaskSDK({
    openDeeplink: link => {
      Linking.openURL(link);
    },
    timer: BackgroundTimer,
    dappMetadata: {
      name: 'React Native Test Dapp',
      url: 'app-test.myshell.ai',
    },
  });
  
  const ethereum = sdk.getProvider();

  const connect = async () => {
    try {
      const result = await ethereum.request({method: 'eth_requestAccounts'});
      /// public address
      const address = result?.[0]
      console.log('public address = ' + address)
      generateNonce({
        publicAddress: address
      }).then((msg) => {  
        setTimeout(() => {
          console.log("msg.nonce = " + msg.nonce)
          sign(msg.nonce)
        }, 100);
      })
      
    } catch (e) {
      console.log('public address have error = ' + e)
    }
  };

  const sign = async (msg) => {
    const msgParams = JSON.stringify({
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: parseInt(ethereum.chainId, 16),
        // Give a user friendly name to the specific contract you are signing for.
        name: 'Ether Mail',
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '1',
      },

      // Defining the message signing data content.
      message: {
        /*
         - Anything you want. Just a JSON Blob that encodes the data you want to send
         - No required fields
         - This is DApp Specific
         - Be as explicit as possible when building out the message schema.
        */
        contents: msg,
        attachedMoneyInEth: 4.2,
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'Mail',
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          {name: 'name', type: 'string'},
          {name: 'version', type: 'string'},
          {name: 'chainId', type: 'uint256'},
          {name: 'verifyingContract', type: 'address'},
        ],
        // Not an EIP712Domain definition
        Group: [
          {name: 'name', type: 'string'},
          {name: 'members', type: 'Person[]'},
        ],
        // Refer to PrimaryType
        Mail: [
          {name: 'from', type: 'Person'},
          {name: 'to', type: 'Person[]'},
          {name: 'contents', type: 'string'},
        ],
        // Not an EIP712Domain definition
        Person: [
          {name: 'name', type: 'string'},
          {name: 'wallets', type: 'address[]'},
        ],
      },
    });

    var address = ethereum.selectedAddress;
    console.log("address = " + address)
    var params = [address, msgParams];
    var method = 'eth_signTypedData_v4';

    /// 签名
    const signature = await ethereum.request({method, params});
    console.log("签名"+signature) 

    verifySignature({
      invitationCode: "",
      publicAddress: address,
      signature: signature
    }).then( res => {
      const userInfo = res
      console.log(userInfo)
      // useUserStore.setState({ particleInfo: userInfo })
      // console.log(userInfo)
      // const info =  particleLogin({
      //   uuid: userInfo.userUid,
      //   token: userInfo.token,
      // })

      // signIn(info)
    })
  };

  const { signIn } = useAuth()
  const login = async loginType => {
    const type = loginType
    const _supportAuthType = [SupportAuthType.Email, SupportAuthType.Google, SupportAuthType.Facebook]
    const result = await particleAuth.login(type, '', _supportAuthType as any, true)
    if (result.status) {
      const userInfo = result.data
      useUserStore.setState({ particleInfo: userInfo })
      const info = await particleLogin({
        uuid: userInfo.uuid,
        token: userInfo.token,
      })

      signIn(info)
    } else {
      const error = result.data
      Toast(error)
    }
  }
  const onCopy = (value: string) => {
    Clipboard.setString(value)
    Alert.alert('Copied to clipboard')
  }
  const web3Provider = useMemo(
    () => (provider ? new ethers.providers.Web3Provider(provider) : undefined),
    [provider],
  );

  useEffect(() => {
    async function getClientId() {
      if (provider && isConnected) {
        const _clientId = await provider?.client?.core.crypto.getClientId()
        setClientId(_clientId)

        setTimeout(() => {
          generateNonce({
            publicAddress: address
          }).then((msg) => {  
            testSignMessage(web3Provider, msg.nonce).then(res => {              
              const signature = res["result"]
              console.log("address="+address)
              console.log("signature="+signature)
              verifySignature({
                invitationCode: "",
                publicAddress: address,
                signature: signature
              }).then( res => {
                const userInfo = res
                useUserStore.setState({ particleInfo: userInfo })
                console.log(userInfo)
                const info =  particleLogin({
                  uuid: userInfo.userUid,
                  token: userInfo.token,
                })

                signIn(info)
              })
            })
          })
        }, 100);
      } else {
        setClientId(undefined)
      }
    }
    getClientId()

  }, [isConnected, provider])

  return (
    <>
      <ScrollView style={styles.main}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Image
              source={userLogo}
              style={{
                width: 150,
                height: 150,
              }}
            />
            <View>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 20,
                  lineHeight: 30,
                  textAlign: 'center',
                  color: '#000000',
                }}
              >
                The most advanced AI chatbot platform
              </Text>
            </View>

            <View style={{ marginTop: 30, width: '80%' }}>
              <View style={{ backgroundColor: '#cccccc', height: 0.5 }}></View>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  width: 108,
                  marginTop: -8,
                  marginHorizontal: 90,
                }}
              >
                <Text
                  style={{
                    color: '#cccccc',
                    fontSize: 12,
                    textAlign: 'center',
                  }}
                >
                  connect using
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 25,
                display: 'flex',
                flexDirection: 'row',
                width: '80%',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                onPress={() => login('Facebook')}
                style={{
                  width: '48%',
                  borderColor: '#000000',
                  borderWidth: 1,
                  borderRadius: 20,
                  height: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image source={facebookLogo} style={{ width: 24, height: 24 }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => login('Google')}
                style={{
                  width: '48%',
                  borderColor: '#000000',
                  borderWidth: 1,
                  borderRadius: 20,
                  height: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image source={googleLogo} style={{ width: 24, height: 24 }}></Image>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'center',
              }}
            >
              <Button
                style={{
                  width: 200,
                  borderRadius: 20,
                  borderColor: '#000000',
                  borderWidth: 1,
                  backgroundColor: 'white',
                }}
                onPress={() => login('Email')}
              >
                <Text style={{ color: 'black', fontSize: 18, fontWeight: '500' }}>Email Login</Text>
              </Button>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'center',
              }}
            >
              <Button
                style={{
                  width: 200,
                  borderRadius: 20,
                  borderColor: '#000000',
                  borderWidth: 1,
                  backgroundColor: 'white',
                }}
                onPress={() => connect()}
              >
                <Text style={{ color: 'black', fontSize: 18, fontWeight: '500' }}>MetaMask</Text>
              </Button>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'center',
              }}
            >
              <Web3Button
                style={{
                  width: 200,
                }}
              ></Web3Button>
              <Web3Modal
                projectId={'c92c0eff30f8f19ef515ef7a86200fd7'}
                providerMetadata={providerMetadata}
                sessionParams={sessionParams}
                onCopyClipboard={onCopy}
              />
            </View>

            <View style={{ width: '80%', marginTop: 20 }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  color: '#aaaaaa',
                  lineHeight: 20,
                }}
              >
                If you haven't registered before, we will help you create an account.
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      {/* <Shim /> */}
    </>
  )
}


export const testSignMessage = async (
  web3Provider?: ethers.providers.Web3Provider,
  msg: string = "Hello World"
) => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }
  // const msg = 'Hello World';
  const hexMsg = utf8ToHex(msg, true);
  const [address] = await web3Provider.listAccounts();
  if (!address) {
    throw new Error('No address found');
  }

  const signature = await web3Provider.send('personal_sign', [hexMsg, address]);
  const valid = verifyEip155MessageSignature(msg, signature, address);
  return {
    method: 'personal_sign',
    address,
    valid,
    result: signature,
  };
};

const verifyEip155MessageSignature = (
  message: string,
  signature: string,
  address: string,
) => verifyMessage(message, signature).toLowerCase() === address.toLowerCase();

export function verifyMessage(
  message: Bytes | string,
  signature: SignatureLike,
): string {
  return recoverAddress(hashMessage(message), signature);
}