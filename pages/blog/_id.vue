<template>
    <v-container fluid>
        <v-layout wrap row width="100%">
            <v-flex xs3>
                <v-select
                :items="locales"
                label="Langue"
                solo
                v-model="locale"
                @change="changeLocale()"
                ></v-select>
            </v-flex>
            <v-flex xs12 row wrap>
                <v-text-field v-model="post.title" label="Titre" width="70px">
                </v-text-field>
            </v-flex>
            <v-flex xs6> 
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
            <v-flex xs6 align-content-end pa-2>
                <v-textarea outline label="Description" v-model="post.description">
                </v-textarea>
                <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" lazy width="290px">
                    <v-text-field slot="activator" v-model="post.created_at" label="date" prepend-icon="event" readonly></v-text-field>
                    <v-date-picker v-model="date" width="290" class="mt-3">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                    </v-date-picker>
                </v-dialog>
            </v-flex>
        </v-layout>
        <v-layout mt-5 row wrap mb-5>
            <v-flex xs6>
                <p class="headline">Contenu:</p>
                <v-textarea solo auto-grow label="Contenu" v-model="post.content"></v-textarea>
            </v-flex>
            <v-flex xs6>
                <p class="headline">Prévisualisation:</p>
                <v-textarea solo auto-grow label="Contenu" v-model="post.content"></v-textarea>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs8>
            </v-flex>
            <v-flex xs4>
                <v-btn color="success" flat @click='editPost()'>Valider</v-btn>
                <v-btn color="error" flat @click='deletePost()'>Supprimer</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            locales: ["fr", "en"],
            id: 0,
            post: [],
            date: new Date().toISOString().substr(0, 10),
            modal0: false,
            modal: false,
            locale: ""
        }),
        created() {
            this.id = this.$route.params.id
            this.$apitator.get("/post/" + this.id).then((response) => {
                this.post = response.data.data.post
                this.locale = this.post.locale
                this.$store.commit('SET_TITLE', "Blog - " + this.post.title)
            })
        },
        methods: {
            changeThumbnail() {
                this.modal0 = true
            },
            deletePost() {
                this.$apitator.delete("/post/" + this.id, { withAuth: true }).then(() => {
                    this.$store.commit("ADD_ALERT", { text: "Article supprimé!", color: "error" })
                    this.$router.push("/blog")
                })
            },
            editPost() {
                this.$apitator.put("/post/" + this.id, this.post, { withAuth: true }).then(() => {
                    this.$store.commit("ADD_ALERT", { text: "Article édité!", color: "success" })
                    this.$router.push("/blog")
                })
            },
            changeLocale() {
                this.$apitator.get("/post/?identifier=" + this.post.identifier).then((response) => {
                    var posts = response.data.data.posts
                    posts = posts.filter(post => post.locale == this.locale)
                    console.log(posts[0])
                    if(posts[0] == undefined) {
                        this.$router.push("/blog/create/" + JSON.stringify({locale: this.locale, identifier: this.post.identifier, id: this.post.id}))
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
