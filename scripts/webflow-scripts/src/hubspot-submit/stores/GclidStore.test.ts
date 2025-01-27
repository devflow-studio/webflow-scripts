import { GclidStore } from './GclidStore'
import { getGclid } from '../util/gclid'

jest.mock('../util/gclid', () => ({
  getGclid: jest.fn(),
}))

describe('GclidStore', () => {
  it('returns null when gclid is not present', () => {
    ;(getGclid as jest.Mock).mockReturnValue(null)
    expect(GclidStore.getGclid()).toBeNull()
  })

  it('returns "test-gclid" when gclid is present', () => {
    ;(getGclid as jest.Mock).mockReturnValue('test-gclid')
    GclidStore.memorizeGclid()
    expect(GclidStore.getGclid()).toBe('test-gclid')
  })
})
