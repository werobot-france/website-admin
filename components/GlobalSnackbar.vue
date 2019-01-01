<template>
  <v-snackbar
    :right="true"
    :bottom="true"
    :top="false"
    :color="$store.state.alert.color"
    :multi-line="true"
    v-if="$store.state.alert.location === 'global'"
    v-model="enabled"
  >
    {{ $store.state.alert.text }}
    <v-layout justify-end>
      <v-btn flat class="px-2" @click="$store.commit('REMOVE_ALERT')">Fermer</v-btn>
    </v-layout>
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
