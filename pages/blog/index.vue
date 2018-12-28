<template>
  <v-container>
    <v-btn block large color="success" to="/blog/create">Creer un nouvel article</v-btn>
    <v-card v-for="post in posts" style="margin-bottom:25px;" :to="'/blog/' + post.id" :key="post.id">
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
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      posts: [],
      noPost: false
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
          if (this.post.length == 0) {
            this.noPost = true
          }
        })
      }
    }
  }
</script>

<style>

</style>
