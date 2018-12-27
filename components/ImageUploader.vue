<template>
    <v-dialog v-model="enabled" max-width="500px">
        <v-card>
            <v-card-title>
                Importer une image
            </v-card-title>
            <v-card-text>
                <v-tabs
                    centered
                >
                    <v-tabs-slider color="primary"></v-tabs-slider>

                    <v-tab href="#local">
                        Local
                    </v-tab>
                    <v-tab href="#url">
                        Url
                    </v-tab>


                    <v-tab-item value="local">
                        Upload local
                    </v-tab-item>
                    <v-tab-item value="url">
                        Url
                    </v-tab-item>
                </v-tabs>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data: () => ({
        enabled: false,
        url: ''
    }),
    methods: {
        open: function () {
            this.enabled = true
        }
    }
}
</script>

<style>

</style>
