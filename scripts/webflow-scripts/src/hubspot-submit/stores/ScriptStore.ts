export const ScriptStore = (() => {
  let script: HTMLScriptElement | undefined

  const init = () => {
    script = document.querySelector('[data-webflow-hubspot-submit]') as
      | HTMLScriptElement
      | undefined

    if (!script) {
      console.warn(
        'Hubspot Submit script missing required attribute.\nIt may not work as expected.',
      )
    }
  }

  const getScript = (): HTMLScriptElement | undefined => script

  return {
    init,
    getScript,
  }
})()
