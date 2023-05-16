import { ChatContext } from '../../app/(app)/chat/chatContext'
import { Popup, Toast } from '@fruits-chain/react-native-xiaoshu'
import { FC, useContext } from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import * as FileSystem from 'expo-file-system'
import systemConfig from '../../constants/System'
import CopyLinkIcon from '../../assets/images/chat/copy_link.svg'
import SaveIcon from '../../assets/images/chat/save_img.svg'
import TwitterIcon from '../../assets/images/chat/twitter.svg'
import Clipboard from '@react-native-clipboard/clipboard'

import { createSharedConversation } from '../../api'
import { ensureDirExists, imageDir } from '../../utils/filesystem'
// import { ensureDirExists } from '../../utils/filesystem'
export interface ShareToPopupProps {}
type shareAction = 'save' | 'link' | 'twitter'
const ShareToPopup: FC<ShareToPopupProps> = () => {
  const { value, setValue } = useContext(ChatContext)
  const action = (key: shareAction) => {
    if (value?.selectedItems?.length <= 0) {
      Toast('Please select at least one chat!')
      return false
    }
    const { close: clearClose } = Toast.loading('Sharing')
    // https://share.vinstic.com/share/101952a812444b22a83fd4e4dcb99a46/download
    createSharedConversation(value.selectedItems).then(async res => {
      switch (key) {
        case 'save':
          const isExists = await ensureDirExists()
          console.log(isExists)
          if (!isExists) {
            Toast('File system error!')
            return
          }
          FileSystem.downloadAsync(`${systemConfig.downloadHost}/${res}/download`, `${imageDir}` + `${res}.png`)
            .then(({ uri }) => {
              console.log(uri)
              Toast('download successfully!')
            })
            .catch(error => {
              console.error(error)
            })
            .finally(() => {
              clearClose()
            })
          break
        case 'link':
          Clipboard.setString(`${systemConfig.shareLink}${res}`)
          clearClose()
          Toast('Copied!')
          break
        case 'twitter':
          break
        default:
          break
      }
    })

    setValue({ selectedItems: [], pageStatus: 'normal' })
  }
  return (
    <Popup visible={value?.pageStatus === 'sharing'} position={'bottom'} overlay={false}>
      <View style={styles.sharePopup}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Share to</Text>
        </View>
        <View style={styles.itemWrap}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              action('save')
            }}
          >
            <SaveIcon />
            <Text style={styles.itemText}>Save Img</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              action('link')
            }}
          >
            <CopyLinkIcon />
            <Text style={styles.itemText}>Copy Link</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              action('twitter')
            }}
          >
            <TwitterIcon />
            <Text style={styles.itemText}>Twitter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Popup>
  )
}

const styles = StyleSheet.create({
  sharePopup: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8ECEF',
    backgroundColor: '#F6F6F6',
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
  },
  titleText: {
    color: '#7A2EF6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    paddingBottom: 36,
  },
  item: {
    alignItems: 'center',
  },
  itemText: {
    color: '#1F1F1F',
    fontSize: 14,
    marginTop: 2,
    lineHeight: 22,
  },
})
export default ShareToPopup
