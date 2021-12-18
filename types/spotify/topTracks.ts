/* eslint-disable camelcase */
export type TopTimeRange = 'short_term' | 'medium_term' | 'long_term'

export interface ExternalUrls {
  spotify: string
}

export interface Image {
  height: number
  url: string
  width: number
}

export interface ExternalIds {
  isrc: string
}

export interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  name: string
  type: string
  uri: string
}

export interface Album {
  album_type: string
  artists?: Artist[] | null
  available_markets?: string[] | null
  external_urls: ExternalUrls
  href: string
  id: string
  images?: Image[] | null
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}

export interface Track {
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

export interface TopTracksResponse {
  items?: Track[] | null
  total: number
  limit: number
  offset: number
  href: string
  previous?: null
  next: string
}
