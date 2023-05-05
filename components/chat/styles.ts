import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
export default StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  itemWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  msgBox: {
    flexShrink: 1,
    flexGrow: 1,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  you: {
    flexDirection: "row",
  },
  me: {
    flexDirection: "row-reverse",
  },
  contentBox: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginRight: 8,
    maxWidth: 263,
  },
  button: {
    borderRadius: 12,
    flexDirection: "row",
    margin: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: Colors.mainWhite,
  },
  active: {
    backgroundColor: "#7A2EF6",
    color: Colors.mainWhite,
  },
  content: {
    padding: 12,
    borderTopWidth: 1,
    fontSize: 14,
    borderColor: "#E2E8F0",
    borderBottomWidth: 1,
  },
  buttonGroup: {
    flexDirection: "row",
  },
  youContent: {
    backgroundColor: Colors.mainGrey,
  },
  meContent: {
    backgroundColor: "#F1EAFE",
  },
  triangleLeft: {
    position: "absolute",
    left: -5,
    top: 14,
    zIndex: 666,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 6,
    borderColor: "#FFF8DC",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  triangleRight: {
    position: "absolute",
    right: -5,
    top: 14,
    zIndex: 666,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 6,
    borderColor: "#9F9F5F",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  time: {
    textAlign: "center",
    color: "rgba(0,0,0,.5)",
    fontSize: 12,
    margin: 10,
  },
  footer: {
    backgroundColor: "#f5f5f5",
    display: "flex",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  input: {
    height: 30,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  sendBtn: {
    width: 60,
    height: 30,
    backgroundColor: "#9F9F5F",
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
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 999,
  },
});
