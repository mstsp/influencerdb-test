<template>
  <section>
    <div class="uploader">
      <v-file-input
          chips
          counter
          show-size
          truncate-length="15"
          @change="onChange"
          :label="`Upload file ${file_name} list (File should contain 25 or less lines)`"
      ></v-file-input>
    </div>
  </section>
</template>

<script>
import {EventBus} from '@/helpers/eventbus';
import {api} from "@/helpers/api";

export default {
  name: "Uploader",
  props: {
    file_name: {
      required: true,
      type: String
    }
  },
  methods: {
    onChange(file) {
      if (file) {
        this.uploadFile(file)
      }
    },
    async uploadFile(file) {
      if (!this.isValidFile(file)) {
        EventBus.$emit('showSnackBar', 'Please download correct file');
      } else {
        const formData = new FormData();
        formData.append('file', file);
        try {
          let response = await api.post('/upload', formData)
          if (this.file_name === 'devices.csv') {
            await this.$store.dispatch('devices/getAllDevices')
            console.log(response)
          }
        } catch (error) {
          EventBus.$emit('showSnackBar', error);
        }
      }
    },
    isValidFile(file) {
      return file.name === this.file_name
    }
  }
}
</script>

<style scoped>
.uploader {
  max-width: 800px;
  margin: 50px auto;
}
</style>