import { ClientIpStore } from '../stores/ClientIpStore'
import { getHubspotCookie } from './cookies'

export interface HubspotContext {
  pageUri: string
  pageName: string
  hutk?: string
  ipAddress?: string
}

const getPageUri = (): string => window.location.href

const getPageName = (): string => document.title

const getIpAddress = (): string | undefined => {
  return ClientIpStore.getIp()
}

export const getHubspotContext = (): HubspotContext => {
  const context: HubspotContext = {
    pageUri: getPageUri(),
    pageName: getPageName(),
  }

  const hubspotCookie = getHubspotCookie()

  if (hubspotCookie) {
    context.hutk = hubspotCookie
  }

  const ipAddress = getIpAddress()

  if (ipAddress) {
    context.ipAddress = ipAddress
  }

  return context
}
