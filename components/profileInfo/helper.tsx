import { Image } from "expo-image";
import { View } from "react-native";

import systemConfig from "../../constants/System";

export const renderImage = (avatar: string, style?: any) => {
  if (!avatar)
    return <View style={{ ...style, backgroundColor: "#E2E8F0" }}></View>;
  if (
    avatar?.startsWith("bot-logo/") ||
    avatar?.startsWith("avatar/") ||
    avatar.startsWith("default_avatars/")
  ) {
    return (
      <Image
        style={style}
        source={{ uri: `${systemConfig?.avatarImgHost}${avatar}` }}
      ></Image>
    );
  }
  return <Image style={style} source={{ uri: `${avatar}` }}></Image>;
};
