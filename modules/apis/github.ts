import { AccessTokenResponse } from '~/types/github/auth'

export const localStorageStateKey = 'github-state'

export const githubAuthorizationUrl = () => {
  if (process.browser) {
    const state = `${Date.now() * Date.now()}`
    localStorage.setItem(localStorageStateKey, state)

    return `https://github.com/login/oauth/authorize?${new URLSearchParams({
      client_id: process.env.NUXT_ENV_GITHUB_CLIENT_ID as string,
      redirect_uri: process.env.NUXT_ENV_GITHUB_REDIRECT_URI as string,
      state,
    }).toString()}`
  }
  return ''
}

export const githubGetAccessToken = async (code: string) => {
  const response = await fetch(
    `https://github.com/login/oauth/access_token?${new URLSearchParams({
      client_id: process.env.NUXT_ENV_GITHUB_CLIENT_ID as string,
      client_secret: process.env.NUXT_ENV_GITHUB_CLIENT_SECRET as string,
      redirect_uri: process.env.NUXT_ENV_GITHUB_REDIRECT_URI as string,
      code,
    }).toString()}`,
    { method: 'POST' }
  )
  return (await response.json()) as AccessTokenResponse
}
