import { SeasonInfo, Task } from "../types/task";
import request from "../utils/request";

export const getTaskList = () => {
  return request<Task[]>({
    url: `/userTask/getTaskList`,
    method: "get",
  });
};

export const completeTask = (data) => {
  return request({
    url: `/userTask/completeTask`,
    method: "post",
    data,
  });
};

export const claimAll = () => {
  return request({
    url: `/userTask/completeAll`,
    method: "get",
  });
};
export const getActiveSeason = () => {
  return request<SeasonInfo>({
    url: `/userTask/getActiveSeason`,
    method: "get",
  });
};
export const getPoints = () => {
  return request<number>({
    url: `/userTask/getPoints`,
    method: "get",
  });
};
export const getRanking = () => {
  return request<number>({
    url: `/userTask/getRanking`,
    method: "get",
  });
};
