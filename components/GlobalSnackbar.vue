<template>
  <v-snackbar
    v-model="enabled"
    :color="$store.state.alert.color"
    right
    bottom
    @click="$store.commit('REMOVE_ALERT')">
    {{ $store.state.alert.text }}
  </v-snackbar>
</template>

<script>
  export default {
    data: () => ({
      enabled: false
    }),
    watch: {
      '$store.state.alert.enabled': function (value) {
        this.enabled = value
      }
    }
  }
</script>
