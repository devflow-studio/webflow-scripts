# Webflow Scripts

## Scripts

### Hubspot Submit

A form controller script that overrides the default Webflow form behavior to
submit form data to Hubspot via API. It will target ALL forms on a page that
have the required attributes, and _will ignore forms that don't have the
required attributes so that other forms can retain default behavior if desired_.

#### IMPORTANT

- The field types and names must match the Hubspot form fields _exactly_.
- `email` property in Hubspot must have corresponding input with name `email` in
  Webflow.
- Properties other that Contact Properties use dot notation: `company.name`,
  `company.industry`, etc.
- Install the Hubspot tracking code on the site to attribute submissions with
  the Hubspot cookie.
- It is highly recommended to turn off non-Hubspot form captures for all forms
  in Hubspot to avoid duplicate submissions.
  [Manage Settings Docs](https://knowledge.hubspot.com/forms/use-non-hubspot-forms#enable-or-disable-non-hubspot-forms)

##### Currently Supported Field Types

These are the tested field types that are supported. More field types are
planned to be supported in future versions with backward compatibility.

- Text Inputs - including text, phone, email, number
- Text Areas
- Checkboxes
- Selects (native select elements - not dropdowns)

#### Usage

```html
<script
  data-webflow-hubspot-submit
  data-use-ip="false"
  data-use-utm="false"
  data-use-gclid="false"
  src="https://cdn.jsdelivr.net/npm/webflow-scripts@<VERSION>/dist/hubspot-submit/index.js"
></script>
```

**Script Tag**

The script embed should have the following attribute to work as expected:
`data-webflow-hubspot-submit`.

The script embed has the following OPTIONAL flags:

- `data-use-ip` [true | false] (default: false) - If true, the script will
  attempt to get the client IP and add to the Hubspot context.
- `data-use-utm` [true | false] (default: false) - If true, the script will
  attempt to get the UTM parameters from the URL and add to the Hubspot context.
  NOTE: The form in Hubspot must have identical utm fields to be collected,
  otherwise the submission data will be noisy.
- `data-use-gclid` [true | false] (default: false) - If true, the script will
  attempt to get the GCLID parameter from the URL and add to the Hubspot
  context. NOTE: The form in Hubspot must have identical gclid field to be
  collected, otherwise the submission data will be noisy.

**Webflow Form Block**

The Webflow form block includes a wrapper with a form element, success block,
and error block. It also includes a class `w-form` which is the selector used
for default behavior. This script will remove the class in preparation for the
custom behavior - therefore, don't style the wrapper using that selector.

_Required Attributes_

= Form Element =

(NOT THE FORM BLOCK, but the form element itself)

- `data-hs-portal-id` - The Hubspot portal ID. (found on the script embed code
  from Hubspot)
- `data-hs-form-id` - The Hubspot form ID. (found on the script embed code from
  Hubspot)

= Form Success Block =

It will be set to display: block when the form is successfully submitted,
therefore style the inner elements accordingly.

- `data-form-success` - Success block target.

= Form Error Block =

It will be set to display: block when the form submission fails, therefore style
the inner elements accordingly.

- `data-form-error` - Error block target.

_Optional Attributes_

= Redirects =

- `data-redirect-url` - The URL to redirect to after successful form submission.
  (e.g. /thank-you)
- `data-redirect-timeout` - The number of milliseconds to wait before
  redirecting. (e.g. 1000 = 1 second) - default is 0 if a redirect URL is
  provided without a timeout.

= Resource Downloads =

- `data-resource-url` - The URL to download a resource after successful form
  submission. These can be PDFs uploaded to the Webflow Assets library, for
  example.
- `data-resource-filename` - The filename of the resource to download. This is
  the name that will be used when the browser prompts the user to save the file.
  (e.g. "whitepaper.pdf")
- NOTE: if a resource URL is provided but a filename is not, the resource will
  open a new browser tab to the resource URL instead.

### Hello World

A script that logs "Hello, world!" to the console. Helpful for testing CDN
fetches.

```html
<script src="https://cdn.jsdelivr.net/npm/webflow-scripts@<VERSION>/dist/hello-world/index.js"></script>
```
