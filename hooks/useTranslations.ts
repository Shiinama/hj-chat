import get from "lodash/get";

import translationsConfig from "../constants/Translations";
export const useTranslations = (spaceName: string[] | string) => {
  const spaceData = get(translationsConfig, spaceName);
  const t = (key: string[] | string) => {
    return get(spaceData, key) || key;
  };
  return t;
};
