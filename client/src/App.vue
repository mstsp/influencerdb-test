<template>
  <div id="app">
    <main-header></main-header>
    <snackbar></snackbar>
    <router-view/>
  </div>
</template>

<script>
import MainHeader from "@/components/MainHeader";
import Snackbar from "@/components/Snackbar";

export default {
  name: "App",
  components: {
    MainHeader,
    Snackbar
  },
}
</script>

<style lang="scss">
html body {
  background-color: rgb(232, 232, 232);
}

</style>
