<template>
    <div>
        <v-list three-line avatar>
            <template v-for="post in posts">
                <v-list-tile :key="post.id" :to="'/blog/' + post.id">
                    <v-list-tile-avatar>
                        <img :src="post.image" />
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="post.title" />
                        <v-list-tile-sub-title>
                            <span class='text--primary'>{{ post.created_at }}</span>
                        </v-list-tile-sub-title>
                        <v-list-tile-sub-title>
                            {{ post.description }}
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider :key="post.id + '_divider'" />
            </template>
        </v-list>
    </div>
</template>

<script>
export default {
	data: () => ({
		posts: [],
		noPost: false
	}),
	created () {
		this.$store.commit('SET_TITLE', 'Blog')
		setTimeout(() => {
			this.fetchBlog()
		}, 200)
    },
    methods: {
        fetchBlog () {
			this.$apitator.get("/post").then((res)=> {
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
