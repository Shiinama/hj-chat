import { MessageDto } from "components/chat/type";

import { BotInfo } from "../types/BotTypes";
import request from "../utils/request";
import { getBotListLocal, setBotListLocal } from "./botChatListCache";

export const botList = (flash?: boolean) => {
  return new Promise(async (resolve, reject) => {
    const localBotList = getBotListLocal();
    if (!localBotList || flash) {
      request<BotInfo[]>({
        url: "/bot/list",
        method: "get",
      })
        .then((res) => {
          resolve(res);
          setBotListLocal(res);
        })
        .catch((e) => {
          // 请求失败使用缓存的列表
          if (localBotList) {
            resolve(localBotList);
          } else {
            reject(e);
          }
        });
    } else if (localBotList) {
      resolve(localBotList);
    }
  });
};
export const chatHistory = (params: {
  botUid: string;
  offset?: number;
  limit?: number;
  afterId?: number;
  beforeId?: number;
}) => {
  return request<{ data: Array<MessageDto> }>({
    url: `/chat/chatHistory`,
    query: params,
    method: "get",
  });
};
export const profile = () => {
  return request({
    url: `/user/profile`,
    method: "get",
  });
};
export const getUserEnergyInfo = () => {
  return request<{ dailyEnergy: number; energy: number }>({
    url: `/user/getUserEnergyInfo`,
    method: "get",
  });
};
export const setBotPinnedStatus = (data) => {
  return request({
    url: `/bot/setBotPinnedStatus`,
    method: "post",
    data,
  });
};
export const removeBotFromChatList = (data) => {
  return request({
    url: `/bot/removeBotFromChatList`,
    method: "post",
    data,
  });
};
export const resetHistory = (data) => {
  return request({
    url: `/chat/resetHistory`,
    method: "post",
    data,
  });
};

export const createSharedConversation = (messageUidList) => {
  return request({
    url: `/chat/createSharedConversation`,
    method: "post",
    data: { messageUidList },
  });
};
