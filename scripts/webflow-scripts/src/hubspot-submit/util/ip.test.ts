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

    it('returns undefined if fetch fails & logs to console', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('test error'),
      )

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

      const response = await getClientIp()

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.ipify.org?format=json',
      )

      expect(consoleSpy).toHaveBeenCalledWith('unable to get client ip')
      expect(response).toBeUndefined()
    })
  })
})
