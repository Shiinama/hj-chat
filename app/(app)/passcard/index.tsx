import { useEffect, useState } from 'react'
import { Text, View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import useUserStore from '../../../store/userStore'
import Carousel from 'react-native-snap-carousel' // Version can be specified in package.json
import PassCardItem from '../../../components/pass-card'
import { useNavigation } from 'expo-router'

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_HEIGHT = Dimensions.get('window').height
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const DATA = [
  {
    id: 1,
    title: 'Lv.1',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Any registered user',
      },
      {
        subTitle: 'Level benefits:',
        subText: '40 ⚡️ Per Day.',
      },
    ],
    buttonText: 'Basic',
  },
  {
    id: 2,
    title: 'Lv.2',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Invite three valid users or signup with invitation link.',
      },
      {
        subTitle: 'Level benefits:',
        subText: '60 ⚡️ Per Day',
      },
    ],
    buttonText: 'Invite',
  },
  {
    id: 3,
    title: 'Lv.3',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Purchase MyShell Pass',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: ['120 ⚡️ Per Day', 'One Private Bot'],
      },
    ],
    buttonText: 'Coming Soon',
  },
  {
    id: 4,
    title: 'Lv.4',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'TBD',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: ['200 ⚡️ Per Day', 'One Public Bot'],
      },
    ],
    buttonText: 'Coming Soon',
  },
  {
    id: 5,
    title: 'Lv.5',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'TBD',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: ['300 ⚡️ Per Day', 'Bots with External Knowledge and Docs', 'More Benefits Coming…'],
      },
    ],
    buttonText: 'Coming Soon',
  },
]
const DATA1 = [
  {
    title: 'Lv.3',
    Sea: true,
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Holder of MyShell Genesis Pass',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: ['200 ⚡️ Per Day', 'One Public Bot'],
      },
    ],
    buttonText: 'Find more on DC',
  },
  {
    title: 'Lv.4',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'TBD',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: ['300 ⚡️ Per Day', 'Bots with External Knowledge and Docs', 'One More Pubic Bot'],
      },
    ],
    buttonText: 'Coming Soon',
  },
  {
    title: 'Lv.5',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'TBD',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: [
          '600 ⚡️ Per Day',
          'Bots with External Knowledge and Docs',
          'One More Pubic Bot',
          'Bots with Personalized Voice and Coming Advanced Feature',
        ],
      },
    ],
    buttonText: 'Coming Soon',
  },
]

export default function Passcard() {
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      title: 'Passcard',
      headerTitleAlign: 'center',
    })
  }, [])
  const [tab, setTab] = useState(1)
  const userInfo = useUserStore().profile
  const _renderItem = ({ item }) => (
    <View
      style={[
        styles.itemContainer,
        { borderColor: userInfo.level === item.id ? '#7A2EF6' : '#F6F6F6', borderWidth: 1 },
      ]}
    >
      <PassCardItem {...item} level={userInfo.level}></PassCardItem>
    </View>
  )
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 20,
          borderRadius: 8,
          marginHorizontal: 20,
          backgroundColor: '#f6f6f6',
          padding: 5,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: tab == 1 ? '#7A2EF6' : '#f6f6f6',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            height: 30,
            borderRadius: 8,
          }}
          onPress={() => setTab(1)}
        >
          <Text style={{ color: tab == 1 ? 'white' : 'black' }}>Basic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: tab == 2 ? '#7A2EF6' : '#f6f6f6',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            height: 30,
            borderRadius: 4,
          }}
          onPress={() => {
            setTab(2)
          }}
        >
          <Text style={{ color: tab == 2 ? 'white' : 'black' }}>Genesis</Text>
        </TouchableOpacity>
      </View>
      {tab === 1 ? (
        <Carousel
          key={'1'}
          data={DATA}
          contentContainerCustomStyle={{ alignItems: 'flex-start' }}
          renderItem={_renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          containerCustomStyle={styles.carouselContainer}
          inactiveSlideShift={0}
        />
      ) : (
        <Carousel
          key={'2'}
          data={DATA1}
          contentContainerCustomStyle={{ alignItems: 'flex-start' }}
          renderItem={_renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          containerCustomStyle={styles.carouselContainer}
          inactiveSlideShift={0}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 30,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT - 200,
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
})
