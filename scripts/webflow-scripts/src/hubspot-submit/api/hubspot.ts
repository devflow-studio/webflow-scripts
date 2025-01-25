import { HubspotPayload } from '../util/payload'
import { FormConfig } from '../util/form'

export const submitHubspotPayload = async (
  payload: HubspotPayload,
  formConfig: FormConfig,
) => {
  return await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${formConfig.portalId}/${formConfig.formId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )
}
