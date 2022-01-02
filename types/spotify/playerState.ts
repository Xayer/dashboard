/* eslint-disable camelcase */

import { Album, Artist } from './topTracks'

export interface Device {
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number
}

export interface ExternalUrls {
  spotify: string
}

export interface Context {
  external_urls: ExternalUrls
  href: string
  type: string
  uri: string
}

export interface ExternalIds {
  isrc: string
}
export interface Disallows {
  resuming: boolean
}

export interface Actions {
  disallows: Disallows
}

export interface Item {
  album: Album
  artists?: Artist[] | null
  available_markets?: string[] | null
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIds
  external_urls: ExternalUrls
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}

export interface PlayerStateResponse {
  device: Device
  shuffle_state: boolean
  repeat_state: string
  timestamp: number
  context: Context
  progress_ms: number
  item: Item
  currently_playing_type: string
  actions: Actions
  is_playing: boolean
}
