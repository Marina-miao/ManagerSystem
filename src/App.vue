<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  .size {
    width: 100%;
    height: 100%;
  }

  html, body {
    .size;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  #app {
    .size;

    .edui-default .edui-editor {
      z-index: 1 !important;
    }
  }

  .ivu-poptip-confirm .ivu-poptip-body {
    text-align: left;
  }
</style>
