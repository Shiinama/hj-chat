import translationsConfig from '../constants/Translations'
import get from 'lodash/get'
export const useTranslations = (spaceName: string[] | string) => {
  const spaceData = get(translationsConfig, spaceName)
  const t = (key: string[] | string) => {
    return get(spaceData, key) || key
  }
  return t
}
