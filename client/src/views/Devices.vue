<template>
  <main class="container">
    <h1>List of the Devices</h1>
    <Uploader file_name="devices.csv"></Uploader>

    <section v-if="devices">
      <table class="table">
        <thead class="table__header">
        <tr>
          <td class="table__item">#</td>
          <td class="table__item">Device id</td>
          <td class="table__item">Name</td>
          <td class="table__item">Location</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(device, index) in devices" :key="device.id">
          <td class="table__item">{{ index + 1 }}</td>
          <td class="table__item">{{ device.device_id }}</td>
          <td class="table__item">{{ device.name }}</td>
          <td class="table__item">{{ device.location }}</td>
        </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script>
import store from '@/store';
import Uploader from "@/components/Uploader";

export default {
  name: 'Devices',
  components: {
    Uploader
  },
  computed: {
    devices() {
      return store.state.devices.devices;
    }
  },
  data() {
    return {}
  },
  created() {
    if (!this.devices) {
      this.$store.dispatch('devices/getAllDevices')
    }
  }
}
</script>

<style lang="scss">
.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto 30px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, .2);
  text-align: center;
  padding: 50px 0 50px;
}

.v-data-table-header {
  background-color: rgba(232, 232, 232, 0.5);
}

.table {
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid lightgray;
  width: 100%;

  &__header {
    width: 100%;
    background-color: rgba(232, 232, 232, 0.5);
    text-align: center;
  }

  &__item {
    padding: 5px 20px;
    text-align: center;
    border-bottom: 1px solid rgba(232, 232, 232, 0.5);

    &--period {
      text-align: start;
      background-color: rgba(232, 232, 232, 0.7);
    }

    &--device {
      text-align: start;
    }
  }
}
</style>