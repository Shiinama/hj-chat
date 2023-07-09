import request from "../utils/request";

/**
 * 工坊列表
 */
export const queryUserProfile = (params) => {
  return request({
    url: `/user/profile`,
    method: "get",
    params,
  });
};

/**
 * 工坊详情
 */
export const getUserEnergyInfo = (params) => {
  return request({
    url: `/user/getUserEnergyInfo`,
    method: "get",
    params,
  });
};

/**
 * 用户名是否合法
 */
export const getIsUserNameAvailable = (params) => {
  return request({
    url: `/user/isUserNameAvailable`,
    method: "get",
    params,
  });
};

/**
 * 用户名是否合法
 */
export const getUserSettings = () => {
  return request<
    {
      name: string;
      value: string;
    }[]
  >({
    url: `/user/getUserSettings`,
    method: "get",
  });
};

/**
 * 修改用户名
 */
export const postUpdateUserName = (data) => {
  return request({
    url: `/user/updateUserName`,
    method: "post",
    data: data,
  });
};

export type UserConnectedAccounts = {
  telegram: {
    id: number;
    userId: number;
    tgId: number;
    firstName: string;
    lastName?: string;
    username?: string;
    photoUrl?: string;
    connectedUserId: number;
    currentBotId: number;
    createdDate: string;
  };
};
/**
 * 获取用户已连接的内容
 */
export const getUserConnectedAccounts = () => {
  return request<UserConnectedAccounts>({
    url: `/user/getUserConnectedAccounts`,
    method: "get",
  });
};

/**
 * 工坊详情
 */
export const postConnectToTelegram = (data) => {
  return request({
    url: `/user/connectToTelegram`,
    method: "post",
    data: data,
  });
};

/**
 * 工坊详情
 */
export const postUploadAvatar = (data) => {
  return request({
    url: `/user/uploadAvatar`,
    method: "post",
    data: data,
  });
};

/**
 * 工坊详情
 */
export const getInvitation = (params) => {
  return request({
    url: `/user/getInvitation`,
    method: "get",
    params,
  });
};
