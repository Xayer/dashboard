const state = {
  online: true,
}

const getters = {
  online: (state: any) => state.online,
}

const actions = {}

const mutations = {
  SET_CONNECTION_STATUS: (state: any, online: boolean) => {
    state.online = online
  },
}

export default {
  state: () => state,
  actions,
  getters,
  mutations,
}
