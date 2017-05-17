<template>
  <div id="app">
    <translate></translate>
  </div>
</template>

<script>
  import translate from './components/translate'

  export default {
    components: {
      translate
    },
    data () {
      return {
      }
    },
    methods: {
    },
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
