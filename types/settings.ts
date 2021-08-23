import { Board } from './dashboards'

export type BoardResponse = {
  name: string
  widgets: string
}

export type SettingKeyValue = {
  key: string
  value: string
}

export type SettingsResponse = {
  id: number
  name: string
  // eslint-disable-next-line camelcase
  avatar_urls: {
    24: string
    48: string
    96: string
  }
  meta: {
    settings: {
      boards: BoardResponse[]
      settings: SettingKeyValue[]
    }
  }
}

export type UserSettings = {
  boards: Board[]
  settings: SettingKeyValue[]
}

export type UserInfo = {
  id?: number
  name?: string
  avatar?: string
}
