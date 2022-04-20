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
        {{ index + 1 }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" color="primary" @click="edit(item.id)">
          mdi-square-edit-outline
        </v-icon>
        <v-icon small class="mr-2" color="red" @click="deleteItem(item)">
          mdi-trash-can-outline
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import api from "@/api";
import { API } from "@/api/constants-api";

export default {
  name: "RestrictionEditor",

  data() {
    return {
      loader: false,
      items: [],
      headers: [
        { text: "№", value: "index", sortable: false },
        { text: "Ключ", value: "key", sortable: false },
        { text: "Заголовок", value: "title", sortable: false },
        { text: "Значення", value: "value", sortable: false },
        { text: "Дії", value: "actions", sortable: false },
      ],
    };
  },
  created() {
    this.getSettings();
  },
  methods: {
    getSettings() {
      this.apiSettings().then((response) => {
        const { data } = response;
        this.items = data.data;
        this.loader = false;
      });
    },
    apiSettings() {
      this.loader = true;
      return api.get(API.SETTINGS);
    },

    edit(id) {
      this.$router.push({name: 'RestrictEdit', params: { id }});
    },

    deleteItem(item) {
      // console.log();
      return api.destroy(`API.SETTINGS${item.id}`);
    },
    // apiDelete(id) {
      
    // }
  },
};
</script>
