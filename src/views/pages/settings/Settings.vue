<template>
  <v-container>
    <v-row align="center" justify="space-around">
      <v-card class="mt-5 mb-8">
        <v-card-text>
          <p class="text-h6 text--primary">Редактор обмежень</p>
        </v-card-text>
        <v-card-actions>
          <v-btn depressed href="/settings/restriction-editor">
            Редактор обмежень
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="mt-5 mb-8">
        <v-card-text>
          <p class="text-h6 text--primary">Термін навчання</p>
        </v-card-text>
        <v-card-actions>
          <v-btn depressed href="/settings/study-term">
            Термін навчання
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
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
