import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSearchParams, useNavigation } from 'expo-router'
import { Text, View, Image, ScrollView, TouchableHighlight } from 'react-native';
import { styles } from './style'
import BotCard from '../../components/botCard';
import { botList } from '../../api/index';
import userLogo from '../../assets/images/login_icon.png';
import walletLogo from '../../assets/images/wallet_icon.png';
import facebookLogo from '../../assets/images/facebook_icon.png';
import googleLogo from '../../assets/images/google_icon.png';
import { Button, TextInput } from "@fruits-chain/react-native-xiaoshu";
// import * as particleAuth from "react-native-particle-auth";

type ListDataItem = {
  id: number
  uid: string
  name: string
  description: string
  userId: number
  logo: string
  language: string
  pinned: boolean
  lastInteractionDate: string
}

export default function Profile() {
  const router = useRouter();
  const navigation = useNavigation();
  const { name, type, uid, userId } = useSearchParams();
  const [tagList, setTagList] = useState([]);

  // const chainInfo = ChainInfo.EthereumGoerli;
  // const env = Env.Production;
  // particleAuth.init(chainInfo, env);

  useEffect(() => {
    navigation.setOptions({
      title: 'Login',
    });
    let list = [
      {
        id: 0,
        bgColor: '#F1EAFE',
        tagColor: '#7A2EF6',
        name: 'Mine'
      },
      {
        id: 1,
        bgColor: '#FAF4E1',
        tagColor: '#F6CA2E',
        name: 'Testnet'
      },
      {
        id: 2,
        bgColor: '#F5E1EF',
        tagColor: '#DD0EA3',
        name: 'en_US'
      },
      {
        id: 3,
        bgColor: '#F5E1EF',
        tagColor: '#DD0EA3',
        name: 'US'
      },
      {
        id: 4,
        bgColor: '#E2F2F6',
        tagColor: '#2ED2F6',
        name: 'Game'
      },
      {
        id: 5,
        bgColor: '#E2F2F6',
        tagColor: '#2ED2F6',
        name: 'Cartoon'
      },
      {
        id: 6,
        bgColor: '#E4E6F7',
        tagColor: '#1A2FE8',
        name: 'Tool'
      }
    ]
    setTagList(list);
  }, [navigation, name]);
  
  function walletClick() {

  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          source={userLogo}
          style={{
            width: 150,
            height: 150,
          }}
        />
        <View style={{width:"60%"}}>
          <Text style={{fontWeight: '600',
            fontSize: 20,
            lineHeight: 30,
            textAlign:"center",
            color: '#000000'}}>The most advanced AI chatbot platform</Text>
        </View>

        <TouchableHighlight onPress={walletClick} style={{marginTop: 20,borderColor:"#000000", borderWidth:1, borderRadius:20, height:35, width: "80%"}}>
          <View style={{display:"flex", flexDirection:"row", justifyContent: "center", alignItems: "center",}}>
                    <Image source={walletLogo} style={{width:32, height:32}}></Image>
                    <Text style={{fontWeight: '600',
                    fontSize: 18,marginLeft:10}}>Wallet Connect</Text>
                  </View>
        </TouchableHighlight>
          
          <View style={{marginTop:30, width:"80%"}}>
            <View style={{backgroundColor:"#cccccc",height:0.5}}></View>
            <View style={{backgroundColor:"#ffffff", width:108, marginTop:-8, marginLeft:90}}><Text style={{color:"#cccccc", fontSize:12, textAlign:"center"}}>Or connect using</Text></View>
          </View>

          <View style={{marginTop: 25,display:"flex", flexDirection:"row", width:"80%", justifyContent:"space-between"}}>
            <View style={{width:"48%",borderColor:"#000000", borderWidth:1, borderRadius:20, height:35,alignItems:"center", justifyContent:"center"}}><Image source={facebookLogo} style={{width:24,height:24}}></Image></View>
            <View style={{width:"48%",borderColor:"#000000", borderWidth:1, borderRadius:20, height:35,alignItems:"center", justifyContent:"center"}}><Image source={googleLogo} style={{width:24,height:24}}></Image></View>
          </View>

          <View style={{display:"flex",flexDirection:"row",marginTop:20, height: 35, borderColor: 'gray', borderWidth: 1, borderRadius:20, width: "80%"}}>
            <TextInput placeholder="Email Address" placeholderTextColor="#cccccc" style={{paddingLeft:20}}></TextInput>
            <Button color="#f8fafc" text="Send" textColor="gray" style={{marginEnd:20, height:30}}></Button>
          </View>

          <View style={{width:"80%", marginTop:20}}><Text style={{textAlign:"center",fontSize:15, color:"#aaaaaa", lineHeight:20}}>If you haven't registered before, we will help you create an account.</Text></View>

      </View>
    </View>
  )
}
