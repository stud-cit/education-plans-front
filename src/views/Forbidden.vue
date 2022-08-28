<template>
  <div class="body">
    <h1 class="big-text">403</h1>
    <p>Доступ заборонено.</p>
    <v-btn
        text
        color="primary"
        class="ma-10"
        href="https://cabinet.sumdu.edu.ua/" >
        Повернутись на головну
      </v-btn>
    </div>
</template>

<script>
export default {
  name: 'Forbidden',
}
</script>

<style scoped>
.body {
  margin: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.big-text {
  font-size: 56px;
  color: #0c3754;
}
</style>
