import { Commit, Dispatch } from 'vuex'
import HueAPI from '@/modules/apis/hue'
import { Devices } from '@/types/hue'
import { hueBridgeAddressStorageKey } from '~/constants/hue'

const state = {
  devices: {},
  available: false,
  instance: false,
  token: null,
  callingDevices: false,
}

const getters = {
  hueAdress: () => localStorage.getItem(hueBridgeAddressStorageKey),
  devices: (state: any) => state.devices,
  token: (state: any) => state.token,
  available: (state: any) => state.available,
  instance: (state: any) => state.instance,
}

const actions = {
  loadSettings: ({
    commit,
    dispatch,
  }: {
    commit: Commit
    dispatch: Dispatch
  }) => {
    if (!process.browser) {
      return
    }
    const address = localStorage.getItem(hueBridgeAddressStorageKey)
    if (address) {
      commit('SET_BRIDGE_ADDRESS', address)
      commit('REFRESH_TOKEN')
      dispatch('getDevices')
    }
  },
  getDevices: ({
    commit,
    rootGetters,
    state,
  }: {
    commit: Commit
    dispatch: Dispatch
    rootGetters: any
    state: any
  }) =>
    new Promise((resolve, reject) => {
      if (state.callingDevices) {
        return
      }
      commit('SET_CALLING_DEVICES', true)

      if (!rootGetters['hue/instance']) {
        commit('SET_AVAILABILITY', false)
        commit('SET_DEVICES', [])
        commit('SET_CALLING_DEVICES', false)
        reject(new Error('instance not available'))
      }
      try {
        rootGetters['hue/instance']
          .getDevices()
          .then((value: unknown) => {
            commit('SET_AVAILABILITY', true)
            commit('SET_DEVICES', value)
            commit('REFRESH_TOKEN')
            resolve('success')
          })
          .catch((error: Error) => {
            if (error.message === 'Network Error') {
              commit('SET_AVAILABILITY', false)
              commit('REFRESH_TOKEN')
              commit('SET_DEVICES', [])
            }
            reject(error)
          })
      } catch (error) {
        commit('SET_AVAILABILITY', false)
        commit('REFRESH_TOKEN')
        commit('SET_DEVICES', [])
        reject(error)
      }
      commit('SET_CALLING_DEVICES', false)
    }),
  registerToken: ({
    commit,
    rootGetters,
  }: {
    commit: any
    dispatch: any
    rootGetters: any
  }) =>
    rootGetters['hue/instance'].registerToken().then(() => {
      commit('REFRESH_TOKEN')
    }),
  toggleLight: (
    { dispatch, rootGetters }: { commit: any; dispatch: any; rootGetters: any },
    {
      uniqueId,
      on,
      colour,
    }: { uniqueId: string; on: boolean; colour?: Array<number> }
  ) =>
    rootGetters['hue/instance'].toggleLight(uniqueId, on, colour).then(() => {
      dispatch('getDevices')
    }),
  turnLightOn: (
    { rootGetters }: { commit: any; dispatch: any; rootGetters: any },
    uniqueId: string
  ) => rootGetters['hue/instance'].lightOn(uniqueId),
  turnLightOff: (
    { rootGetters }: { commit: any; dispatch: any; rootGetters: any },
    uniqueId: string
  ) => rootGetters['hue/instance'].lightOff(uniqueId),
}

const mutations = {
  SET_BRIDGE_ADDRESS: (state: any, address: string) => {
    state.instance = new HueAPI(address)
    localStorage.setItem(hueBridgeAddressStorageKey, address)
  },
  SET_DEVICES: (state: any, devices: any) => {
    state.devices = devices
  },
  REFRESH_TOKEN: (state: any) => {
    let token = null
    if (state.instance) {
      const tempToken = state.instance.findExistingToken()
      if (tempToken) {
        token = tempToken
      }
    }
    state.token = token
  },
  SET_AVAILABILITY: (state: any, available: boolean) => {
    state.available = available
  },
  SET_CALLING_DEVICES: (state: any, calling: boolean) => {
    state.callingDevices = calling
  },
}

export default {
  actions,
  state: () => state,
  getters,
  mutations,
}
