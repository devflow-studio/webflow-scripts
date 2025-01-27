import { getHubspotCookie } from './cookies'

const deleteAllCookies = () => {
  document.cookie.split(';').forEach(cookie => {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim()
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  })
}

describe('Cookies', () => {
  describe('func getHubspotCookie', () => {
    beforeEach(() => {
      deleteAllCookies()
    })

    it('returns the value of the cookie', () => {
      const cookieName = 'hubspotutk'
      const cookieValue = '1234'
      document.cookie = `${cookieName}=${cookieValue};`

      const result = getHubspotCookie()
      expect(result).toBe(cookieValue)
    })

    it('returns undefined if the cookie is not found', () => {
      const result = getHubspotCookie()
      expect(result).toBeUndefined()
    })
  })
})
