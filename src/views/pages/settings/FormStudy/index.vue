<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loader"
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
import api from '@/api';
import { API } from '@/api/constants-api';

export default {
  name: "FormStudy",
  data() {
    return {
      loader: false,
      headers: [
        { text: "№", value: "index", sortable: false },
        { text: "Форма навчання", value: "title", sortable: false },
      ],
      items: [],
    };
  },

  created() {
    this.getFormStudies();
  },

  methods: {
    getFormStudies() {
      this.apiFromStudies().then( (response) => {
        const { data } = response;
        this.items = data.data;
        this.loader = false;
      });
    },
    apiFromStudies() {
      this.loader = true;
      return api.get(API.FORM_STUDIES);
    }
  },
};
</script>
