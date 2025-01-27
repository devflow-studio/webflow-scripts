import { getHubspotFields } from './fields'
import { useGclid, useUtmParameters } from '../config/init'

jest.mock('../config/init', () => ({
  useGclid: jest.fn(),
  useUtmParameters: jest.fn(),
}))

jest.mock('../stores/GclidStore', () => ({
  GclidStore: {
    getGclid: jest.fn(() => '123'),
  },
}))

jest.mock('../stores/UTMStore', () => ({
  UTMStore: {
    getUtmParameters: jest.fn(() => ({
      utm_source: 'test-source',
      utm_medium: 'test-medium',
      utm_campaign: 'test-campaign',
      utm_term: 'test-term',
      utm_content: 'test-content',
    })),
  },
}))

describe('Fields Util', () => {
  let form: HTMLFormElement

  beforeEach(() => {
    form = document.createElement('form')

    // firstname
    const firstname = document.createElement('input')
    firstname.name = 'firstname'
    firstname.value = 'Test'
    form.appendChild(firstname)

    // lastname
    const lastname = document.createElement('input')
    lastname.name = 'lastname'
    lastname.value = 'User'
    form.appendChild(lastname)

    // email
    const email = document.createElement('input')
    email.name = 'email'
    email.value = 'test@test.com'
    form.appendChild(email)

    // phone
    const phone = document.createElement('input')
    phone.name = 'phone'
    phone.value = '1234567890'
    form.appendChild(phone)

    // message
    const message = document.createElement('textarea')
    message.name = 'message'
    message.value = 'This is a test message'
    form.appendChild(message)

    // agreement
    const agreement = document.createElement('input')
    agreement.type = 'checkbox'
    agreement.name = 'agreement'
    agreement.checked = true
    form.appendChild(agreement)

    // submit
    const submit = document.createElement('input')
    submit.type = 'submit'
    submit.value = 'Submit'
    form.appendChild(submit)

    // cf-turnstile-response (hidden & injected input)
    const turnstileResponse = document.createElement('input')
    turnstileResponse.type = 'hidden'
    turnstileResponse.name = 'cf-turnstile-response'
    turnstileResponse.value = '1234567890'
    form.appendChild(turnstileResponse)
  })

  afterEach(() => {
    form.remove()
    jest.clearAllMocks()
  })

  describe('func getHubspotFields', () => {
    it('returns fields from form elements', () => {
      ;(useUtmParameters as jest.Mock).mockReturnValue(false)
      ;(useGclid as jest.Mock).mockReturnValue(false)

      const fields = getHubspotFields(form)

      expect(fields).toEqual([
        { name: 'firstname', value: 'Test' },
        { name: 'lastname', value: 'User' },
        { name: 'email', value: 'test@test.com' },
        { name: 'phone', value: '1234567890' },
        { name: 'message', value: 'This is a test message' },
        { name: 'agreement', value: 'true' },
      ])

      expect(
        fields.find(f => f.name === 'cf-turnstile-response'),
      ).toBeUndefined()
      expect(fields.find(f => f.name === '')).toBeUndefined()
    })

    it('returns fields including utm parameters', () => {
      ;(useUtmParameters as jest.Mock).mockReturnValue(true)
      ;(useGclid as jest.Mock).mockReturnValue(false)

      const fields = getHubspotFields(form)

      expect(fields).toEqual([
        { name: 'firstname', value: 'Test' },
        { name: 'lastname', value: 'User' },
        { name: 'email', value: 'test@test.com' },
        { name: 'phone', value: '1234567890' },
        { name: 'message', value: 'This is a test message' },
        { name: 'agreement', value: 'true' },
        { name: 'utm_source', value: 'test-source' },
        { name: 'utm_medium', value: 'test-medium' },
        { name: 'utm_campaign', value: 'test-campaign' },
        { name: 'utm_term', value: 'test-term' },
        { name: 'utm_content', value: 'test-content' },
      ])
    })

    it('returns fields including gclid', () => {
      ;(useUtmParameters as jest.Mock).mockReturnValue(false)
      ;(useGclid as jest.Mock).mockReturnValue(true)

      const fields = getHubspotFields(form)

      expect(fields).toEqual([
        { name: 'firstname', value: 'Test' },
        { name: 'lastname', value: 'User' },
        { name: 'email', value: 'test@test.com' },
        { name: 'phone', value: '1234567890' },
        { name: 'message', value: 'This is a test message' },
        { name: 'agreement', value: 'true' },
        { name: 'gclid', value: '123' },
      ])
    })

    it('logs a warning to the console if a field is missing a name', () => {
      const firstNameField: HTMLInputElement | null = form.querySelector(
        'input[name="firstname"]',
      )
      firstNameField?.removeAttribute('name')
      ;(useUtmParameters as jest.Mock).mockReturnValue(false)
      ;(useGclid as jest.Mock).mockReturnValue(false)

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      const fields = getHubspotFields(form)

      expect(fields).toEqual([
        { name: '', value: 'Test' },
        { name: 'lastname', value: 'User' },
        { name: 'email', value: 'test@test.com' },
        { name: 'phone', value: '1234567890' },
        { name: 'message', value: 'This is a test message' },
        { name: 'agreement', value: 'true' },
      ])

      expect(consoleSpy).toHaveBeenCalledWith(
        `Field is missing a name - field:`,
        firstNameField,
      )
    })

    it('returns all fields including utm parameters and gclid', () => {
      ;(useUtmParameters as jest.Mock).mockReturnValue(true)
      ;(useGclid as jest.Mock).mockReturnValue(true)

      const fields = getHubspotFields(form)

      expect(fields).toEqual([
        { name: 'firstname', value: 'Test' },
        { name: 'lastname', value: 'User' },
        { name: 'email', value: 'test@test.com' },
        { name: 'phone', value: '1234567890' },
        { name: 'message', value: 'This is a test message' },
        { name: 'agreement', value: 'true' },
        { name: 'utm_source', value: 'test-source' },
        { name: 'utm_medium', value: 'test-medium' },
        { name: 'utm_campaign', value: 'test-campaign' },
        { name: 'utm_term', value: 'test-term' },
        { name: 'utm_content', value: 'test-content' },
        { name: 'gclid', value: '123' },
      ])
    })
  })
})
