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
  font-size: 14px;
}
</style>
