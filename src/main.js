import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import '@/plugins/vee-validate'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import GlobalMixin from "@/mixins/GlobalMixin";

Vue.config.productionTip = false
Vue.mixin(GlobalMixin);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
