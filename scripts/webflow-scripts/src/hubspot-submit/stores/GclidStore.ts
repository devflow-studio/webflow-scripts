import { getGclid } from '../util/gclid'

export const GclidStore = (() => {
  let gclid: string | null = null

  return {
    getGclid: (): string | null => {
      return gclid
    },
    memorizeGclid: (): void => {
      gclid = getGclid()
    },
  }
})()
