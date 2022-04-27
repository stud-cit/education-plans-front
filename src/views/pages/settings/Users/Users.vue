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
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" color="primary" @click="edit(item)">
          mdi-square-edit-outline
        </v-icon>
        <v-icon
          small
          class="mr-2"
          color="red"
          @click="deleted(item.id, item.full_name)"
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

    <EditUserModal :dialog="showEdit" :item="itemEdit" @close="() => this.showEdit = false"/>

  </v-container>
</template>

<script>
// import api from "@/api";
// import { API } from "@/api/constants-api";
import {getApiSimulator} from "@/api/simulator-api";
import EditUserModal from "@/views/pages/settings/Users/Modals/Edit";

export default {
  name: "Users",
  components: {EditUserModal},
  data() {
    return {
      loader: false,
      items: [],
      headers: [
        {text: "№", value: "index", sortable: false},
        {text: "ПІБ", value: "full_name", sortable: false},
        {text: "Факультет", value: "faculty", sortable: false},
        {text: "Кафедра", value: "department", sortable: false},
        {text: "Роль", value: "role", sortable: false},
        {text: "Дії", value: "actions", sortable: false},
      ],
      itemEdit: null,
      showEdit: false,
    };
  },
  created() {
    this.apiUsers();
  },
  methods: {
    apiUsers() {
      this.loader = true;
      setTimeout(() => {
        this.items = getApiSimulator('settingUsers');
        this.loader = false;
      }, 1500)
      // api.get(API.SETTING_USERS).then((response) => {
      //   const { data } = response;
      //   this.items = data.data;
      //   this.loader = false;
      // }); // ToDo with back
    },
    edit(item) {
      this.showEdit = true;
      this.itemEdit = item
      console.log(item)
      //this.$router.push({name: 'RestrictEdit', params: { id }});
    },
    save(id, value) {
      this.itemEdit = null;
      console.log(id, value)
      // const options = { value: value };
      // api.put(`${API.SETTINGS}${id}`, options).then((response) => {
      //   const { message } = response.data;
      //   this.snack = true;
      //   this.snackColor = 'success';
      // });
    },
    deleted(id, full_name) {
      this.$swal.fire({
        title: `Ви хочете видалити користувача ?`,
        text: `${full_name}`,
        showDenyButton: true,
        confirmButtonText: 'Так',
        denyButtonText: `Ні`,
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('destroy id = ' + id)
          // return api.destroy(API.SETTING_USERS + id);
        }
      })
    },
  },
};
</script>
