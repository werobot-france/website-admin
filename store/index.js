export const state = () => ({
  alert: {
    enabled: false,
    location: 'global',
    text: '',
    color: ''
  },
  title: '',
  isLoading: false,
  loadingType: '',
  galleryState: false,
  galleryHasFinished: false,
  galleryPayload: '',
  galleryFromPost: false
})

export const mutations = {
  SET_GALLERY_STATE: function (state, payload) {
    state.galleryState = payload
    state.galleryFromPost = true
  },
  SET_GALLERY_FINISHED: function (state, payload) {
    state.galleryHasFinished = payload
  },
  SET_GALLERY_PAYLOAD: function (state, payload) {
    state.galleryPayload = payload
  },
  ADD_ALERT: function (state, payload) {
    state.alert = {
      enabled: true,
      text: payload.text,
      color: payload.color,
      location: payload.location === undefined ? 'global' : payload.location
    }
  },
  REMOVE_ALERT: function (state) {
    state.alert = {
      enabled: false,
      text: '',
      color: '',
      location: 'global'
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
