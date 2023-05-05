import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSearchParams, useNavigation } from 'expo-router';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Dialog } from '@fruits-chain/react-native-xiaoshu';
import {
  getUgcBotDetail
} from '../../api/robot';
import { styles } from './style';
import userLogo from '../../assets/images/userLogo.png';
import thunder from '../../assets/images/thunder.png';
import editIcon from '../../assets/images/edit.png';
import publishIcon from '../../assets/images/publish.png';

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

export default function Robot() {
  const router = useRouter();
  const navigation = useNavigation();
  const { name, type, uid, userId } = useSearchParams();
  const [tagList, setTagList] = useState([]);

  useEffect(()=>{
    navigation.setOptions({
      title: 'Robot',
    });
    loadData();
  }, []);

  useEffect(() => {
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

  const loadData = () => {
    getUgcBotDetail({botUid: uid})
      .then(res=>{
        console.log('res', res);
      })
  }

  const showView = () => {
    Dialog({
      title: 'Publish',
      message: 'A robot named "Robot Name" already exists. Are you sure you want to overwrite it?',
      width: 327,
      confirmButtonColor: '#7A2EF6',
      confirmButtonText: 'Confirm',
      cancelButtonColor: '#ffffff',
      cancelButtonText: 'Cancel',
    }).then(action => {
      console.log('提示弹窗：', action)
    })
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          source={userLogo}
          style={{
            width: 100,
            height: 100,
            borderRadius: 100
          }}
        />
        <View style={styles.user}>
          <Text style={styles.userName}>Kanye West</Text>
          <View style={styles.userTag}>
            <Image
              source={thunder}
              style={{
                width: 16,
                height: 16
              }}
            />
            <Text style={styles.userTagText}>1</Text>
          </View>
        </View>
        <View style={styles.tagList}>
          {
            tagList && tagList.map(item=>
              <View
                key={item?.id}
                style={{
                  ...styles.tagListItem,
                  backgroundColor: item?.bgColor
                }}
              >
                <View
                  style={{
                    ...styles.tagListItemTip,
                    backgroundColor: item?.tagColor
                  }}
                ></View>
                <Text style={styles.tagListItemText}>{item?.name}</Text>
              </View>  
            )
          }
        </View>
        <View style={styles.actions}>
          <View style={styles.actionsItem}>
            <Image
              source={editIcon}
              style={{
                width: 30,
                height: 30
              }}
            />
            <Text style={styles.actionsItemText}>Edit</Text>
          </View>
          <View style={styles.actionsItem}>
            <Image
              source={publishIcon}
              style={{
                width: 30,
                height: 30
              }}
            />
            <Text style={styles.actionsItemText}>Publish</Text>
          </View>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionValue}>
          "Her" is a futuristic romantic drama movie that takes place in a world where technology has advanced to the point where people form relationships with AI operating systems.  I will provide my answer, but we will need to improve it through continual iterations by going through the next steps.
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.action} onPress={()=>{showView()}}>
        <View style={styles.actionMain}>
          <Text style={styles.actionChat}>Chat</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
