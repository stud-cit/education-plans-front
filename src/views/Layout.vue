<template>
  <div>
    <navbar/>
    <bread-crumbs/>
    <loader :show="loading" />
    <router-view/>
  </div>
</template>

<script>
import Navbar from "@c/Navbar/Navbar";
import BreadCrumbs from "@c/Navbar/BreadCrumbs";
import Loader from "@c/Loader";
import { mapState } from "vuex";

export default {
  components: {BreadCrumbs, Navbar, Loader},
  computed: {
    ...mapState('loader', ['loading'])
  },
}
</script>

<style scoped>

</style>
