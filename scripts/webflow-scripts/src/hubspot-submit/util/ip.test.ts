import { getClientIp } from './ip'

describe('IP', () => {
  describe('func getClientIp', () => {
    beforeEach(() => {
      global.fetch = jest.fn()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('makes a fetch to ipify API', async () => {
      // mock fetch
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ip: '127.0.0.1' }),
      } as Response)

      const response = await getClientIp()

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.ipify.org?format=json',
      )

      expect(response).toBe('127.0.0.1')
    })
  })
})
