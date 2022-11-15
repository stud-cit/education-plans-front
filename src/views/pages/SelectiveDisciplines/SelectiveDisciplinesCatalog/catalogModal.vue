<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-toolbar-title>Налаштування каталогів</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          dark
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs
        fixed-tabs
        background-color="primary"
        dark
        v-model="tab"
      >
        <v-tab>
          Каталоги
        </v-tab>
        <v-tab>
          Створити новий каталог
        </v-tab>
        <v-tab v-if="this.$route.name !== 'SelectiveDisciplinesCatalog'">
          Копіювати каталог
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card max-width="1024" class="mx-auto py-10" elevation="0" >
            <v-data-table
              :headers="headers"
              :items="items"
              class="elevation-1"
              :server-items-length="meta.total"
              :options.sync="options"
              :footer-props="{ 'items-per-page-options': [15, 25, 50] }"
            >
              <template v-slot:top>
                <v-row class="px-4">
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="year"
                      :items="years"
                      item-text="year"
                      item-value="id"
                      label="Рік"
                      hide-details
                      clearable
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="group"
                      :items="groups"
                      item-text="title"
                      item-value="id"
                      label="Група"
                      hide-details
                      clearable
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="px-4 pb-4">
                  <v-col align-self="center" class="d-flex">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" outlined @click="search"> Пошук </v-btn>
                    <v-btn color="primary" class="ml-2" outlined @click="clear"> Очистити </v-btn>
                  </v-col>
                </v-row>
              </template>

              <template v-slot:item.index="{ index }">
                {{ ++index }}
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <validation-observer
            ref="create"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="submit" @keyup.enter="submit">
              <v-card-text>
                <v-container>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Оберіть рік"
                    rules="required"
                    vid="title"
                  >
                    <v-autocomplete
                      v-model="year"
                      :items="years"
                      :error-messages="errors"
                      item-text="title"
                      item-value="id"
                      label="Оберіть рік"
                    ></v-autocomplete>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Оберіть групу"
                    rules="required"
                    vid="title"
                  >
                    <v-autocomplete
                      v-model="group"
                      :items="groups"
                      :error-messages="errors"
                      item-text="title"
                      item-value="id"
                      label="Оберіть групу"
                    ></v-autocomplete>
                  </validation-provider>

                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary"
                  @click="close"
                >
                  Закрити
                </v-btn>
                <v-btn
                  color="primary"
                  @click="create"
                  :disabled="invalid"
                >
                  Створити
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </form>
          </validation-observer>
        </v-tab-item>
        <v-tab-item v-if="this.$route.name !== 'SelectiveDisciplinesCatalog'">
          <validation-observer
            ref="copy"
            v-slot="{ invalid }"
          >
            <form @submit.prevent="submit" @keyup.enter="submit">
              <v-card-text>
                <v-container>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Оберіть каталог"
                    rules="required"
                    vid="title"
                  >
                    <v-autocomplete
                      v-model="catalog"
                      :items="catalogs"
                      :error-messages="errors"
                      item-text="title"
                      item-value="id"
                      label="Оберіть каталог"
                    ></v-autocomplete>
                  </validation-provider>

                  <validation-provider
                    v-slot="{ errors }"
                    name="Оберіть рік"
                    rules="required"
                    vid="title"
                  >
                    <v-autocomplete
                      v-model="year"
                      :items="years"
                      :error-messages="errors"
                      item-text="name"
                      item-value="id"
                      label="Оберіть рік"
                    ></v-autocomplete>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Оберіть групу"
                    rules="required"
                    vid="title"
                  >
                    <v-autocomplete
                      v-model="group"
                      :items="groups"
                      :error-messages="errors"
                      item-text="title"
                      item-value="id"
                      label="Оберіть групу"
                    ></v-autocomplete>
                  </validation-provider>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary"
                  @click="close"
                >
                  Закрити
                </v-btn>
                <v-btn
                  color="primary"
                  @click="copy"
                  :disabled="invalid"
                >
                  Скопіювати
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </form>
          </validation-observer>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/api';
import {ALLOWED_REQUEST_PARAMETERS, API} from '@/api/constants-api';
import GlobalMixin from "@/mixins/GlobalMixin";

export default {
  name: "CatalogSelectiveDisciplinesCatalogModal",
  data() {
    return {
      headers: [
        { text: '№', value: 'index', sortable: false, width: '20px' },
        { text: 'Рік', value: 'year', sortable: false },
        { text: 'Назва групи', value: 'group_name', sortable: false },
      ],
      items: [],
      meta: [],
      options: null,

      catalogs: [],
      catalog: null,
      groups: [],
      group: null,
      years: [],
      year: null,
      tab: null
    }
  },
  mounted() {
    this.apiGetCatalogs();
    this.apiGetGroups();
    this.apiGetYears();
  },
  watch: {
    options(v) {
      v.year = new Date().getFullYear();
      this.apiGetItems();
    },
    tab(v) {
      switch (v) {
        case 0:
          this.apiGetYears();
          break;
        case 1:
          this.years = this.fakerYears();
          break;
        default:
          this.apiGetYears();
      }
    }
  },
  props: {
    dialog: {
      type: Boolean,
      default() {
        return false;
      }
    },
  },
  methods: {
    async apiGetItems() {
      const options = GlobalMixin.methods.GlobalHandlingRequestParameters(
        ALLOWED_REQUEST_PARAMETERS.GET_CATALOG_SUBJECTS,
        this.options,
      );
      try {
        const response = await api.get(API.CATALOG_SUBJECTS, options, { showLoader: true });
        const { data } = response;
        this.items = data.data;
        this.meta = data.meta;
      } catch (e) {
        console.error(e); // TODO: show error
      }
    },
    async apiGetYears() {
      const response = await api.get(API.CATALOG_SUBJECTS + '/years');
      const { data } = response.data;
      this.years = data;
    },
    apiGetCatalogs() {
      api.get(API.CATALOG_SUBJECTS_TITLES).then( ({ data }) => {
        this.catalogs = data.data;
      })
    },
    apiGetGroups() {
      api.get(API.CATALOG_GROUPS).then(({ data }) => {
        this.groups = data.data;
      });
    },

    close() {
      this.$emit('close');
    },
    create() {
      this.$refs.create.validate().then((validated) => {
        if (validated) {
          const data = {
            year: this.year,
            selective_discipline_id: 1,
            group_id: this.group
          }
          api
            .post(API.CATALOG_SUBJECTS, data)
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
              this.$refs.create.reset();
              this.close();
            })
            .catch((errors) => {
              console.log(errors) // todo when duplicate catalog
            });
        }
      });
    },
    copy() {

    },
    fakerYears() {
      let years = []
      const limit = 10
      const currentYear = new Date().getFullYear()
      let i = 1;
      while (i < limit) {
        years.push(currentYear + i, currentYear - i)
        i++;
      }
      years.push(currentYear)
      return years.sort();
    },
    clear() {
      this.options.year = '';
      this.options.group = '';
      this.apiGetItems();
    },
    search() {
      this.options.year = this.year;
      this.options.group = this.group;
      this.apiGetItems();
    },
  }
}
</script>

<style scoped>
.btn-center {
  left: 50%;
  transform: translateX(-50%);
}
</style>
