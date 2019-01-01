<template>
  <div>
    <v-dialog v-model="enabled" max-width="500px">
      <v-card>
        <v-card-title>
          Gallerie d'image
        </v-card-title>
        <v-card-text class="pt-0">
          <div class="text-xs-center mb-2" v-if="images.length > 0">
            <v-pagination
              v-model="currentPage"
              :length="totalPage"
              :total-visible="7"
            ></v-pagination>
          </div>
          <v-layout v-if="$store.state.isLoading && $store.state.loadingType === 'gallery'" justify-center align-center
                    style="height: 16em;">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-layout>
          <v-layout v-if="images.length === 0 && !$store.state.isLoading" justify-center align-center
                    style="height: 16em;">
            <span style="opacity: 0.8">Pas d'images disponible</span>
          </v-layout>
          <v-container grid-list-sm fluid pb-2 v-if="!$store.state.isLoading && images.length > 0">
            <v-layout row wrap>
              <v-flex
                v-for="image in images"
                :key="image.id"
                xs4
                d-flex
              >
                <v-card flat tile class="d-flex">
                  <v-img
                    @click="copyAndFinish(image)"
                    style="cursor: pointer"
                    :src="image.url"
                    :lazy-src="image.url"
                    aspect-ratio="1"
                    class="grey lighten-2"
                  >
                    <v-layout
                      slot="placeholder"
                      fill-height
                      align-center
                      justify-center
                      ma-0
                    >
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                  </v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn flat color="error" @click="enabled = false">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ImageNavigation',
    data: () => ({
      enabled: false,
      currentPage: 1,
      totalPage: 0,
      perPage: 9,
      images: [],
      imagePublicPath: ''
    }),
    methods: {
      open: function () {
        this.fetchPhotos()
        this.enabled = true
      },
      fetchPhotos: function () {
        this.$apitator.get('/image?page=' + this.currentPage + '&per_page=' + this.perPage, {
          withAuth: true,
          loadingType: 'gallery'
        }).then(response => {
          this.imagePublicPath = response.data.data.image_public_path
          this.totalPage = response.data.data.pagination.total_page
          this.images = response.data.data.images
          this.images.map(image => {
            image.url = this.imagePublicPath + '/' + image.id + '/25.' + image.extension
            return image
          })
        })
      },
      copyAndFinish: function (image) {
        this.$clipboard(image.url.replace('/25.', '/50.'))
        this.enabled = false
        this.$store.commit('ADD_ALERT', {
          color: 'success',
          text: 'Copié dans le presse papier!'
        })
      }
    },
    watch: {
      'currentPage': function () {
        this.fetchPhotos()
      }
    }
  }
</script>
