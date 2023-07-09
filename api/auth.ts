import request from "../utils/request";
type UserStore = {
  token: string;
  expiration: number;
  userId: number;
  userUid: string;
};
export const particleLogin = (data) => {
  return request<UserStore>({
    url: `/auth/particleLogin`,
    method: "post",
    data,
  });
};

type generateNonceModel = {
  nonce: string;
};
export const generateNonce = (data) => {
  return request<generateNonceModel>({
    url: `/auth/generateNonce`,
    method: "post",
    data,
  });
};

export const verifySignature = (data) => {
  return request<UserStore>({
    url: `/auth/verifySignature`,
    method: "post",
    data,
  });
};
