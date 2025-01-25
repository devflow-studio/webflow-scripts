import { constructHubspotPayload } from './payload'

jest.mock('./fields', () => ({
  getHubspotFields: jest.fn().mockReturnValue([
    {
      name: 'email',
      value: 'test@test.com',
    },
  ]),
}))

jest.mock('./context', () => ({
  getHubspotContext: jest.fn().mockReturnValue({
    pageUri: 'test.com',
    pageName: 'Test Page',
    ipAddress: '127.0.0.1',
    hutk: '1234',
  }),
}))

describe('Payload Util', () => {
  describe('func constructHubspotPayload', () => {
    it('returns a valid HubspotPayload object', () => {
      const form = document.createElement('form')
      form.setAttribute('data-hs-portal-id', '12345')
      form.setAttribute('data-hs-form-id', 'abcde')

      const payload = constructHubspotPayload(form)

      expect(payload).toEqual({
        fields: [
          {
            name: 'email',
            value: 'test@test.com',
          },
        ],
        context: {
          pageUri: 'test.com',
          pageName: 'Test Page',
          ipAddress: '127.0.0.1',
          hutk: '1234',
        },
      })
    })
  })
})
