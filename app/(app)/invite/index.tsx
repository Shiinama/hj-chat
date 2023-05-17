import { Text, View, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useEffect, useState } from 'react'
import { TextInput, Toast } from '@fruits-chain/react-native-xiaoshu'
import Copy from '../../../assets/images/profile/copy.svg'
import Shim from '../../../components/full-image/shim'
import { getInvitation } from '../../../api/proofile'
import System from '../../../constants/System'
import ShellLoading from '../../../components/loading'
import { useNavigation } from 'expo-router'
import Clipboard from '@react-native-clipboard/clipboard'

export default function Invite() {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [validInvitationCount, setValidInvitationCount] = useState(false)
  useEffect(() => {
    navigation.setOptions({
      title: 'Invite To Earn',
      headerTitleAlign: 'center',
    })
    setLoading(true)
    getInvitation({}).then(({ code, validInvitationCount }: any) => {
      setCode(code)
      setLink(`${System.inviteLink}${code}`)
      setValidInvitationCount(validInvitationCount)
      setLoading(false)
    })
  }, [])

  const [link, setLink] = useState('')
  const [code, setCode] = useState('')
  if (loading) {
    return <ShellLoading />
  }
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <View>
            <View style={styles.inviteConut}>
              <Text style={{ fontSize: 16, fontWeight: '700' }}>Your valid invite</Text>
              <Text style={{ fontSize: 34, fontWeight: '800', color: '#7A2EF6' }}>{validInvitationCount || 0}</Text>
              <Text style={{ fontSize: 16, width: 263, color: '#797979' }}>
                Share Myshell with Friends and instantly enjoy high rebate benefits.
              </Text>
            </View>
            <View style={styles.inputView}>
              <Text style={{ fontSize: 16, fontWeight: '700' }}>Invite Link</Text>
              <TextInput
                editable={false}
                suffix={
                  <Copy
                    onPress={() => {
                      Clipboard.setString(link)
                      Toast('Copied')
                    }}
                  />
                }
                fixGroupStyle={{
                  backgroundColor: '#EDEDED',
                  marginTop: 10,
                  height: 40,
                  borderRadius: 4,
                }}
                value={link}
                onChangeText={nextValue => setLink(nextValue)}
              />
            </View>
            <View style={styles.inputView}>
              <Text style={{ fontSize: 16, fontWeight: '700' }}>Invite Code</Text>
              <TextInput
                editable={false}
                suffix={
                  <Copy
                    onPress={() => {
                      Clipboard.setString(code)
                      Toast('Copied')
                    }}
                  />
                }
                fixGroupStyle={{
                  backgroundColor: '#EDEDED',
                  marginTop: 10,
                  height: 40,
                  borderRadius: 4,
                }}
                value={code}
                onChangeText={nextValue => setCode(nextValue)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Shim />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
  },
  inviteConut: {
    paddingVertical: 24,
    backgroundColor: '#F6F6F6',
    width: 343,
    height: 261,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputView: {
    marginTop: 24,
    width: 343,
  },
})
