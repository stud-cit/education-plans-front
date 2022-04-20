<template>
  <v-container>
    <template>
      <v-card class="mt-5 mb-8">
        <v-card-text>
          <p class="text-h4 text--primary"> Редактор обмежень </p>
        </v-card-text>
        <v-card-actions>
          <v-btn href="/settings/restriction-editor" color="deep-purple accent-4"> Редактор обмежень </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-container>
</template>
<script>
export default {
  name: "Settings",

  data() {
    return {
      items: [{ icon: "mdi-account", href: "settings" }],
    };
  },
};
</script>
