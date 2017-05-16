<template>
  <div id="result">
    <p v-for="item in contents" class="item">{{item}}</p>
  </div>
</template>

<script>
  export default {
    props: ['err', 'contents'],
  }
</script>

<style>
.item {
  padding: 10px;
  font-size: 14px;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
