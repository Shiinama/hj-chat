import { View, Text, StyleSheet } from 'react-native'
type Iprops = {
  title: number
  subView: {
    subTitle: string
    subText: string
  }[]
}
export default function PassCardItem({ title, subView }: Iprops) {
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
            <View style={{ height: 12, width: 4, marginRight: 6, backgroundColor: '#7A2EF6' }}></View>
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
                style={{ marginTop: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'grey' }}
              >
                <Text style={{ fontSize: 14, lineHeight: 24 }}>{i}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      {cardTitle()}
      {subView.map((i, index) => subViewRender(i, index))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  viewItem: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    marginBottom: 30,
    alignItems: 'center',
    width: 230,
  },
})
