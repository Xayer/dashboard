import { backendUrl } from './proxy'

const clientId = process.env.NUXT_ENV_NORDEA_CLIENT_ID as string
const redirectUri = process.env.NUXT_ENV_NORDEA_REDIRECT_URI as string

const baseUrl = process.env.NUXT_ENV_NORDEA_ENDPOINT

const proxy = 'http://localhost:8888/' // backendUrl
const backendNordeaUrl = `${proxy}.netlify/functions/nordea-`

export const nordeaAuthUrl = () => {
  const authUrl = `${backendNordeaUrl}auth?${new URLSearchParams({
    client_id: 'eee8f462-2735-4c93-bd0d-0f029dafae11', // clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    max_th_history: '10',
    scope:
      'ACCOUNTS_BASIC,ACCOUNTS_BALANCES,ACCOUNTS_DETAILS,ACCOUNTS_TRANSACTIONS,PAYMENTS_MULTIPLE',
    duration: '500',
    account_list: 'ALL',
    country: 'DK',
    authentication_method: 'BANKID_SE',
  })}`

  return authUrl
}

export const authenticateToken = async (code: string) => {
  const response = await fetch(
    `${backendNordeaUrl}token?${new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    })}`
  )
  return await response.json()

  // return mockedResponse
}
