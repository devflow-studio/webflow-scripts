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

/**
 * Hubspot Form Controller
 * Written by: David Potter (Devflow Studio)
 * The embedded script element should have the following attributes:
 * - data-webflow-hubspot-submit: (required) - flag to get the script tag
 * - data-use-ip: (optional) - flag to use the client IP address for context (default: false)
 * - data-use-utm: (optional) - flag to use UTM parameters as field (default: false)
 * - data-use-gclid: (optional) - flag to use 'gclid' as field (default: false)
 * Each form element needs the following HTML attributes:
 * - data-hs-form-id: Hubspot form id
 * - data-hs-portal-id: Hubspot portal id
 * - data-redirect-url: (optional) - URL to redirect to after form submission
 * - data-resource-url: (optional) - URL to resource [PDF] to open in new tab after success
 * - data-resource-filename: (optional) - filename for the resource (e.g. whitepaper.pdf)
 * - data-redirect-timeout: (optional) - time in milliseconds to wait before redirecting
 * The form success/error blocks needs the following HTML attributes:
 * - data-form-success: this is the block that will be displayed after form submission
 * - data-form-error: this is the block that will be displayed after form submission (if there is an error)
 */
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
