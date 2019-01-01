<template>
    <div>
        <v-dialog v-model="enabled" max-width="500px">
            <v-card>
                <v-card-title>
                    Importer une image
                </v-card-title>
                <v-card-text class="pt-0">
                    <div v-show="isLoading == false">
                        <input
                            type="file"
                            v-show="false"
                            ref="fileInput"
                            accept="image/*"
                            @change="onFilePicked"
                        >
                        <v-layout justify-center column>
                            <div v-if="image.file !== null">
                                {{ image.name }}
                                <a @click="resetFile()">Reset</a>
                            </div>
                            <v-btn color="primary" @click="pickFile()" class="mb-4">
                                <v-icon left>
                                    cloud_upload
                                </v-icon>
                                Choisir un fichier
                            </v-btn>
                            <v-text-field v-model="url" label="Image url" placeholder="https://example.org" />
                        </v-layout>
                    </div>
                    <div v-show="isLoading">
                        Uploading...
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn flat color="error" @click="enabled = false">
                        Fermer
                    </v-btn>
                    <v-spacer />
                    <v-btn flat color="primary" @click="save()">
                        Sauvegarder
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog max-width="500px" v-model="clipboardDialog">
            <v-card>
                <v-card-text class="pb-0">
                    <v-text-field label="Résultat" v-model="toCopy" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn flat color="primary" @click="copy()">
                        Copier
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    data: () => ({
        enabled: false,
        url: '',
        image: {
            name: '',
            file: null,
            url: ''
        },
        isLoading: false,
        toCopy: '',
        clipboardDialog: false
    }),
    created () {
    },
    methods: {
        open: function () {
            this.enabled = true
        },
        pickFile: function () {
            this.$refs.fileInput.click()
        },
        onFilePicked: function (e) {
            const files = e.target.files
			if(files[0] !== undefined) {
				this.image.name = files[0].name
				if(this.image.name.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.image.url = fr.result
					this.image.file = files[0]
				})
			} else {
        this.resetFile()
			}
        },
        resetFile: function () {
            this.image.name = ''
            this.image.file = null
            this.image.url = ''
        },
        save: function () {
            this.enabled = false
            let data = {image: this.url}
            if (this.url == '' && this.image.url !== '') {
                data = new FormData();
                data.append('image', this.image.file);
            }
            this.$apitator.post('/image-upload', data, {withAuth: true}).then(response => {
                this.resetFile()
                this.url = ''
                console.log(response.data.data.url)
                this.toCopy = response.data.data.url
                this.clipboardDialog = true
            }).catch(() => {
                this.resetFile()
                this.$store.commit('ADD_ALERT', {
                    color: 'error',
                    text: "Erreur pendant l'upload"
                })
            })
        },
        copy: function () {
            this.clipboardDialog = false
            this.$clipboard(this.toCopy)
            this.$store.commit('ADD_ALERT', {
                color: 'success',
                text: "L'url a été copié dans le presse papier"
            })
        }
    }
}
</script>

<style>

</style>
