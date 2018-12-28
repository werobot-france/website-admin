<template>
  <v-container>
    <v-layout row wrap align-center justify-center>
    <v-flex xs3 pt-4>
      <v-select
        :items="locales"
        label="Langue"
        solo
        color="primary"
        v-model="locale"
        >
      </v-select>
    </v-flex>
    <v-flex xs9>
    <v-btn block large color="success" to="/blog/create">Creer un nouvel article</v-btn>
    </v-flex>
    <v-flex xs6 v-for="post in posts" pa-2 v-show="post.locale == locale" :key="post.id">
      <v-card style="margin-top:25px; min-height: 26em;" :to="'/blog/' + post.id" :key="post.id">
        <v-img class="white--text" height="200px" :src="post.image">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-end flexbox>
                <span class="headline">{{ post.title }}</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-img>
        <v-card-title>
          <div>
            <span class="grey--text">{{ post.created_at }}</span><br>
            <span>{{ post.description }}</span>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      posts: [],
      noPost: false,
      locales: ["fr", "en"],
      locale: "fr"
    }),
    created() {
      this.$store.commit('SET_TITLE', 'Blog')
      setTimeout(() => {
        this.fetchBlog()
      }, 200)
    },
    methods: {
      fetchBlog() {
        this.$apitator.get("/post").then((res) => {
          this.posts = res.data.data.posts
          if (this.posts.length == 0) {
            this.noPost = true
          }
        })
      }
    }
  }
</script>

<style>

</style>
