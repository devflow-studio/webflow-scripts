import { getClientIp } from '../util/ip'

export const ClientIpStore = (() => {
  let ip: string | undefined

  const getIp = (): string | undefined => ip

  const memorizeClientIp = async (useClientIp: boolean): Promise<void> => {
    ip = useClientIp ? await getClientIp() : undefined
  }

  return {
    getIp,
    memorizeClientIp,
  }
})()
