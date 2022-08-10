<template>
  <div>
    <div class="d-flex flex-column justify-center">
    <h1 class="align-self-center big-text">403</h1>
    <p class="align-self-center">Доступ заборонено.</p>
    <v-btn
        text
        color="primary"
        class="align-self-center ma-10"
        href="https://cabinet.sumdu.edu.ua/" >
        Повернутись на головну
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forbidden',   
}
</script>

<style scoped>
.big-text {
  font-size: 56px;
  color: #0c3754;
}
</style>