const state = {
  online: true,
}

export default {
  state: () => state,

  getters: {
    online: (state: any) => state.online,
  },

  actions: {},

  mutations: {
    SET_CONNECTION_STATUS: (state: any, online: boolean) => {
      state.online = online
    },
  },
}
