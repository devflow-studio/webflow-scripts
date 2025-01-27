import { ScriptStore } from './ScriptStore'

describe('ScriptStore', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('returns the script element', () => {
    const script = document.createElement('script')
    script.setAttribute('data-webflow-hubspot-submit', '')
    document.body.appendChild(script)
    ScriptStore.init()
    expect(ScriptStore.getScript()).toBe(script)
  })

  it('returns null if the script element is not found', () => {
    ScriptStore.init()
    expect(ScriptStore.getScript()).toBeNull()
  })
})
