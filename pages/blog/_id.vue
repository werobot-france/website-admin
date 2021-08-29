<template>
  <div>
    <v-layout wrap row width="100%">
      <v-flex xs12 md6>
        <v-select
          :items="locales"
          label="Langue"
          solo
          v-model="locale"
          @change="changeLocale()"
        ></v-select>
      </v-flex>
      <v-flex xs12 md6 class="text-xs-right">
        <v-dialog width="300px">
        <v-btn
          color="error"
          outline
          slot="activator"
        >
          <v-icon left>delete</v-icon> Delete</v-btn>
          <v-card>
            <v-card-title>Êtes vous sur de vouloir supprimer cet article?</v-card-title>
            <v-btn color="red" block @click="deletePost()">Oui</v-btn>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex xs12 row wrap>
        <v-text-field v-model="post.title" label="Titre" width="70px">
        </v-text-field>
      </v-flex>
      <v-flex md6 xs12>
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
      <v-flex md6 xs12 align-content-end pa-2>
        <v-textarea outline label="Description" v-model="post.description">
        </v-textarea>
        <v-checkbox
          v-model="editDate"
          label="Changer la date"
          color="primary"
        ></v-checkbox>
        <v-select
          :items="['default', 'small', 'medium', 'large']"
          label="Mode de couverture"
          solo
          v-model="post.cover_mode"
        ></v-select>
        <v-text-field
          label="Offset de couverture"
          v-model="post.cover_offset"
        ></v-text-field>
        <v-dialog ref="dialog" v-model="modal" :return-value.sync="post.created_at" lazy width="290px" v-if="editDate">
          <v-text-field slot="activator" v-model="post.created_at" label="date" prepend-icon="event"
                        readonly></v-text-field>
          <v-date-picker v-model="post.created_at" width="290" class="mt-3">
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.dialog.save(post.created_at)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
    </v-layout>
    <v-layout mt-5 row wrap mb-5>
      <MarkdownEditor ref="editor"/>
      <v-btn
        color="success"
        fab
        fixed
        right
        bottom
        @click='editPost()'
      >
        <v-icon>check</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
  import MarkdownEditor from "../../components/MarkdownEditor"

  export default {
    components: {MarkdownEditor},
    data: () => ({
      locales: ["fr", "en"],
      id: 0,
      post: [],
      modal0: false,
      modal: false,
      editDate: false,
      locale: "",
      firstDate: ""
    }),
    created() {
      this.id = this.$route.params.id
      this.$apitator.get("/post/" + this.id).then((response) => {
        this.post = response.data.data.post
        this.locale = this.post.locale
        this.firstDate = this.post.created_at
        this.post.cover_mode = this.post.cover_mode ?? 'default'
        this.$refs.editor.setContent(this.post.content)
        this.$store.commit('SET_TITLE', "Blog - " + this.post.title)
      })
    },
    methods: {
      changeThumbnail() {
        this.modal0 = true
      },
      deletePost() {
        this.$apitator.delete("/post/" + this.id, {withAuth: true}).then(() => {
          this.$store.commit("ADD_ALERT", {text: "Article supprimé!", color: "error"})
          this.$router.push("/blog")
        })
      },
      editPost() {
        if (this.editDate && this.post.created_at != this.firstDate) {
          this.post.created_at += " 00:00:00"
        } else {
          this.post.created_at = this.firstDate
        }
        this.post.content = this.$refs.editor.getContent()
        this.post.cover_mode = this.post.cover_mode === 'default' ? null : this.post.cover_mode
        this.$apitator.put("/post/" + this.id, this.post, {withAuth: true}).then(() => {
          console.log('Post saved!')
          setTimeout(() => {
            this.$store.commit("ADD_ALERT", {text: "Article édité!", color: "success"})
          }, 500)
          //this.$router.push("/blog")
        })
      },
      changeLocale() {
        this.$apitator.get("/post/?identifier=" + this.post.identifier).then((response) => {
          var posts = response.data.data.posts
          posts = posts.filter(post => post.locale == this.locale)
          if (posts[0] == undefined) {
            this.$router.push("/blog/create/" + JSON.stringify({
              locale: this.locale,
              identifier: this.post.identifier,
              id: this.post.id
            }))
          }
          this.$router.push("/blog/" + posts[0].id)
        })
      }
    }
  }
</script>

<style>
  .thumbnails {
    transition: 0.2s opacity;
  }

  .thumbnails:hover {
    opacity: 0.5;
    cursor: pointer;
  }
</style>
