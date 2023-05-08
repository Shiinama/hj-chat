import { UserProfile } from "@/../store/userStore";
import { Button, Overlay, Toast } from "@fruits-chain/react-native-xiaoshu";
import { FC, useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import ArrowLeft from "../../assets/images/profile/arrow-left.svg";
import request from "../../utils/request";
import CustomSlider from "./Slider";
import { genAvatarUrl } from "./helper";
import { getPageInfo } from "../../app/profileInfo";

const uploadFile = async (uri) => {
  const filePath = uri;
  const formData = new FormData();
  formData.append("file", {
    uri: filePath,
    type: "application/octet-stream",
    name: "file",
  });

  const boundary = "----WebKitFormBoundaryKuaSUT6xPZeD4B8b";
  return await request({
    url: "/user/uploadAvatar",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
  });
};

export interface EditAvatarModalProps {
  visible: boolean;
  setVisible: (val: boolean) => void;
  profile: UserProfile;
}
const EditAvatarModal: FC<EditAvatarModalProps> = ({
  visible,
  setVisible,
  profile,
}) => {
  const [imgSize, setImgSize] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [zoomSize, setZoomSize] = useState(0);
  useEffect(() => {
    setZoomSize(imgSize);
  }, [imgSize]);
  const [inputImage, setInputImage] =
    useState<ImagePicker.ImagePickerAsset>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setInputImage(result.assets[0]);
    }
  };

  const updateAvatar = async () => {
    try {
      if (inputImage?.fileSize > 1048576) {
        Toast("The image size cannot exceed 1M");
        return false;
      }
      const res = await uploadFile(inputImage?.uri);
      Toast("update successfully!");
      setVisible(false);
      getPageInfo();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Overlay
      visible={visible}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <View style={styles.cardWrap}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                }}
              >
                <ArrowLeft />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Update avatar</Text>
            </View>
            <Button
              color="#1F1F1F"
              size="s"
              style={{ borderRadius: 12, paddingHorizontal: 14 }}
              onPress={() => {
                updateAvatar();
              }}
            >
              Confirm
            </Button>
          </View>
          <View
            style={styles.content}
            onLayout={(e) => {
              // 需要减边框的8像素
              setImgSize(e?.nativeEvent?.layout?.width - 8);
            }}
          >
            <TouchableOpacity
              onPress={() => {
                pickImage();
              }}
            >
              <View
                style={{
                  width: imgSize,
                  height: imgSize,
                  borderWidth: 4,
                  borderColor: "#7A2EF6",
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{
                    uri: genAvatarUrl(
                      inputImage?.uri ? inputImage?.uri : profile?.avatar
                    ),
                  }}
                  style={{
                    width: zoomSize,
                    height: zoomSize,
                    transform: [{ scale: zoom }],
                  }}
                />
              </View>
            </TouchableOpacity>
            <CustomSlider
              value={zoom}
              onValueChange={setZoom}
              maximumValue={2}
              minimumValue={1}
            />
          </View>
        </View>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  cardWrap: {
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  card: {
    maxWidth: 480,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ededed",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 3,
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  content: {},
});
export default EditAvatarModal;
