import { useCallback } from 'react'
import { useRouter, useFocusEffect } from 'expo-router'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import ImgPlaceholder from '../../assets/images/img_placeholder.png'
import { Image } from 'expo-image'
import arrowIcon from '../../assets/images/profile/arrow.png'
import EditIcon from '../../assets/images/profile/edit.svg'
import helpIcon from '../../assets/images/profile/help.png'
import inviteIcon from '../../assets/images/profile/invite.png'
import walletIcon from '../../assets/images/profile/wallet.png'
import settingIcon from '../../assets/images/profile/setting.png'
import passcardIcon from '../../assets/images/profile/passcard.png'
import SocialIcon from '../../assets/images/profile/Social.png'
import Social1Icon from '../../assets/images/profile/Social1.png'
import Social2Icon from '../../assets/images/profile/Social2.png'
import ThunderIcon from '../../assets/images/profile/Thunder.png'
import CommunityIcon from '../../assets/images/profile/community.png'
import * as WebBrowser from 'expo-web-browser'
import useUserStore, { getConnections, getProfile, getUserEnergyInfo } from '../../store/userStore'
import { genAvatarUrl } from '../../components/profileInfo/helper'
import ProgressBar from '../../components/common/ProgressBar'

export default function TabThreeScreen() {
  const router = useRouter()
  const { profile, userEnergyInfo, userConnectedAccounts } = useUserStore()
  useFocusEffect(
    useCallback(() => {
      getProfile()
      getUserEnergyInfo()
      getConnections()
    }, [])
  )

  const onEdit = () => {
    router.push({
      pathname: '/profileInfo',
    })
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          onEdit()
        }}
      >
        <View style={styles.profile}>
          <View style={styles.profileInfo}>
            <Image
              cachePolicy="disk"
              placeholderContentFit="cover"
              placeholder={ImgPlaceholder}
              source={{ uri: genAvatarUrl(profile?.avatar) }}
              style={{ width: 80, height: 80, borderRadius: 12 }}
            />

            <EditIcon></EditIcon>
          </View>
          <View style={styles.profileDetail}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.profileDesc}>
              {profile?.name}
            </Text>
            <Text style={styles.profileBianhao}>{profile?.nameTag}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={{ ...styles.flextag, ...styles.pink }}>Basic</Text>
            <Text style={{ ...styles.flextag, ...styles.green }}>Lv.{profile?.level}</Text>
            {userConnectedAccounts?.telegram?.id && <Image source={SocialIcon} style={{ width: 24, height: 24 }} />}

            {/* <Image source={Social1Icon} style={{ width: 24, height: 24 }} />
            <Image source={Social2Icon} style={{ width: 24, height: 24 }} /> */}
          </View>
          <View style={{ ...styles.flexMain }}>
            <Image
              source={ThunderIcon}
              style={{
                width: 24,
                height: 24,
                position: 'absolute',
                left: 0,
                top: 0,
              }}
            />
            <ProgressBar maxRange={userEnergyInfo?.dailyEnergy} progressValue={userEnergyInfo?.energy} />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionItem} onPress={() => router.push({ pathname: 'passcard' })}>
        <View style={styles.actionItemInfo}>
          <Image source={passcardIcon} style={{ width: 30, height: 30, marginRight: 6 }} />
          <Text style={styles.actionItemInfoText}>Passcard</Text>
        </View>
        <Image source={arrowIcon} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      {/* <View style={styles.actionItem}>
        <View style={styles.actionItemInfo}>
          <Image
            source={walletIcon}
            style={{ width: 30, height: 30, marginRight: 6 }}
          />
          <Text style={styles.actionItemInfoText}>Wallet</Text>
        </View>
        <Image source={arrowIcon} style={{ width: 24, height: 24 }} />
      </View> */}
      <TouchableOpacity style={styles.actionItem} onPress={() => router.push({ pathname: 'invite' })}>
        <View style={styles.actionItemInfo}>
          <Image source={inviteIcon} style={{ width: 30, height: 30, marginRight: 6 }} />
          <Text style={styles.actionItemInfoText}>Invite to Earn</Text>
        </View>
        <Image source={arrowIcon} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={e => {
          e.preventDefault()
          WebBrowser.openBrowserAsync('https://discord.com/invite/myshell')
        }}
        style={styles.actionItem}
      >
        <View style={styles.actionItemInfo}>
          <Image source={CommunityIcon} style={{ width: 30, height: 30, marginRight: 6 }} />
          <Text style={styles.actionItemInfoText}>Community</Text>
        </View>
        <Image source={arrowIcon} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionItem}
        onPress={e => {
          e.preventDefault()
          WebBrowser.openBrowserAsync('https://docs.myshell.ai/')
        }}
      >
        <View style={styles.actionItemInfo}>
          <Image source={helpIcon} style={{ width: 30, height: 30, marginRight: 6 }} />
          <Text style={styles.actionItemInfoText}>Help</Text>
        </View>
        <Image source={arrowIcon} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionItem} onPress={() => router.push({ pathname: 'settings' })}>
        <View style={styles.actionItemInfo}>
          <Image source={settingIcon} style={{ width: 30, height: 30, marginRight: 6 }} />
          <Text style={styles.actionItemInfoText}>Settings</Text>
        </View>
        <Image source={arrowIcon} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
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
    flexDirection: 'column',
    marginBottom: 20,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginBottom: 10,
    marginRight: 55,
  },
  profileDesc: {
    fontSize: 20,
    color: '#1F1F1F',
    fontWeight: '700',
    marginRight: 8,
  },
  profileBianhao: {
    fontSize: 20,
    color: '#797979',
    fontWeight: '500',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  flextag: {
    height: 24,
    lineHeight: 24,
    paddingLeft: 10,
    paddingRight: 10,
    overflow: 'hidden',
    borderRadius: 8,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 12,
    color: '#FFFFFF',
  },
  pink: {
    backgroundColor: '#F62EE2',
  },
  green: {
    backgroundColor: '#10CE84',
  },
  flexMain: {
    position: 'relative',
    paddingLeft: 30,
  },
  actionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 15,
    paddingRight: 12,
    marginBottom: 20,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
  },
  actionItemInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  actionItemInfoText: {
    fontSize: 16,
    // flex: 1,
    fontWeight: '500',
    color: '#1F1F1F',
  },
})
