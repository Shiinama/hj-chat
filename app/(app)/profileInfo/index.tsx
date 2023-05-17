import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { useNavigation } from 'expo-router'
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { WebView } from 'react-native-webview'

import { Image } from 'expo-image'
import { styles } from './style'
import Camera from '../../../assets/images/profile/camera.svg'
import ActiveIcon from '../../../assets/images/profile/activeIcon.svg'
import Discord from '../../../assets/images/profile/discord.svg'
import Telegram from '../../../assets/images/profile/telegram.svg'
import Twitter from '../../../assets/images/profile/twitter.svg'
import ImgPlaceholder from '../../../assets/images/img_placeholder.png'
import useUserStore, { getConnections, getProfile } from '../../../store/userStore'
import { Button, Popup, Toast } from '@fruits-chain/react-native-xiaoshu'
import { useBoolean, useDebounceEffect, useDeepCompareEffect } from 'ahooks'
import {
  getIsUserNameAvailable,
  getUserConnectedAccounts,
  postConnectToTelegram,
  postUpdateUserName,
  UserConnectedAccounts,
} from '../../../api/proofile'
import EditAvatarModal from '../../../components/profileInfo/EditAvatarModal'
import { genAvatarUrl } from '../../../components/profileInfo/helper'

export default function Profile() {
  const navigation = useNavigation()
  const { profile, userConnectedAccounts } = useUserStore()
  const [pageVisible, setPageVisible] = useState(false)
  const [name, setName] = useState(profile?.name)
  const [visible, { set: setVisible }] = useBoolean(false)
  const [saveLoading, { set: setSaveLoading }] = useBoolean(false)
  const [btnDisabled, { set: setBtnDisabled }] = useBoolean(true)
  useDebounceEffect(
    () => {
      getIsUserNameAvailable({ name }).then(res => {
        if (res) {
          setBtnDisabled(false)
        } else {
          setBtnDisabled(true)
        }
      })
    },
    [name],
    { wait: 400 }
  )
  useDeepCompareEffect(() => {
    setName(profile?.name)
  }, [profile?.name])

  useFocusEffect(
    useCallback(() => {
      getProfile()
      getConnections()
    }, [])
  )
  useEffect(() => {
    navigation.setOptions({
      title: 'Edit Profile',
    })
  }, [navigation])
  const connectionsList = useMemo(() => {
    return [
      // { name: "Twitter", icon: <Twitter />, isAcitve: false },
      // { name: "Discord", icon: <Discord />, isAcitve: false },
      {
        name: 'Telegram',
        icon: <Telegram />,
        isAcitve: userConnectedAccounts?.telegram?.id,
        userName: userConnectedAccounts?.telegram?.firstName,
        onPress: () => {
          setPageVisible(true)
        },
      },
    ]
  }, [userConnectedAccounts])
  const saveAction = () => {
    setSaveLoading(true)
    getIsUserNameAvailable({ name }).then(res => {
      if (res) {
        postUpdateUserName({ name }).then(res => {
          Toast('Update successfully!')
          setSaveLoading(false)
          getProfile()
        })
      }
    })
  }
  return (
    <View style={styles.container}>
      <ScrollView bounces={false} style={{ flex: 1 }}>
        <View style={styles.main}>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => {
              setVisible(true)
            }}
          >
            <Image
              cachePolicy="disk"
              placeholderContentFit="cover"
              placeholder={ImgPlaceholder}
              source={{ uri: genAvatarUrl(profile?.avatar) }}
              style={styles.avatarImg}
            />
            <View style={styles.mask}>
              <Camera />
            </View>
          </TouchableOpacity>
          {/* 编辑头像modal */}
          <EditAvatarModal visible={visible} setVisible={setVisible} profile={profile} />
          <View style={styles.contentWrap}>
            <View>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                placeholder="Write your name, MAX 32 characters"
                maxLength={32}
                onChangeText={nextValue => setName(nextValue)}
              />
            </View>
            <View style={styles.br} />
            <View>
              <Text style={styles.label}>Connections</Text>
              <Text style={styles.tips}>Add accounts to your profile to make more friends</Text>
              {connectionsList?.map((v, i) => {
                return (
                  <TouchableOpacity
                    style={{
                      ...styles.connectionsItem,
                      ...(v?.isAcitve ? styles.connectionsActiveItem : {}),
                    }}
                    onPress={v.onPress}
                    key={i}
                  >
                    <View style={styles.itemBody}>
                      {v?.isAcitve ? <ActiveIcon style={styles.activeIcon} /> : null}
                      <Text style={styles.connectionsItemText}>
                        {v?.isAcitve ? v?.name : `Connect with ${v?.name}`}
                      </Text>
                    </View>
                    {v?.icon}
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.action}>
        <Button style={styles.actionMain} disabled={btnDisabled} loading={saveLoading} onPress={saveAction}>
          Save Changes
        </Button>
      </View>

      <Popup.Page visible={pageVisible}>
        <Popup.Header
          title="telegram"
          onClose={() => {
            setPageVisible(false)
          }}
        />
        <WebView
          source={{
            uri: 'https://app-test.myshell.ai/mobile/connect/tg',
          }}
          onMessage={e => {
            setPageVisible(false)
            postConnectToTelegram(JSON.parse(e.nativeEvent.data))
          }}
        />
      </Popup.Page>
    </View>
  )
}
