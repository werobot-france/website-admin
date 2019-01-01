<template>
  <v-app dark>
    <v-content>
      <v-container ma-0 pa-0 fill-height full-width fluid>
          <v-layout>
              <nuxt />
          </v-layout>
      </v-container>
    </v-content>
    <GlobalSnackbar />
  </v-app>
</template>

<script>
  import GlobalSnackbar from "../components/GlobalSnackbar"
  export default {
    components: {GlobalSnackbar}
  }
</script>
