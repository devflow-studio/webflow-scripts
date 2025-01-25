import { UTMStore } from '../stores/UTMStore'
import { GclidStore } from '../stores/GclidStore'
import { useGclid, useUtmParameters } from '../config/init'

export interface HubspotField {
  name: string
  value: string
}

const getHubspotFieldElements = (
  form: HTMLFormElement,
): (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] => {
  const fieldElements: (
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
  )[] = Array.from(form.querySelectorAll('input, textarea, select'))

  return fieldElements
    .filter(fe => fe.type !== 'submit') // remove submit button
    .filter(fe => fe.name !== 'cf_turnstile_response') // remove Cloudflare turnstile response
}

const getFieldsFromInputs = (form: HTMLFormElement): HubspotField[] => {
  const fieldElements = getHubspotFieldElements(form)

  return fieldElements.map(fieldElement => {
    const name: string | undefined = fieldElement.name
    let value

    if (
      fieldElement instanceof HTMLInputElement &&
      fieldElement.type === 'checkbox'
    ) {
      value = fieldElement.checked.toString()
    } else {
      value = fieldElement.value
    }

    if (!name) {
      console.warn('Field is missing a name - field:', fieldElement)
    }

    return { name, value }
  })
}

const appendUtmParameters = (fields: HubspotField[]): HubspotField[] => {
  const utmParameters = UTMStore.getUtmParameters()

  if (!utmParameters || !useUtmParameters) {
    return fields
  }

  const utmFields: HubspotField[] = Object.entries(utmParameters).map(
    ([key, value]) => ({ name: key, value }),
  )

  return [...fields, ...utmFields]
}

const appendGclid = (fields: HubspotField[]): HubspotField[] => {
  const gclid = GclidStore.getGclid()

  if (!gclid || !useGclid) {
    return fields
  }

  return [...fields, { name: 'gclid', value: gclid }]
}

export const getHubspotFields = (form: HTMLFormElement): HubspotField[] => {
  let fields: HubspotField[] = getFieldsFromInputs(form)
  fields = appendUtmParameters(fields)
  fields = appendGclid(fields)

  return fields
}
