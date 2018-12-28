<template>
    <v-snackbar
      v-model="enabled"
      bottom
      left
      :color="$store.state.alert.color"
        @click="$store.commit('REMOVE_ALERT')"
      multi-line>
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
