import { greet, useClientIp, useGclid, useUtmParameters } from './init'
import { ScriptStore } from '../stores/ScriptStore'

jest.mock('../stores/ScriptStore', () => ({
  ScriptStore: {
    init: jest.fn(),
    getScript: jest.fn(),
  },
}))

describe('Config Init', () => {
  describe('func greet', () => {
    it('logs init message to console', () => {
      const logSpy = jest.spyOn(console, 'log')
      greet()
      expect(logSpy).toHaveBeenCalledWith(
        'Devflow Studio: Hubspot Submit script loaded',
      )
    })
  })

  describe('func useClientIp', () => {
    let mockScript: HTMLScriptElement

    beforeEach(() => {
      mockScript = document.createElement('script')
      mockScript.setAttribute('data-webflow-hubspot-submit', '')
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('returns false when data-use-ip is not set', () => {
      ;(ScriptStore.getScript as jest.Mock).mockReturnValue(undefined)
      expect(useClientIp()).toBe(false)
    })

    it('returns false when data-use-ip is set to false', () => {
      mockScript.setAttribute('data-use-ip', 'false')
      ;(ScriptStore.getScript as jest.Mock).mockReturnValue(mockScript)
      expect(useClientIp()).toBe(false)
    })

    it('returns true when data-use-ip is set to true', () => {
      mockScript.setAttribute('data-use-ip', 'true')
      ;(ScriptStore.getScript as jest.Mock).mockReturnValue(mockScript)
      expect(useClientIp()).toBe(true)
    })
  })

  describe('func useUtmParameters', () => {
    let mockScript: HTMLScriptElement

    beforeEach(() => {
      mockScript = document.createElement('script')
      mockScript.setAttribute('data-webflow-hubspot-submit', '')
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('returns false when data-use-utm is not set', () => {
      ;(ScriptStore.getScript as jest.Mock).mockReturnValue(undefined)
      expect(useUtmParameters()).toBe(false)
    })

    it('returns false when data-use-utm is set to false', () => {
      mockScript.setAttribute('data-use-utm', 'false')
      ;(ScriptStore.getScript as jest.Mock).mockReturnValue(mockScript)
      expect(useUtmParameters()).toBe(false)
    })

    it('returns true when data-use-utm is set to true', () => {
      mockScript.setAttribute('data-use-utm', 'true')
      ;(ScriptStore.getScript as jest.Mock).mockReturnValue(mockScript)
      expect(useUtmParameters()).toBe(true)
    })
  })

  describe('func useGclid', () => {
    let mockScript: HTMLScriptElement

    beforeEach(() => {
      mockScript = document.createElement('script')
      mockScript.setAttribute('data-webflow-hubspot-submit', '')
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('returns false when data-use-gclid is not set', () => {
      ;(ScriptStore.getScript as jest.Mock).mockReturnValue(undefined)
      expect(useGclid()).toBe(false)
    })

    it('returns false when data-use-gclid is set to false', () => {
      mockScript.setAttribute('data-use-gclid', 'false')
      ;(ScriptStore.getScript as jest.Mock).mockReturnValue(mockScript)
      expect(useGclid()).toBe(false)
    })

    it('returns true when data-use-gclid is set to true', () => {
      mockScript.setAttribute('data-use-gclid', 'true')
      ;(ScriptStore.getScript as jest.Mock).mockReturnValue(mockScript)
      expect(useGclid()).toBe(true)
    })
  })
})
