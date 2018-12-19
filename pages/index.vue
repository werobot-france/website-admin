<template>
    <v-layout justify-center>
        <v-flex xs10 md8 lg6>
            <v-layout justify-center>
                <v-flex xs12>
                    <v-text-field
                        v-model="token"
                        box
                        label="Clé de l'api"
                        type="text"
                        color="blue"
                    >
                        <v-flex align-items slot="append-outer" 
              style="position:relative; top: -10px"
              offset-y><v-btn icon @click="getApiKey(token)"><v-icon>check_circle</v-icon></v-btn></v-flex>
                    </v-text-field>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>
<script>
export default {
    layout: 'center',
    data: () => ({
        token: ''
    }),
	mounted () {
		if (localStorage.getItem("haveBeenAuth")) {
			this.$router.push("/dashboard")
		}else {
			if (localStorage.getItem("password") === null) {
				var url_string = window.location.href
				var url = new URL(url_string)
				if (url.searchParams.get("password") != null){
					localStorage.setItem("password", url.searchParams.get("password"));
					this.verifyKey(localStorage.getItem("password"))
				}
			}
		}
	},
	methods: {
		getApiKey (key) {
			localStorage.setItem("password", key)
			this.verifyKey()			
		},
		verifyKey () {
            this.$apitator.setAuthorizationToken(localStorage["password"])
			this.$apitator.get('/auth/info', {withAuth: true}).then(() => {
				localStorage.setItem("haveBeenAuth", true)
				this.$router.push("/dashboard")
			}).catch(() => {
				alert("mové mdp, dsl, vous ne passseré pas!")
            })		
		}
	}
}
</script>