import Vue from 'vue';
import Vuex from 'vuex';
import devices from './modules/devices';
import reports from './modules/reports';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    devices,
    reports
  }
})
