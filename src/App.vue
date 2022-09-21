<template>
  <v-app>
    <router-view/>
    <loader :show="loading" class="no-print"/>
    <DevelopmentSettings v-if="devtool"/>
  </v-app>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import DevelopmentSettings from "@c/Navbar/DevelopmentSettings";
import vuexStore from "@/store";
import Loader from "@c/Loader";

export default {
  name: 'App',
  data: () => ({
    devtool: process.env.VUE_APP_DEBUG === 'true'
  }),
  computed: {
    ...mapGetters(["errors"]),
    ...mapState('loader', ['loading'])
  },

  components: {
    DevelopmentSettings, Loader
  },
  watch: {
    errors() {
      this.showAlert();
    }
  },
  methods: {
    showAlert() {
      if (Object.keys(this.errors).length !== 0) {
        let errors = '';

        for (const messages of Object.values(this.errors)) {
          if (typeof messages !== "string") {
            for (const error of messages) {
              errors += `${error} </br>`
            }
          } else {
            errors += `${messages} </br>`;
          }
        }

        this.$swal.fire({
          icon: 'error',
          title: 'Ой... виникла помилка',
          html: errors,
          confirmButtonText: 'Зачинити',
        }).then(() => {
          this.$store.commit("setErrors", {});
        })
      }
    }
  }
};
</script>
