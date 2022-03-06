import { AccessTokenResponse, RefreshTokenResponse } from '~/types/github/auth'
import { Widget } from '~/types/widgets'

export const githubStateStorageKey = 'github-state'
export const githubTokenStorageKey = 'github-token'
export const githubUserInfoStorageKey = 'github-user-info'

export const githubProxy = `${
  process.env.NUXT_ENV_GITHUB_PROXY_URL as string
}access_token/`

export const githubAuthorizationUrl = () => {
  if (process.browser) {
    const state = `${Date.now() * Date.now()}`
    localStorage.setItem(githubStateStorageKey, state)

    return `https://github.com/login/oauth/authorize?${new URLSearchParams({
      client_id: process.env.NUXT_ENV_GITHUB_CLIENT_ID as string,
      redirect_uri: process.env.NUXT_ENV_GITHUB_REDIRECT_URI as string,
      state,
      scope: 'gist',
    }).toString()}`
  }
  return ''
}

export const githubGetAccessToken = async (code: string) => {
  const response = await fetch(
    `${githubProxy}https://github.com/login/oauth/access_token?${new URLSearchParams(
      {
        client_id: process.env.NUXT_ENV_GITHUB_CLIENT_ID as string,
        redirect_uri: process.env.NUXT_ENV_GITHUB_REDIRECT_URI as string,
        code,
      }
    ).toString()}`,
    { method: 'POST' }
  )
  const params = (await response.text()) as string
  const parsedParams = new URLSearchParams(params)
  const accessResponse = Object.fromEntries(
    parsedParams.entries()
  ) as AccessTokenResponse
  return accessResponse
}

export const githubRefreshAccessToken = async (token: string) => {
  const response = await fetch(
    `${githubProxy}https://github.com/login/oauth/access_token?${new URLSearchParams(
      {
        client_id: process.env.NUXT_ENV_GITHUB_CLIENT_ID as string,
        redirect_uri: process.env.NUXT_ENV_GITHUB_REDIRECT_URI as string,
        grant_type: 'refresh_token',
        refresh_token: token,
      }
    ).toString()}`,
    { method: 'POST' }
  )

  return (await response.json()) as RefreshTokenResponse
}

export const githubGetUserInfo = async (userId?: string) => {
  const response = await fetch(
    `https://api.github.com/user${userId ? `/${userId}` : ''}`,
    {
      headers: {
        Authorization: `token ${
          process.browser
            ? (localStorage.getItem(githubTokenStorageKey) as string)
            : ''
        }`,
      },
    }
  )

  return response.json()
}

export const githubSyncDashboardToGist = async (
  widgets?: Widget[],
  guid?: string,
  dashboardName?: string
) => {
  const githubToken = localStorage.getItem(githubTokenStorageKey) as string

  const response = await fetch(
    `https://api.github.com/gists${guid ? `/${guid}` : ''}`,
    {
      headers: {
        Authorization: `token ${process.browser ? githubToken : ''}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      method: guid ? 'PATCH' : 'POST',
      body: JSON.stringify({
        description: `Dashboard ${dashboardName} - available at https://dashboard.rabol.co/dashboards${
          guid ? `?gist=${guid}` : ''
        }`,
        public: true,
        files: {
          'dashboard.json': {
            content: `${JSON.stringify({
              name: dashboardName,
              widgets: widgets || [],
            })}`,
          },
        },
      }),
    }
  )

  return response.json()
}

export const githubRemoveDashboardGist = async (guid?: string) => {
  const githubToken = localStorage.getItem(githubTokenStorageKey) as string

  const response = await fetch(
    `https://api.github.com/gists${guid ? `/${guid}` : ''}`,
    {
      headers: {
        Authorization: `token ${process.browser ? githubToken : ''}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    }
  )

  return response
}

export const githubFetchDashboardWidgetsFromGist = async (guid?: string) => {
  const githubToken = localStorage.getItem(githubTokenStorageKey) as string

  const response = await fetch(
    `https://api.github.com/gists${guid ? `/${guid}` : ''}`,
    {
      headers: {
        Authorization: `token ${process.browser ? githubToken : ''}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }
  )

  return response.json()
}
