import Sdk from '@commercelayer/sdk'

type ReturnObj = {
  organization: string
  domain: string
}

export type CLSdk = ReturnType<typeof Sdk>

export function getOrganizationSlug<E extends string>(endpoint: E): ReturnObj {
  const org = {
    organization: '',
    domain: 'commercelayer.io',
  }
  if (endpoint.search('commercelayer.io') === -1)
    org.domain = 'commercelayer.co'
  org.organization = endpoint
    .replace('https://', '')
    .replace(`.${org.domain}`, '')
  return org
}

type SdkArgs = {
  endpoint: string
  accessToken: string
}

export default function getSdk({ endpoint, accessToken }: SdkArgs): CLSdk {
  const org = getOrganizationSlug(endpoint)
  return Sdk({
    accessToken,
    ...org,
  })
}
