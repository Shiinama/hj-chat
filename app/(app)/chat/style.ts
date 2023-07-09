import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
  },
  bodyInner: {
    // flex: 1,
    paddingTop: 12,
    paddingHorizontal: 12,
    // backgroundColor: 'white',
  },
  bottomBar: {
    marginTop: 12,
  },
  footer: {
    backgroundColor: "#f5f5f5",
    display: "flex",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
});

export { styles };
