const script: HTMLScriptElement | null = document.querySelector(
  '[data-webflow-hubspot-submit]',
)

if (!script) {
  console.warn(
    'Hubspot Submit script missing required attribute.\nIt may not work as expected.',
  )
}

export const greet = () => {
  console.log('Devflow Studio: Hubspot Submit script loaded')
}

export const useClientIp =
  (script?.getAttribute('data-use-ip') || 'false').toLowerCase() === 'true'

export const getHubspotForms = (): NodeListOf<HTMLFormElement> => {
  return document.querySelectorAll('[data-hs-form-id]')
}
