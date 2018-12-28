import Apitator from 'vue-apitator'
import Vue from 'vue'

Vue.use(Apitator, {
    baseUrl: 'https://api-dev.werobot.fr',
    defaultToken: localStorage['password'] !== null ? localStorage['password'] : '' 
})