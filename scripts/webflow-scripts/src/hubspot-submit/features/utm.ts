export interface UtmParameters {
  [key: string]: string
}

export const getUtmParameters = (): UtmParameters | null => {
  const utmParameters: UtmParameters = {}
  const searchParams = new URLSearchParams(window.location.search)

  searchParams.forEach((value, key) => {
    if (key.startsWith('utm_')) {
      utmParameters[key] = value
    }
  })

  if (Object.keys(utmParameters).length === 0) {
    return null
  }

  return utmParameters
}
