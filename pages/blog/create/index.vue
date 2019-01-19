<template>
  <div>
    <v-layout wrap row width="100%">
      <v-flex xs3>
        <v-select
          :items="locales"
          label="Langue"
          solo
          prepend-icon="flag"
          v-model="post.locale"
        ></v-select>
      </v-flex>
      <v-flex xs12 row wrap>
        <v-text-field v-model="post.title" label="Titre" width="70px">
        </v-text-field>
      </v-flex>
      <v-flex md6 xs12>
        <v-layout style="height: 300px;" justify-center align-items align-center v-if="post.image === ''">
          <v-btn @click="changeThumbnail()" color="primary" ouline><v-icon left>insert_photo</v-icon> Image principale</v-btn>
        </v-layout>
        <div v-else>
          <v-img :src="post.image" class="thumbnails" height="300px" ></v-img>
        </div>
        <!--<v-dialog ref="dialog" v-model="modal0" lazy width="500px">-->
          <!--<v-card class='pr-3 pl-3'>-->
              <!--<v-card-title class="body-2">Url de l'image:</v-card-title>-->
              <!--<v-card-content>-->
              <!--<v-text-field color="primary" v-model="post.image"></v-text-field>-->
              <!--</v-card-content>-->
          <!--</v-card>-->
        <!--</v-dialog>-->
      </v-flex>
      <v-flex md6 xs12 align-content-end pa-2>
        <v-layout justify-center column px-4>
          <v-checkbox
            v-model="editDescription"
            label="Personaliser la description"
            color="primary"
          ></v-checkbox>
          <v-textarea outline label="Description" v-model="post.description" v-if="editDescription"></v-textarea>
          <v-dialog ref="dialog" v-model="modal" lazy width="290px">
            <v-text-field slot="activator" v-model="post.created_at" label="Date de création" prepend-icon="event" readonly></v-text-field>
            <v-date-picker v-model="post.created_at" width="290" class="mt-3">
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dialog.save(post.created_at)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
          <v-btn v-if="post.image !== ''" @click="changeThumbnail()"><v-icon left>insert_photo</v-icon>Changer l'image</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout mt-5 row wrap mb-5>
      <!--<v-flex md6 xs12>-->
        <!--<p class="headline">Contenu:</p>-->
        <!--<v-textarea solo auto-grow label="Contenu" v-model="post.content"></v-textarea>-->
      <!--</v-flex>-->
      <!--<v-flex md6 sm12>-->
        <!--<p class="headline">Prévisualisation:</p>-->
        <!--<v-textarea solo auto-grow label="Contenu" v-model="post.content"></v-textarea>-->
      <!--</v-flex>-->
      <MarkdownEditor ref="editor" />
      <v-btn
        color="success"
        fab
        fixed
        right
        bottom
        @click="createPost()"
      >
      <v-icon>check</v-icon>
    </v-btn>
    </v-layout>
  </div>
</template>

<script>
  import MarkdownEditor from "../../../components/MarkdownEditor"
  export default {
    components: {MarkdownEditor},
    data: () => ({
      post: {
        title: '',
        description: '',
        content: '',
        image: '',
        locale: ''
      },
      locales: ["fr", "en"],
      modal0: false,
      editDescription: false,
      modal: false
    }),
    created() {
      this.$store.commit('SET_TITLE', "Creer un article")
    },
    methods: {
      createPost() {
        let body = {}
        body.title = this.post.title
        body.image = this.post.image
        body.content = this.$refs.editor.getContent()
        body.locale = this.post.locale
        if (this.editDescription) {
          body.description = this.post.description
        }
        if (this.post.created_at != null && this.post.created_at !== undefined) {
          body.created_at = this.post.created_at + " 00:00:00"
        }
        this.$apitator.post("/post/", body, {withAuth: true}).then(() => {
          this.$store.commit("ADD_ALERT", {text: "Article créée!", color: "success"})
          this.$router.push("/blog")
        })
      },
      changeThumbnail() {
        this.$store.commit('SET_GALLERY_FINISHED', false)
        this.$store.commit('SET_GALLERY_STATE', true)
      }
    },
    watch: {
      '$store.state.galleryHasFinished': function (value) {
        if (value) {
          this.post.image = this.$store.state.galleryPayload
        }
      }
    }
  }
</script>
<style>
  /*.thumbnailsC {*/
    /*background-color: rgb(39, 39, 39);*/
    /*transition: 0.1s background-color;*/
    /*min-height: 10em;*/
  /*}*/

  /*.thumbnailsC:hover {*/
    /*background-color: rgb(26, 26, 26);*/
  /*}*/
</style>
