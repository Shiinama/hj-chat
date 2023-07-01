import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native'
import { renderImage } from '../../profileInfo/helper'
import userStore from '../../../store/userStore'
import LinearText from '../../common/linearText'
import Tag from '../../common/tag'
import { TagFromType, useTagList } from '../../../constants/TagList'
import { memo, useState } from 'react'
import { Dialog, Button, Row, Col } from '@fruits-chain/react-native-xiaoshu'
import { addBanned } from '../../../api/robot'
import CallBackManagerSingle from '../../../utils/CallBackManager'
const windowWidth = Dimensions.get('window').width
function UgcBotCard({ ld, onShowDetail, type, loadData }: any) {
  const tags = useTagList(ld, type)
  const [report, setReport] = useState(false)
  const userInfo = userStore.getState().profile
  return (
    <TouchableOpacity
      style={styles.listItem}
      onLongPress={() => {
        if (type === TagFromType.AllBot) {
          setReport(true)
        }
      }}
      onPress={() => {
        onShowDetail(ld)
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {renderImage(ld.logo, styles.avatar)}
        <View style={styles.listItemTop}>
          <View>
            {userInfo?.id === ld.userId ? (
              <View style={{ flexDirection: 'row' }}>
                <LinearText text={ld.name} styles={styles.name}></LinearText>
              </View>
            ) : (
              <Text numberOfLines={1} ellipsizeMode="tail" style={{ ...styles.name, width: 230 }}>
                {ld.name}
              </Text>
            )}
          </View>
          <View style={styles.tagList}>
            {tags.map(tag => {
              return <Tag key={tag.id} {...tag} textMaxWidth={windowWidth / 6}></Tag>
            })}
          </View>
        </View>
      </View>
      {ld.description && (
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.message}>
            {ld.description}
          </Text>
        </View>
      )}
      <Dialog.Component
        style={{ paddingHorizontal: 16 }}
        onPressClose={() => setReport(false)}
        showConfirmButton={false}
        onPressOverlay={() => setReport(false)}
        visible={report}
      >
        <View style={styles.dialog}>
          <Text style={styles.title}>Select a reason and hide robot</Text>
          <Row justify="space-between">
            {['Dislike', 'Sick Content', 'Offensive', 'Other reasons'].map(i => {
              return (
                <Col key={i} span={12}>
                  <Button
                    size="m"
                    textColor={'black'}
                    style={{ margin: 8, backgroundColor: '#fff', borderColor: 'black', borderWidth: 1 }}
                    onPress={() => {
                      addBanned({ botId: ld.id })
                        .then(() => {
                          loadData()
                          CallBackManagerSingle().execute('botList')
                        })
                        .finally(() => {
                          setReport(false)
                        })
                    }}
                  >
                    {i}
                  </Button>
                </Col>
              )
            })}
          </Row>

          {/* <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button onPress={() => setReport(false)}>Offensive</Button>
            <Button onPress={() => setReport(false)}>Other reasons</Button>
          </View> */}
        </View>
      </Dialog.Component>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
    height: '100%',
    padding: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 18,
    marginRight: 16,
  },
  tagList: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  listItem: {
    padding: 12,
    gap: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F6F6F6',
  },
  listItemTop: {
    // flexDirection: 'row',
    alignItems: 'flex-start',
    flexShrink: 0,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 30,
    color: '#1F1F1F',
  },
  message: {
    // marginTop: 5,
    fontSize: 14,
    color: '#0A0A0AA3',
  },
  dialog: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  buttonGroup: {},
})

export default memo(UgcBotCard)
