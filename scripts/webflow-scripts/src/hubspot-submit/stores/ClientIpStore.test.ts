import { ClientIpStore } from './ClientIpStore'
import { getClientIp } from '../util/ip'

jest.mock('../util/ip', () => ({
  getClientIp: jest.fn(),
}))

describe('ClientIpStore', () => {
  it('returns undefined if no ip is set', () => {
    ;(getClientIp as jest.Mock).mockResolvedValue(undefined)
    expect(ClientIpStore.getIp()).toBeUndefined()
  })

  it('returns the ip if it is set', async () => {
    ;(getClientIp as jest.Mock).mockResolvedValue('127.0.0.1')
    await ClientIpStore.memorizeClientIp(true)
    const ip = ClientIpStore.getIp()
    expect(ip).toBeDefined()
    expect(ip).toBe('127.0.0.1')
  })

  it('returns undefined if useClientIp is false', async () => {
    const useClientIp = false
    ;(getClientIp as jest.Mock).mockResolvedValue('127.0.0.1')
    await ClientIpStore.memorizeClientIp(useClientIp)
    const ip = ClientIpStore.getIp()
    expect(ip).toBeUndefined()
  })
})
