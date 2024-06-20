import psl from 'psl'
import Url from 'url-parse'

export const getDomain = async (url: string) => {
  const cleanedUrl = new Url(url)
  const parsedDomain = psl.parse(cleanedUrl.host || cleanedUrl.pathname) as psl.ParsedDomain
  console.log('url ', cleanedUrl, parsedDomain)
  const domainName = parsedDomain.domain ? parsedDomain.domain : ''
  console.log('domainName ', domainName)
  return domainName
}

export const getPathName = async (url: string) => {
  const cleanedUrl = new Url(url)
  return cleanedUrl.pathname
}
