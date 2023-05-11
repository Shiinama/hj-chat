import { Button } from "@ui-kitten/components";
import { View, Text, StyleSheet } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { getInvitation } from "../../api/proofile";
import * as WebBrowser from "expo-web-browser";
import { Toast } from "@fruits-chain/react-native-xiaoshu";

type Iprops = {
  title: number;
  level: number;
  id: number;
  Sea?: boolean;
  subView: {
    subTitle: string;
    subText: string;
  }[];
};
export default function PassCardItem({
  title,
  subView,
  level,
  id,
  Sea,
}: Iprops) {
  const cardTitle = () => {
    return (
      <View style={styles.viewItem}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>{title}</Text>
      </View>
    );
  };
  const subViewRender = (i, index) => {
    return (
      <View key={index} style={styles.viewItem}>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 12,
                width: 4,
                marginRight: 6,
                backgroundColor: "#7A2EF6",
              }}
            ></View>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              {i.subTitle}
            </Text>
          </View>
          {i.subText ? (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 14 }}>{i.subText}</Text>
            </View>
          ) : (
            i.subTextArray.map((i) => (
              <View
                key={i}
                style={{
                  marginTop: 12,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: "#EDEDED",
                }}
              >
                <Text style={{ fontSize: 14, lineHeight: 24 }}>{i}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    );
  };

  const buttonGroupRender = () => {
    if (Sea) {
      return (
        <Button
          onPress={(e) => {
            e.preventDefault();
            WebBrowser.openBrowserAsync(
              "https://opensea.io/collection/myshellgenesispass"
            );
          }}
          style={styles.bottomButton}
        >
          OpenSea
        </Button>
      );
    }

    if (id === level) {
      return (
        <Button disabled={true} style={[styles.bottomButton, styles.greyColor]}>
          Current Level
        </Button>
      );
    }
    if (id === level + 1) {
      return (
        <Button
          onPress={() => {
            getInvitation({}).then(({ code }: any) => {
              Clipboard.setString(code);
              Toast("Copied!");
            });
          }}
          style={styles.bottomButton}
        >
          Invite
        </Button>
      );
    }

    return (
      <Button disabled={true} style={[styles.bottomButton, styles.greyColor]}>
        Coming Soon
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      {cardTitle()}
      {subView.map((i, index) => subViewRender(i, index))}
      {buttonGroupRender()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: "relative",
  },
  bottomButton: {
    width: "100%",
    position: "absolute",
    left: "4%",
    bottom: 30,
    backgroundColor: "#7A2EF6",
    borderColor: "#7A2EF6",
  },
  greyColor: {
    backgroundColor: "#E0E0E0",
    borderColor: "#E0E0E0",
  },
  viewItem: {
    flexDirection: "row",
    // justifyContent: 'flex-start',
    marginBottom: 30,
    alignItems: "center",
    width: 230,
  },
});
