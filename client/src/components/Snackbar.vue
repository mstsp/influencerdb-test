<template>
  <v-snackbar v-model="snackbar" timeout="2000" color="#EF5350">{{ text }}</v-snackbar>
</template>

<script>
import {EventBus} from '@/helpers/eventbus';

export default {
  name: 'snackbar',
  data() {
    return {
      snackbar: false,
      color: '',
      text: ''
    }
  },
  created() {
    EventBus.$on('showSnackBar', (msg, color) => {
      this.color = color;
      this.text = msg;
      this.snackbar = true
    });
  },
  beforeDestroy() {
    EventBus.$off('showSnackBar');
  }
};
</script>
