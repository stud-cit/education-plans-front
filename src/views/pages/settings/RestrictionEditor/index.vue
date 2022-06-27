<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loader"
      loading-text="Loading... Please wait"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:item.index="{ index }">
        {{ index + 1 }}
      </template>

      <template v-slot:item.value="{ item }">
        <template v-if="item.edit">
          <validation-observer
            ref="observer"
          >
            <validation-provider
              v-slot="{ errors }"
              name="Значення"
              rules="required|digits"
            >
              <v-text-field
                v-model="item.value"
                :error-messages="errors"
                required
                type="number"
                min="0"
                autofocus
                dense
                hide-details
                @change="edit(item)"
                @blur="closeEdit(item)"
              ></v-text-field>
            </validation-provider>
          </validation-observer>
        </template>
        <template v-else>
          {{item.value}}
        </template>
      </template>

      <template v-slot:item.actions="{ item }">
       <template v-if="item.edit">
          <v-icon small class="mr-2" color="success" @click="edit(item)">
            mdi-check
          </v-icon>
        </template>
        <template v-else>
          <v-icon small class="mr-2" color="primary" @click="item.edit = true">
            mdi-square-edit-outline
          </v-icon>
        </template>
        <v-icon
          small
          class="mr-2"
          color="red"
          @click="deleteItem(item.id, item.title)"
        >
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
            :to="{ name: 'RestrictCreate' }"
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
  name: 'RestrictionEditor',

  data() {
    return {
      loader: false,
      max3digits: v => v.length <= 3 || 'Максимум 3 цифри!',
      items: [],
      headers: [
        { text: "№", value: "index", sortable: false, width: '20px' },
        { text: "Ключ", value: "key", sortable: false },
        { text: "Заголовок", value: "title", sortable: false },
        { text: "Значення", value: "value", sortable: false, width: '100px' },
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
    save(id, value) {
      const options = { value: value };
      api.put(`${API.SETTINGS}${id}`, options).then((response) => {
        const { message } = response.data;
        this.snack = true;
        this.snackColor = 'success';
        this.snackText = message;
       });
    },
    closeEdit(item) {
      if (item.value === '') return;
      item.edit = false;
    },
    edit(data) {
      if (data.value === '') return;
      api.put(API.SETTINGS + '/' + data.id, {value: data.value} ).then((response) => {
        data.edit = false;
        const { message } = response.data;
        this.$swal.fire({
          position: "center",
          icon: "success",
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });
      })
    },

    deleteItem(id, title) {
      this.$swal.fire({
        title: `Ви хочете видалити налаштування?`,
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
