import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    // backgroundColor: "gray",
    width: "100%",
    height: "100%",
    position: "relative",
    paddingTop: 20,
  },
  main: {
    // display: "flex",
    // flexDirection: "column",
    // // justifyContent: 'center',
    alignItems: "center",
  },
  // 头像
  avatar: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    position: "relative",
    zIndex: 0,
  },
  mask: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  // 内容
  contentWrap: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 10,
    fontWeight: "700",
  },
  input: {
    height: 48,
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F1F1F",
  },
  br: {
    height: 1,
    backgroundColor: "#F6F6F6",
    width: "100%",
    marginVertical: 20,
  },
  tips: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#B9B9B9",
    marginBottom: 10,
  },
  // connections
  connectionsItem: {
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  connectionsActiveItem: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#7A2EF6",
  },
  activeIcon: {
    marginRight: 16,
    alignItems: "center",
  },
  itemBody: {
    height: "100%",
    alignItems: "center",
    flexGrow: 1,
    flexDirection: "row",
  },
  connectionsItemText: {
    color: "#1F1F1F",
    fontWeight: "500",
  },
  action: {
    // position: "absolute",
    // left: 0,
    // bottom: 32,
    marginBottom: 32,
    width: "100%",
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionMain: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#7A2EF6",
    height: 48,
  },
  actionChat: {
    color: "#FFFFFF",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
  },
});

export { styles };
