<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      absolute
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
            @click="$refs.gallery.open()">
            <v-list-tile-action>
              <v-icon>insert_photo</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Gallerie</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            @click="logout()">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Se déconnecter</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt v-show="!($store.state.isLoading && $store.state.loadingType === 'normal')" />
        <v-layout justify-center align-item align-center style="height:20em" v-show="$store.state.isLoading && $store.state.loadingType === 'normal'">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-layout>
      </v-container>
    </v-content>
    <GlobalSnackbar />
    <ImageNavigation ref="gallery" />
  </v-app>
</template>

<script>
  import GlobalSnackbar from '../components/GlobalSnackbar'
  import ImageNavigation from '../components/ImageNavigation'
  export default {
    components: {
      GlobalSnackbar,
      ImageNavigation
    },
    head() {
        return {
          title: this.$store.state.title + ' | WeRobot'
        }
    },
    mounted() {
      this.$apitator.setGlobalCallbackOnLoading((value, type) => {
        this.$store.commit('SET_LOADING', [value, type])
      })
      if (localStorage.getItem('haveBeenAuth') && localStorage.getItem('password') != null) {
        this.$apitator.setAuthorizationToken(localStorage['password'])
      }
    },
    watch: {
      '$store.state.galleryState': function (value) {
        if (value) {
          this.$refs.gallery.open()
        } else {
          this.$refs.gallery.close()
        }
      }
    },
    data() {
      return {
        uploadPhotoDialog: false,
        drawer: null,
        items: [
          { icon: 'apps', title: 'Dashboard', to: '/dashboard' },
          { icon: 'messages', title: 'Messages', to: '/messages' },
          { icon: 'library_books', title: 'Blog', to: '/blog' },
          { icon: 'add_photo_alternate', title: 'Importer des images', to: '/import-images' }
        ]
      }
    },
    methods: {
      logout() {
        localStorage.removeItem('haveBeenAuth')
        localStorage.removeItem('password')
        this.$store.commit('ADD_ALERT', {
          color: 'success',
          text: 'Vous vous êtes déconnecté'
        })
        this.$router.push('/')
      }
    }
  }
</script>
