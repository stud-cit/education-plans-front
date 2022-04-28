<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      loading="loader"
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
  name: "FormOrganization",
  data() {
    return {
      headers: [
        { text: "№", value: "index", sortable: false },
        { text: "Форма організації навчання", value: "title", sortable: false },
      ],
      items: [],
      loader: false,
    };
  },
  created() {
    this.getFormOrganization();
  },
  methods: {
    getFormOrganization() {
      this.apiFormOrganization().then( (response) => {
        const { data } = response;
        this.items = data.data;
        this.loader = false;
      });
    },
    apiFormOrganization() {
      this.loader = true;
      return api.get(API.FORM_ORGANIZATIONS);
    }
  }
};
</script>
