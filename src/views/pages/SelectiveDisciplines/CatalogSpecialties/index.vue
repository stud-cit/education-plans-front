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
              v-model="specialty"
              :items="specialties"
              item-text="title"
              item-value="id"
              label="Спеціальність"
              hide-details
              clearable
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row class="px-4 pb-4">
          <v-col cols="12" lg="6">
            <v-autocomplete
              v-model="faculty"
              :items="faculties"
              item-text="name"
              item-value="id"
              label="Факультет"
              :loading="facultiesLoading"
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
              label="Кафедра"
              hide-details
              :loading="departmentsLoading"
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" lg="6">
            <v-autocomplete
              v-model="division"
              :items="divisions"
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
              :items="verificationsDivisionsStatus"
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
        <router-link v-if="item.actions.preview" :to="{ name: 'CatalogSpecialty', params:{id: item.id} }" target="_blank">
          <v-icon  small class="mr-2" color="primary">mdi-eye</v-icon>
        </router-link>
        <v-icon v-if="item.actions.edit" small class="mr-2 cursor-pointer" color="primary">mdi-pencil</v-icon>
        <v-icon v-if="item.actions.copy" small class="mr-1 cursor-pointer" color="primary">mdi-content-copy</v-icon>
        <v-icon v-if="item.actions.delete" small class="mr-2 cursor-pointer" color="red">mdi-trash-can-outline</v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import GlobalMixin from "@/mixins/GlobalMixin";
import {ALLOWED_REQUEST_PARAMETERS, API} from "@/api/constants-api";
import api from "@/api";

export default {
  name: "CatalogSpecialties",
  data() {
    return {
      years: [],
      year: new Date().getFullYear(),

      specialties: [],
      specialty: null,

      faculties: [],
      faculty: null,
      facultiesLoading: false,

      departments: [],
      department: null,
      departmentsLoading: false,

      divisions: [],
      division: null,

      verificationsDivisionsStatus: [],
      verificationDivisionStatus: 1,

      headers: [
        { text: '№', value: 'index', sortable: false, width: '20px' },
        { text: 'Рік', value: 'year', sortable: false },
        { text: 'Спеціальність', value: 'speciality', sortable: false },
        { text: 'Кафедра', value: 'department', sortable: false },
        { text: 'Дії', value: 'actions', sortable: false, width: '140px' },
      ],
      items: [],
      meta: [],
      options: null,
    }
  },
  mounted() {
    this.apiGetItems();
  },
  watch: {
    faculty(v) {
      v !== null ? this.apiGetDepartments(v) : (this.departments = []);
    },
    faculties(v) {
      if (v.length === 1) {
        this.faculty = v[0].id;
      }
    },
    options(v) {
      v.year = new Date().getFullYear();
      this.apiGetItems();
    },
  },
  methods: {
    async apiGetItems() {
      const options = GlobalMixin.methods.GlobalHandlingRequestParameters(
        ALLOWED_REQUEST_PARAMETERS.GET_CATALOG_CATALOG_SPECIALTIES,
        this.options,
      );
      try {
        const response = await api.get(API.CATALOG_SPECIALTIES, options, { showLoader: true });
        const { data } = response;
        this.items = data.data;
        this.meta = data.meta;
      } catch (e) {
        console.error(e); // TODO: show error
      }
    },
    clear() {
      this.options.year = null;
      this.specialty = this.options.specialty = null;
      this.faculty = this.options.faculty = null;
      this.department = this.options.department = null;
      this.division = this.options.divisionWithStatus = null;
      this.apiGetItems();
    },
    search() {
      this.options.year = this.year;
      this.options.group = this.group;
      this.options.faculty = this.faculty;
      this.options.department = this.department;
      if (this.division !== null) {
        this.options.divisionWithStatus = [this.division, this.verificationDivisionStatus];
      }
      this.apiGetItems();
    },
  }
}
</script>

<style scoped>

</style>
