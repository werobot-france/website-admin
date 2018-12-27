<template>
    <v-snackbar
      v-model="enabled"
      bottom
      right
      :color="$store.state.alert.color"
      multi-line>
       {{ $store.state.alert.text }}
      <v-btn
        dark
        flat
        @click="$store.commit('REMOVE_ALERT')"
      >
        Close
      </v-btn>
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
