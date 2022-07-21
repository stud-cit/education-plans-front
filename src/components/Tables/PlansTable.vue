<template>
  <v-data-table
      :headers="headers"
      :items="items"
      :server-items-length="meta.total"
      :options.sync="options"
      :footer-props="{ 'items-per-page-options' : [15,25,50] }"
      class="elevation-1 plans-table"
      :item-class="itemRowBackground"
  >
    <template v-slot:top>
      <v-row>
        <v-col cols="12" md="6">
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
          <v-btn
              color="primary"
              outlined
              class="ml-2"
              @click="search"
          >
            Пошук
          </v-btn>
          <v-btn
              color="primary"
              class="ml-2"
              outlined
              :input-value="filterToggle"
              @click="filterToggle = !filterToggle"
          >
            <v-icon>
              mdi-filter
            </v-icon>
          </v-btn>
          <v-btn
            color="primary"
            class="ml-2"
            outlined
            @click="clear"
          >
            Очистити
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-show="filterToggle" class="px-4 pb-4">
        <v-col cols="12" lg="6" v-if="exceptRoles([ROLES.ID.department])">
          <v-autocomplete
            v-model="faculty"
            :items="faculties"
            item-text="name"
            item-value="id"
            label="Факультет"
            hide-details
            :readonly="!exceptRoles([ROLES.ID.department, ROLES.ID.faculty_institute])"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" lg="6" v-if="exceptRoles([ROLES.ID.department])">
          <v-autocomplete
            v-model="department"
            :items="departments"
            item-text="name"
            item-value="id"
            label="Кафедра"
            hide-details
            :loading="departmentsLoading"
            :readonly="!exceptRoles([ROLES.ID.department])"
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
          ></v-select>
        </v-col>
      </v-row>

    </template>

    <template v-slot:item.index="{ index }">
      {{ (meta.current_page - 1) * meta.per_page + (index + 1) }}
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
        v-if="item.actions.preview"
        small
        class="mr-1"
        color="primary"
        @click="$emit('preview', item.id, item.title)"
      >
        mdi-eye-outline
      </v-icon>
      <v-icon
          v-if="item.actions.copy"
          small
          class="mr-1"
          color="primary"
          @click="$emit('copy', item.id, item.title)"
      >
        mdi-content-copy
      </v-icon>
      <v-icon
          v-if="item.actions.edit"
          small
          class="mr-1"
          color="primary"
          @click="$emit('edit', item.id, item.title)"
      >
        mdi-pencil-outline
      </v-icon>
      <v-icon
          v-if="item.actions.delete"
          small
          color="red"
          @click="$emit('delete', item.id, item.title)"
      >
        mdi-trash-can-outline
      </v-icon>
    </template>


  </v-data-table>
</template>

<script>
import api from "@/api";
import {API} from "@/api/constants-api";
import RolesMixin from "@/mixins/RolesMixin";
import {ROLES} from "@/utils/constants";
import {mapGetters} from "vuex";

export default {
  name: "PlansTable",
  data() {
    return {
      ROLES,
      filterToggle: false,
      searchTitle: '',
      headers: [
        {text: '№', value: 'index', sortable: false},
        {text: 'Id', value: 'id', sortable: false},
        {text: 'Тип', value: 'is_template', sortable: false},
        {text: 'Назва', value: 'title'},
        {text: 'Факультет', value: 'faculty', sortable: false},
        {text: 'Кафедра', value: 'department', sortable: false},
        {text: 'Рік', value: 'year', width: '80px'},
        {text: 'Дата створення', value: 'created_at', width: '150px'},
        {text: 'Дії', value: 'actions', width: '120px', sortable: false},
      ],
      faculty: null,
      faculties: [],
      department: null,
      departments: [],
      departmentsLoading: false,
      division: null,
      divisions: [],
      verificationDivisionStatus: 1,
      verificationsDivisionsStatus: [],
    }
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    meta: {
      type: Object,
      default: () => {
      }
    },
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    loading() {
      return this.$store.state.plans.loading
    },
    options: {
      get: function () {
        return this.$store.state.plans.options
      },
      set: function (newValue) {
        this.$store.dispatch('plans/setOptions', newValue)
        this.update()
      }
    }
  },
  mixins: [RolesMixin],
  watch: {
    faculty(v) {
      v !== null ? this.apiGetDepartments(v) : this.departments = [];
    },
    division(v) {
      if (v === null) {
        this.options.divisionWithStatus = null
      }
    },
    faculties(v) {
      if (v.length === 1 && this.allowedRoles([ROLES.ID.faculty_institute, ROLES.ID.department])) {
        this.faculty = v[0].id;
      }
    },
    departments(v) {
      if (v.length && this.allowedRoles([ROLES.ID.department])) {
        const department = v.find((i) => i.id === this.user.department_id)
        this.department = department ? department.id : null;
      }
    }
  },
  mounted() {
    this.apiGetDivisions();
  },
  methods: {
    update() {
      this.$emit('update', this.options)
    },
    search() {
      this.options.searchTitle = this.searchTitle;

      if (this.exceptRoles([ROLES.ID.department])) {
        this.options.faculty = this.faculty;
        this.options.department = this.department;
      }

      if (this.division !== null) {
        this.options.divisionWithStatus = [this.division, this.verificationDivisionStatus];
      }
      this.resetPage();
    },
    resetPage() {
      if (this.options.page == 1) {
        this.update();

      } else {
        this.options.page = 1;
      }
    },
    clear() {
      this.searchTitle = this.options.searchTitle = '';

      if (this.exceptRoles([ROLES.ID.department])) {
        this.department = null;
      }

      if (this.exceptRoles([ROLES.ID.faculty_institute,ROLES.ID.department])) {
        this.faculty = null;
      }

      this.options.faculty = null;
      this.options.department = null;
      this.division = this.options.divisionWithStatus = null;
      this.resetPage();
    },
    apiGetDivisions() {
      api.get(API.PLAN_FILTERS).then(({data}) => {
        this.divisions = data.divisions
        this.verificationsDivisionsStatus = data.verificationsStatus
        this.faculties = data.faculties
      })
    },
    apiGetDepartments(id) {
      this.departmentsLoading = true;

      api.show(API.DEPARTMENTS, id).then(({data}) => {
        this.departments = data.data
        this.departmentsLoading = false;
      })
    },
    itemRowBackground (item) {
      return item.status + ' lighten-5'
    }
  },
}
</script>

<style>
</style>
