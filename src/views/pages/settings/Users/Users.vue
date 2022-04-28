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
      <template v-slot:item.role="{ item }">
        <template v-if="roles.length">
          {{ roles.find(el => el.id === item.role_id).label }}
        </template>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" color="primary" @click="openEdit(item)">
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
            @click="showCreate = true"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>Додати користувача</span>
    </v-tooltip>

    <CreateUserModal
      :dialog="showCreate"
      :workers="workers"
      :roles="roles"
      @close="() => this.showCreate = false" @submit="create"
    />

    <EditUserModal
      :dialog="showEdit"
      :roles="roles"
      :user="user"
      @close="closeEdit" @submit="edit"
    />

  </v-container>
</template>

<script>
import api from "@/api";
import { API } from "@/api/constants-api";
import CreateUserModal from "@/views/pages/settings/Users/Modals/Create"
import EditUserModal from "@/views/pages/settings/Users/Modals/Edit";

export default {
  name: "Users",
  components: {EditUserModal, CreateUserModal},
  data() {
    return {
      loader: false,
      items: [],
      roles: [],
      headers: [
        {text: "№", value: "index", sortable: false},
        {text: "ПІБ", value: "full_name", sortable: false},
        {text: "Факультет", value: "faculty", sortable: false},
        {text: "Кафедра", value: "department", sortable: false},
        {text: "Роль", value: "role", width: '200px', sortable: false},
        {text: "Дії", value: "actions", width: '80px', sortable: false},
      ],
      showEdit: false,
      showCreate: false,
      user: {},
      workers: [],
    };
  },
  mounted() {
    this.apiGetRoles();
    this.apiUsers();
    this.apiWorkers();
  },
  methods: {
    apiUsers() {
      this.loader = true;

      api.get(API.USERS).then((response) => {
        const { data } = response;
        this.items = data.data;
        this.loader = false;
      });
    },
    apiWorkers() {
      api.get(API.WORKERS).then((response) => {
        const {data} = response;
        this.workers = data;
      });
    },
    async apiGetRoles() {
      const {data} = await api.get(API.ROLES)
      this.roles = data.data
    },
    closeEdit() {
      this.user = {};
      this.showEdit = false;
    },
    openEdit(item) {
      this.showEdit = true;
      this.user = item
    },
    create(data) {
      api.post(API.USERS, data).then((response) => {
        this.showCreate = false;
        const { message } = response.data;
        this.$swal.fire({
          position: "center",
          icon: "success",
          title: message,
          showConfirmButton: false,
          timer: 1500,
        })

        this.apiUsers();
        this.apiWorkers();
      })
    },
    edit(data) {
      api.put(API.USERS + '/' + data.id, {role_id: data.role_id} ).then((response) => {
        this.showEdit = false;

        const { message } = response.data;
        this.$swal.fire({
          position: "center",
          icon: "success",
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
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
          api.destroy(API.USERS,id).then( (response) => {
            const { message } = response.data;
            this.$swal.fire({
              position: "center",
              icon: "success",
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });

            this.apiUsers();
            this.apiWorkers();
          });
        }
      })
    },
  },
};
</script>
