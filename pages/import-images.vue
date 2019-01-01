<template>
  <div>
    <v-card class="mb-4">
      <v-card-title>
        Importer une/des image(s) depuis votre ordinateur
      </v-card-title>
      <v-card-text class="pt-0">
        <div>
          <input
            type="file"
            v-show="false"
            ref="fileInput"
            multiple
            accept="image/*"
            @change="onFilePicked"
          >
          <v-layout justify-center column>
            <v-flex xs12>
              <div class="text-xs-center">
                <v-btn color="primary" @click="pickFile()">
                  <v-icon left>
                    cloud_upload
                  </v-icon>
                  Choisir
                </v-btn>
              </div>
              <v-list v-if="images.length > 0" subheader>
                <v-subheader>{{ images.length }} image(s) chargée(s)</v-subheader>
                <v-divider />
                <template v-for="(image, index) in images">
                  <v-list-tile :key="image.name">
                    <v-list-tile-content>
                      {{ image.name }}
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn v-if="isLoading === false && imageCursor === false" color="error" small flat icon @click="removeImage(image)">
                        <v-icon>remove_circle</v-icon>
                      </v-btn>
                      <v-btn v-if="(isLoading === true && imageCursor > index) || (imageCursor === images.length - 1 && isLoading === false)" color="success" small flat icon>
                        <v-icon>check_circle</v-icon>
                      </v-btn>
                      <v-btn v-if="isLoading === true && way === 'local' && imageCursor === index" color="info" small flat icon loading></v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider :key="image.name + '_divider'" />
                </template>
              </v-list>
            </v-flex>
          </v-layout>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn flat color="success" @click="save()" :disabled="isLoading || images.length === 0 || imageCursor === images.length - 1">
          Importer
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card>
      <v-card-title>Importer depuis une url</v-card-title>
      <v-card-text>
        <v-text-field v-model="url" label="Url de l'image" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn flat color="success" @click="save()" :disabled="isLoading && way === 'local' || this.url === ''" :loading="isLoading && way === 'url'">
          Importer
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  export default {
    data: () => ({
      url: '',
      image: {
        name: '',
        file: null,
        url: ''
      },
      isLoading: false,
      way: '',
      images: [],
      imageCursor: false
    }),
    created () {
      this.$store.commit('SET_TITLE', 'Importer des images')
    },
    methods: {
      open: function () {
        this.enabled = true
      },
      pickFile: function () {
        this.$refs.fileInput.click()
      },
      onFilePicked: function (e) {
        // add to existing images
        if (this.imageCursor === this.images.length -1) {
          this.images = []
        }
        this.imageCursor = false
        const files = e.target.files
        for (let i = 0; i < files.length; i++) {
          if (files.item(i).type.split('/')[0] === 'image') {
            this.images.push(files.item(i))
          } else {
            this.$store.commit('ADD_ALERT', {
              color: 'error',
              text: "Seul les images sont acceptés"
            })
          }
        }
      },
      removeImage: function (image) {
        this.images = this.images.filter(_i => _i !== image)
      },
      save: function () {
        this.imageCursor = 0
        this.way = this.url === '' ? 'local' : 'url'
        this.isLoading = true
        if (this.way === 'local') {
          this.newTic()
        }
        if (this.way === 'url') {
          this.doRequest({image: this.url}).then(() => {
            this.isLoading = false
            this.url = ''
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: "File uploaded successfuly"
            })
          })
        }
      },
      newTic: function () {
        console.log('> new tic')
        console.log(this.imageCursor)
        console.log(this.images[this.imageCursor])
        this.images[this.imageCursor].isLoading = true
        let data = new FormData();
        data.append('image', this.images[this.imageCursor]);
        this.doRequest(data).then(() => {
          this.images[this.imageCursor].isLoading = false
          this.images[this.imageCursor].done = true
          console.log(this.images[this.imageCursor])
          if ((this.imageCursor + 1) === this.images.length) {
            this.isLoading = false
            this.$store.commit('ADD_ALERT', {
              color: 'success',
              text: "File(s) uploaded successfuly"
            })
          } else {
            this.imageCursor = this.imageCursor + 1
            this.newTic()
          }
        })
      },
      doRequest: function (data) {
        return new Promise((resolve, reject) => {
          this.$apitator.post('/image-upload', data, {withAuth: true, loadingType: 'special'}).then(response => {
            resolve(response)
          }).catch(error => {
            reject(error)
            this.$store.commit('ADD_ALERT', {
              color: 'error',
              text: "Erreur pendant l'upload"
            })
          })
        })
      }
    },
    watch: {
      'imageCursor': (value) => {
        console.log(value)
      }
    },
  }
</script>
