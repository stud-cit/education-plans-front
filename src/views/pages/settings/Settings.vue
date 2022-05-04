<template>
  <v-container>
      <div class="settings">
        <v-card v-for="item in items" :key="item.title" elevation="2">
          <v-card-text>
            <p class="text-h6 text--primary text-center">{{ item.title }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn depressed block :to="{ name: item.to }">
              Налаштувати
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
  </v-container>
</template>
<script>
export default {
  name: 'Settings',
  data() {
    return {
      items: [
        { title: 'Редактор обмежень', to: 'RestrictionEditor' },
        { title: 'Термін навчання', to: 'StudyTerm' },
        { title: 'Форми навчання', to: 'FormStudy' },
        { title: 'Форма організації навчання', to: 'FormOrganization' },
        { title: 'Користувачі', to: 'SettingUsers' },
        { title: 'Вибіркові дисципліни', to: 'SelectiveDisciplines' },
      ],
    };
  },
};
</script>
//TODO: fix adaptive grid
<style scope>
.settings {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
</style>
