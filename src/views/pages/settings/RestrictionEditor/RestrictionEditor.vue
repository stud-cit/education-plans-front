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
        <v-icon small class="mr-2" color="red" @click="deleteItem(item.id, item.title)">
          mdi-trash-can-outline
        </v-icon>
      </template>
    </v-data-table>

    <v-tooltip left color="info">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
              color="primary"
              dark
              fixed
              bottom
              right
              fab
              v-bind="attrs"
              v-on="on"
              :to="{name: 'RestrictCreate'}"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>Додати налаштування</span>
    </v-tooltip>

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

    deleteItem(id, title) {
      this.$swal.fire({
        title: `Ви хочете видалити план ?`,
        text: `${title}`,
        showDenyButton: true,
        confirmButtonText: 'Так',
        denyButtonText: `Ні`,
      }).then((result) => {
        if (result.isConfirmed) {
          return api.destroy(API.SETTINGS + id);   
        }
      })
    },
  },
};
</script>
