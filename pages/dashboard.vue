<template>
    <div>Ceci n'est un dashboard</div>
</template>

<script>
export default {
    mounted () {
        this.$store.commit('ADD_ALERT', {
            color: 'success',
            text: 'Hello world!'
        })
        console.log('dqsdqsd')
    }
}
</script>
