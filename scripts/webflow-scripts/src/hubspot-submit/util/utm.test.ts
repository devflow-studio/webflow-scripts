import { getUtmParameters } from './utm'

describe('UTM Util', () => {
  describe('func getUtmParameters', () => {
    it('should return null if no UTM parameters are found', () => {
      const result = getUtmParameters()
      expect(result).toBeNull()
    })

    it('should return UTM parameters', () => {
      const search = '?utm_source=google&utm_medium=cpc&utm_campaign=summer'
      Object.defineProperty(window, 'location', {
        value: {
          search,
        },
      })

      const result = getUtmParameters()
      expect(result).toEqual({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'summer',
      })
    })
  })
})
