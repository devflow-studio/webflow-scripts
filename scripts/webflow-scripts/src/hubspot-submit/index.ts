import { getHubspotForms, greet, useClientIp } from './config/init'
import { getClientIp } from './features/ip'

/**
 * Hubspot Form Controller
 * Written by: David Potter (Devflow Studio)
 * The embedded script element should have the following attributes:
 * - data-webflow-hubspot-submit: (required) - flag to get the script tag
 * - data-use-ip: (optional) - flag to use the client IP address
 * Each form element needs the following HTML attributes:
 * - data-hs-form-id: Hubspot form id
 * - data-hs-portal-id: Hubspot portal id
 * - data-redirect-url: (optional) - URL to redirect to after form submission
 * - data-resource-url: (optional) - URL to resource [PDF] to open in new tab after success
 * - data-redirect-timeout: (optional) - time in milliseconds to wait before redirecting
 * The form success block needs the following HTML attribute:
 * - data-form-success: this is the block that will be displayed after form submission
 * - data-form-error: this is the block that will be displayed after form submission (if there is an error)
 */
;(async () => {
  greet()

  const hubspotForms = getHubspotForms()

  if (!hubspotForms.length) {
    // no hubspot forms on page
    return
  }

  const clientIp: string | undefined = useClientIp
    ? await getClientIp()
    : undefined
})()
