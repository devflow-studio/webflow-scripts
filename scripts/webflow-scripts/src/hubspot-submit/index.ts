import { getHubspotForms, greet, useClientIp } from './config/init'
import { ScriptStore } from './stores/ScriptStore'
import { UTMStore } from './stores/UTMStore'
import { GclidStore } from './stores/GclidStore'
import { ClientIpStore } from './stores/ClientIpStore'
import {
  addFormSubmitListener,
  FormConfig,
  getFormConfig,
  prepareWebflowForm,
} from './util/form'
;(async () => {
  greet()

  ScriptStore.init()

  const hubspotForms = getHubspotForms()

  if (!hubspotForms.length) {
    // no hubspot forms on page
    return
  }

  UTMStore.memorizeUtmParameters()
  GclidStore.memorizeGclid()
  await ClientIpStore.memorizeClientIp(useClientIp())

  hubspotForms.forEach(form => {
    prepareWebflowForm(form)

    const formConfig: FormConfig = getFormConfig(form)

    addFormSubmitListener(form, formConfig)
  })
})()
