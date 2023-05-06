import { useRef, useState } from 'react'
import { Text, View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'

import Carousel from 'react-native-snap-carousel' // Version can be specified in package.json
import PassCardItem from '../../components/pass-card'
import { Button } from '@ui-kitten/components'

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const DATA = [
  {
    title: 'Lv.1',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Any registered user',
      },
      {
        subTitle: 'Level benefits:',
        subText: 'Restores 30 energy daily',
      },
    ],
  },
  {
    title: 'Lv.2',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Invite three valid users, or register yourself as an invited user',
      },
      {
        subTitle: 'Level benefits:',
        subText: 'Recharge 60 units of electricity daily',
      },
    ],
  },
  {
    title: 'Lv.3',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Invite ten active users',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: [
          'Daily recovery of 100 energy',
          'You can create a private robot ',
          'Pay 100U to publish it publicly',
        ],
      },
    ],
  },
  {
    title: 'Lv.4',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Payment of 50U',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: [
          'Daily recharge of 200 units of electricity',
          'You can create a private robot ',
          'Knowledge base integration (one update opportunity per day)',
          'More benefits are being planned...',
        ],
      },
    ],
  },
  {
    title: 'Lv.5',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Payment of 100U',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: ['Daily recovery of 300 electricity', 'More benefits are being planned...'],
      },
    ],
  },
]
const DATA1 = [
  {
    title: 'Lv.3',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Buy Genesis NFT',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: [
          'Recover 200 electricity per day',
          'Can create a private robot',
          'Free public release',
          'Priority review at high speed',
        ],
      },
    ],
  },
  {
    title: 'Lv.4',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Payment of 50U',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: [
          'Daily recharge of 300 power.',
          'Access to knowledge base (one update opportunity per day).',
          'More privileges are being planned…',
          '(Adding an additional private robot.)',
        ],
      },
    ],
  },
  {
    title: 'Lv.5',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Payment of 100U',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: [
          'Daily recharge of 600 units of electricity',
          'Personalized TTS',
          'More benefits are under development...',
          '(Draw a Genesis passcard)',
          '(Add an extra public robot)',
        ],
      },
    ],
  },
  {
    title: 'Lv.4',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Payment of 50U',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: [
          'Daily recharge of 200 units of electricity',
          'You can create a private robot ',
          'Knowledge base integration (one update opportunity per day)',
          'More benefits are being planned...',
        ],
      },
    ],
  },
  {
    title: 'Lv.5',
    subView: [
      {
        subTitle: 'Achievement conditions:',
        subText: 'Payment of 100U',
      },
      {
        subTitle: 'Level benefits:',
        subTextArray: ['Daily recovery of 300 electricity', 'More benefits are being planned...'],
      },
    ],
  },
]

export default function Passcard() {
  const carouselRef = useRef(null)
  const [tab, setTab] = useState(1)
  const astyles = {}
  const _renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <PassCardItem {...item}></PassCardItem>
    </View>
  )
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: tab == 1 ? '#7A2EF6' : '#f6f6f6',
            alignItems: 'center',
            justifyContent: 'center',
            width: 166,
            height: 40,
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
            width: 166,
            height: 40,
            borderRadius: 4,
          }}
          onPress={() => setTab(2)}
        >
          <Text style={{ color: tab == 2 ? 'white' : 'black' }}>Genesis</Text>
        </TouchableOpacity>
      </View>
      {tab === 1 ? (
        <Carousel
          data={DATA}
          loop={true}
          contentContainerCustomStyle={{ alignItems: 'flex-start' }}
          renderItem={_renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          containerCustomStyle={styles.carouselContainer}
          inactiveSlideShift={0}
        />
      ) : (
        <Carousel
          data={DATA1}
          loop={true}
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
    height: 600,
    boderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
})
