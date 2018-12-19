export const state = () => ({
    alert: {
        enabled: false,
        text: '',
        color: ''
    }
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
    }
}