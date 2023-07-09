import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  main: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: 144,
    left: 55,
    right: 55,
  },
  name: {
    fontSize: 24,
    color: "#0026AB",
    fontWeight: "bold",
    marginTop: 20,
  },
  detail: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#5163A4",
  },
  bottom: {
    position: "absolute",
    bottom: 58,
    left: 30,
    right: 30,
  },
  emailButton: {
    height: 48,
    backgroundColor: "#3E5CFA",
  },
  emailText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
  },
  emailDetail: {
    marginTop: 10,
    textAlign: "center",
    color: "#6D7175",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  service: {
    marginTop: 10,
    textAlign: "center",
    color: "#3E5CFA",
  },
  lineBackground: {
    backgroundColor: "#E4E9F0",
    height: 1,
  },
  lineLeft: {
    backgroundColor: "#ffffff",
    width: 50,
    marginTop: -8,
    marginHorizontal: 135,
  },
  orText: {
    color: "#6D7175",
    fontSize: 12,
    textAlign: "center",
  },
  googleAndFacebook: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  google: {
    width: 44,
    height: 44,
  },
  facebook: {
    width: 44,
    height: 44,
  },
});

export { styles };
