<template>
    <div>
    </div>
</template>

<script>
export default {
	data: () => ({
		post: []
	}),
    mounted () {
        this.$apitator.get("/post/" + this.$route.params.id).then((response) => {
            this.post = response.data.data.post
		    this.$store.commit('SET_TITLE', this.post.title)
        })
    }
}
</script>

<style>

</style>
