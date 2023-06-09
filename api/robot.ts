import { BotInfo, UGCBotInfo } from "../types/BotTypes";
import request from "../utils/request";

/**
 * 工坊列表
 */
export const getUgcBotList = (params) => {
  return request<UGCBotInfo[]>({
    url: `/bot/getUgcBotList`,
    method: "get",
    params,
  });
};

/**
 * 工坊列表
 */
export const queryCanCreateUgcBot = (params) => {
  return request({
    url: `/bot/canCreateUgcBot`,
    method: "get",
    params,
  });
};

/**
 * 工坊详情
 */
export const getUgcBotDetail = (params) => {
  return request<UGCBotInfo>({
    url: `/bot/getUgcBotDetail`,
    method: "get",
    params,
  });
};

export const postAddBotToChatList = (data) => {
  return request<BotInfo>({
    url: `/bot/addBotToChatList`,
    method: "post",
    data,
  });
};

export const postPublishBot = (data) => {
  return request({
    url: `/bot/publishBot`,
    method: "post",
    data,
  });
};
export const setBotPrivate = (data) => {
  return request({
    url: `/bot/setBotPrivate`,
    method: "post",
    data,
  });
};

export const addBanned = (data) => {
  return request({
    url: `/bot/banned`,
    method: "post",
    data,
  });
};
