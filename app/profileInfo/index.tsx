import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { useSearchParams, useNavigation } from "expo-router";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { styles } from "./style";
import BotCard from "../../components/botCard";
import { profile as getProfile } from "../../api/index";
import Camera from "../../assets/images/profile/camera.svg";
import ActiveIcon from "../../assets/images/profile/activeIcon.svg";
import Discord from "../../assets/images/profile/discord.svg";
import Telegram from "../../assets/images/profile/telegram.svg";
import Twitter from "../../assets/images/profile/twitter.svg";
import useUserStore, { UserEnergyInfo } from "../../store/userStore";
import { Button } from "@fruits-chain/react-native-xiaoshu";
import { useDeepCompareEffect } from "ahooks";

type ListDataItem = {
  id: number;
  uid: string;
  name: string;
  description: string;
  userId: number;
  logo: string;
  language: string;
  pinned: boolean;
  lastInteractionDate: string;
};

export default function Profile() {
  const navigation = useNavigation();
  const { profile } = useUserStore();
  const [name, setName] = useState(profile?.name);
  const btnDisabled = name === profile?.name;
  useDeepCompareEffect(() => {
    setName(profile?.name);
  }, [profile?.name]);
  useFocusEffect(
    useCallback(() => {
      getProfile().then((res: any) => {
        useUserStore.setState({ profile: res });
      });
    }, [])
  );
  useEffect(() => {
    navigation.setOptions({
      title: "Edit Profile",
    });
  }, [navigation]);
  const connectionsList = [
    { name: "Twitter", icon: <Twitter />, isAcitve: true },
    { name: "Discord", icon: <Discord />, isAcitve: false },
    { name: "Telegram", icon: <Telegram />, isAcitve: false },
  ];
  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.main}>
          <TouchableOpacity style={styles.avatar}>
            <Image source={{ uri: profile?.avatar }} style={styles.avatarImg} />
            <View style={styles.mask}>
              <Camera />
            </View>
          </TouchableOpacity>
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
        <Button style={styles.actionMain} disabled={btnDisabled}>
          Save Changes
        </Button>
      </View>
    </View>
  );
}
