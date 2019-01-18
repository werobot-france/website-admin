<template>
  <div>
    <v-dialog v-model="enabled" max-width="500px">
      <v-card>
        <v-card-title>
          Galerie d'image
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
                  <v-menu absolute>
                    <v-img
                      slot="activator"
                      style="cursor: pointer"
                      :src="image.small"
                      :lazy-src="image.small"
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
                    <v-list>
                      <v-list-tile
                        @click="finish(image)"
                      >
                        <v-list-tile-title>Use</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile
                        @click="openViewDialog(image)"
                      >
                        <v-list-tile-title>Open</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile
                        @click="openDeleteDialog(image)"
                      >
                        <v-list-tile-title>Delete</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
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
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Voulez vous vraiment supprimer cette image ? (#{{ toDeleteImage.id }})</v-card-title>
        <v-card-actions>
          <v-btn flat @click="deleteDialog = false" color="success">
            Non
          </v-btn>
          <v-spacer />
          <v-btn flat @click="destroy()" color="error" :loading="$store.state.isLoading && $store.state.loadingType === 'button'">
            Oui, supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ toViewImage.caption }} (#{{ toViewImage.id }})</v-card-title>
        <v-card-text>
          <v-img
            slot="activator"
            style="cursor: pointer"
            :src="toViewImage.large"
            :lazy-src="toViewImage.large"
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
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat @click="viewDialog = false" color="primary">
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
      imagePublicPath: '',
      deleteDialog: false,
      toDeleteImage: {},
      viewDialog: false,
      toViewImage: {}
    }),
    methods: {
      openDeleteDialog: function (image) {
        this.deleteDialog = true
        this.toDeleteImage = image
      },
      openViewDialog: function (image) {
        this.viewDialog = true
        this.toViewImage = image
      },
      open: function () {
        this.fetchPhotos()
        this.enabled = true
      },
      close: function () {
        this.enabled = false
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
            image.small = this.imagePublicPath + '/' + image.id + '/25.' + image.extension
            image.medium = this.imagePublicPath + '/' + image.id + '/50.' + image.extension
            image.large = this.imagePublicPath + '/' + image.id + '/75.' + image.extension
            return image
          })
        })
      },
      finish: function (image) {
        this.enabled = false
        if (this.$store.state.galleryFromPost === false) {
          this.$clipboard(image.medium)
          this.$store.commit('ADD_ALERT', {
            color: 'success',
            text: 'Copié dans le presse papier!'
          })
        } else {
          this.$store.commit('SET_GALLERY_FINISHED', true)
          this.$store.commit('SET_GALLERY_STATE', false)
          this.$store.commit('SET_GALLERY_PAYLOAD', image.medium)
        }
      },
      destroy: function () {
        this.$apitator.delete('/image/' + this.toDeleteImage.id, {withAuth: true, loadingType: 'button'}).then(() => {
          this.deleteDialog = false
          this.toDeleteImage = {}
          this.fetchPhotos()
          this.$store.commit('ADD_ALERT', {
            color: 'success',
            text: 'Image supprimé!'
          })
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
