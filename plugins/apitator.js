import Apitator from 'vue-apitator'
import Vue from 'vue'

Vue.use(Apitator, {
  baseUrl: process.env.apiEndpoint || 'http://localhost:8000',
  defaultToken: localStorage['password'] || ''
})
