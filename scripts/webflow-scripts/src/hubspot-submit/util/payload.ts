import { getHubspotFields, HubspotField } from './fields'
import { getHubspotContext, HubspotContext } from './context'

export interface HubspotPayload {
  fields: HubspotField[]
  context: HubspotContext
}

export const constructHubspotPayload = (
  form: HTMLFormElement,
): HubspotPayload => {
  const fields: HubspotField[] = getHubspotFields(form)
  const context: HubspotContext = getHubspotContext()

  return { fields, context }
}
