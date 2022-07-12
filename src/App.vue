<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'App',
  data: () => ({}),
  computed: {
    ...mapGetters(["errors"]),
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
