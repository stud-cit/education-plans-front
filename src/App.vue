<template >
 <div v-if="auth">
  <v-app>
      <router-view  />
  </v-app>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import axios from 'axios';
import api from "@/api";
import { API } from '@/api/constants-api';


export default {
    name: 'App',
    data: () => ({
      auth: true,
      // auth: false,
      cabinet_api: "https://cabinet.sumdu.edu.ua/api/",
    //
  }),
  computed: {
    ...mapGetters(["errors"]),
  },
  created() {
    // this.authUser();
  },
  watch: {
    errors() {
      this.showAlert();
    }
  },
  methods: {
    authUser() {

      const userData = this.$store.getters["auth/user"];

      if(!userData) {

        const key = this.$route.query.key;

        if(!key) {
          window.location.href = '/?key='+process.env.VUE_APP_SERVICE_KEY;
          // window.location.href = "http://cabinet.sumdu.edu.ua/index/service/"+process.env.VUE_APP_SERVICE_KEY;
        }

        api.get(API.AUTH, {key: key}).then(({data}) => {
        console.log(data)

        if(data) {

          this.$store.commit("auth/setUserData", data);
          this.auth = true;
        }

        // else {

        // }
        });
      }
    },
    showAlert() {
      if (Object.keys(this.errors).length !== 0) {
        let errors = '';

        for(const messages of Object.values(this.errors)) {
          // console.log('messages',messages);
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
          title: 'Зверніться до адміністратора',
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
