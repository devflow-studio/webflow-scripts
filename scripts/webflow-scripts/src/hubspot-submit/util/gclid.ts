export const getGclid = (): string | null => {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get('gclid')
}
