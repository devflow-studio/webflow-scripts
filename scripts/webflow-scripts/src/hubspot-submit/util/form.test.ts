import * as formUtils from './form'
import {
  addFormSubmitListener,
  FormConfig,
  getFormConfig,
  prepareWebflowForm,
  sendFormData,
} from './form'
import { submitHubspotPayload } from '../api/hubspot'
import { downloadFile } from './download'
import { HubspotPayload } from './payload'

jest.mock('../api/hubspot', () => ({
  submitHubspotPayload: jest.fn(),
}))

jest.mock('../util/download', () => ({
  downloadFile: jest.fn(),
}))

describe('Form Util', () => {
  let webflowFormBlock: HTMLDivElement
  let form: HTMLFormElement
  let formSuccessBlock: HTMLDivElement
  let formErrorBlock: HTMLDivElement

  beforeEach(() => {
    webflowFormBlock = document.createElement('div')
    webflowFormBlock.classList.add('w-form')

    form = document.createElement('form')
    form.setAttribute('data-hs-portal-id', '12345')
    form.setAttribute('data-hs-form-id', 'abcde')
    webflowFormBlock.appendChild(form)

    formSuccessBlock = document.createElement('div')
    formSuccessBlock.setAttribute('data-form-success', '')
    formSuccessBlock.style.display = 'none'
    webflowFormBlock.appendChild(formSuccessBlock)

    formErrorBlock = document.createElement('div')
    formErrorBlock.setAttribute('data-form-error', '')
    formErrorBlock.style.display = 'none'
    webflowFormBlock.appendChild(formErrorBlock)

    document.body.appendChild(webflowFormBlock)
  })

  afterEach(() => {
    webflowFormBlock.remove()
    jest.clearAllMocks()
  })

  describe('func prepareWebflowForm', () => {
    it('removes the w-form class from the form wrapper div', () => {
      prepareWebflowForm(form)
      expect(webflowFormBlock.classList.contains('w-form')).toBe(false)
    })
  })

  describe('func getFormConfig', () => {
    it('returns a basic form config', () => {
      const formConfig = getFormConfig(form)

      expect(formConfig.portalId).toBe('12345')
      expect(formConfig.formId).toBe('abcde')
      expect(formConfig.redirectUrl).toBeUndefined()
      expect(formConfig.resourceUrl).toBeUndefined()
      expect(formConfig.resourceFilename).toBeUndefined()
      expect(formConfig.redirectTimeout).toBeUndefined()
      expect(formConfig.formSuccessBlock).toBeDefined()
      expect(formConfig.formErrorBlock).toBeDefined()
    })

    it('returns undefined if data-redirect-timeout is set to string that evaluates to NaN', () => {
      form.setAttribute('data-redirect-timeout', 'test')

      const formConfig = getFormConfig(form)

      expect(formConfig.redirectTimeout).toBeUndefined()
    })

    it('throws an error if the formId is missing', () => {
      form.removeAttribute('data-hs-form-id')

      expect(() => getFormConfig(form)).toThrow(
        'Hubspot form id is missing - please check the HTML attributes on the form:\n' +
          form,
      )
    })

    it('throws an error if the portalId is missing', () => {
      form.removeAttribute('data-hs-portal-id')

      expect(() => getFormConfig(form)).toThrow(
        'Hubspot portal id is missing - please check the HTML attributes on the form:\n' +
          form,
      )
    })

    it('returns a redirect on success configuration', () => {
      form.setAttribute('data-redirect-url', 'https://example.com/thank-you')
      form.setAttribute('data-redirect-timeout', '2000')

      const formConfig = getFormConfig(form)

      expect(formConfig.portalId).toBe('12345')
      expect(formConfig.formId).toBe('abcde')
      expect(formConfig.redirectUrl).toBe('https://example.com/thank-you')
      expect(formConfig.resourceUrl).toBeUndefined()
      expect(formConfig.resourceFilename).toBeUndefined()
      expect(formConfig.redirectTimeout).toBe(2000)
      expect(formConfig.formSuccessBlock).toBeDefined()
      expect(formConfig.formErrorBlock).toBeDefined()
    })

    it('returns a resource download configuration', () => {
      form.setAttribute(
        'data-resource-url',
        'https://files.example.com/resource.pdf',
      )
      form.setAttribute('data-resource-filename', 'resource.pdf')

      const formConfig = getFormConfig(form)

      expect(formConfig.portalId).toBe('12345')
      expect(formConfig.formId).toBe('abcde')
      expect(formConfig.redirectUrl).toBeUndefined()
      expect(formConfig.resourceUrl).toBe(
        'https://files.example.com/resource.pdf',
      )
      expect(formConfig.resourceFilename).toBe('resource.pdf')
      expect(formConfig.redirectTimeout).toBeUndefined()
      expect(formConfig.formSuccessBlock).toBeDefined()
      expect(formConfig.formErrorBlock).toBeDefined()
    })

    it('logs a warning if the success block is missing', () => {
      formSuccessBlock.remove()

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      getFormConfig(form)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Hubspot form is missing a success block - form:',
        form,
      )
    })

    it('logs a warning if the error block is missing', () => {
      formErrorBlock.remove()

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      getFormConfig(form)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Hubspot form is missing an error block - form:',
        form,
      )
    })
  })

  describe('func sendFormData', () => {
    let formConfig: FormConfig
    let payload: HubspotPayload

    beforeEach(() => {
      formConfig = getFormConfig(form)
      payload = {
        fields: [{ name: 'email', value: 'test@test.com' }],
        context: {
          pageUri: 'https://example.com',
          pageName: 'Example Page',
        },
      }
    })

    it('sends form data to Hubspot', async () => {
      ;(submitHubspotPayload as jest.Mock).mockResolvedValue({
        ok: true,
      } as Response)

      const success = await sendFormData(payload, formConfig)

      expect(success).toBe(true)
    })

    it('logs an error and returns false if the request fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(submitHubspotPayload as jest.Mock).mockRejectedValue({
        ok: false,
      } as Response)

      const success = await sendFormData(payload, formConfig)

      expect(consoleSpy).toHaveBeenCalled()
      expect(success).toBe(false)
    })
  })

  describe('func addFormSubmitHandler', () => {
    const mockSubmitForm = () => {
      const submitEvent = new Event('submit', {
        bubbles: true,
        cancelable: true,
      })
      form.dispatchEvent(submitEvent)
    }

    afterEach(() => {
      jest.restoreAllMocks()
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it('adds an [submit] event listener to the form element', () => {
      const listenerSpy = jest
        .spyOn(form, 'addEventListener')
        .mockImplementation()

      const formConfig = getFormConfig(form)

      addFormSubmitListener(form, formConfig)

      expect(listenerSpy).toHaveBeenCalled()
    })

    it('hides the form on success and displays success block', async () => {
      jest.spyOn(formUtils, 'sendFormData').mockResolvedValue(true)

      const formConfig = getFormConfig(form)

      addFormSubmitListener(form, formConfig)

      mockSubmitForm()

      await Promise.resolve()

      expect(form.style.display).toBe('none')
      expect(formSuccessBlock.style.display).toBe('block')
      expect(formErrorBlock.style.display).toBe('none')
    })

    it('hides the form on error and displays error block', async () => {
      jest.spyOn(formUtils, 'sendFormData').mockResolvedValue(false)

      const formConfig = getFormConfig(form)

      addFormSubmitListener(form, formConfig)

      mockSubmitForm()

      await Promise.resolve()

      expect(form.style.display).toBe('none')
      expect(formSuccessBlock.style.display).toBe('none')
      expect(formErrorBlock.style.display).toBe('block')
    })

    it('redirects to the success URL after a timeout', async () => {
      jest.spyOn(formUtils, 'sendFormData').mockResolvedValue(true)

      form.setAttribute('data-redirect-url', 'https://example.com/thank-you')
      form.setAttribute('data-redirect-timeout', '2000')

      const formConfig = getFormConfig(form)

      addFormSubmitListener(form, formConfig)

      const locationSpy = jest
        .spyOn(window, 'location', 'get')
        .mockReturnValue({
          href: '',
          assign: jest.fn(),
        } as unknown as Location)

      jest.useFakeTimers()

      mockSubmitForm()

      await Promise.resolve()

      expect(form.style.display).toBe('none')
      expect(formSuccessBlock.style.display).toBe('block')
      expect(formErrorBlock.style.display).toBe('none')

      jest.advanceTimersByTime(2000)

      expect(window.location.assign).toHaveBeenCalledWith(
        'https://example.com/thank-you',
      )

      locationSpy.mockRestore()
      jest.useRealTimers()
    })

    it('redirects with timeout of 0 if redirect-timeout evaluates to NaN', async () => {
      jest.spyOn(formUtils, 'sendFormData').mockResolvedValue(true)

      form.setAttribute('data-redirect-url', 'https://example.com/thank-you')
      form.setAttribute('data-redirect-timeout', 'test')

      const formConfig = getFormConfig(form)

      addFormSubmitListener(form, formConfig)

      const locationSpy = jest
        .spyOn(window, 'location', 'get')
        .mockReturnValue({
          href: '',
          assign: jest.fn(),
        } as unknown as Location)

      jest.useFakeTimers()

      mockSubmitForm()

      await Promise.resolve()

      expect(form.style.display).toBe('none')
      expect(formSuccessBlock.style.display).toBe('block')
      expect(formErrorBlock.style.display).toBe('none')

      jest.advanceTimersByTime(0)

      expect(window.location.assign).toHaveBeenCalledWith(
        'https://example.com/thank-you',
      )

      locationSpy.mockRestore()
      jest.useRealTimers()
    })

    it('downloads a resource on success', async () => {
      jest.spyOn(formUtils, 'sendFormData').mockResolvedValue(true)

      form.setAttribute(
        'data-resource-url',
        'https://files.example.com/resource.pdf',
      )
      form.setAttribute('data-resource-filename', 'resource.pdf')

      const formConfig = getFormConfig(form)

      addFormSubmitListener(form, formConfig)

      mockSubmitForm()

      await Promise.resolve()

      expect(downloadFile).toHaveBeenCalledWith(
        formConfig.resourceUrl,
        formConfig.resourceFilename,
      )
    })

    it('opens tab to resource URL if filename is missing', async () => {
      jest.spyOn(formUtils, 'sendFormData').mockResolvedValue(true)
      const windowOpenSpy = jest
        .spyOn(window, 'open')
        .mockImplementation(() => null)

      form.setAttribute(
        'data-resource-url',
        'https://files.example.com/resource.pdf',
      )

      const formConfig = getFormConfig(form)

      addFormSubmitListener(form, formConfig)

      mockSubmitForm()

      await Promise.resolve()

      expect(downloadFile).not.toHaveBeenCalled()
      expect(windowOpenSpy).toHaveBeenCalledWith(
        formConfig.resourceUrl,
        '_blank',
      )

      windowOpenSpy.mockRestore()
    })
  })
})
