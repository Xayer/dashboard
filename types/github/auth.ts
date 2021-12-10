/* eslint-disable camelcase */
export type AccessTokenResponse = {
  access_token: string
  scope: string
  token_type: 'bearer'
}

export type RefreshTokenResponse = {
  access_token: string
  expires_in: string
  refresh_token: string
  refresh_token_expires_in: string
  scope: string
  token_type: string
}
