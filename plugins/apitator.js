import Apitator from 'vue-apitator'
import Vue from 'vue'

Vue.use(Apitator, {
  baseUrl: process.env.API_ENDPOINT === undefined || process.env.API_ENDPOINT === null ? 'http://localhost:8000' : process.env.API_ENDPOINT,
  defaultToken: localStorage['password'] !== null ? localStorage['password'] : ''
})
