<template>
  <v-app-bar
    color="primary"
    dark
  >
    <v-toolbar-title class="indigo--text text--lighten-4"> {{ name }} |</v-toolbar-title>
    <v-toolbar-title class="ml-2">{{ $route.meta.header }}</v-toolbar-title>

    <v-spacer></v-spacer>
    <span v-if="devtool" class="ml-2 warning--text">{{ $store.getters["developmentSettings/role"](user.role_id).label }}</span>
    <v-spacer v-if="devtool"></v-spacer>

    <v-btn v-if="devtool" text color="warning" :input-value="panelOpen" @click="toggle()">
      Панель розробника
    </v-btn>
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
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Navbar",
  data() {
    return {
      check: 1,
      menu: null,
      name: process.env.VUE_APP_NAME_APP,
      devtool: process.env.VUE_APP_DEBUG === 'true'
    }
  },
  watch: {
    user(v) {
      if (v !== null) {
        this.getMenu();
        return v;
      }
      return null;
    },
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      panelOpen: 'developmentSettings/panelOpen',
    }),
  },
  mounted() {
    this.getMenu();
  },
  methods: {
    getMenu() {
      const user = JSON.parse(localStorage.getItem('user'));

      this.menu = navigation.getItems(user)
    },
    ...mapActions(
      {
        toggle: 'developmentSettings/toggle',
        sendLogoutRequest: 'auth/sendLogoutRequest'
      }
    ),
    logout() {
      this.sendLogoutRequest().then(() => {
        window.location.replace(process.env.VUE_APP_CABINET_APP_URL);
    });
    }
  },
}
</script>

<style scoped>

</style>
