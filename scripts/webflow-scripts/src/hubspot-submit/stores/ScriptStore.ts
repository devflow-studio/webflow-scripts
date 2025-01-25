export const ScriptStore = (() => {
  const script: HTMLScriptElement | undefined = document.querySelector(
    '[data-webflow-hubspot-submit]',
  ) as HTMLScriptElement | undefined

  const init = () => {
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
