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
import { widgetsLocalStorageKey } from '@/constants/widgets'
import { SettingsResponse, UserSettings, UserInfo } from '@/types/settings'
import { storageKey as spotifyStorageKey } from '@/modules/apis/spotify'
import { todosStorageKey } from '@/constants/todo'
import { themeStorageKey } from '~/constants/themes'
import { dasboardsLocalStorageKey } from '~/constants/dashboard'

type StateType = {
  isAuthenticated: boolean
  userSettings: UserSettings
  userInfo: UserInfo
}

const SettingsState: StateType = {
  isAuthenticated: false,
  userInfo: {
    id: undefined,
    name: undefined,
  },
  userSettings: {
    boards: [],
    settings: [],
  },
}

const SettingsGetters = {
  isAuthenticated: (state: StateType) => state.isAuthenticated,
  user: (state: StateType) => state.userInfo,
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
  loadExistingSettings: ({ commit }: { commit: Commit }) => {
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
            localStorage.getItem(menuShownStorageKey) || '"true"'
          ),
        },
        {
          key: themeStorageKey,
          value: JSON.parse(localStorage.getItem(themeStorageKey) || '"true"'),
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

    commit('LOAD_SETTINGS', settings)
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
        },
      }: AxiosResponse<SettingsResponse>) => {
        await commit('SET_SETTINGS', settings)
        await commit('SET_USER_DATA', { id, name })
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
        ({
          data: {
            meta: { settings },
            id,
            name,
          },
        }: AxiosResponse<SettingsResponse>) => {
          commit('SET_SETTINGS', settings)
          commit('SET_USER_DATA', { id, name })
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
  SET_USER_DATA: (state: StateType, userInfo: UserInfo) => {
    state.userInfo = userInfo
    localStorage.setItem(userInfoStorageKey, JSON.stringify(userInfo))
  },
  LOAD_SETTINGS: (state: StateType, newSettings: UserSettings) => {
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
}

export default {
  state: () => SettingsState,
  getters: SettingsGetters,
  actions,
  mutations,
}
