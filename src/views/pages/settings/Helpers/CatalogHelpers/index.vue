<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :server-items-length="meta.total"
      :options.sync="options"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-row>
          <v-col cols="12" md="9">
            <v-text-field
              v-model="searchTitle"
              append-icon="mdi-magnify"
              label="Пошук за назвою"
              single-line
              hide-details
              class="mx-4"
            ></v-text-field>
          </v-col>
          <v-col align-self="center">
            <v-btn color="primary" outlined class="ml-2" @click="search"> Пошук </v-btn>
            <v-btn color="primary" class="ml-2" outlined @click="clear"> Очистити </v-btn>
          </v-col>
        </v-row>

        <v-row class="px-4 pb-4">
          <v-col cols="12">
            <v-autocomplete
              v-model="type"
              :items="types"
              item-text="title"
              item-value="id"
              label="Тип"
              hide-details
              clearable
            ></v-autocomplete>
          </v-col>
        </v-row>
      </template>

      <template v-slot:item.index="{ index }">
        {{ (meta.current_page - 1) * meta.per_page + (index + 1) }}
      </template>

    </v-data-table>

    <v-tooltip left color="info">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn color="primary" dark fixed bottom right fab v-bind="attrs" v-on="on" @click="create">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>Додати підсказку</span>
    </v-tooltip>

  </v-container>
</template>

<script>
import api from "@/api";
import {ALLOWED_REQUEST_PARAMETERS, API} from '@/api/constants-api';
import GlobalMixin from "@/mixins/GlobalMixin";

export default {
  name: "CatalogHelpers",
  data() {
    return {
      searchTitle: '',
      types: [],
      type: '',
      headers: [
        { text: '№', value: 'index', sortable: false, width: '20px' },
        { text: 'Назва', value: 'title', sortable: false},
        { text: 'Тип', value: 'type', sortable: false},
      ],
      meta: [],
      items: [],
      options: null,
    }
  },
  watch: {
    options(v) {
      this.apiGetItems();
    }
  },
  mounted() {
    this.apiGetCatalogHelperTypes();
  },
  methods: {
    apiGetItems() {
      const options = GlobalMixin.methods.GlobalHandlingRequestParameters(ALLOWED_REQUEST_PARAMETERS.GET_SUBJECT_HELPERS, this.options);
      api.get(API.SUBJECT_HELPERS, options ,{ showLoader: true }).then((response) => {
        const { data } = response;
        this.items = data.data;
        this.meta = data.meta;
      })
    },
    apiGetCatalogHelperTypes() {
      api.get(API.CATALOG_HELPER_TYPES).then((response) => {
        const { data } = response;
        this.types = data.data;
      })
    },
    create() {
      console.log('create')
    },
    clear() {
      this.options.searchTitle = '';
      this.options.type = '';
      this.apiGetItems();
    },
    search() {
      this.options.searchTitle = this.searchTitle;
      this.options.type = this.type;
      this.apiGetItems();
    }
  }
}
</script>

<style scoped>

</style>
