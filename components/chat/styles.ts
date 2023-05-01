import { StyleSheet } from 'react-native'
export default StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    // borderRadius: 5,
  },
  msgBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: 12,
    position: 'relative',
  },
  you: {
    flexDirection: 'row',
  },
  me: {
    flexDirection: 'row-reverse',
  },
  contentBox: {
    borderRadius: 5,
    padding: 8,
    marginLeft: 8,
    marginRight: 8,
  },
  content: {
    lineHeight: 22,
    maxWidth: 265,
  },
  youContent: {
    backgroundColor: '#FFF8DC',
  },
  meContent: {
    backgroundColor: '#95ec69',
  },
  triangleLeft: {
    position: 'absolute',
    left: -5,
    top: 14,
    zIndex: 666,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 6,
    borderColor: '#FFF8DC',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  triangleRight: {
    position: 'absolute',
    right: -5,
    top: 14,
    zIndex: 666,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 6,
    borderColor: '#9F9F5F',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  time: {
    textAlign: 'center',
    color: 'rgba(0,0,0,.5)',
    fontSize: 12,
    margin: 10,
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
})
