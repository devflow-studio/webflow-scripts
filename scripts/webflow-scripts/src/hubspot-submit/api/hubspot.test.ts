import { submitHubspotPayload } from './hubspot'
import { HubspotPayload } from '../util/payload'
import { FormConfig } from '../util/form'

describe('Hubspot', () => {
  describe('func submitHubspotPayload', () => {
    beforeEach(() => {
      global.fetch = jest.fn()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('makes a fetch to Hubspot form submissions API', async () => {
      const payload: HubspotPayload = {
        fields: [
          {
            name: 'email',
            value: 'test@test.com',
          },
        ],
        context: {
          pageName: 'Test',
          pageUri: 'https://test.com',
        },
      }

      const formConfig: FormConfig = {
        portalId: '12345',
        formId: 'abcde',
      }

      // mock fetch
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      } as Response)

      const response = await submitHubspotPayload(payload, formConfig)

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.hsforms.com/submissions/v3/integration/submit/12345/abcde`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )

      expect(response.ok).toBe(true)
    })
  })
})
