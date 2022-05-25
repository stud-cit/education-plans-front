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
              :disabled="edit"
            ></v-autocomplete>
          </validation-provider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="py-0 mt-3">
          <table>
            <thead>
              <tr v-if="hoursWeek.length && studyTerm">
                <td :colspan="studyTerm.course * 4">
                  Кількість тижнів у модульному атестаційному циклі
                </td>
              </tr>
            </thead>
            <tbody>
            <tr v-if="hoursWeek.length && studyTerm">
              <td v-for="(course, ind) in studyTerm.course" :key="ind" :colspan="4">
                {{course}} курс
              </td>
            </tr>
            <tr v-if="hoursWeek.length">
              <template  v-for="element in hoursWeek">
                <td v-for="item in 4" :key="element.course +'-'+ item">
                  <validation-provider
                      v-slot="{ errors }"
                      rules="required|numeric|min:1|max:2|min_value:1"
                      name="Кількість тижнів у модульному атестаційному циклі"
                      :vid="'cw_' + element.course + '_' + item"
                    >
                    <v-text-field
                        v-model="element.weeks[item-1]"
                        :error-messages="errors"
                        required
                        type="number"
                        :min="1"
                        :max="16"
                        dense
                        hide-details
                      ></v-text-field>
                  </validation-provider>
                </td>
              </template>
            </tr>
            </tbody>
          </table>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pb-0">
          <table>
            <thead>
            <tr v-if="maxHoursSemesters.length && studyTerm">
              <td :colspan="studyTerm.course * 4">
                Максимальна кількість годин за семестрами
              </td>
            </tr>
            </thead>
            <tbody>
            <tr v-if="maxHoursSemesters.length && studyTerm">
              <td v-for="(course, ind) in studyTerm.course" :key="ind" :colspan="4">
                {{course}} курс
              </td>
            </tr>
            <tr v-if="maxHoursSemesters.length && studyTerm">
              <td v-for="(semester, ind) in studyTerm.semesters" :key="ind" :colspan="2">
                {{semester}} семестр
              </td>
            </tr>
            <tr v-if="maxHoursSemesters.length">
              <template  v-for="element in maxHoursSemesters">
                <td v-for="item in 2" :key="element.semester +'-'+ item">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required|numeric|min:1|max:2|min_value:1"
                    name="Кількість тижнів у модульному атестаційному циклі"
                    :vid="'cw_' + element.semester + '_' + item"
                  >
                    <v-text-field
                      v-model="element.hours[item-1]"
                      :error-messages="errors"
                      required
                      type="number"
                      :min="1"
                      :max="16"
                      dense
                      hide-details
                    ></v-text-field>
                  </validation-provider>
                </td>
              </template>
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
      educationalProgram: null,
      educationalPrograms: [],
      qualification: null,
      qualifications: [],
      fieldKnowledge: null,
      fieldsKnowledge: [],
      formOrganizationStudy: null,
      formsOrganizationStudy: [],
      credits: null,
      hoursWeek: [],
      maxHoursSemesters: []
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
        this.formOrganizationStudy = this.plan.form_organization_id
        this.credits = this.plan.credits;
      }
    },
    faculty(v) {
      v !== null ? this.apiGetDepartments(v) : this.departments = [];
    },
    studyTerm(v) {
      if (v !== null) {
        this.numberSemesters = v.semesters;
        if (this.plan &&
          v.id === this.plan.study_term_id &&
          this.checkValueTable('hours_week', this.plan) &&
          this.checkValueTable('max_hours_semesters', this.plan)
        ) {
          this.hoursWeek = JSON.parse(this.plan.hours_week);
          this.maxHoursSemesters = JSON.parse(this.plan.max_hours_semesters);
        } else {
          this.buildTable(v.course, 'hoursWeek', ['course', 'weeks'])
          this.buildTable(v.semesters, 'maxHoursSemesters', ['semester', 'hours'])
        }
      } else {
        this.numberSemesters = null;
        this.hoursWeek = [];
        this.maxHoursSemesters = [];
      }
    },
  },
  methods: {
    buildTable(obj, vName, template = ['iterator', 'items'], defaultVal = []) {
      this[vName] = defaultVal;
      for (let i = 0; i < obj;) {
        let temp = {[template[0]]: ++i, [template[1]]: []}
        this[vName].push(temp);
      }
    },
    checkValueTable(key, obj) {
      if (obj[key] !== null) {
        if (JSON.parse(obj[key]).length) {
          return true;
        }
      }
      return false;
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
            max_hours_semesters: JSON.stringify(this.maxHoursSemesters),
            hours_week: JSON.stringify(this.hoursWeek),
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
  margin: auto;
  border: 1px solid #dee2e6;
  border-collapse: collapse;
}
table td {
  text-align: center;
  color: #000;
  font-size: 14px;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}
</style>
