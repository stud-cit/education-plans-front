<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loader"
      loading-text="Завантаження... Будь ласка зачекайте"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:item.index="{ index }">
        {{ ++index }}
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import api from "@/api";
import { API } from '@/api/constants-api';

export default {
  name: "StudyTerm",
  data() {
    return {
      headers: [
        { text: "№", value: "index", sortable: false, width: '20px' },
        { text: "Опис", value: "title", sortable: false },
        { text: "Місяців", value: "month", sortable: false },
        { text: "Курсів", value: "course", sortable: false },
        { text: "Модулів", value: "module", sortable: false },
        { text: "Семестрів", value: "semesters", sortable: false },
      ],
      items: [],
      loader: false,
    };
  },
  created() {
    this.getStudyTerms();
  },
  methods: {
    getStudyTerms() {
      this.apiStudyTerms().then( (response) => {
        const { data } = response;
        this.items = data.data;
        this.loader = false;
      });
    },
    apiStudyTerms() {
      this.loader = true;
      return api.get(API.STUDY_TERMS);
    }
  }
};
</script>
