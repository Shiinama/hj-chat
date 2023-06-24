import { Button } from '@fruits-chain/react-native-xiaoshu'
import { View, Text, StyleSheet } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { getInvitation } from '../../api/proofile'
import * as WebBrowser from 'expo-web-browser'
import { Toast } from '@fruits-chain/react-native-xiaoshu'
import System from '../../constants/System'

type Iprops = {
  title: number
  level: number
  id: number
  Sea?: boolean
  buttonText: string
  subView: {
    subTitle: string
    subText: string
  }[]
}
export default function PassCardItem({ title, subView, level, id, buttonText }: Iprops) {
  const cardTitle = () => {
    return (
      <View style={styles.viewItem}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{title}</Text>
      </View>
    )
  }
  const subViewRender = (i, index) => {
    return (
      <View key={index} style={styles.viewItem}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                height: 12,
                width: 4,
                marginRight: 6,
                backgroundColor: '#7A2EF6',
              }}
            ></View>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>{i.subTitle}</Text>
          </View>
          {i.subText ? (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 14 }}>{i.subText}</Text>
            </View>
          ) : (
            i.subTextArray.map(i => (
              <View
                key={i}
                style={{
                  marginTop: 12,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: '#EDEDED',
                }}
              >
                <Text style={{ fontSize: 14, lineHeight: 24 }}>{i}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    )
  }

  const buttonGroupRender = () => {
    if (id < level) {
      return null
    }

    if (id === 2 && id !== level) {
      return (
        <Button
          textStyle={{ fontWeight: '700' }}
          onPress={() => {
            getInvitation({}).then(({ code }: any) => {
              Clipboard.setString(`${System.inviteLink}${code}`)
              Toast('Copied!')
            })
          }}
          style={styles.bottomButton}
        >
          <Text>Invite</Text>
        </Button>
      )
    }

    if (id === level) {
      return (
        <Button textStyle={styles.textStyle} disabled={true} style={[styles.bottomButton, styles.greyColor]}>
          Current Level
        </Button>
      )
    }

    if (id > level) {
      return (
        <Button textStyle={styles.textStyle} disabled={true} style={[styles.bottomButton, styles.greyColor]}>
          Coming Soon
        </Button>
      )
    }

    if (buttonText === 'Find more on DC') {
      return (
        <Button
          textStyle={{ fontWeight: '700' }}
          onPress={e => {
            e.preventDefault()
            WebBrowser.openBrowserAsync('https://discord.gg/5XHBzGcE')
          }}
          style={styles.bottomButton}
        >
          Find more on DC
        </Button>
      )
    }

    return (
      <Button textStyle={styles.textStyle} disabled={true} style={[styles.bottomButton, styles.greyColor]}>
        Coming Soon
      </Button>
    )
  }

  return (
    <>
      <View style={styles.container}>
        {cardTitle()}
        {subView.map((i, index) => subViewRender(i, index))}
      </View>
      <View>{buttonGroupRender()}</View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  bottomButton: {
    width: 240,
    alignContent: 'center',
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: '#7A2EF6',
    borderColor: '#7A2EF6',
  },
  greyColor: {
    // color: 'black',
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  textStyle: {
    fontWeight: '700',
    color: '#B9B9B9',
  },
  viewItem: {
    flexDirection: 'row',

    // justifyContent: 'flex-start',
    marginBottom: 30,
    alignItems: 'center',
    width: 230,
  },
})
