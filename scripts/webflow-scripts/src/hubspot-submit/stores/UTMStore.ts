import { getUtmParameters, UtmParameters } from '../util/utm'

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
