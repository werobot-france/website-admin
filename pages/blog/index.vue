<template>
  <div>
    <v-layout row wrap justify-space-between align-content-space-between>
      <v-flex xs12 sm6 md4 v-for="post in posts" pa-2 v-show="post.locale == locale" :key="post.id">
        <v-card :to="'/blog/' + post.id" :key="post.id" classs="blog" hover height="24em">
          <v-img class="white--text" height="200px" :src="post.image" gradient="to bottom, rgba(0,0,0, .2), #424242"
            dark>
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
      <v-speed-dial direction="top" transition="scale-transition" fixed right bottom style="transform: translateY(-75px)">
        <v-btn slot="activator" color="red" fab sm>
          <v-icon>flag</v-icon>
        </v-btn>
        <v-btn fab small color="grey darken-3" @click="locale='fr'">
          FR
        </v-btn>
        <v-btn fab small color="grey darken-3" @click="locale='en'">
          EN
        </v-btn>
      </v-speed-dial>
      <v-btn sm color="success" fab fixed right bottom to="/blog/create">
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>
  </div>
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
