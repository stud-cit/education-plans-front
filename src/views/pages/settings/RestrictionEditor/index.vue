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

      <template v-slot:item.value="props">
        <v-edit-dialog
          :return-value.sync="props.item.value"
          large
          persistent
          cancel-text='Відміна'
          save-text='Зберегти'
          @save="save(props.item.id, props.item.value)"
          @open="open"
        >
          <div>{{ props.item.value }}</div>
          <template v-slot:input>
            <div class="mt-4 text-h6">Редагування</div>
            <v-text-field
              v-model="props.item.value"
              :rules="[required, number, max3digits]"
              label="Редагування"
              single-line
              counter
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}

        <template v-slot:action="{ attrs }">
          <v-btn v-bind="attrs" text @click="snack = false"> Закрити </v-btn>
        </template>
      </v-snackbar>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" color="primary"  @click="edit(item.id)">
          mdi-square-edit-outline
        </v-icon>
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
  name: "RestrictionEditor",

  data() {
    return {
      snack: false,
      snackColor: '',
      snackText: '',
      loader: false,
      number: v => Number.isInteger(v) ? true :  'Тільки цілі числа!', 
      required: v => !!v || 'Поле обов\'язкове!', 
      max3digits: v => v.length <= 3 || 'Максимум 3 цифри!',
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
    save(id, value) {
      const options = { value: value };
      api.put(`${API.SETTINGS}${id}`, options).then((response) => {
        const { message } = response.data;
        this.snack = true;
        this.snackColor = 'success';
        this.snackText = message;
       });
    },

    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
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
