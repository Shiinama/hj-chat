import { getProfile, UserProfile } from '../../store/userStore'
import { Button, Overlay, Toast } from '@fruits-chain/react-native-xiaoshu'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import ArrowLeft from '../../assets/images/profile/arrow-left.svg'
import request from '../../utils/request'

import ImgPlaceholder from '../../assets/images/img_placeholder.png'
import CustomSlider from './Slider'
import { genAvatarUrl } from './helper'
import ViewShot, { captureRef } from 'react-native-view-shot'
import { useBoolean } from 'ahooks'
const uploadFile = async uri => {
  const filePath = uri
  const regex = /\/([\w-]+)\.\w+$/
  const match = regex.exec(uri)
  const filename = match[1]
  const formData = new FormData()
  formData.append('file', {
    uri: filePath,
    type: 'image/png',
    name: filename,
  } as any)
  return await request({
    url: '/user/uploadAvatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': `multipart/form-data`,
    },
  })
}

export interface EditAvatarModalProps {
  visible: boolean
  setVisible: (val: boolean) => void
  profile: UserProfile
}
const EditAvatarModal: FC<EditAvatarModalProps> = ({ visible, setVisible, profile }) => {
  const viewRef = useRef()
  const [imgSize, setImgSize] = useState(0)
  const [inputImage, setInputImage] = useState<ImagePicker.ImagePickerAsset>(null)
  const [zoom, setZoom] = useState(1)
  const [zoomSize, setZoomSize] = useState(0)
  const [updateLoading, { set: setUpdateLoading }] = useBoolean(false)
  const canEdit = useMemo(() => {
    if (inputImage) {
      return true
    } else {
      if (zoom !== 1) {
        return true
      }
    }
    return false
  }, [zoom, inputImage])
  useEffect(() => {
    setZoomSize(imgSize)
  }, [imgSize])
  useEffect(() => {
    if (visible) {
      setInputImage(null)
      setZoom(1)
    }
  }, [visible])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.canceled) {
      setInputImage(result.assets[0])
    }
  }

  const updateAvatar = async () => {
    setUpdateLoading(true)
    try {
      captureRef(viewRef, {
        format: 'png',
        quality: 1,
      }).then(
        uri => {
          uploadFile(uri)
            .then(res => {
              Toast('Update successfully!')
              setVisible(false)
              getProfile()
            })
            .finally(() => {
              setUpdateLoading(false)
            })
        },
        error => {
          console.log(error)
          setUpdateLoading(false)
        }
      )
      // if (inputImage?.fileSize > 1048576) {
      //   Toast("The image size cannot exceed 1M");
      //   return false;
      // }
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <Overlay visible={visible} style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.cardWrap}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false)
                }}
              >
                <ArrowLeft />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Update avatar</Text>
            </View>
            <Button
              disabled={!canEdit}
              loading={updateLoading}
              color="#1F1F1F"
              size="s"
              style={{ borderRadius: 12, paddingHorizontal: 14 }}
              onPress={() => {
                updateAvatar()
              }}
            >
              Confirm
            </Button>
          </View>
          <View
            style={styles.content}
            onLayout={e => {
              // 需要减边框的8像素
              setImgSize(e?.nativeEvent?.layout?.width - 8)
            }}
          >
            <TouchableOpacity
              onPress={() => {
                pickImage()
              }}
            >
              <View
                style={{
                  width: imgSize,
                  height: imgSize,
                  borderWidth: 4,
                  borderColor: '#7A2EF6',
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  ref={viewRef}
                >
                  <Image
                    cachePolicy="disk"
                    placeholderContentFit="cover"
                    placeholder={ImgPlaceholder}
                    source={{
                      uri: genAvatarUrl(inputImage?.uri ? inputImage?.uri : profile?.avatar),
                    }}
                    style={{
                      width: zoomSize,
                      height: zoomSize,
                      transform: [{ scale: zoom }],
                    }}
                  />
                  <Image
                    source={{
                      uri: genAvatarUrl(inputImage?.uri ? inputImage?.uri : profile?.avatar),
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <CustomSlider value={zoom} onValueChange={setZoom} maximumValue={2} minimumValue={1} />
          </View>
        </View>
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  cardWrap: {
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  card: {
    maxWidth: 480,
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ededed',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 3,
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  content: {},
})
export default EditAvatarModal
