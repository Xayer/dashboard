import axios, { AxiosResponse } from 'axios'
import { Commit, Dispatch } from 'vuex'
import {
  jwtTokenStorageKey,
  jwtValidateEndpoint,
  jwtTokenEndpoint,
  settingsEndpoint,
  jwtInvalidateEndpoint,
  menuShownStorageKey,
  userInfoStorageKey,
  jwtBaseEndpoint,
} from '@/constants/login'
import { SettingsResponse, UserSettings, UserInfo } from '@/types/settings'
import { storageKey as spotifyStorageKey } from '@/modules/apis/spotify'
import { todosStorageKey } from '@/constants/todo'
import { themeStorageKey } from '~/constants/themes'
import { dasboardsLocalStorageKey } from '~/constants/dashboard'
import { Board } from '~/types/dashboards'

type StateType = {
  isAuthenticated: boolean
  userSettings: UserSettings
  userInfo: UserInfo
}

const updateUserInfo = (userInfo: UserInfo) => {
  let avatar = ''
  if (userInfo.avatar) {
    const removeUrlParams = /\?.*/g
    avatar = userInfo.avatar.replace(removeUrlParams, '')
  }

  return {
    ...userInfo,
    avatar,
  }
}

const SettingsState: StateType = {
  isAuthenticated: false,
  userInfo: {
    id: undefined,
    name: undefined,
    avatar: undefined,
  },
  userSettings: {
    boards: [],
    settings: [],
  },
}

const SettingsGetters = {
  isAuthenticated: (state: StateType) => state.isAuthenticated,
  user: (state: StateType) => state.userInfo,
  avatar: ({ userInfo: { avatar } }: StateType) => avatar,
  boards: ({ userSettings: { boards } }: StateType) => boards,
  settings: () => ({
    boards: [
      {
        name: 'Dashboard',
        widgets: JSON.parse(
          localStorage.getItem(dasboardsLocalStorageKey) || JSON.stringify([])
        ),
      },
    ],
    settings: [
      {
        key: menuShownStorageKey,
        value: JSON.parse(localStorage.getItem(menuShownStorageKey) || 'true'),
      },
      {
        key: themeStorageKey,
        value: JSON.parse(localStorage.getItem(themeStorageKey) || ''),
      },
      {
        key: spotifyStorageKey,
        value: JSON.parse(localStorage.getItem(spotifyStorageKey) || ''),
      },
    ],
  }),
}

const actions = {
  validate: ({ commit }: { commit: Commit }) => {
    if (!process.browser) {
      return null
    }

    if (localStorage.getItem(jwtTokenStorageKey)) {
      const token = localStorage.getItem(jwtTokenStorageKey)
      axios
        .post(
          jwtValidateEndpoint,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          commit('SET_IS_AUTHENTICATED', true)
        })
        .catch(() => {
          commit('SET_IS_AUTHENTICATED', false)
          localStorage.removeItem(jwtTokenStorageKey)
        })
    } else {
      commit('SET_IS_AUTHENTICATED', false)
      localStorage.removeItem(jwtTokenStorageKey)
    }
  },
  loadExistingSettings: async ({ commit }: { commit: Commit }) => {
    if (!process.browser) {
      return
    }

    const settings = {
      boards: JSON.parse(
        localStorage.getItem(dasboardsLocalStorageKey) || JSON.stringify([])
      ),
      settings: [
        {
          key: menuShownStorageKey,
          value: JSON.parse(
            localStorage.getItem(menuShownStorageKey) || JSON.stringify(true)
          ),
        },
        {
          key: themeStorageKey,
          value: JSON.parse(
            localStorage.getItem(themeStorageKey) || JSON.stringify('light')
          ),
        },
        {
          key: spotifyStorageKey,
          value: JSON.parse(localStorage.getItem(spotifyStorageKey) || '""'),
        },
        {
          key: todosStorageKey,
          value: JSON.parse(
            localStorage.getItem(todosStorageKey) || JSON.stringify([])
          ),
        },
      ],
    }

    await commit('LOAD_SETTINGS', {
      settings,
    })

    const userData = JSON.parse(
      localStorage.getItem(userInfoStorageKey) as string
    )
    if (userData) {
      await commit('SET_USER_DATA', userData)
    }
  },
  authenticate: async (
    { commit }: { commit: Commit },
    { username, password }: { username: string; password: string }
  ) => {
    if (!jwtBaseEndpoint) {
      alert(`NUXT_ENV_SETTINGS_ENDPOINT is not set`)
      return
    }
    const formdata = new FormData()
    formdata.append('username', username)
    formdata.append('password', password)
    await axios.post(jwtTokenEndpoint, formdata).then((response) => {
      const {
        data: { token },
      } = response
      localStorage.setItem(jwtTokenStorageKey, token)
      commit('SET_IS_AUTHENTICATED', true)
    })
  },
  signOut: ({ commit }: { commit: Commit }) => {
    if (localStorage.getItem(jwtTokenStorageKey)) {
      const token = localStorage.getItem(jwtTokenStorageKey)
      axios.delete(jwtInvalidateEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }
    commit('SET_IS_AUTHENTICATED', false)
    localStorage.removeItem(jwtTokenStorageKey)
    localStorage.removeItem(userInfoStorageKey)
  },
  download: async ({
    commit,
    dispatch,
  }: {
    commit: Commit
    dispatch: Dispatch
  }) => {
    await dispatch('fetch').then(
      async ({
        data: {
          meta: { settings },
          id,
          name,
          // eslint-disable-next-line camelcase
          avatar_urls,
        },
      }: AxiosResponse<SettingsResponse>) => {
        await commit('SET_SETTINGS', settings)
        await commit('SET_USER_DATA', { id, name, avatar: avatar_urls['48'] })
      }
    )
  },
  fetch: (): Promise<AxiosResponse<SettingsResponse>> =>
    axios.get(settingsEndpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(jwtTokenStorageKey)}`,
      },
    }),
  upload: async ({
    commit,
    dispatch,
  }: {
    commit: Commit
    dispatch: Dispatch
  }) => {
    let existingSettings = {}
    dispatch('fetch').then((response: AxiosResponse<SettingsResponse>) => {
      const { settings } = response.data.meta
      existingSettings = settings
    })

    const localSettings = {
      boards: JSON.parse(
        localStorage.getItem(dasboardsLocalStorageKey) ||
          JSON.stringify([
            {
              name: 'Dasboard',
              widgets: [],
            },
          ])
      ),
      settings: [
        {
          key: menuShownStorageKey,
          value: JSON.parse(
            localStorage.getItem(menuShownStorageKey) || 'true'
          ),
        },
        {
          key: themeStorageKey,
          value: JSON.parse(localStorage.getItem(themeStorageKey) || 'true'),
        },
        {
          key: spotifyStorageKey,
          value: JSON.parse(localStorage.getItem(spotifyStorageKey) || '""'),
        },
        {
          key: todosStorageKey,
          value: JSON.parse(
            localStorage.getItem(todosStorageKey) || JSON.stringify([])
          ),
        },
      ],
    }

    await axios
      .post(
        settingsEndpoint,
        {
          meta: {
            settings: {
              ...existingSettings,
              ...localSettings,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(jwtTokenStorageKey)}`,
          },
        }
      )
      .then(
        async ({
          data: {
            meta: { settings },
            id,
            name,
            // eslint-disable-next-line camelcase
            avatar_urls,
          },
        }: AxiosResponse<SettingsResponse>) => {
          await commit('SET_SETTINGS', settings)
          await commit('SET_USER_DATA', { id, name, avatar: avatar_urls['48'] })
        }
      )
      .catch((response) => {
        console.error(response)
      })
  },
}

const mutations = {
  SET_IS_AUTHENTICATED: (state: StateType, isAuthenticated: boolean) => {
    state.isAuthenticated = isAuthenticated
  },
  SET_USER_DATA: (state: StateType, userInfo?: UserInfo) => {
    if (!userInfo) {
      return
    }
    const formattedUserInfo = updateUserInfo(userInfo)
    state.userInfo = formattedUserInfo
    localStorage.setItem(userInfoStorageKey, JSON.stringify(formattedUserInfo))
  },
  LOAD_SETTINGS: (
    state: StateType,
    { settings: newSettings }: { settings: UserSettings }
  ) => {
    const { boards, settings } = newSettings
    state.userSettings.boards = boards

    state.userSettings.settings = settings
  },
  SET_SETTINGS: (_state: StateType, newSettings: UserSettings) => {
    const { boards, settings } = newSettings

    localStorage.setItem(dasboardsLocalStorageKey, JSON.stringify(boards))

    settings.forEach(({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value))
    })
  },
  CREATE_NEW_DASHBOARD: (_state: StateType) => {
    const existingBoards: Board[] = [
      ...JSON.parse(
        localStorage.getItem(dasboardsLocalStorageKey) || JSON.stringify([])
      ),
    ]

    existingBoards.push({
      name: `Dashboard #${existingBoards.length}`,
      widgets: [],
    })

    localStorage.setItem(
      dasboardsLocalStorageKey,
      JSON.stringify(existingBoards)
    )
  },
  REMOVE_DASHBOARD: (_state: StateType, dashboardIndex: number) => {
    const existingBoards: Board[] = [
      ...JSON.parse(
        localStorage.getItem(dasboardsLocalStorageKey) || JSON.stringify([])
      ),
    ]

    if (!existingBoards[dashboardIndex]) {
      return
    }

    existingBoards.splice(dashboardIndex, 1)

    localStorage.setItem(
      dasboardsLocalStorageKey,
      JSON.stringify(existingBoards)
    )
  },
}

export default {
  state: () => SettingsState,
  getters: SettingsGetters,
  actions,
  mutations,
}
