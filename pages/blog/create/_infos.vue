<template>
  <v-container fluid>
    <v-layout wrap row width="100%">
      <v-flex xs12 row wrap>
        <v-text-field v-model="post.title" label="Titre" width="70px">
        </v-text-field>
      </v-flex>
      <v-flex  md6 xs12 thumbnailsC @click="modal0 = true">
        <v-img :src="post.image" @click="changeThumbnail()" class="thumbnails"></v-img>
        <v-dialog ref="dialog" v-model="modal0" lazy width="500px">
          <v-card class='pr-3 pl-3'>
              <v-card-title class="body-2">Url de l'image:</v-card-title>
              <v-card-content>
              <v-text-field color="primary" v-model="post.image"></v-text-field>
              </v-card-content>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex  md6 xs12 align-content-end pa-2>
        <v-checkbox
        v-model="editDescription"
        label="Personaliser la description"
        color="primary"
        ></v-checkbox>
        <v-textarea outline label="Description" v-model="post.description" v-if="editDescription"></v-textarea>
        <v-dialog ref="dialog" v-model="modal" :return-value.sync="post.created_at" lazy width="290px">
          <v-text-field slot="activator" v-model="post.created_at" label="date" prepend-icon="event" readonly></v-text-field>
          <v-date-picker v-model="post.created_at" width="290" class="mt-3">
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.dialog.save(post.created_at)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
    </v-layout>
    <v-layout mt-5 row wrap mb-5>
      <v-flex  md6 xs12>
        <p class="headline">Contenu:</p>
        <v-textarea solo auto-grow label="Contenu" v-model="post.content"></v-textarea>
      </v-flex>
      <v-flex  md6 xs12>
        <p class="headline">Prévisualisation:</p>
        <v-textarea solo auto-grow label="Contenu" v-model="post.content"></v-textarea>
      </v-flex>
            <v-btn
                large
                color="success"
                fab
                fixed
                right
                bottom
                @click='createPost()'
            >
                <v-icon>check</v-icon>
            </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      post: {},
      infos: [],
      modal0: false,
      editDescription: false,
      modal: false
    }),
    created() {
      this.$store.commit('SET_TITLE', "Creer un article")
      this.infos = JSON.parse(this.$route.params.infos)
      this.post.identifier = this.infos.identifier
      this.$apitator.get("/post/" + this.infos.id).then((response) => {
        this.post.image = response.data.data.post.image
      })
      this.post.locale = this.infos.locale
    },
    methods: {
      createPost() {
        if(this.post.created_at != null && this.post.created_at != undefined) {
          this.post.created_at += " 00:00:00"
        }
        this.$apitator.post("/post/", this.post, {withAuth: true}).then(() => {
          this.$store.commit("ADD_ALERT", {text: "Article créée!", color: "success"})
          this.$router.push("/blog")
        })
      }
    }
  }
</script>


<style>
  .thumbnailsC {
    background-color: rgb(39, 39, 39);
    transition: 0.1s background-color;
  }

  .thumbnailsC:hover {
    background-color: rgb(26, 26, 26);
  }
</style>
