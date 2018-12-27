<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      fixed
      app
    >
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title>{{ $store.state.title }}</v-toolbar-title>
      <v-spacer />
      <v-menu bottom left offset-y>
        <v-btn
          slot="activator"
          icon
        >
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            @click="$refs.uploader.open()">
            <v-list-tile-action>
              <v-icon>add_photo_alternate</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Upload photo</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            @click="logout()">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt v-show="!$store.state.isLoading" />
        <v-layout justify-center align-item style="height:20em" v-show="$store.state.isLoading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-layout>
      </v-container>
    </v-content>
    <GlobalSnackbar />
    <ImageUploader ref="uploader" />
  </v-app>
</template>

<script>
  import GlobalSnackbar from '../components/GlobalSnackbar'
  import ImageUploader from '../components/ImageUploader'
  export default {
    components: {
      GlobalSnackbar,
      ImageUploader
    },
    head() {
        return {
          title: this.$store.state.title + ' | WeRobot'
        }
    },
    mounted() {
      this.$apitator.setGlobalCallbackOnLoading(value => {
        this.$store.commit('SET_LOADING', value)
      })
      if (localStorage.getItem('haveBeenAuth') && localStorage.getItem('password') != null) {
        this.$apitator.setAuthorizationToken(localStorage['password'])
      }
    },
    data() {
      return {
        uploadPhotoDialog: false,
        drawer: null,
        items: [
          { icon: 'apps', title: 'Dashboard', to: '/dashboard' },
          { icon: 'messages', title: 'Messages', to: '/messages' },
          { icon: 'library_books', title: 'Blog', to: '/blog' }
        ]
      }
    }
  }
</script>
