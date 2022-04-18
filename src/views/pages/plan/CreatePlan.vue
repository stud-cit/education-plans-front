<template>
  <v-container>
    <validation-observer
        ref="observer"
        v-slot="{ invalid }"
    >
      <form @submit.prevent="submit" @keyup.enter="submit">
        <v-row>
          <v-col cols="12" class="pb-0">
            <validation-provider
                v-slot="{ errors }"
                name="Назва плану"
                rules="required"
            >
              <v-text-field
                  v-model="name"
                  :error-messages="errors"
                  label="Назва плану"
                  required
              ></v-text-field>
            </validation-provider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Факультет"
                rules="required"
            >
              <v-autocomplete
                  v-model="faculty"
                  :items="faculties"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  label="Факультет"
              ></v-autocomplete>
            </validation-provider>
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Кафедра"
                rules="required"
            >
              <v-autocomplete
                  v-model="department"
                  :items="departments"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  label="Кафедра"
              ></v-autocomplete>
            </validation-provider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Освітній (Освітньо-науковий) рівень"
                rules="required"
            >
              <v-autocomplete
                  v-model="educationLevel"
                  :items="educationsLevel"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  label="Освітній (Освітньо-науковий) рівень"
              ></v-autocomplete>
            </validation-provider>
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Форма навчання"
                rules="required"
            >
              <v-autocomplete
                  v-model="formStudy"
                  :items="formsStudy"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  label="Форма навчання"
              ></v-autocomplete>
            </validation-provider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Термін навчання"
                rules="required"
            >
              <v-autocomplete
                  v-model="termStudy"
                  :items="termsStudy"
                  :error-messages="errors"
                  item-text="title"
                  label="Термін навчання"
                  return-object
              ></v-autocomplete>
            </validation-provider>
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Кількість семестрів"
                rules="required"
            >
              <v-text-field
                  v-model="numberSemesters"
                  :error-messages="errors"
                  label="Кількість семестрів"
                  disabled
                  required
              ></v-text-field>
            </validation-provider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Спеціальність"
                rules="required"
            >
              <v-autocomplete
                  v-model="speciality"
                  :items="specialities"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  label="Спеціальність"
              ></v-autocomplete>
            </validation-provider>
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Спеціалізація"
                rules=""
            >
              <v-text-field
                  v-model="specialization"
                  :error-messages="errors"
                  label="Спеціалізація"
              ></v-text-field>
            </validation-provider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Освітня програма"
                rules="required"
            >
              <v-autocomplete
                  v-model="educationalProgram"
                  :items="educationalPrograms"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  label="Освітня програма"
              ></v-autocomplete>
            </validation-provider>
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Кваліфікація"
                rules="required"
            >
              <v-autocomplete
                  v-model="qualification"
                  :items="qualifications"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  label="Кваліфікація"
              ></v-autocomplete>
            </validation-provider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Галузь знань "
                rules="required"
            >
              <v-autocomplete
                  v-model="branchKnowledge"
                  :items="branchesKnowledge"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  label="Галузь знань "
              ></v-autocomplete>
            </validation-provider>
          </v-col>
          <v-col cols="12" md="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Рік прийому"
                rules="required|numeric|digits:4"
            >
              <v-text-field
                  v-model="year"
                  label="Рік прийому"
                  :error-messages="errors"
                  readonly
                  @click="() => visibleDatePicker = !visibleDatePicker"
              ></v-text-field>
              <VueDatePicker
                  v-model="year"
                  name="Рік прийому"
                  :visible="visibleDatePicker"
                  type="year"
                  placeholder="YYYY"
                  @onClose="visibleDatePicker = false"
                  fullscreen-mobile
                  v-show="false"
              />
            </validation-provider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Обсяг плану в кредитах"
                rules="required|numeric|min:1|max:3|min_value:1"
            >
              <v-text-field
                  v-model="volumePlanCredits"
                  :error-messages="errors"
                  label="Обсяг плану в кредитах"
                  required
                  type="number"
                  :min="1"
                  :max="999"
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col cols="12" lg="6" class="py-0">
            <validation-provider
                v-slot="{ errors }"
                name="Форма організації навчання"
                rules="required"
            >
              <v-autocomplete
                  v-model="formOrganizationStudy"
                  :items="formsOrganizationStudy"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  label="Форма організації навчання"
                  required
              ></v-autocomplete>
            </validation-provider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
                class="mr-4"
                type="submit"
                color="primary"
                :disabled="invalid"
            >
              Зберегти
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </validation-observer>
  </v-container>
</template>

<script>
import {getApiSimulator} from "@/api/simulator-api"

export default {
  name: "CreatePlan",
  data() {
    return {
      name: null,
      visibleDatePicker: false,
      faculty: null,
      faculties: [],
      department: null,
      departments: [],
      educationLevel: null,
      educationsLevel: [],
      formStudy: null,
      formsStudy: [],
      termStudy: null,
      termsStudy: [],
      year: new Date().toISOString().substr(0, 4),
      numberSemesters: null,
      speciality: null,
      specialities: [],
      specialization: null,
      educationalProgram: null,
      educationalPrograms: [],
      qualification: null,
      qualifications: [],
      branchKnowledge: null,
      branchesKnowledge: [],
      formOrganizationStudy: null,
      formsOrganizationStudy: [],
      volumePlanCredits: null,
    }
  },
  watch: {
    faculty(v) {
      v !== null ? this.getDepartments(v) : this.departments = [];
    },
    termStudy(v) {
      this.numberSemesters = v !== null ? v.numberSemesters : null
    }
  },
  mounted() {
    this.apiGetFaculties();
    this.apiGetEducationsLevel();
    this.apiGetFormsStudy();
    this.apiGetTermsStudy();
    this.apiGetSpecialities();
    this.apiGetEducationalPrograms();
    this.apiGetQualifications();
    this.apiGetBranchesKnowledge();
    this.apiGetFormsOrganizationStudy();
  },
  methods: {
    submit() {
      this.$refs.observer.validate().then((validated) => {
        if (validated) {
          console.log('yes') //TODO: add submit api
        }
      });
    },

    getDepartments(id) {
      this.departments = this.apiGetDepartments(id);
    },

    apiGetDepartments(id) {
      const list = getApiSimulator('departments');
      return list.filter((item) => item.id_faculty === id) //TODO: get data from API
    },

    apiGetFaculties() {
      this.faculties = getApiSimulator('faculties');
    },

    apiGetEducationsLevel() {
      this.educationsLevel = getApiSimulator('educationsLevel');
    },

    apiGetFormsStudy() {
      this.formsStudy = getApiSimulator('formsStudy');
    },

    apiGetTermsStudy() {
      this.termsStudy = getApiSimulator('termsStudy');
    },

    apiGetSpecialities() {
      this.specialities = getApiSimulator('specialities');
    },

    apiGetEducationalPrograms() {
      this.educationalPrograms = getApiSimulator('educationalPrograms');
    },

    apiGetQualifications() {
      this.qualifications = getApiSimulator('qualifications');
    },

    apiGetBranchesKnowledge() {
      this.branchesKnowledge = getApiSimulator('branchesKnowledge');
    },

    apiGetFormsOrganizationStudy() {
      this.formsOrganizationStudy = getApiSimulator('formsOrganizationStudy');
    }
  }
}

</script>

<style scoped>

</style>
