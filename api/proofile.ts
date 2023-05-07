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
 * 修改用户名
 */
export const postUpdateUserName = (data) => {
  return request({
    url: `/user/updateUserName`,
    method: "post",
    data: data,
  });
};

/**
 * 工坊详情
 */
export const getUserConnectedAccounts = (params) => {
  return request({
    url: `/user/getUserConnectedAccounts`,
    method: "get",
    params,
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
