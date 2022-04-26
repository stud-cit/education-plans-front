<template>
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
              v-model="title"
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
              item-text="name"
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
              :loading="departmentsLoading"
              item-text="name"
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
              v-model="fieldKnowledge"
              :items="fieldsKnowledge"
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
            <v-autocomplete
              v-model="year"
              :items="years"
              :error-messages="errors"
              label="Рік прийому"
            ></v-autocomplete>
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
              v-model="credits"
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
</template>

<script>
import api from "@/api";
import {API} from "@/api/constants-api";

export default {
  name: "General",
  props: {
    fields: {
      required: true,
    }
  },
  data() {
    return {
      title: null,
      faculty: null,
      faculties: [],
      department: null,
      departments: [],
      departmentsLoading: false,
      educationLevel: null,
      educationsLevel: [],
      formStudy: null,
      formsStudy: [],
      termStudy: null,
      termsStudy: [],
      year: new Date().getFullYear(),
      years: this.fakerYears(),
      numberSemesters: null,
      speciality: null,
      specialities: [],
      specialization: null,
      educationalProgram: null,
      educationalPrograms: [],
      qualification: null,
      qualifications: [],
      fieldKnowledge: null,
      fieldsKnowledge: [],
      formOrganizationStudy: null,
      formsOrganizationStudy: [],
      credits: null,
    }
  },
  watch: {
    faculty(v) {
      v !== null ? this.apiGetDepartments(v) : this.departments = [];
    },
    termStudy(v) {
      this.numberSemesters = v !== null ? v.number_semesters : null
    },
    fields(v) {
      this.faculties = v.faculties ?? [];
      this.educationsLevel = v.educations_level ?? [];
      this.formsStudy = v.forms_study ?? [];
      this.termsStudy = v.terms_study ?? [];
      this.educationalPrograms = v.educational_programs ?? [];
      this.specialities = v.specialities ?? [];
      this.qualifications = v.qualifications ?? [];
      this.specialities = v.specialities ?? [];
      this.fieldsKnowledge = v.fields_knowledge ?? [];
      this.formsOrganizationStudy = v.forms_organizationStudy ?? [];
    }
  },
  methods: {
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
    apiGetDepartments(id) {
      this.departmentsLoading = true;

      api.show(API.DEPARTMENTS, id).then(({data}) => {
        this.departments = data.data
        this.departmentsLoading = false;
      })
    },

    submit() {
      this.$refs.observer.validate().then((validated) => {
        if (validated) {
          const data = {
            title: this.title,
            faculty_id: this.faculty,
            department_id: this.department,
            education_level_id: this.educationLevel,
            form_study_id: this.formStudy,
            study_term_id: this.termStudy.id,
            year: this.year,
            number_semesters: this.numberSemesters,
            // specialityId: this.speciality,//todo
            specialization_id: this.speciality,
            specialization: this.specialization,
            education_program_id: this.educationalProgram,
            qualification_id: this.qualification,
            field_knowledge_id: this.fieldKnowledge,
            form_organization_id: this.formOrganizationStudy,
            credits: this.credits,
          };

          this.$emit('submit', data)
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
