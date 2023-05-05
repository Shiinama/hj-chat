import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import BotCard from '../../components/botCard';
import { botList } from '../../api/index';
import ProfileIcon from '../../assets/images/profile/Profile.png';
import arrowIcon from '../../assets/images/profile/arrow.png';
import editIcon from '../../assets/images/profile/edit.png';
import helpIcon from '../../assets/images/profile/help.png';
import inviteIcon from '../../assets/images/profile/invite.png';
import walletIcon from '../../assets/images/profile/wallet.png';
import settingIcon from '../../assets/images/profile/setting.png';
import passcardIcon from '../../assets/images/profile/passcard.png';
import SocialIcon from '../../assets/images/profile/Social.png';
import Social1Icon from '../../assets/images/profile/Social1.png';
import Social2Icon from '../../assets/images/profile/Social2.png';

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

export default function TabThreeScreen() {
  const router = useRouter();
  const [listData, setListData] = useState<ListDataItem[]>([]);

  useEffect(() => {
    botList().then(res => setListData(res as ListDataItem[]))
  }, [])

  const onShowDetail = (event) => {
    router.push({
      pathname: `robot/${event.id}`,
      params: {
        id: event.id,
        userId: event.userId,
        name: event.name,
        language: event.language,
        uid: event.uid,
      },
    })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.profileInfo}>
          <Image
            source={ProfileIcon}
            style={{width: 80,height: 80, borderRadius: 12}}
          />
          <Image
            source={editIcon}
            style={{width: 30,height: 30, borderRadius: 4}}
          />
        </View>
        <View style={styles.profileDetail}>
          <Text style={styles.profileDesc}>Juiceboy999</Text>
          <Text style={styles.profileBianhao}>#0871</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
  },
  profile: {
    padding: 16,
    width: '100%',
    height: 240,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileInfoAvatar: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  profileDetail: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginBottom: 10
  },
  profileDesc: {
    fontSize: 20,
    color: '#1F1F1F',
    fontWeight: '700',
    marginRight: 8
  },
  profileBianhao: {
    fontSize: 20,
    color: '#797979',
    fontWeight: '500',
  }

})
