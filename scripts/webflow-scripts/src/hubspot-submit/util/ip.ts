export const getClientIp = async (): Promise<string | undefined> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch {
    console.log('unable to get client ip')
    return undefined
  }
}
