import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
export default StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    marginHorizontal: 2,
    borderRadius: 16,
  },

  itemWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  msgBox: {
    flexShrink: 1,
    flexGrow: 1,
    paddingHorizontal: 10,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  you: {
    flexDirection: 'row',
  },
  me: {
    flexDirection: 'row-reverse',
  },
  contentBox: {
    marginLeft: 8,
    marginRight: 8,
    width: 263,
  },
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    marginHorizontal: 4,
    height: 28,
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,

    backgroundColor: Colors.mainWhite,
  },
  active: {
    backgroundColor: '#7A2EF6',
    color: Colors.mainWhite,
  },
  content: {
    padding: 12,
    width: '100%',
    borderTopWidth: 1,
    fontSize: 14,

    borderColor: '#E2E8F0',
    overflow: 'hidden',
    // borderBottomWidth: 1,
  },
  textContent: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  buttonGroup: {
    borderColor: '#E2E8F0',
    borderTopWidth: 1,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  chatWrap: {},
  youContent: {
    borderRadius: 6,
    backgroundColor: Colors.mainGrey,
  },
  meContent: {
    borderRadius: 6,
    backgroundColor: '#F1EAFE',
  },
  placeholder: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: '#f5f5f5',
    display: 'flex',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  input: {
    height: 30,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  sendBtn: {
    width: 60,
    height: 30,
    backgroundColor: '#9F9F5F',
  },
  picture: {
    borderRadius: 5,
    marginHorizontal: 8,
  },
  checkbox: {
    marginTop: 4,
    marginLeft: 11,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 999,
  },
  loadingBox: {
    height: 42,
    backgroundColor: Colors.mainGrey,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  loadingIcon: {
    marginLeft: 8,
  },
})
