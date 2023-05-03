import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingBottom: 72,
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    position: 'relative',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 34
  },
  userName: {
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '700',
    background: 'linear-gradient(133.04deg, #7A2EF6 11.45%, #F62EE2 146.07%)',
    backgroundClip: 'text',
  },
  userTag: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 8,
    border: '1px solid #EDEDED',
    boxSizing: 'border-box'
  },
  userTagText: {
    marginLeft: 2
  },
  tagList: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6
  },
  tagListItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 6,
    flexShrink: 1
  },
  tagListItemTip: {
    width: 10,
    height: 10,
    borderRadius: 100,
    marginRight: 6
  },
  tagListItemText: {
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 14,
    color: '#3A0D84'
  },
  actions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32
  },
  actionsItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 161.5,
    height: 88,
    backgroundColor: '#F6F6F6',
    borderRadius: 12
  },
  actionsItemText: {
    marginTop: 6,
    lineHeight: 22,
    color: '#7A2EF6',
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  description: {
    marginTop: 20,
    padding: 12,
    boxSizing: 'border-box',
    backgroundColor: '#F6F6F6',
    borderRadius: 12
  },
  descriptionTitle: {
    lineHeight: 22,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 5,
    color: '#1F1F1F'
  },
  descriptionValue: {
    lineHeight: 22,
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'normal',
    color: '#1F1F1F'
  },
  action: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 72,
    width: 375,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionMain: {
    width: 343,
    marginLeft: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#7A2EF6',
    height: 48,
  },
  actionChat: {
    color: '#FFFFFF',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700'
  }
})

export { styles }
