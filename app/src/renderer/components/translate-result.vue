<template>
  <div id="result">
    <p v-for="item in contents" class="item">{{item}}</p>
  </div>
</template>

<script>
  export default {
    created() {
    },
    props: ['contents'],
    data() {
      return {
        
      }
    },
  }
</script>

<style>
.item {
  padding: 10px 10px 0px 10px;
  font-size: 14px;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
