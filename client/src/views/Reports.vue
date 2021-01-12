<template>
  <div data-app>
  <main class="container">
    <h1>Report {{selectedDate}}</h1>
    <section>
      <Uploader file_name="results.txt"></Uploader>
    </section>
    <section class="date-picker">
      <v-col
          cols="12"
          justify="center"
      >
        <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="selectedDate"
                label="Select date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="selectedDate"
              @input="menu2 = false"
              :max="maxDate"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </section>
    <section v-if="reports">
      <div v-for="(report, index) in reports" :key="index">
        <table class="table">
          <thead class="table__header">
          <tr>
            <td class="table__item table__item--period" colspan="5">Date {{ report.period_start | getPeriod }}</td>
          </tr>
          <tr>
            <td class="table__item">Device</td>
            <td class="table__item">Min</td>
            <td class="table__item">Max</td>
            <td class="table__item">Avg</td>
            <td class="table__item">Median</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(device, index) in report.statistic" :key="index">
            <td class="table__item table__item--device">{{(device.device_info.location)}}: {{(device.device_info.name)}}</td>
            <td class="table__item">{{ device.min }}</td>
            <td class="table__item">{{ device.max }}</td>
            <td class="table__item">{{ device.avg }}</td>
            <td class="table__item">{{ device.median }}</td>
          </tr>
          </tbody>
        </table>
        <div>
        </div>
      </div>
    </section>
  </main>
  </div>
</template>

<script>
import Uploader from "@/components/Uploader";
import {api} from "@/helpers/api";

export default {
  name: 'reports',
  components: {
    Uploader,
  },
  filters: {
    getPeriod(value) {
      let period = Number(value)
      return `${period}:00 - ${period + 1}:00`
    },
  },
  data() {
    return {
      reports: null,
      selectedDate: new Date().toISOString().substr(0, 10),
      maxDate: new Date().toISOString().substr(0, 10),
      menu2: false,
      stepForCrontab: 5
    }
  },
  created() {
    this.getData()
    this.$crontab.addJob({
      name: 'counter',
      interval: {
        seconds: `/${this.stepForCrontab}`,
      },
      job: this.getData
    })
  },
  methods: {
    getData() {
      api.post('/reports', {date: this.selectedDate})
          .then((res) => {
            this.reports = res.data.data
          })
      .catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss">
.v-card>.v-card__progress+:not(.v-btn):not(.v-chip), .v-card>:first-child:not(.v-btn):not(.v-chip) {
  background-color: #007cba!important;
}
.date-picker {
  max-width: 820px;
  margin: 0 auto;
}
</style>