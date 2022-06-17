<template>
  <v-app-bar
    color="primary"
    dark
  >
    <v-toolbar-title class="indigo--text text--lighten-4"> {{ name }} |</v-toolbar-title>
    <v-toolbar-title class="ml-2">{{ $route.meta.header }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <template v-for="item in menu">
      <v-btn :to="{name: item.route}" text :key="item.route" exact>
        {{ item.title }}
      </v-btn>
    </template>

    <v-btn @click="logout" text>
      Вихід
    </v-btn>

  </v-app-bar>
</template>

<script>
import navigation from "@/services/navigation";
import {mapActions} from "vuex";

export default {
  name: "Navbar",
  data() {
    return {
      menu: null,
      name: process.env.VUE_APP_NAME_APP
    }
  },
  mounted() {
    this.getMenu();
  },
  methods: {
    getMenu() {
      const user = JSON.parse(localStorage.getItem('user'));
      this.menu = navigation.getItems(user)
    },
    ...mapActions("auth", ["sendLogoutRequest"]),
    logout() {
      this.sendLogoutRequest().then(() => this.$router.push({name: "Login"}));
    }
  },
}
</script>

<style scoped>

</style>
