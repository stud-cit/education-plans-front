<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
      :server-items-length="meta.total"
      :options.sync="options"
      :footer-props="{ 'items-per-page-options': [15, 25, 50] }"
    >
      <template v-slot:top>
        <v-row class="px-4 pt-3" v-if="catalog">
          <v-col>
            <p class="text-h6 mb-0 text-center">
              {{catalog.title}}
            </p>
          </v-col>
        </v-row>
        <v-row class="px-4 pb-4">
          <v-col cols="12" lg="6">
            <v-autocomplete
              v-model="faculty"
              :items="filters.faculties"
              item-text="name"
              item-value="id"
              label="Факультет що пропонує"
              hide-details
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" lg="6">
            <v-autocomplete
              v-model="department"
              :items="departments"
              item-text="name"
              item-value="id"
              label="Кафедра що пропонує"
              hide-details
              :loading="departmentsLoading"
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" lg="6">
            <v-autocomplete
              v-model="division"
              :items="filters.divisions"
              item-text="title"
              item-value="id"
              hide-details
              label="Представник відділу"
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" lg="6">
            <v-select
              v-model="verificationDivisionStatus"
              :items="filters.verificationsStatus"
              :disabled="division === null"
              item-text="title"
              item-value="id"
              select
              hide-details
              label="Статус верифікації"
              clearable
            ></v-select>
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
      <template v-slot:item.actions="{ item }">
        <v-icon v-if="item.actions.preview" small class="mr-2 cursor-pointer" color="primary">mdi-eye</v-icon>
        <v-icon v-if="item.actions.edit" small class="mr-2 cursor-pointer" color="primary">mdi-pencil</v-icon>
        <v-icon v-if="item.actions.delete" small class="mr-2 cursor-pointer" color="red">mdi-trash-can-outline</v-icon>
      </template>
    </v-data-table>

    <v-speed-dial v-model="nav" bottom right fixed direction="top" transition="slide-y-reverse-transition">
      <template v-slot:activator>
        <v-btn v-model="nav" color="blue darken-2" dark fab>
          <v-icon v-if="nav"> mdi-close </v-icon>
          <v-icon v-else> mdi-dots-vertical </v-icon>
        </v-btn>
      </template>
      <v-tooltip left color="info">
        <template v-slot:activator="{ on, attrs }">
          <v-fab-transition>
            <v-btn color="warning" small dark fab v-bind="attrs" v-on="on" @click="openDialogCatalog">
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
          </v-fab-transition>
        </template>
        <span>Налаштування каталога</span>
      </v-tooltip>
      <v-tooltip left color="info" v-if="options && options.year && options.group">
        <template v-slot:activator="{ on, attrs }">
          <v-fab-transition>
            <v-btn fab dark small color="red accent-4" v-bind="attrs" v-on="on" @click="openDialogPdf">
              <v-icon>mdi-pdf-box</v-icon>
            </v-btn>
          </v-fab-transition>
        </template>
        <span>PDF</span>
      </v-tooltip>
      <v-tooltip left color="info">
        <template v-slot:activator="{ on, attrs }">
          <v-fab-transition>
            <v-btn color="primary" small dark fab v-bind="attrs" v-on="on" @click="openDialogCreate">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-fab-transition>
        </template>
        <span>Додати дисципліну</span>
      </v-tooltip>
    </v-speed-dial>


    <CreateSpecialitySubjectModal
      :dialog="createModal"
      :catalog="catalog"
      @close="closeDialogCreate"
      @submit="store"
      ref="createModal"
    />
  </v-container>




</template>

<script>
import GlobalMixin from "@/mixins/GlobalMixin";
import {ALLOWED_REQUEST_PARAMETERS, API} from "@/api/constants-api";
import api from "@/api";
import CreateSpecialitySubjectModal from '@/views/pages/SelectiveDisciplines/CatalogSpecialties/createSubjectModal'

export default {
  name: "CatalogSpecialty",
  components: {
    CreateSpecialitySubjectModal
  },
  data() {
    return {
      nav: false,
      faculty: null,

      departments: [],
      department: null,
      departmentsLoading: false,

      division: null,
      verificationDivisionStatus: 1,

      headers: [
        { text: '№', value: 'index', sortable: false, width: '20px' },
        { text: 'Назва предмету', value: 'title', sortable: false },
        { text: 'Кафедра що пропонує', value: 'department', sortable: false },
        { text: 'Дії', value: 'actions', sortable: false, width: '140px' },
      ],
      items: [],
      meta: [],
      options: null,
      createModal: false,
      filters: {
        divisions: [],
        faculties: [],
        verificationsStatus: [],
      },
      catalog: null,
    }
  },
  watch: {
    faculty(v) {
      v !== null ? this.apiGetDepartments(v) : (this.departments = []);
    },
    options() {
      this.options.catalogSubject = this.$route.params.id;
      this.apiGetItems();
    },
  },
  methods: {
    async apiGetItems() {
      const options = GlobalMixin.methods.GlobalHandlingRequestParameters(
        ALLOWED_REQUEST_PARAMETERS.SPECIALTY_SUBJECTS,
        this.options,
      );
      try {
        const response = await api.get(API.SPECIALTY_SUBJECTS, options, { showLoader: true });
        const { data } = response;

        this.catalog = data.catalog;
        this.items = data.data;
        this.meta = data.meta;
      } catch (e) {
        console.error(e); // TODO: show error
      }
    },
    apiGetDepartments(id) {
      this.departmentsLoading = true;

      api.show(API.DEPARTMENTS, id).then(({ data }) => {
        this.departments = data.data;
        this.departmentsLoading = false;
      });
    },
    clear() {
      this.options.year = null;
      this.speciality = this.options.speciality = null;
      this.faculty = this.options.faculty = null;
      this.department = this.options.department = null;
      this.division = this.options.divisionWithStatus = null;
      this.apiGetItems();
    },
    search() {
      this.options.year = this.year;
      this.options.speciality = this.speciality;
      this.options.faculty = this.faculty;
      this.options.department = this.department;
      if (this.division !== null) {
        this.options.divisionWithStatus = [this.division, this.verificationDivisionStatus];
      }
      this.apiGetItems();
    },
    store(data) {
      api
        .post(API.SPECIALTY_SUBJECTS, data)
        .then((response) => {
          this.createModal = false;

          const { message } = response.data;
          this.$swal.fire({
            position: 'center',
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500,
          });

          this.apiGetItems();
          this.$refs.createModal.clear();
        })
        .catch((errors) => {
          this.$refs.createModal.setErrors(errors.response.data.errors);
        });
    },
    openDialogPdf() {

    },
    openDialogCatalog() {

    },
    openDialogCreate() {
      this.createModal = true;
    },
    closeDialogCreate() {
      this.createModal = false;
    },
  }
}
</script>

<style scoped>

</style>
