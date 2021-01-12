<template>
  <header class="header">
    <h1>Daily Report</h1>
    <div>
      <router-link class="header__link" to="/">Report</router-link>
      <router-link class="header__link" to="/devices">Devices</router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: "main-header"
}
</script>

<style scoped lang="scss">
.header {
  background-color: #007cba;
  color: white;
  text-align: center;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  align-items: center;

  &__link {
    color: white;
    padding: 0 10px;
  }
}
</style>