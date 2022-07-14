<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:item.index="{ index }">
        {{ index + 1 }}
      </template>
      <template v-slot:item.title="{ item }">
        <template v-if="item.edit">
          <validation-observer
            ref="observer"
          >
            <validation-provider
              v-slot="{ errors }"
              name="Назва"
              rules="required|max:150"
            >
              <v-text-field
                v-model="item.title"
                :counter="150"
                :error-messages="errors"
                required
                autofocus
                @change="edit(item)"
                @blur="closeEdit(item)"
              ></v-text-field>
            </validation-provider>
          </validation-observer>
        </template>
        <template v-else>
          {{item.title}}
        </template>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon v-if="item.edit" small class="mr-2" color="success" @click="edit(item)">
          mdi-check
        </v-icon>
        <v-icon v-if="!item.edit" small class="mr-2" color="primary" @click="item.edit = true">
          mdi-square-edit-outline
        </v-icon>

        <v-icon
          small
          class="mr-2"
          color="red"
          @click="deleted(item.id, item.title)"
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
            @click="showCreate = true"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>Створити дисципліну</span>
    </v-tooltip>

    <CreateSelectiveDisciplineModal
      :dialog="showCreate"
      @close="() => { this.showCreate = false }" @submit="create"
    />

  </v-container>
</template>

<script>
import api from "@/api";
import { API } from "@/api/constants-api";
import CreateSelectiveDisciplineModal from "@/views/pages/settings/SelectiveDisciplines/Modals/Create"

export default {
  name: "SelectiveDisciplines",
  components: {CreateSelectiveDisciplineModal},
  data() {
    return {
      items: [],
      headers: [
        {text: "№", value: "index", width: '20px', sortable: false},
        {text: "Назва", value: "title", sortable: false},
        {text: "Дії", value: "actions", width: '80px', sortable: false},
      ],
      showCreate: false,
    };
  },
  mounted() {
    this.apiSelectiveDisciplines();
  },
  methods: {
    apiSelectiveDisciplines() {
      api.get(API.SELECTIVE_DISCIPLINES, null, {showLoader: true}).then((response) => {
        const { data } = response;
        this.items = data.data;
      });
    },
    closeCreate() {
      this.showCreate = false;
    },
    closeEdit(item) {
      if (item.title === '') return;
      item.edit = false;
    },
    create(title) {
      api.post(API.SELECTIVE_DISCIPLINES, title).then((response) => {
        this.showCreate = false;
        const { message } = response.data;
        this.$swal.fire({
          position: "center",
          icon: "success",
          title: message,
          showConfirmButton: false,
          timer: 1500,
        })

        this.apiSelectiveDisciplines();
      })
    },
    deleted(id, title) {
      this.$swal.fire({
        title: `Ви хочете видалити дисципліну ?`,
        text: `${title}`,
        showDenyButton: true,
        confirmButtonText: 'Так',
        denyButtonText: `Ні`,
      }).then((result) => {
        if (result.isConfirmed) {
          api.destroy(API.SELECTIVE_DISCIPLINES,id).then( (response) => {
            const { message } = response.data;
            this.$swal.fire({
              position: "center",
              icon: "success",
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });

            this.apiSelectiveDisciplines();
          });
        }
      })
    },
    edit(data) {
      if (data.title === '') return;
      api.put(API.SELECTIVE_DISCIPLINES + '/' + data.id, {title: data.title} ).then((response) => {
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
  },
};
</script>
