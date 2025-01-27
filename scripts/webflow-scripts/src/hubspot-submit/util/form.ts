import { constructHubspotPayload, HubspotPayload } from './payload'
import { submitHubspotPayload } from '../api/hubspot'
import { downloadFile } from './download'

export const prepareWebflowForm = (form: HTMLFormElement): void => {
  form.parentElement?.classList.remove('w-form') // Webflow form class
}

export interface FormConfig {
  formId: string
  portalId: string
  redirectUrl?: string
  resourceUrl?: string
  resourceFilename?: string
  redirectTimeout?: number
  formSuccessBlock?: HTMLElement
  formErrorBlock?: HTMLElement
}

const getFormId = (form: HTMLFormElement): string => {
  const id = form.getAttribute('data-hs-form-id')

  if (!id) {
    throw new Error(
      'Hubspot form id is missing - please check the HTML attributes on the form:\n' +
        form,
    )
  }

  return id
}

const getPortalId = (form: HTMLFormElement): string => {
  const id = form.getAttribute('data-hs-portal-id')

  if (!id) {
    throw new Error(
      'Hubspot portal id is missing - please check the HTML attributes on the form:\n' +
        form,
    )
  }

  return id
}

const getRedirectUrl = (form: HTMLFormElement): string | undefined => {
  return form.getAttribute('data-redirect-url') || undefined
}

const getResourceUrl = (form: HTMLFormElement): string | undefined => {
  return form.getAttribute('data-resource-url') || undefined
}

const getResourceFilename = (form: HTMLFormElement): string | undefined => {
  return form.getAttribute('data-resource-filename') || undefined
}

const getRedirectTimeout = (form: HTMLFormElement): number | undefined => {
  const timeout = form.getAttribute('data-redirect-timeout')
  const parsedTimeout = timeout ? parseInt(timeout, 10) : NaN
  return isNaN(parsedTimeout) ? undefined : parsedTimeout
}

const getFormSuccessBlock = (
  form: HTMLFormElement,
): HTMLElement | undefined => {
  const block: HTMLElement | undefined =
    form.parentElement?.querySelector('[data-form-success]') || undefined

  if (!block) {
    console.warn('Hubspot form is missing a success block - form:', form)
  }

  return block
}

const getFormErrorBlock = (form: HTMLFormElement): HTMLElement | undefined => {
  const block: HTMLElement | undefined =
    form.parentElement?.querySelector('[data-form-error]') || undefined

  if (!block) {
    console.warn('Hubspot form is missing an error block - form:', form)
  }

  return block
}

export const getFormConfig = (form: HTMLFormElement): FormConfig => {
  const formId = getFormId(form)
  const portalId = getPortalId(form)
  const redirectUrl = getRedirectUrl(form)
  const resourceUrl = getResourceUrl(form)
  const resourceFilename = getResourceFilename(form)
  const redirectTimeout = getRedirectTimeout(form)
  const formSuccessBlock = getFormSuccessBlock(form)
  const formErrorBlock = getFormErrorBlock(form)

  return {
    formId,
    portalId,
    redirectUrl,
    resourceUrl,
    resourceFilename,
    redirectTimeout,
    formSuccessBlock,
    formErrorBlock,
  }
}

export const sendFormData = async (
  payload: HubspotPayload,
  formConfig: FormConfig,
): Promise<boolean> => {
  try {
    const response = await submitHubspotPayload(payload, formConfig)
    return response.ok
  } catch (error) {
    console.error('Error submitting form to Hubspot:', error)
    return false
  }
}

export const addFormSubmitListener = (
  form: HTMLFormElement,
  formConfig: FormConfig,
): void => {
  form.addEventListener('submit', async (event: Event) => {
    event.preventDefault()

    const success: boolean = await sendFormData(
      constructHubspotPayload(form),
      formConfig,
    )

    form.style.display = 'none'

    if (formConfig.formSuccessBlock && success) {
      formConfig.formSuccessBlock.style.display = 'block'
    }

    if (formConfig.formErrorBlock && !success) {
      formConfig.formErrorBlock.style.display = 'block'
    }

    if (formConfig.redirectUrl && success) {
      setTimeout(() => {
        window.location.assign(String(formConfig.redirectUrl))
      }, formConfig.redirectTimeout || 0)
    }

    if (formConfig.resourceUrl && formConfig.resourceFilename && success) {
      downloadFile(formConfig.resourceUrl, formConfig.resourceFilename)
    } else if (formConfig.resourceUrl && success) {
      console.warn(
        'resource filename not specified - opening resource in new tab',
      )
      window.open(formConfig.resourceUrl, '_blank')
    }
  })
}
