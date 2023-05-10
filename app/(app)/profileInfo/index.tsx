import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useNavigation } from "expo-router";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { Image } from "expo-image";
import { styles } from "./style";
import Camera from "../../../assets/images/profile/camera.svg";
import ActiveIcon from "../../../assets/images/profile/activeIcon.svg";
import Discord from "../../../assets/images/profile/discord.svg";
import Telegram from "../../../assets/images/profile/telegram.svg";
import Twitter from "../../../assets/images/profile/twitter.svg";
import ImgPlaceholder from "../../../assets/images/img_placeholder.png";
import useUserStore, { getProfile } from "../../../store/userStore";
import { Button, Toast } from "@fruits-chain/react-native-xiaoshu";
import { useBoolean, useDeepCompareEffect } from "ahooks";
import {
  getIsUserNameAvailable,
  getUserConnectedAccounts,
  postUpdateUserName,
  UserConnectedAccounts,
} from "../../../api/proofile";
import EditAvatarModal from "../../../components/profileInfo/EditAvatarModal";
import { genAvatarUrl } from "../../../components/profileInfo/helper";

export default function Profile() {
  const navigation = useNavigation();
  const { profile } = useUserStore();
  const [name, setName] = useState(profile?.name);
  const [visible, { set: setVisible }] = useBoolean(false);
  const [saveLoading, { set: setSaveLoading }] = useBoolean(false);
  const [userConnected, setUserConnected] =
    useState<UserConnectedAccounts>(null);
  const btnDisabled = name === profile?.name;
  useDeepCompareEffect(() => {
    setName(profile?.name);
  }, [profile?.name]);

  const getConnections = () => {
    getUserConnectedAccounts().then((res) => setUserConnected(res));
  };
  useFocusEffect(
    useCallback(() => {
      getProfile();
      getConnections();
    }, [])
  );
  useEffect(() => {
    navigation.setOptions({
      title: "Edit Profile",
    });
  }, [navigation]);
  const connectionsList = useMemo(() => {
    return [
      // { name: "Twitter", icon: <Twitter />, isAcitve: false },
      // { name: "Discord", icon: <Discord />, isAcitve: false },
      {
        name: "Telegram",
        icon: <Telegram />,
        isAcitve: userConnected?.telegram?.id,
        userName: userConnected?.telegram?.firstName,
      },
    ];
  }, [userConnected]);
  const saveAction = () => {
    setSaveLoading(true);
    getIsUserNameAvailable({ name }).then((res) => {
      if (res) {
        postUpdateUserName({ name }).then((res) => {
          Toast("Update successfully!");
          setSaveLoading(false);
          getProfile();
        });
      }
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.main}>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => {
              setVisible(true);
            }}
          >
            <Image
              cachePolicy="disk"
              placeholderContentFit="cover"
              placeholder={ImgPlaceholder}
              source={{ uri: genAvatarUrl(profile?.avatar) }}
              style={styles.avatarImg}
            />
            <View style={styles.mask}>
              <Camera />
            </View>
          </TouchableOpacity>
          {/* 编辑头像modal */}
          <EditAvatarModal
            visible={visible}
            setVisible={setVisible}
            profile={profile}
          />
          <View style={styles.contentWrap}>
            <View>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(nextValue) => setName(nextValue)}
              />
            </View>
            <View style={styles.br} />
            <View>
              <Text style={styles.label}>Connections</Text>
              <Text style={styles.tips}>
                Add accounts to your profile to make more friends
              </Text>
              {connectionsList?.map((v, i) => {
                return (
                  <View
                    style={{
                      ...styles.connectionsItem,
                      ...(v?.isAcitve ? styles.connectionsActiveItem : {}),
                    }}
                    key={i}
                  >
                    <View style={styles.itemBody}>
                      {v?.isAcitve ? (
                        <ActiveIcon style={styles.activeIcon} />
                      ) : null}
                      <Text style={styles.connectionsItemText}>
                        {v?.isAcitve ? v?.name : `Connect with ${v?.name}`}
                      </Text>
                    </View>
                    {v?.icon}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.action}>
        <Button
          style={styles.actionMain}
          disabled={btnDisabled}
          loading={saveLoading}
          onPress={saveAction}
        >
          Save Changes
        </Button>
      </View>
    </View>
  );
}