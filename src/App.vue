<template>
  <v-app>
      <router-view/>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: 'App',
    data: () => ({
    //
  }),
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

          for(const messages of Object.values(this.errors)) {
             for (const error of messages) {
              errors += `${error} </br>`
            }
          }

          this.$swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: errors,
            confirmButtonText: 'Так',
          }).then(() => {
            this.$store.commit("setErrors", {});
          })
        }
      }
  }
};
</script>
