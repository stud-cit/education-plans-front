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
        <v-toolbar-title>Налаштування: <span v-if="catalog">{{catalog.title}}</span></v-toolbar-title>
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
          Обмеження доступу
        </v-tab>
        <v-tab>
          Підписи
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card max-width="1024" class="mx-auto py-10" elevation="0" >
            <validation-observer
              ref="create"
              v-slot="{ invalid }"
            >
              <form @submit.prevent="saveOwners" @keyup.enter="saveOwners">
                <validation-provider
                  v-slot="{ errors }"
                  name="Кафедрам, яким буде наданий доступ"
                >
                  <v-autocomplete
                    v-model="department"
                    :items="departments"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    return-object
                    class="mt-3"
                    chips
                    deletable-chips
                    multiple
                    :loading="departmentsLoading"
                    label="Кафедрам, яким буде наданий доступ"
                  ></v-autocomplete>
                </validation-provider>
                <v-btn
                  color="primary"
                  @click="saveOwners"
                  :disabled="invalid"
                >
                  Зберегти
                </v-btn>
              </form>
            </validation-observer>

          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card max-width="1024" class="mx-auto py-10" elevation="0" >
            <validation-observer
              ref="signatures"
              v-slot="{ invalid }"
            >
              <form @submit.prevent="saveSignatures" @keyup.enter="saveSignatures">
                <validation-provider
                  v-slot="{ errors }"
                  name="Голова Ради з якості інституту (факультету)"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="headSignature"
                    :items="workers"
                    :error-messages="errors"
                    item-text="full_name"
                    item-value="asu_id"
                    return-object
                    class="mt-3"
                    label="Голова Ради з якості інституту (факультету) "
                  ></v-autocomplete>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Керівник групи забезпечення спеціальності"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="leaderSignature"
                    :items="workers"
                    :error-messages="errors"
                    item-text="full_name"
                    item-value="asu_id"
                    return-object
                    class="mt-3"
                    label="Керівник групи забезпечення спеціальності"
                  ></v-autocomplete>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Завідувач кафедри "
                  rules="required"
                >
                  <v-autocomplete
                    v-model="managerSignature"
                    :items="workers"
                    :error-messages="errors"
                    item-text="full_name"
                    item-value="asu_id"
                    return-object
                    class="mt-3"
                    label="Завідувач кафедри"
                  ></v-autocomplete>
                </validation-provider>
                <v-btn
                  color="primary"
                  @click="saveSignatures"
                  :disabled="invalid"
                >
                  Зберегти
                </v-btn>
              </form>
            </validation-observer>
          </v-card>
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
  name: "settingCatalogModal",
  data() {
    return {
      department: null,
      departments: [],
      departmentsLoading: false,
      workers: [],
      headSignature: null,
      leaderSignature: null,
      managerSignature: null,


      headers: [
        { text: '№', value: 'index', sortable: false, width: '20px' },
        { text: 'Рік', value: 'year', sortable: false },
        { text: 'Назва групи', value: 'group_name', sortable: false },
      ],
      items: [],
      meta: [],
      options: null,

      catalogs: [],
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
    dialog(v) {
      if (v === true) {
        this.apiGetDepartments();
        this.apiGetWorkers();
      }
    },
    catalog(v) {
      if (v !== null && 'owners' in v) {
        this.department = v.owners;
      }
    },
    tab(v) {
      switch (v) {
        case 0:
          this.apiGetYears();
          break;
        case 1:
          this.years = this.GlobalFakerYears();
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
    catalog: null,
  },
  methods: {
    apiGetDepartments() {
      api.get(API.DEPARTMENTS).then(({ data }) => {
        this.departments = data.data;
        this.departmentsLoading = false;
      });
    },
    apiGetWorkers() {
      api.get(API.LIST_WORKERS).then((response) => {
        const { data } = response;
        this.workers = data;
      });
    },

    close() {
      this.$emit('close');
    },

    saveOwners() {
      const data = {
        id: this.catalog.id,
        owners: this.department
      }
      api.patch(API.SAVE_SPECIALITY_OWNERS, this.catalog.id, data).then((response) => {
        const { message } = response.data;

        this.$swal.fire({
          position: 'center',
          icon: 'success',
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });
      })
    },

    saveSignatures() {
      // const data = {
      //   id: this.catalog.id,
      //   owners: this.department
      // }
      // api.patch(API.SAVE_SPECIALITY_OWNERS, this.catalog.id, data).then((response) => {
      //   const { message } = response.data;
      //
      //   this.$swal.fire({
      //     position: 'center',
      //     icon: 'success',
      //     title: message,
      //     showConfirmButton: false,
      //     timer: 1500,
      //   });
      // })
    },






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
