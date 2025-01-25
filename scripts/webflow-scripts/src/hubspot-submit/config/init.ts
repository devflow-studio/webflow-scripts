import { ScriptStore } from '../stores/ScriptStore'

export const greet = () => {
  console.log('Devflow Studio: Hubspot Submit script loaded')
}

export const useClientIp = (): boolean =>
  (
    ScriptStore.getScript()?.getAttribute('data-use-ip') || 'false'
  ).toLowerCase() === 'true'

export const useUtmParameters = (): boolean =>
  (
    ScriptStore.getScript()?.getAttribute('data-use-utm') || 'false'
  ).toLowerCase() === 'true'

export const useGclid = (): boolean =>
  (
    ScriptStore.getScript()?.getAttribute('data-use-gclid') || 'false'
  ).toLowerCase() === 'true'

export const getHubspotForms = (): NodeListOf<HTMLFormElement> => {
  return document.querySelectorAll('[data-hs-form-id]')
}
