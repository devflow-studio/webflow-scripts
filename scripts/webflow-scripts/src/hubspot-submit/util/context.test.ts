import { getHubspotContext } from './context'

jest.mock('./cookies', () => ({
  getHubspotCookie: jest.fn(() => '1234'),
}))

jest.mock('../stores/ClientIpStore', () => ({
  ClientIpStore: {
    getIp: jest.fn(() => '127.0.0.1'),
  },
}))

describe('Context Util', () => {
  describe('func getHubspotContext', () => {
    it('returns the correct context', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://example.com',
        },
      })

      Object.defineProperty(document, 'title', {
        value: 'Example',
      })

      const context = getHubspotContext()
      expect(context).toEqual({
        pageUri: 'https://example.com',
        pageName: 'Example',
        hutk: '1234',
        ipAddress: '127.0.0.1',
      })
    })
  })
})
