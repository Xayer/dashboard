import querystring from 'querystring'
import { TopTimeRange } from '~/types/spotify/topTracks'

export const clientId = process.env.NUXT_ENV_SPOTIFY_CLIENT_ID
export const clientSecret = process.env.NUXT_ENV_SPOTIFY_CLIENT_SECRET
export const redirectUri = process.env.NUXT_ENV_SPOTIFY_REDIRECT_URI
export const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams(
  {
    client_id: clientId as string,
    response_type: 'code',
    redirect_uri: redirectUri as string,
    scope:
      'user-read-currently-playing user-top-read streaming user-read-playback-position user-read-recently-played app-remote-control user-read-playback-state user-modify-playback-state user-read-currently-playing',
  }
)}`

export const storageKey = 'spotify-refresh-token'
export const integrationActiveStorageKey = 'integration-spotify-active'

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`
const PLAYER_ENDPOINT = `https://api.spotify.com/v1/me/player`

export const authenticateToken = async (code: string) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  })
  return response.json()
}

export const getAccessToken = async () => {
  if (!process.browser) {
    return
  }
  const refreshToken = JSON.parse(localStorage.getItem(storageKey) as string)

  if (refreshToken === '') {
    localStorage.removeItem(storageKey)
    return
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  return response.json()
}

export const getTopTracks = async (timeRange: TopTimeRange) => {
  const { access_token: accessToken } = await getAccessToken()

  const response = await fetch(
    `${TOP_TRACKS_ENDPOINT}/?${new URLSearchParams({
      time_range: timeRange,
    }).toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  return response.json()
}

export const getPlaybackState = async () => {
  const { access_token: accessToken } = await getAccessToken()

  const response = await fetch(`${PLAYER_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.json()
}

export const pauseTrack = async () => {
  const { access_token: accessToken } = await getAccessToken()

  const response = await fetch(`${PLAYER_ENDPOINT}/pause`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'put',
  })

  return response
}

export const playTrack = async () => {
  const { access_token: accessToken } = await getAccessToken()

  const response = await fetch(`${PLAYER_ENDPOINT}/play`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'put',
  })

  return response
}
