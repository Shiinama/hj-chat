import systemConfig from "../../constants/System";
export const genAvatarUrl = (avatar: string) => {
  return avatar?.startsWith("avatar/")
    ? `${systemConfig?.avatarImgHost}${avatar}`
    : avatar;
};
