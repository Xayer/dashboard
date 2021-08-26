import { Commit, Dispatch } from 'vuex'
import { themeStorageKey } from '@/constants/themes'
import { Theme } from '~/types/themes'

interface State {
  theme: string
  themes: Theme[]
}

export default {
  state: () =>
    ({
      theme: 'light',
      themes: [
        {
          name: 'dark',
          icon: 'moon',
          variables: {
            '--accent-0': '#1D2733',
            '--text-color': 'var(--white)',
            '--accent-50': '#212d3b',
            '--accent-100': '#273243',
          },
        },
        { name: 'light', icon: 'sun' },
        {
          name: 'red',
          icon: 'star',
          variables: {
            '--accent-0': '#475c7a',
            '--text-color': 'var(--white)',
            '--accent-50': '#685d79',
          },
        },
        {
          name: 'green',
          icon: 'tree',
          variables: {
            '--accent-0': '#305f72',
            '--text-color': 'var(--white)',
            '--accent-50': '#568ea6',
          },
        },
        {
          name: 'tornado',
          icon: 'tornado',
          variables: {
            '--accent-0': '#292929',
            '--primary': '#c0184d',
            '--secondary': '#5a9f9e',
            '--text-color': 'var(--white)',
            '--accent-50': '#232323',
            '--success': 'var(--primary)',
          },
        },
      ],
    } as State),

  getters: {
    theme: (state: State) => state.theme,
    themeIcon: (state: State) => {
      const foundTheme = state.themes.find(
        (theme) => theme.name === state.theme
      )
      return foundTheme ? foundTheme.icon : ''
    },
    themes: (state: State) => state.themes,
  },

  actions: {
    setTheme: ({ commit }: { commit: Commit }, theme: string) => {
      commit('SET_THEME', theme)
    },
    loadTheme: ({ dispatch }: { dispatch: Dispatch }) => {
      if (!process.browser) {
        return null
      }
      const localTheme = localStorage.getItem(themeStorageKey)
      let theme: string | null = localTheme ? JSON.parse(localTheme) : null
      if (
        theme === null &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        theme = 'dark'
      }
      if (theme === null) {
        theme = 'light'
      }
      dispatch('setTheme', theme)
    },
  },

  mutations: {
    SET_THEME: (state: State, theme: string) => {
      state.theme = theme
      localStorage.setItem(themeStorageKey, JSON.stringify(theme))
    },
  },
}
