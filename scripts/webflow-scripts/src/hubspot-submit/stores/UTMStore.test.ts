import { UTMStore } from './UTMStore'
import { getUtmParameters } from '../util/utm'

jest.mock('../util/utm', () => ({
  getUtmParameters: jest.fn(),
}))

describe('UTMStore', () => {
  it('returns null when no utm parameters are present in the url', () => {
    ;(getUtmParameters as jest.Mock).mockReturnValue(null)
    expect(UTMStore.getUtmParameters()).toBeNull()
  })

  it('returns utm parameters', () => {
    ;(getUtmParameters as jest.Mock).mockReturnValue({
      utm_source: 'source',
      utm_medium: 'medium',
      utm_campaign: 'campaign',
      utm_term: 'term',
      utm_content: 'content',
    })
    UTMStore.memorizeUtmParameters()
    const utmParameters = UTMStore.getUtmParameters()
    expect(utmParameters).not.toBeNull()
    expect(utmParameters).toEqual({
      utm_source: 'source',
      utm_medium: 'medium',
      utm_campaign: 'campaign',
      utm_term: 'term',
      utm_content: 'content',
    })
  })
})
