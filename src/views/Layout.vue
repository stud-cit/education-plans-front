<template>
  <div>
    <navbar/>
    <bread-crumbs/>
    <router-view/>
  </div>
</template>

<script>
import Navbar from "@c/Navbar/Navbar";
import BreadCrumbs from "@c/Navbar/BreadCrumbs";

export default {
  components: {BreadCrumbs, Navbar},
}
</script>

<style scoped>

</style>
