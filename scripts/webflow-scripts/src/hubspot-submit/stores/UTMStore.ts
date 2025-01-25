import { getUtmParameters, UtmParameters } from '../features/utm'

export const UTMStore = (() => {
  let utmParameters: UtmParameters | null = null

  return {
    getUtmParameters: (): UtmParameters | null => {
      return utmParameters
    },
    memorizeUtmParameters: (): void => {
      utmParameters = getUtmParameters()
    },
  }
})()
