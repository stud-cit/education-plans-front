<template>
  <v-container>
    <v-row align="center" justify="start">
      <v-col cols="12" sm="6" md="4" lg="2">
        <v-card>
          <v-card-text>
            <p class="text-h6 text--primary">Редактор обмежень</p>
          </v-card-text>
          <v-card-actions>
            <v-btn depressed block :to="{ name: 'RestrictionEditor' }">
              Налаштувати
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="2">
        <v-card>
          <v-card-text>
            <p class="text-h6 text--primary">Термін навчання</p>
          </v-card-text>
          <v-card-actions>
            <v-btn depressed block :to="{ name: 'StudyTerm' }">
              Налаштувати
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="2">
        <v-card>
          <v-card-text>
            <p class="text-h6 text--primary">Форми навчання</p>
          </v-card-text>
          <v-card-actions>
            <v-btn depressed block :to="{ name: 'FormStudy' }">
              Налаштувати
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="2">
        <v-card>
          <v-card-text>
            <p class="text-h6 text--primary">Форма організації навчання</p>
          </v-card-text>
          <v-card-actions>
            <v-btn depressed block :to="{ name: 'FormOrganization' }">
              Налаштувати
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="2">
        <v-card>
          <v-card-text>
            <p class="text-h6 text--primary">Користувачі</p>
          </v-card-text>
          <v-card-actions>
            <v-btn depressed block :to="{ name: 'SettingUsers' }">
              Налаштувати
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
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
