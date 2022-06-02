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
        <v-col cols="12" class="pb-0">
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
      </v-row>
      <v-row>
        <v-col cols="12" class="pb-0">
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
      </v-row>
      <v-row>
        <v-col cols="12" class="pb-0">
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
      </v-row>
      <v-row>
        <v-col cols="12" class="pb-0">
          <validation-provider
            v-slot="{ errors }"
            name="Спеціалізація"
            rules=""
          >
            <v-autocomplete
              v-model="specialization"
              :items="specializations"
              :loading="specializationsLoading"
              :error-messages="errors"
              item-text="title"
              item-value="id"
              label="Спеціалізація"
              :disabled="specializations.length === 0"
            ></v-autocomplete>
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
              :disabled="edit"
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
              v-model="studyTerm"
              :items="termsStudy"
              :error-messages="errors"
              item-text="title"
              label="Термін навчання"
              return-object
              :disabled="edit"
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
        <v-col cols="12" class="py-0">
          <v-checkbox
            v-model="published"
            label="Відкрити спільний доступ"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row v-if="objHoursWeeks.length">
        <v-col>
          <table>
            <thead>
              <tr>
                <td v-for="course in studyTerm.course" :key="course" :colspan="objHoursWeeks.length / studyTerm.semesters * 2">
                  {{course}} курс
                </td>
              </tr>
              <tr>
                <td v-for="semester in studyTerm.semesters" :key="semester" :colspan="objHoursWeeks.length / studyTerm.semesters">
                  {{semester}} семестр
                </td>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td :colspan="objHoursWeeks.length">
                  Кількість тижнів у модульному атестаційному циклі
                </td>
              </tr>
              <tr>
                <td v-for="(item, index) in objHoursWeeks" :key="index">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required|numeric|min:1|min_value:1"
                    name="Кількість тижнів у модульному атестаційному циклі"
                    :vid="'weeds_' + item.index + '_' + item.course"
                  >
                    <v-text-field
                      v-model.number="item.week"
                      :error-messages="errors"
                      required
                      type="number"
                      :min="1"
                      dense
                      hide-details
                    ></v-text-field>
                  </validation-provider>
                </td>
              </tr>

              <tr>
                <td :colspan="objHoursWeeks.length">
                  Максимальна кількість годин за семестрами
                </td>
              </tr>
              <tr>
                <td v-for="(item, index) in objHoursWeeks" :key="index">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required|numeric|min:1|min_value:1"
                    name="Максимальна кількість годин за семестрами"
                    :vid="'hours_' + item.index + '_' + item.course"
                  >
                    <v-text-field
                      v-model.number="item.hour"
                      :error-messages="errors"
                      required
                      type="number"
                      :min="1"
                      dense
                      hide-details
                    ></v-text-field>
                  </validation-provider>
                </td>
              </tr>
            </tbody>
          </table>
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
import { FORM_ORGANIZATIONS_TABLE } from "@/utils/constants"

export default {
  name: "General",
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
      studyTerm: null,
      termsStudy: [],
      year: new Date().getFullYear(),
      years: this.fakerYears(),
      numberSemesters: null,
      speciality: null,
      specialities: [],
      specialization: null,
      specializations: [],
      specializationsLoading: false,
      educationalProgram: null,
      educationalPrograms: [],
      qualification: null,
      qualifications: [],
      fieldKnowledge: null,
      fieldsKnowledge: [],
      formOrganizationStudy: null,
      formsOrganizationStudy: [],
      credits: null,
      objHoursWeeks: [],
      published: false
    }
  },
  props: {
    plan: {
      type: Object,
      default(){
        return null;
      },
      required: false
    },
    edit: {
      type: Boolean
    },
  },
  mounted() {
    this.apiGetFields();
  },
  watch: {
    plan(v) {
      if (v !== null) {
        this.title = this.plan.title;
        this.faculty = this.plan.faculty_id;
        this.department = this.plan.department_id;
        this.educationLevel = this.plan.education_level_id;
        this.formStudy = this.plan.form_study_id;
        setTimeout(() => { this.studyTerm = this.termsStudy.find((el => el.id === this.plan.study_term_id))},0);
        this.year = this.plan.year;
        this.speciality = this.plan.speciality_id;
        this.specialization =  this.plan.specialization;
        this.educationalProgram = this.plan.education_program_id;
        this.qualification = this.plan.qualification_id;
        this.fieldKnowledge = this.plan.field_knowledge_id;
        this.formOrganizationStudy = this.plan.form_organization_id;
        this.credits = this.plan.credits;
        this.published = this.plan.published;
      }
    },
    faculty(v) {
      v !== null ? this.apiGetDepartments(v) : this.departments = [];
    },
    studyTerm(v) {
      this.buildObjHoursWeeks();
      if (v !== null) {
        this.numberSemesters = v.semesters;
      }
    },
    formOrganizationStudy() {
      this.buildObjHoursWeeks();
    },
    speciality(v) {
      v !== null ? this.apiGetSpecializations(v) : this.specializations = [];
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
    apiGetFields() {
      api.get(API.PLAN_CREATE).then(({data}) => {
        this.faculties = data.faculties ?? [];
        this.educationsLevel = data.educations_level ?? [];
        this.formsStudy = data.forms_study ?? [];
        this.termsStudy = data.terms_study ?? [];
        this.educationalPrograms = data.educational_programs ?? [];
        this.specialities = data.specialities ?? [];
        this.qualifications = data.qualifications ?? [];
        this.specialities = data.specialities ?? [];
        this.fieldsKnowledge = data.fields_knowledge ?? [];
        this.formsOrganizationStudy = data.forms_organizationStudy ?? [];
      })
    },
    apiGetDepartments(id) {
      this.departmentsLoading = true;

      api.show(API.DEPARTMENTS, id).then(({data}) => {
        this.departments = data.data
        this.departmentsLoading = false;
      })
    },
    apiGetSpecializations(id) {
      this.specializationsLoading = true;

      api.show(API.SPECIALIZATIONS, id).then(({data}) => {
        this.specializations = data.data
        this.specializationsLoading = false;
      })
    },
    buildObjHoursWeeks() {
      const result = [];
      const studyTerm = this.studyTerm;
      const formOrganization = this.formOrganizationStudy;

      if (studyTerm !== null && formOrganization !== null ) {

        if (this.plan !== null &&
          studyTerm.id === this.plan.study_term_id &&
          formOrganization === this.plan.form_organization_id &&
          this.plan.hours_weeks_semesters
        ) {
          this.objHoursWeeks = this.plan.hours_weeks_semesters;
          return;
        }

        let currentSemester = 1;
        for (let course = 1; course <= studyTerm.course; course++) {
          const obj = {course};
          for (let semester = 1; semester <= 2; semester++ ) {
            if (currentSemester <= studyTerm.semesters) {
              obj.semester = currentSemester;

              for (let item = 1; item <= FORM_ORGANIZATIONS_TABLE[formOrganization]; item++ ) {
                result.push(
                  {
                    ...obj,
                    week: '',
                    hour: '',
                    index: item,
                  }
                );
              }
            }
            currentSemester++;
          }
        }
        this.objHoursWeeks = result;

      } else {
        this.objHoursWeeks = [];
      }
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
            study_term_id: this.studyTerm.id,
            year: this.year,
            number_semesters: this.numberSemesters,
            speciality_id: this.speciality,
            specialization: this.specialization,
            education_program_id: this.educationalProgram,
            qualification_id: this.qualification,
            field_knowledge_id: this.fieldKnowledge,
            form_organization_id: this.formOrganizationStudy,
            credits: this.credits,
            hours_weeks_semesters: JSON.stringify(this.objHoursWeeks),
            published: this.published,
          };

          this.$emit('submit', data)
        }
      });
    },
  }
}
</script>

<style lang="css" scoped>
table {
  width: 100%;
  border: 1px solid #dee2e6;
  border-collapse: collapse;
  width: 100%;
}
table td {
  text-align: center;
  color: #000;
  font-size: 14px;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}
</style>
