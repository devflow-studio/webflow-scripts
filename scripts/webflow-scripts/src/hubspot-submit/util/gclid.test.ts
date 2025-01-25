import { getGclid } from './gclid'

describe('gclid Util', () => {
  describe('func getGclid', () => {
    it('returns null if gclid parameter is not present in the URL', () => {
      const searchParams = new URLSearchParams('')
      jest
        .spyOn(window, 'location', 'get')
        .mockReturnValue({ search: searchParams.toString() } as Location)
      expect(getGclid()).toBeNull()
    })

    it('returns gclid parameter if it is present in the URL', () => {
      const searchParams = new URLSearchParams('?gclid=123')
      jest
        .spyOn(window, 'location', 'get')
        .mockReturnValue({ search: searchParams.toString() } as Location)
      expect(getGclid()).toBe('123')
    })
  })
})
