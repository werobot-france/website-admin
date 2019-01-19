<template>
  <v-layout justify-center>
    <v-flex xs10 md8 lg6>
      <v-layout justify-center>
        <v-flex xs12 v-if="!isLoading">
          <v-text-field
            v-model="token"
            box
            label="Clé de l'api"
            type="text"
            color="blue"
          >
            <v-flex align-items slot="append-outer"
                    style="position:relative; top: -10px"
                    offset-y>
              <v-btn icon @click="getApiKey(token)">
                <v-icon>check_circle</v-icon>
              </v-btn>
            </v-flex>
          </v-text-field>
        </v-flex>
        <v-flex xs12 md6 v-else>
          <v-layout justify-center align-item align-center style="height:20em">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>
<script>
  export default {
    layout: 'center',
    data: () => ({
      token: '',
      isLoading: false
    }),
    mounted() {
      this.isLoading = true
      if (localStorage.getItem("haveBeenAuth")) {
        this.$apitator.setAuthorizationToken(localStorage["password"])
        this.$apitator.get('/auth/info', {withAuth: true}).then(() => {
          this.$router.push("/dashboard")
        }).catch(() => {
          this.$store.commit('ADD_ALERT', {color: 'error', text: 'Vous devez réentrer le mot de passe'})
        }).then(() => {
          this.isLoading = false
        })
      } else {
        if (localStorage.getItem("password") === null) {
          let url = new URL(window.location.href)
          if (url.searchParams.get("password") != null) {
            localStorage.setItem("password", url.searchParams.get("password"));
            this.verifyKey()
          } else {
            this.isLoading = false
          }
        } else {
          this.isLoading = false
        }
      }
    },
    methods: {
      getApiKey(key) {
        localStorage.setItem("password", key)
        this.verifyKey()
      },
      verifyKey() {
        this.isLoading = true
        this.$apitator.setAuthorizationToken(localStorage["password"])
        this.$apitator.get('/auth/info', {withAuth: true}).then(() => {
          localStorage.setItem("haveBeenAuth", true)
          this.isLoading = false
          this.$store.commit('ADD_ALERT', {
            color: 'success',
            text: 'Mot de passe enregistré !'
          })
          this.$router.push("/dashboard")
        }).catch(() => {
          localStorage.removeItem("password")
          this.isLoading = false
          this.$store.commit('ADD_ALERT', {
            color: 'error',
            text: "Vous ne passerez pas !"
          })
        })
      }
    }
  }
</script>
