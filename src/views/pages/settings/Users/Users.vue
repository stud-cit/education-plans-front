<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="meta.total"
      :footer-props="{ 'items-per-page-options': [15, 25, 50] }"
      class="elevation-1"
    >
      <template v-slot:item.index="{ index }">
        {{ (meta.current_page - 1) * meta.per_page + (index + 1) }}
      </template>
      <template v-slot:item.role="{ item }">
        <template v-if="roles.length">
          {{ roles.find((el) => el.id === item.role_id).label }}
        </template>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" color="primary" @click="openEdit(item)"> mdi-square-edit-outline </v-icon>
        <v-icon small class="mr-2" color="red" @click="deleted(item.id, item.full_name)">
          mdi-trash-can-outline
        </v-icon>
      </template>
    </v-data-table>

    <v-tooltip left color="info">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn color="primary" dark fixed bottom right fab v-bind="attrs" v-on="on" @click="showCreateOrEditDialog = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>Додати користувача</span>
    </v-tooltip>

    <CreateOrUpdateUserModal
      :dialog="showCreateOrEditDialog"
      :workers="workers"
      :item="user"
      :roles="roles"
      @close="closeDialog"
      @store="create"
      @update="update"
      ref="createOrUpdateDialog"
    />
  </v-container>
</template>

<script>
import api from '@/api';
import { API, ALLOWED_REQUEST_PARAMETERS } from '@/api/constants-api';
import CreateOrUpdateUserModal from '@/views/pages/settings/Users/Modals/CreateOrUpdate';

export default {
  name: 'Users',
  components: { CreateOrUpdateUserModal },
  data() {
    return {
      items: [],
      roles: [],
      headers: [
        { text: '№', value: 'index', sortable: false, width: '20px' },
        { text: 'ПІБ', value: 'full_name', sortable: false },
        { text: 'Факультет', value: 'faculty', sortable: false },
        { text: 'Кафедра', value: 'department', sortable: false },
        { text: 'Роль', value: 'role', width: '200px', sortable: false },
        { text: 'Дії', value: 'actions', width: '80px', sortable: false },
      ],
      showCreateOrEditDialog: false,
      user: null,
      workers: [],
      meta: {},
      options: {},
    };
  },
  mounted() {
    this.apiGetRoles();
    this.apiWorkers();
  },
  watch: {
    options: {
      handler() {
        this.apiUsers();
      },
    },
  },
  methods: {
    async apiUsers() {
      const options = this.GlobalHandlingRequestParameters(ALLOWED_REQUEST_PARAMETERS.GET_USERS, this.options);
      const {
        data: { data, meta },
      } = await api.get(API.USERS, options, { showLoader: true });
      this.items = data;
      this.meta = meta;
    },
    apiWorkers() {
      api.get(API.WORKERS).then((response) => {
        const { data } = response;
        this.workers = data;
      });
    },
    async apiGetRoles() {
      const { data } = await api.get(API.ROLES, null, { showLoader: true });
      this.roles = data.data;
    },
    closeDialog() {
      this.user = null;
      this.showCreateOrEditDialog = false;
      this.$refs.createOrUpdateDialog.clear();
    },
    openEdit(item) {
      this.user = item;
      this.showCreateOrEditDialog = true;
    },
    create(data) {
      api
        .post(API.USERS, data)
        .then((response) => {
          this.closeDialog();
          const { message } = response.data;
          this.$swal.fire({
            position: 'center',
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500,
          });

          this.apiUsers();
          this.apiWorkers();
        })
        .catch((errors) => {
          this.$refs.createOrUpdateDialog.setErrors(errors.response.data.errors);
        });
    },
    update(data) {
      api.put(API.USERS + '/' + data.id, { ...data }).then((response) => {
        this.closeDialog();

        const { message } = response.data;
        this.$swal.fire({
          position: 'center',
          icon: 'success',
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });

        this.apiUsers();
        this.apiWorkers();
      });
    },
    deleted(id, full_name) {
      this.$swal
        .fire({
          title: `Ви хочете видалити користувача ?`,
          text: `${full_name}`,
          showDenyButton: true,
          confirmButtonText: 'Так',
          denyButtonText: `Ні`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            api.destroy(API.USERS, id).then((response) => {
              const { message } = response.data;
              this.$swal.fire({
                position: 'center',
                icon: 'success',
                title: message,
                showConfirmButton: false,
                timer: 1500,
              });

              this.apiUsers();
              this.apiWorkers();
            });
          }
        });
    },
  },
};
</script>
