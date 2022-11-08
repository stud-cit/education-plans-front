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
        <v-toolbar-title>Створити дисципліну</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          dark
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>


      <validation-observer
        ref="observer"
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
                name="Назва дисципліни"
                rules="required"
                vid="title"
              >
                <v-autocomplete
                  v-model="discipline"
                  :items="disciplines"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  return-object
                  label="Назва дисципліни"
                ></v-autocomplete>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Інша назва дисципліни"
              >
                <v-text-field
                  label="Інша назва дисципліни"
                  v-model="anotherDiscipline"
                  :error-messages="errors"
                  :disabled="!discipline"
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Мова викладання"
                rules="required"
              >
                <v-autocomplete
                  v-model="language"
                  multiple
                  :items="languages"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  label="Мова викладання"
                ></v-autocomplete>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Рівень освіти, для якого пропонується дисципліна"
                rules="required"
              >
                <v-autocomplete
                  v-model="educationLevel"
                  :items="educationsLevel"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  persistent-hint
                  hint="(перший/другий/третій)"
                  label="Рівень освіти, для якого пропонується дисципліна"
                ></v-autocomplete>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Перелік галузей знань / спеціальностей, для яких пропонується дисципліна"
                rules="required"
                vid="knowledgeSpecialty"
              >
                <v-autocomplete
                  v-model="knowledgeSpecialty"
                  :items="knowledgeSpecialties"
                  :error-messages="errors"
                  item-text="title"
                  item-value="id"
                  return-object
                  class="mt-3"
                  label="Перелік галузей знань / спеціальностей, для яких пропонується дисципліна"
                ></v-autocomplete>
              </validation-provider>
              <validation-provider
                v-if="knowledgeSpecialty && knowledgeSpecialty.id === 2"
                v-slot="{ errors }"
                name="Перелік галузей знань / спеціальностей, для яких пропонується дисципліна"
                rules="required_if:knowledgeSpecialty.id,2"
                vid="title"
              >
                <v-radio-group
                  v-model="selectListKnowledgeSpecialties"
                  row
                  :error-messages="errors"
                >

                  <v-radio
                    v-for="radio in radioBtnListKnowledgeSpecialties"
                    :key="radio.id"
                    :label="radio.label"
                    :value="radio.id"
                  ></v-radio>
                </v-radio-group>
              </validation-provider>

              <validation-provider
                v-if="knowledgeSpecialty && knowledgeSpecialty.id === 2"
                v-slot="{ errors }"
                :name="radioBtnListKnowledgeSpecialties.find((el) => el.id === selectListKnowledgeSpecialties).label"
                rules="required_if:knowledgeSpecialty.id,2"
                vid="title"
              >
                <v-autocomplete
                  v-model="listKnowledgeSpecialties"
                  :items="listsKnowledgeSpecialties"
                  :error-messages="errors"
                  :item-text="radioBtnListKnowledgeSpecialties.find((el) => el.id === selectListKnowledgeSpecialties).itemText"
                  hide-details
                  item-value="id"
                  return-object
                  multiple
                  class="mt-3"
                  :label="radioBtnListKnowledgeSpecialties.find((el) => el.id === selectListKnowledgeSpecialties).label"
                ></v-autocomplete>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Кафедра, що пропонує дисципліну"
                rules="required"
                vid="title"
              >
                <v-autocomplete
                  v-model="department"
                  :items="departments"
                  :error-messages="errors"
                  item-text="name"
                  item-value="id"
                  return-object
                  class="mt-3"
                  label="Кафедра, що пропонує дисципліну"
                ></v-autocomplete>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Лекції"
                rules="required"
                vid="full_name"
              >
                <v-autocomplete
                  v-model="lecture"
                  :items="teachers"
                  :error-messages="errors"
                  item-text="full_name"
                  item-value="asu_id"
                  return-object
                  class="mt-3"
                  label="Лекції"
                  multiple
                ></v-autocomplete>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Семінарські та практичні заняття, лабораторні роботи"
                rules="required"
                vid="full_name"
              >
                <v-autocomplete
                  v-model="practice"
                  :items="teachers"
                  :error-messages="errors"
                  item-text="full_name"
                  item-value="asu_id"
                  return-object
                  class="mt-3"
                  label="Семінарські та практичні заняття, лабораторні роботи"
                  multiple
                ></v-autocomplete>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Загальна компетентність, на формування або розвиток якої спрямована дисципліна"
                rules="required"
                vid="title"
              >
                <v-combobox
                  v-model="generalCompetence"
                  :items="helpersGeneralCompetence"
                  item-value="id"
                  item-text="title"
                  :error-messages="errors"
                  label="Загальна компетентність, на формування або розвиток якої спрямована дисципліна"
                ></v-combobox>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Результати навчання за навчальною дисципліною"
                rules="required"
                vid="title"
              >
                <v-combobox
                  v-model="resultsOfStudy"
                  :items="helpersResultsOfStudy"
                  item-value="id"
                  item-text="title"
                  :error-messages="errors"
                  label="Результати навчання за навчальною дисципліною"
                ></v-combobox>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Види навчальних занять та методи викладання, що пропонуються"
                rules="required"
                vid="title"
              >
                <v-combobox
                  v-model="typesTrainingSessions"
                  :items="helpersTypesTrainingSessions"
                  item-value="id"
                  item-text="title"
                  :error-messages="errors"
                  label="Види навчальних занять та методи викладання, що пропонуються"
                ></v-combobox>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Кількість здобувачів, які можуть записатися на дисципліну"
                rules="required|numeric"
                vid="title"
              >
                <v-text-field
                  v-model="numberAcquirers"
                  :error-messages="errors"
                  type="number"
                  label="Кількість здобувачів, які можуть записатися на дисципліну"
                ></v-text-field>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Вхідні вимоги до здобувачів, які хочуть обрати дисципліну/вимоги до матеріально-технічного забезпечення"
                rules="required"
                vid="title"
              >
                <v-combobox
                  v-model="requirements"
                  :items="helpersRequirements"
                  item-value="id"
                  item-text="title"
                  :error-messages="errors"
                  label="Вхідні вимоги до здобувачів, які хочуть обрати дисципліну/вимоги до матеріально-технічного забезпечення"
                ></v-combobox>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Обмеження щодо семестру вивчення"
                rules="required"
                vid="restrictionsSemester"
              >
                <v-radio-group
                  v-model="restrictionsSemester"
                  row
                  :error-messages="errors"
                >

                  <v-radio
                    v-for="radio in radioRestrictionsSemester"
                    :key="radio.id"
                    :label="radio.label"
                    :value="radio.id"
                  ></v-radio>
                </v-radio-group>
              </validation-provider>

              <validation-provider
                v-if="restrictionsSemester === 2"
                v-slot="{ errors }"
                name="Виберіть семестр/и"
                rules="required_if:restrictionsSemester,2"
              >
                <v-select
                  v-model="semesters"
                  :items="[1,2,3,4,5,6,7,8,9,10,11,12]"
                  :error-messages="errors"
                  disable-lookup
                  chips
                  deletable-chips
                  hide-selected
                  label="Виберіть семестр/и"
                  multiple
                  @change="(v) => v.sort()"
                ></v-select>
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
              @click="submit"
              :disabled="invalid"
            >
              Зберегти
            </v-btn>
          </v-card-actions>
        </form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/api';
import {ALLOWED_REQUEST_PARAMETERS, API} from '@/api/constants-api';
import GlobalMixin from "@/mixins/GlobalMixin";

export default {
  name: "CreateSelectiveDisciplinesCatalogModal",
  data() {
    return {
      catalog: null,
      catalogs: [],

      disciplines: [],
      discipline: null,
      anotherDiscipline: null,
      languages: [],
      language: null,
      educationsLevel: [],
      educationLevel: null,

      knowledgeSpecialties: [
        {id: 1, title: 'Для всіх ОП'},
        {id: 2, title: 'Для всіх здобувачів освіти крім'}
      ],
      knowledgeSpecialty: null,
      showListKnowledgeSpecialties: false,
      selectListKnowledgeSpecialties: 1,
      radioBtnListKnowledgeSpecialties: [
        {id: 1, label: 'Інститут/факультет', itemText: 'name'},
        {id: 2, label: 'Спеціальність', itemText: 'title'},
        {id: 3, label: 'Освітня програма', itemText: 'title'},
      ],
      listsKnowledgeSpecialties: [],
      listKnowledgeSpecialties: null,

      departments: [],
      department: null,

      teachers: [],
      lecture: null,
      practice: null,

      helpersGeneralCompetence: [],
      generalCompetence: null,

      helpersResultsOfStudy: [],
      resultsOfStudy: null,

      helpersTypesTrainingSessions: [],
      typesTrainingSessions: null,

      numberAcquirers: null,

      helpersRequirements: [],
      requirements: null,

      radioRestrictionsSemester: [
        {id: 1, label: 'Без обмежень'},
        {id: 2, label: 'Крім'},
      ],
      restrictionsSemester: 1,
      semesters: [],

      divisions: [
        {id: 1, apiPath: API.FACULTIES, label: 'faculties'},
        {id: 2, apiPath: API.SPECIALITIES_ALL, label: 'specialities'},
        {id: 3, apiPath: API.EDUCATIONAL_PROGRAMS_ALL, label: 'educational_programs'},
      ],
    }
  },
  watch: {
    selectListKnowledgeSpecialties(v) {
      if (v !== null) {
        this.apiGetKnowledgeSpecialtiesDepartments(v)
      }
    },
    dialog(v) {
      if (v === true) {
        this.apiGetCreate();
      }
    },
    discipline(v) {
      if (v.title_eng) {
        this.anotherDiscipline = v.title_eng;
      }
    },
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
    apiGetCreate() {
      api.get(API.CATALOG_SELECTIVE_SUBJECTS + '/create', null , { showLoader: true }).then(({ data }) => {
        const {
          catalogs, subjects, languages, educationsLevel, departments, teachers,
          helpersGeneralCompetence, helpersResultsOfStudy, helpersTypesTrainingSessions,
          helpersRequirements, faculties
        } = data;
        this.catalogs = catalogs
        this.disciplines = subjects
        this.languages = languages
        this.educationsLevel = educationsLevel
        this.departments = departments
        this.teachers = teachers
        this.helpersGeneralCompetence = helpersGeneralCompetence
        this.helpersResultsOfStudy = helpersResultsOfStudy
        this.helpersTypesTrainingSessions = helpersTypesTrainingSessions
        this.helpersRequirements = helpersRequirements
        this.listsKnowledgeSpecialties = faculties
      });
    },
    apiGetKnowledgeSpecialtiesDepartments(v) {
      this.listKnowledgeSpecialties = null;
      api.get(this.divisions.find((el) => el.id === v ).apiPath).then(({ data }) => {
        this.listsKnowledgeSpecialties = data.data;
      });
    },
    close() {
      this.$emit('close');
    },
    submit() {
      let data = [];
      this.$refs.observer.validate().then((validated) => {
        if (validated) {
          this.$emit('submit', {
            catalog_id: this.catalog,
            discipline: this.year,
            month: this.month,
            course: this.course,
            module: this.module,
            semesters: this.semesters,
          });
        }
      });
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
