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

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="openEdit(item)"> mdi-pencil </v-icon>

        <v-icon small class="mr-2" color="red" @click="deleteItem(item.id, item.title)"> mdi-archive-outline </v-icon>
      </template>
    </v-data-table>

    // TODO: move to component
    <v-tooltip left color="info">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn color="primary" dark fixed bottom right fab v-bind="attrs" v-on="on" @click="showCreate = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>Додати групу дисциплін</span>
    </v-tooltip>

    <CreateCatalogGroupModal
      :dialog="showCreate"
      @close="
        () => {
          this.showCreate = false;
        }
      "
      @submit="create"
    />

    <EditCatalogGroupModal
      :dialog="showEdit"
      :item="item"
      @close="
        () => {
          this.showEdit = false;
        }
      "
      @submit="edit"
    />
  </v-container>
</template>

<script>
import api from '@/api';
import { API, ALLOWED_REQUEST_PARAMETERS } from '@/api/constants-api';
import vuexStore from '@/store';
import CreateCatalogGroupModal from '@/views/pages/settings/CatalogGroup/create';
import EditCatalogGroupModal from '@/views/pages/settings/CatalogGroup/edit';

export default {
  name: 'CatalogGroup',
  components: {
    CreateCatalogGroupModal,
    EditCatalogGroupModal,
  },
  data() {
    return {
      headers: [
        { text: '№', value: 'index', sortable: false, width: '20px' },
        { text: 'Група дисциплін', value: 'title', sortable: false },
        { text: 'Дії', value: 'actions', width: '80px', sortable: false },
      ],
      items: [],
      options: {},
      meta: {},
      showCreate: false,
      showEdit: false,
      item: {},
    };
  },
  watch: {
    options: {
      handler() {
        this.getData();
      },
      deep: true,
    },
  },
  methods: {
    async getData() {
      try {
        const options = this.GlobalHandlingRequestParameters(
          ALLOWED_REQUEST_PARAMETERS.GET_CATALOG_GROUPS,
          this.options,
        );
        const response = await api.get(API.CATALOG_GROUPS, options, { showLoader: true });
        this.items = response.data.data;
        this.meta = response.data.meta;
      } catch (error) {
        vuexStore.dispatch('loader/hide');
        vuexStore.commit('setErrors', { error: 'Server error' });
      }
    },
    closeCreate() {
      this.showCreate = false;
    },
    create(language) {
      api
        .post(API.CATALOG_GROUPS, language)
        .then((response) => {
          this.showCreate = false;
          const { message } = response.data;
          this.$swal.fire({
            position: 'center',
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .then(() => this.getData());
    },
    openEdit(item) {
      const { id, title } = item;
      this.showEdit = true;
      this.item = { id, title };
    },
    edit(data) {
      let { id, title } = data;
      console.log(id);
      if (title === '') return;

      api
        .put(`${API.CATALOG_GROUPS}/${id}`, { title })
        .then((response) => {
          this.showEdit = false;
          const { message } = response.data;
          this.$swal.fire({
            position: 'center',
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .then(() => this.getData());
    },
    closeEdit(item) {
      if (item.title === '') return;
      item.edit = false;
    },
    deleteItem(id, title) {
      this.$swal
        .fire({
          title: `Ви справді хочете архівувати ?`,
          text: `${title}`,
          showDenyButton: true,
          confirmButtonText: 'Так',
          denyButtonText: `Ні`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            api
              .destroy(API.CATALOG_GROUPS, id)
              .then((response) => {
                const { message } = response.data;
                this.$swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: message,
                  showConfirmButton: false,
                  timer: 1500,
                });
              })
              .then(() => this.getData());
          }
        });
    },
  },
};
</script>

<style scoped></style>
