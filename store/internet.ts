export default {
  state: {
    online: true,
  },

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
