<template>
  <div>
    <v-dialog
      v-model="subjectDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar
          flat
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="subjectDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ sebjectTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="saveSubject()"
              :disabled="!subjectForm.selective_discipline_id && !subjectForm.asu_id"
            >
              Зберегти
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="py-5">
          <v-container>
            <v-row>
              <v-col cols="3" class="py-0" style="display:flex; align-items: end">
                <v-checkbox
                  v-model="subjectForm.selectiveDiscipline"
                  class="ma-0"
                  label="Дисципліна за вибором"
                ></v-checkbox>
              </v-col>
              <v-col cols="9" class="py-0">
                <v-autocomplete
                  v-if="subjectForm.selectiveDiscipline"
                  :items="selectiveDiscipline"
                  v-model="subjectForm.selective_discipline_id"
                  label="Вибіркова дисципліна"
                  item-text="title"
                  item-value="id"
                  value="number"
                ></v-autocomplete>
                <v-autocomplete
                  v-else
                  v-model="subjectForm.asu_id"
                  :items="subjects"
                  label="Дисципліна"
                  item-text="title"
                  item-value="id"
                  value="number"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  type="number"
                  label="Кредитів"
                  min="0"
                  v-model.number="subjectForm.credits"
                  :rules="[v => (v + subjectForm.sumSubjectsCredits) <= cycleForm.credit || 'Перевищена кількість кредитів']"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  type="number"
                  label="Обсяг годин лекцій"
                  min="0"
                  v-model.number="subjectForm.hours"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  type="number"
                  label="Обсяг годин практичних занять"
                  min="0"
                  v-model.number="subjectForm.practices"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  type="number"
                  label="Обсяг годин лабораторних занять"
                  min="0"
                  v-model.number="subjectForm.laboratories"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-autocomplete
                  v-model="subjectForm.faculty_id"
                  :items="faculties"
                  :loading="facultiesLoading"
                  item-text="name"
                  item-value="id"
                  label="Факультет"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-autocomplete
                  v-model="subjectForm.department_id"
                  :items="departments"
                  :loading="departmentsLoading"
                  item-text="name"
                  item-value="id"
                  label="Кафедра"
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-alert
              dense
              outlined
              type="error"
              class="mb-2"
              v-if="cycleForm.has_discipline && checkCountHoursSemester.length > 0"
            >
              Не вірно розподілені кредити за семестрами.
            </v-alert>

            <v-alert
              dense
              outlined
              type="error"
              class="mb-2"
              v-if="cycleForm.has_discipline && checkCountHours"
            >
              Не вірно розподілено аудиторне навантаження на дисципліну.
            </v-alert>

            <v-alert
              dense
              outlined
              type="error"
              class="mb-2"
              v-if="cycleForm.has_discipline && checkCountHoursModules"
            >
              Перевищено загальну кількість годин. Кількість розподілених годин має відповідати сумі годин лекцій, практичних, лабораторних.
            </v-alert>

            <v-alert
              dense
              outlined
              type="error"
              class="mb-2"
              v-if="cycleForm.has_discipline && checkLastHourModule != null"
            >
              Необхідно вказати форму контролю в останньому модулі.
            </v-alert>

            <v-alert
              dense
              outlined
              type="error"
              class="mb-2"
              v-if="subjectForm.verification == 0"
            >
              Не відповідає освітній програмі.
            </v-alert>

            <table class="table-modules" v-if="plan && plan.id">
              <tr>
                <td :colspan="countModules * 2">Розподіл годин на тиждень за курсами, семестрами і модульними атестаційними циклами</td>
              </tr>
              <tr>
                <td colspan="4" v-for="index in plan.study_term.course" :key="index">{{ index }} курс</td>
              </tr>
              <tr>
                <td :colspan="countModules * 2">Семестри</td>
              </tr>
              <tr>
                <td colspan="2" v-for="index in plan.study_term.module" :key="index">{{ index }}</td>
              </tr>
              <tr v-if="plan.form_organization.id == 1">
                <td :colspan="countModules * 2">Модульні атестаційні цикли</td>
              </tr>
              <tr>
                <td
                  :colspan="plan.form_organization.id == 1 ? 0 : 2"
                  v-for="(subject, index) in subjectForm.hours_modules"
                  :key="index"
                  :class="[cycleForm.has_discipline == 1 && (index === activMod ? 'activMod' : '', checkLastHourModule == index || checkCountHoursSemester.indexOf(subject.semester) != -1) ? 'error' : '']"
                >
                  <v-text-field
                    type="number"
                    min="0"
                    :dark="cycleForm.has_discipline == 1 && (checkLastHourModule == index || checkCountHoursSemester.indexOf(subject.semester) != -1)"
                    v-model.number="subject.hour"
                    @click="activMod = index; moduleNumber = subject"
                    dense
                    hide-details
                  >
                  </v-text-field>
                </td>
              </tr>
              <tr v-if="moduleNumber">
                <td :colspan="countModules * 2" class="activMod">
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        :items="formControls"
                        label="Форма контролю"
                        item-text="title"
                        item-value="id"
                        v-model="moduleNumber.form_control_id"
                        hide-details
                      ></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        :items="individualTasks"
                        label="Індивідуальні завдання"
                        item-text="title"
                        item-value="id"
                        v-model="moduleNumber.individual_task_id"
                        hide-details
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </td>
              </tr>
              <tr>
                <td :colspan="countModules * 2">Розподіл кредитів на вивчення за семестрами</td>
              </tr>
              <tr>
                <td
                  colspan="2" 
                  v-for="(item, index) in subjectForm.semesters_credits" 
                  :key="index"
                  :class="[cycleForm.has_discipline == 1 && checkCountHoursSemester.indexOf(item.semester) != -1 ? 'error' : '']"
                >
                  <v-text-field 
                    type="number"
                    min="0"
                    :dark="cycleForm.has_discipline == 1 && checkCountHoursSemester.indexOf(item.semester) != -1"
                    v-model.number="item.credit"
                    dense
                    hide-details
                    >
                  </v-text-field>
                </td>
              </tr>
            </table>

          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="cycleDialog"
      persistent
      max-width="500px"
    >
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
      >
        <form @submit.prevent="saveCycle" @keyup.enter="saveCycle">
          <v-card class="pb-0">
            <v-card-text class="pb-0">
              <v-container>

               <validation-provider
                  v-slot="{ errors }"
                  name="цикл"
                  rules="required"
                >
                  <v-autocomplete
                    :items="listCycles"
                    v-model="cycleForm.list_cycle_id"
                    :error-messages="errors"
                    item-text="title"
                    item-value="id"
                    label="Цикл"
                    class="mb-4"
                    required
                  ></v-autocomplete>
                </validation-provider>

                <v-text-field
                  label="Кредитів"
                  v-model="cycleForm.credit"
                  type="number"
                  min="0"
                  :rules="[v => (+v + cycleForm.sumCyclesCredits) <= cycleForm.parrentCycleCredit || 'Перевищена кількість кредитів']"
                  dense
                  hide-details
                  class="mb-4"
                ></v-text-field>

                <v-checkbox
                  class="ma-0"
                  v-model="cycleForm.has_discipline"
                  label="Цикл з навчальними дисциплінами"
                ></v-checkbox>
              </v-container>
            </v-card-text>
            <v-card-actions class="pt-0">
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="cycleDialog = false"
              >
                Закрити
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="saveCycle()"
                :disabled="invalid"
              >
                Зберегти
              </v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </validation-observer>
    </v-dialog>

    <v-alert
      dense
      outlined
      type="error"
      class="mb-2"
      v-for="(error, errorIndex) in errorsPlan"
      :key="'error' + errorIndex"
    >
      {{ error }}
    </v-alert>

    <v-alert
      dense
      outlined
      type="error"
      class="mb-2"
      v-if="getErrorsSemesters"
    >
      Перевищена кількість кредитів у {{ getErrorsSemesters }} семестрі.
    </v-alert>

    <v-alert
      dense
      outlined
      type="error"
      class="mb-2"
      v-if="getErrorsSemestersHours"
    >
      Перевищена кількість годин у {{ getErrorsSemestersHours }} семестрі.
    </v-alert>

    <v-alert
      dense
      outlined
      type="error"
      class="mb-2"
      v-if="getErrorsSemestersExams"
    >
      Перевищена кількість екзаменів у {{ getErrorsSemestersExams }} семестрі.
    </v-alert>

    <v-alert
      dense
      outlined
      type="error"
      class="mb-2"
      v-if="getErrorsCourseWorks"
    >
      Перевищена кількість курсових робіт у {{ getErrorsCourseWorks }} семестрі.
    </v-alert>

    <v-alert
      dense
      outlined
      type="error"
      class="mb-2"
      v-if="plan.count_credits_selective_discipline < options['min-quantity-credits'] && plan.credits.length > 0"
    >
      Кількість кредитів для вибіркових дисциплін має бути не менше {{ options['min-quantity-credits'] }}.
    </v-alert>
    
    <CycleItem
      :item="item"
      :index="index"
      v-for="(item, index) in plan.cycles"
      :key="'cycle' + item.id + indexComponent"
      :indexComponent="indexComponent"
      :data="plan"
      :cycles="cycles"
      @addSubject="addSubject"
      @addCycle="addCycle"
      @saveCycle="saveCycle"
      @delCycle="delCycle"/>

    <div class="text-center mt-4">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            large
            v-bind="attrs"
            v-on="on"
            @click="addCycle({}, true)"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Додати цикл</span>
      </v-tooltip>
    </div>
  </div>
</template>
<script>
import CycleItem from '@/views/pages/plan/tabs/CycleItem.vue';
import api from "@/api";
import {API} from "@/api/constants-api";
import {eventBus} from '@/main';
import { mapGetters } from 'vuex';
export default {
  name: "Cycles",
  components: {
    CycleItem
  },
  props: {
    plan: Object
  },
  data() {
    return {
      selectiveDiscipline: [],
      subjects: [],
      faculties: [],
      departments: [],
      cycles: [],
      departmentsLoading: false,
      facultiesLoading: false,
      cycleDialog: false,
      subjectDialog: false,
      cycleForm: {
        title: "",
        credit: 0,
        plan_id: null,
        cycle_id: null,
        has_discipline: false,
        general: false,
        parrentCycleCredit: 0,
        sumCyclesCredits: 0
      },
      subjectForm: {
        id: null,
        sumSubjectsCredits: 0,
        selectiveDiscipline: false,
        selective_discipline_id: null,
        asu_id: null,
        credits: 0,
        hours: 0,
        practices: 0,
        laboratories: 0,
        hours_modules: [],
        semesters_credits: [],
        verification: 1,
        faculty_id: null,
        department_id: null
      },
      moduleNumber: null,
      activMod: null,
      individualTasks: [],
      formControls: [],
    }
  },
  watch: {
    'subjectForm.faculty_id': {
      handler(newValue, oldValue) {
        if(newValue != oldValue) {
          newValue !== null ? this.apiGetDepartments(newValue) : this.departments = [];
        }
      },
      deep: true
    }
  },
  computed: {
    sebjectTitle() {
      let value = 'Нова дисципліна';
      if(this.subjectForm.id) {
        if(this.subjectForm.selective_discipline) {
          value = this.subjectForm.selective_discipline.title;
        } else {
          value = this.subjectForm.title;
        }
      }
      return value;
    },
    listCycles() {
      return this.cycles.filter(cycle => {
        if(this.cycleForm.general) {
          return cycle.general;
        } else {
          return !cycle.general;
        }
      })
    },
    countModules() {
      return this.plan.study_term.module;
    },
    checkCountHoursModules() {
      let sumHours = +this.subjectForm.hours + +this.subjectForm.practices + +this.subjectForm.laboratories;
      let sumHoursModules = this.sumArray(this.subjectForm.hours_modules, 'hour');
      return sumHoursModules > sumHours;
    },
    checkCountHours() {
      let sumHours = +this.subjectForm.hours + +this.subjectForm.practices + +this.subjectForm.laboratories;
      return (this.subjectForm.credits * 30) * (this.options['min-classroom-load'] / 100) > sumHours || (this.subjectForm.credits * 30) * (this.options['max-classroom-load'] / 100) < sumHours;
    },
    checkLastHourModule() {
      let res = null;
      let semestersCredits = this.subjectForm.semesters_credits.filter(item => item.credit);
      let lastSemestersCredits = semestersCredits[semestersCredits.length - 1];
      if(lastSemestersCredits) {
        let hoursModules = this.subjectForm.hours_modules.filter(item => {
          return item.semester == lastSemestersCredits.semester;
        })
        let lastItem = hoursModules[hoursModules.length - 1];
        if(lastItem.form_control_id == 10) {
         res = this.subjectForm.hours_modules.indexOf(lastItem);
        }
      }
      return res;
    },
    checkCountHoursSemester() {
      var res = [];
      for (let index = 0; index < this.subjectForm.semesters_credits.length; index++) {
        let semesterItem = this.subjectForm.semesters_credits[index];
        let modules = this.subjectForm.hours_modules.map((item, index) => {
          item.checkHour = +item.hour * +this.plan.hours_weeks_semesters[index].week;
          return item;
        }).filter(elem => {
          return elem.semester == semesterItem.semester;
        });
        let sumHoursModules = this.sumArray(modules, 'checkHour');
        if((semesterItem.credit * 30) * (this.options['min-classroom-load'] / 100) > sumHoursModules || (semesterItem.credit * 30) * (this.options['max-classroom-load'] / 100) < sumHoursModules) {
          res.push(semesterItem.semester);
        }
      }
      return res;
    },
    getErrorsSemesters() {
      let result = [];
      this.plan.sum_semesters_credits.forEach((item, index) => {
        if(item > this.options['quantity-credits-semester']) {
          result.push(index+1);
        }
      });
      return result.join(', ');
    },
    getErrorsSemestersHours() {
      let result = [];
      this.plan.sum_semesters_hours.forEach((item, index) => {
        if(item > this.sumArray(this.plan.hours_weeks_semesters.filter(i => i.semester == index+1), 'hour')) {
          result.push(index+1);
        }
      });
      return result.join(', ');
    },
    getErrorsSemestersExams() {
      let result = [];
      this.plan.count_exams.forEach((item, index) => {
        if(item > this.options['exam']) {
          result.push(index+1);
        }
      });
      return result.join(', ');
    },
    getErrorsCourseWorks() {
      let result = [];
      this.plan.count_coursework.forEach((item, index) => {
        if(item > this.options['coursework']) {
          result.push(index+1);
        }
      });
      return result.join(', ');
    },
    ...mapGetters({
      errorsPlan: "plans/errorsPlan",
      indexComponent: "plans/indexComponent",
      options: "plans/options"
    }),
  },
  mounted() {
    if(this.$route.name === 'EditPlan') {
      this.apiGetIndividualTasks();
      this.apiGetFormControls();
      this.apiGetSubjects();
      this.apiGetCycles();
      this.apiGetSelectiveDiscipline();
      this.apiGetFaculty();
    } else {
      this.$store.dispatch('plans/clear');
    }
    eventBus.$on('editSubject', (data) => {
      this.editSubject(data);
    });
    eventBus.$on('delSubject', (data) => {
      this.delSubject(data);
    });
  },
  methods: {
    addSubject(item) {
      this.activMod = null;
      this.moduleNumber = null;
      this.cycleForm = item;
      this.subjectForm = {
        sumSubjectsCredits: this.sumArray(item.subjects, 'credits'),
        id: null,
        cycle_id: item.id,
        selectiveDiscipline: false,
        selective_discipline_id: null,
        asu_id: null,
        credits: 0,
        hours: 0,
        practices: 0,
        laboratories: 0,
        hours_modules: [],
        semesters_credits: [],
        verification: 1,
        faculty_id: null,
        department_id: null
      };
      var semesters = this.plan.study_term.semesters;
      var semesterNumber = 1;
      for (let course = 0; course < this.plan.study_term.course; course++) {
        let moduleNumber = 1;
        for (let semester = 0; semester < semesters; semester++) {
          if(semesters != 0) {
            this.subjectForm.semesters_credits.push({
              credit: 0,
              course: course+1,
              semester: semesterNumber
            });
          }
          for (let module = 0; module < (this.plan.form_organization.id == 1 ? 2 : 1); module++) {
            if(semesters != 0) {
              this.subjectForm.hours_modules.push({
                hour: 0,
                course: course+1,
                semester: semesterNumber,
                module: moduleNumber++,
                individual_task_id: 3,
                form_control_id: 10
              });
            }
          }
          semesterNumber += 1; 
          semesters--;
        }
      }
      this.subjectDialog = true;
    },
    editSubject({subject, cycle}) {
      this.activMod = null;
      this.moduleNumber = null;
      this.subjectForm = Object.assign(this.subjectForm, subject);
      this.subjectForm.selectiveDiscipline = this.subjectForm.selective_discipline ? true : false;
      this.cycleForm = cycle;
      this.subjectForm.sumSubjectsCredits = this.sumArray(cycle.subjects, 'credits') - subject.credits;
      let semesters = this.plan.study_term.semesters;
      let index = 0;
      let indexSemester = 0;
      let newHoursModules = [];
      let newSemestersCredits = [];
      for (let course = 0; course < this.plan.study_term.course; course++) {
        let moduleNumber = 1;
        for (let semester = 0; semester < 2; semester++) {
          if(semesters != 0) {
            if(this.subjectForm.semesters_credits[indexSemester]) {
              newSemestersCredits.push(this.subjectForm.semesters_credits[indexSemester]);
            } else {
              newSemestersCredits.push({
                credit: 0,
                course: course+1,
                semester: indexSemester + 1
              })
            }
          }
          for (let module = 0; module < (this.plan.form_organization.id == 1 ? 2 : 1); module++) {
            if(semesters != 0) {
              if(this.subjectForm.hours_modules[index]) {
                newHoursModules.push(this.subjectForm.hours_modules[index]);
              } else {
                newHoursModules.push({
                  hour: 0,
                  course: course+1,
                  semester: indexSemester + 1,
                  module: moduleNumber++,
                  individual_task_id: 3,
                  form_control_id: 10
                })
              }
            }
            index++;
          }
          indexSemester += 1;
          semesters--;
        }
      }
      this.subjectForm.hours_modules = newHoursModules;
      this.subjectForm.semesters_credits = newSemestersCredits;
      this.subjectDialog = true;
    },
    delSubject(item) {
      this.$swal.fire({
        title: `Бажаєте видалити?`,
        text: `Інформацію неможливо буде відновити`,
        showDenyButton: true,
        confirmButtonText: 'Так',
        denyButtonText: `Ні`,
      }).then((result) => {
        if (result.isConfirmed) {
          api.destroy(API.SUBJECTS, item.id).then(() => {
            this.$emit('apiGetPlanId');
          }).catch((errors) => {
            console.log(errors.response.data)
          });
        }
      })
    },
    saveSubject() {
      if(this.subjectForm.id) {
        this.subjectForm.plan_id = this.$route.params.id;
        api.patch(API.SUBJECTS, this.subjectForm.id, this.subjectForm).then(() => {
          this.$emit('apiGetPlanId');
          this.subjectDialog = false;
        }).catch((errors) => {
          console.log(errors.response.data)
        });
      } else {
        this.subjectForm.plan_id = this.$route.params.id;
        api.post(API.SUBJECTS, this.subjectForm).then(() => {
          this.$emit('apiGetPlanId');
          this.subjectDialog = false;
        }).catch((errors) => {
          console.log(errors.response.data)
        });
      }
    },
    saveCycle(item = null) {
      if(item != null) {
        api.patch(API.CYCLES, item.id, item).then(() => {
          this.$emit('apiGetPlanId');
        }).catch((errors) => {
          console.log(errors.response.data)
        });
      } else {
        this.cycleForm.plan_id = this.$route.params.id;
        api.post(API.CYCLES, this.cycleForm).then(() => {
          this.$emit('apiGetPlanId');
          this.cycleDialog = false;
        }).catch((errors) => {
          console.log(errors.response.data)
        });
      }
    },
    addCycle(item, general = false) {
      this.cycleForm = {
        title: "",
        credit: 0,
        cycle_id: item.id,
        has_discipline: false,
        general,
        parrentCycleCredit: item.credit == null ? this.plan.credits : item.credit,
        sumCyclesCredits: item.id ? this.sumArray(item.cycles, 'credit') : 0
      }
      this.cycleDialog = true;
    },
    delCycle(item) {
      this.$swal.fire({
        title: `Бажаєте видалити?`,
        text: `Інформацію неможливо буде відновити`,
        showDenyButton: true,
        confirmButtonText: 'Так',
        denyButtonText: `Ні`,
      }).then((result) => {
        if (result.isConfirmed) {
          api.destroy(API.CYCLES, item.id).then(() => {
            this.$emit('apiGetPlanId');
          }).catch((errors) => {
            console.log(errors.response.data)
          });
        }
      })
    },
    sumArray(array, field) {
      return array.map(item => item[field]).reduce((prev, curr) => +prev + +curr, 0);
    },

    apiGetSelectiveDiscipline() {
      api.get(API.SELECTIVE_DISCIPLINES).then(({data}) => {
        this.selectiveDiscipline = data.data
      })
    },

    apiGetSubjects() {
      api.get(API.SUBJECTS).then(({data}) => {
        this.subjects = data.data
      })
    },

    apiGetCycles() {
      api.get(API.LIST_CYCLES).then(({data}) => {
        this.cycles = data.data
      })
    },

    apiGetIndividualTasks() {
      api.get(API.INDIVIDUAL_TASKS).then(({data}) => {
        this.individualTasks = data.data
      })
    },

    apiGetFormControls() {
      api.get(API.FORM_CONTROLS).then(({data}) => {
        this.formControls = data.data
      })
    },

    apiGetDepartments(id) {
      this.departmentsLoading = true;
      api.show(API.DEPARTMENTS, id).then(({data}) => {
        this.departments = data.data
        this.departmentsLoading = false;
      })
    },

    apiGetFaculty() {
      this.facultiesLoading = true;
      api.get(API.FACULTIES).then(({data}) => {
        this.faculties = data.data;
        this.facultiesLoading = false;
      })
    },
  }
}
</script>
<style lang="css" scoped>
  table.table-modules {
    width: 100%;
    border: 1px solid #dee2e6;
    border-collapse: collapse;
  }
  table.table-modules td {
    text-align: center;
    color: #000;
    font-size: 14px;
    padding: 0.75rem;
    border: 1px solid #dee2e6;
  }
  .activMod {
    background: #f2f2f2;
  }
</style>