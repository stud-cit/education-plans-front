<template>
  <v-app>
    <router-view/>
    <DevelopmentSettings v-if="devtool"/>
  </v-app>
</template>

<script>
import {mapGetters} from "vuex";
import DevelopmentSettings from "@c/Navbar/DevelopmentSettings";

export default {
  name: 'App',
  data: () => ({
    devtool: process.env.VUE_APP_DEBUG === 'true'
  }),
  computed: {
    ...mapGetters(["errors"]),
  },
  components: {
    DevelopmentSettings
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
