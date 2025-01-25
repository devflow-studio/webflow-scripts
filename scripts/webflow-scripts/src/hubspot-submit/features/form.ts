import {
  appendGclid,
  appendUtmParameters,
  getHubspotFields,
  HubspotField,
} from './fields'

export const prepareWebflowForm = (form: HTMLFormElement): void => {
  form.parentElement?.classList.remove('w-form') // Webflow form class
}

export interface FormConfig {
  formId: string
  portalId: string
  redirectUrl?: string
  resourceUrl?: string
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

const getRedirectTimeout = (form: HTMLFormElement): number | undefined => {
  return form.getAttribute('data-redirect-timeout')
    ? parseInt(form.getAttribute('data-redirect-timeout') || '0', 10)
    : undefined
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
  const redirectTimeout = getRedirectTimeout(form)
  const formSuccessBlock = getFormSuccessBlock(form)
  const formErrorBlock = getFormErrorBlock(form)

  return {
    formId,
    portalId,
    redirectUrl,
    resourceUrl,
    redirectTimeout,
    formSuccessBlock,
    formErrorBlock,
  }
}

export const addFormSubmitListener = (
  form: HTMLFormElement,
  formConfig: FormConfig,
  ip?: string,
): void => {
  form.addEventListener('submit', async (event: Event) => {
    event.preventDefault()

    console.log(
      `Form Submit!\nForm ID: ${formConfig.formId}\nPortal ID: ${formConfig.portalId}\nIP: ${ip}`,
    )

    let fields: HubspotField[] = getHubspotFields(form)
    fields = appendUtmParameters(fields)
    fields = appendGclid(fields)
    console.log('Fields:', fields)
  })
}
