<template >
 <div >
  <v-app>
      <h1 >sfsdf</h1>
      <router-view  />
  </v-app>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "@/api";
import { API } from '@/api/constants-api';


export default {
    name: 'App',
    data: () => ({
      auth: false
    //
  }),
  computed: {
    ...mapGetters(["errors"]),
  },
  created() {
    // this.checkAuth();
  },
  watch: {
    errors() {
      this.showAlert();
    }
  },
  methods: {
    apiAuth() {
      return api.get(API.FORM_STUDIES);
    },
    checkAuth() {

      const userData = this.$store.getters["auth/user"];

      if(!userData) {
        
        this.apiAuth().then((response) => {

          if(response.status == 200) {
            const {data} = response; 
            this.$store.commit("auth/setUserData", data);
          }

          else {
            // window.location.href = "http://cabinet.sumdu.edu.ua/index/service/"+process.env.MIX_APP_TOKEN;
          }
        })
        
      }
      // fetch('http://127.0.0.1:8000/api/v1/form-studies').then((response) => 
      // { 
        
      //   return response;
      // })
      // .then((data) => {
      //  console.log(data);
      //   if(data != 200) {

      //     // window.location.href = "http://cabinet.sumdu.edu.ua/index/service/"+process.env.MIX_APP_TOKEN;
      //   }
      //   else {
      //      console.log(data.status);
      //     this.auth = true;
      //   }
      // });
  

     
    },
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
