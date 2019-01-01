export const state = () => ({
  alert: {
    enabled: false,
    text: '',
    color: ''
  },
  title: '',
  isLoading: false,
  loadingType: ''
})

export const mutations = {
  ADD_ALERT: function (state, payload) {
    state.alert = {
      enabled: true,
      text: payload.text,
      color: payload.color
    }
  },
  REMOVE_ALERT: function (state) {
    state.alert = {
      enabled: false,
      text: '',
      color: ''
    }
  },
  SET_TITLE: function (state, payload) {
    state.title = payload
  },
  SET_LOADING: function (state, payload) {
    state.isLoading = payload[0]
    state.loadingType = payload[1] === undefined ? 'normal' : payload[1]
  }
}
