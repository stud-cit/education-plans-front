<template>
  <div v-if="show" class="loader">
    <v-progress-circular
      indeterminate
      color="primary"
      :size="50"
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loader {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, .7);
  text-align: center;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
