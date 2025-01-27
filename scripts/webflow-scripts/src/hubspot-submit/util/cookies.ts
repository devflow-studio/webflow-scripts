export const getHubspotCookie = () => {
  const cookieName = 'hubspotutk'
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${cookieName}=`))

  if (!cookieValue) {
    return undefined
  }

  return cookieValue.split('=')[1]
}
