<template>
  <v-container>
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
          <v-toolbar-title>{{ subjectForm.id != null ? subjectForm.title : 'Нова дисципліна' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="saveSubject()"
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
                ></v-autocomplete>
                <v-autocomplete
                  v-else
                  v-model="subjectForm.title"
                  :items="['Фізика','Математика','Іноземна мова','Філосовія']"
                  label="Дисципліна"
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
                  v-model.number="subjectForm.hours"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  type="number"
                  label="Обсяг годин практичних занять"
                  v-model.number="subjectForm.practices"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  type="number"
                  label="Обсяг годин лабораторних занять"
                  v-model.number="subjectForm.laboratories"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-alert
              dense
              outlined
              type="error"
              class="mb-2"
              v-if="checkCountHoursModules"
            >
              Перевищено загальну кількість годин. Кількість розподілених годин має відповідати сумі годин лекцій, практичних, лабораторних.
            </v-alert>

            <v-alert
              dense
              outlined
              type="error"
              class="mb-2"
              v-if="checkLastHourModule"
            >
              Необхідно вказати форму контролю та індивідуальне завдання в останньому модулі.
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
                  :class="[index === activMod ? 'activMod' : '', (checkLastHourModule && index == subjectForm.hours_modules.length - 1) ? 'error' : '']"
                >
                  <v-text-field
                    type="number"
                    :dark="checkLastHourModule && index == subjectForm.hours_modules.length - 1"
                    v-model.number="subject.hour"
                    @click="activMod = index; moduleNumber = subject"
                  >
                  </v-text-field>
                </td>
              </tr>
              <tr v-if="moduleNumber">
                <td :colspan="countModules * 2">
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        :items="formControls"
                        label="Форма контролю"
                        item-text="title"
                        item-value="id"
                        v-model="moduleNumber.form_control_id"
                      ></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        :items="individualTasks"
                        label="Індивідуальні завдання"
                        item-text="title"
                        item-value="id"
                        v-model="moduleNumber.individual_task_id"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </td>
              </tr>
              <tr>
                <td :colspan="countModules * 2">Розподіл кредитів на вивчення за семестрами</td>
              </tr>
              <tr>
                <td colspan="2" v-for="index in plan.study_term.module" :key="index">
                  <v-text-field>
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
      <v-card class="pb-0">
        <v-card-text class="pb-0">
          <v-container>
            <v-text-field
              label="Назва циклу"
              v-model="cycleForm.title"
              :rules="[v => !!v || 'Поле обов\'язкове для заповнення']"
              required
            ></v-text-field>

            <v-text-field
              label="Кредитів"
              v-model="cycleForm.credit"
              type="number"
              min="0"
              :rules="[v => (+v + cycleForm.sumCyclesCredits) <= cycleForm.parrentCycleCredit || 'Перевищена кількість кредитів']"
              required
            ></v-text-field>
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
          >
            Зберегти
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-tabs v-model="tab" class="mb-2">
      <v-tab>Загальна інформація</v-tab>
      <v-tab :disabled="$route.name == 'CreatePlan'">Цикли / предмети</v-tab>
      <v-tab :disabled="$route.name == 'CreatePlan'">Графіки</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <General
          @submit="submit"
          :plan="plan"
        />
      </v-tab-item>
      <v-tab-item>

        <v-alert
          dense
          outlined
          type="error"
          class="mb-2"
          v-for="(error, errorIndex) in alertErrorCycle"
          :key="'error'+errorIndex"
        >
          {{ error }}
        </v-alert>

        <CycleItem
          :item="item"
          :index="index"
          v-for="(item, index) in plan.cycles"
          :key="'cycle' + item.id + indexComponent"
          :indexComponent="indexComponent"
          :data="plan"
          @addSubject="addSubject"
          @addCycle="addCycle"
          @saveCycle="saveCycle"
          @delCycle="delCycle"
          @errorCycle="errorCycle"/>

        <div class="text-center mt-4">
          <v-btn
            icon
            large
          >
            <v-icon @click="addCycle({})">mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-tab-item>
      <v-tab-item>
        <Title :data="plan"></Title>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import CycleItem from '@/views/pages/plan/tabs/CycleItem.vue';
import api from "@/api";
import {API} from "@/api/constants-api";
import General from "@/views/pages/plan/tabs/General";
import { mapGetters } from 'vuex'
import Title from "@/views/pages/plan/tabs/Title";

import {eventBus} from '@/main'

export default {
  name: "CreatePlan",
  components: {
    General,
    Title,
    CycleItem
  },
  data() {
    return {
      tab: 0,
      selectiveDiscipline: [],
      cycleDialog: false,
      alertErrorCycle: [],
      subjectDialog: false,
      indexComponent: 1,
      cycleForm: {
        title: "",
        credit: 0,
        plan_id: null,
        cycle_id: null,
        parrentCycleCredit: 0,
        sumCyclesCredits: 0
      },
      subjectForm: {
        sumSubjectsCredits: 0,
        selectiveDiscipline: false,
        selective_discipline_id: null,
        title: "",
        credits: "",
        hours: "",
        practices: "",
        laboratories: "",
        hours_modules: []
      },
      moduleNumber: null,
      activMod: null,

      generalTabFields: null,

      individualTasks: [],
      formControls: [],
    }
  },
  computed: {
    ...mapGetters({
      plan: "plans/plan"
    }),
    countModules() {
      return this.plan.study_term.module;
    },
    checkCountHoursModules() {
      let sumHours = +this.subjectForm.hours + +this.subjectForm.practices + +this.subjectForm.laboratories;
      let sumHoursModules = this.sumArray(this.subjectForm.hours_modules, 'hour');
      return sumHoursModules > sumHours;
    },
    checkLastHourModule() {
      if(this.subjectForm.hours_modules.length > 0) {
        let lastItem = this.subjectForm.hours_modules[this.subjectForm.hours_modules.length - 1];
        return lastItem.individual_task_id == 3 || lastItem.form_control_id == 4;
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.apiGetSelectiveDiscipline();
    if(this.$route.name === 'EditPlan') {
      this.apiGetPlanId();
      this.apiGetIndividualTasks();
      this.apiGetFormControls();
    } else {
      this.$store.dispatch('plans/clear');
    }
    eventBus.$on('editSubject', (data) => {
      this.editSubject(data);
    });
    eventBus.$on('delSubject', (data) => {
      this.delSubject(data);
    });
    eventBus.$on('errorSubject', (data) => {
      this.errorCycle(data);
    });
  },

  methods: {
    addSubject(item) {
      this.activMod = null;
      this.moduleNumber = null;
      this.cycleForm = item;
      this.subjectForm = {
        sumSubjectsCredits: this.sumArray(item.subjects, 'credits'),
        cycle_id: item.id,
        selectiveDiscipline: false,
        selective_discipline_id: null,
        title: "",
        credits: "",
        hours: "",
        practices: "",
        laboratories: "",
        hours_modules: []
      };
      var semesters = this.plan.study_term.semesters;
      for (let course = 0; course < this.plan.study_term.course; course++) {
        let moduleNumber = 1;
        for (let semester = 0; semester < 2; semester++) {
          for (let module = 0; module < (this.plan.form_organization.id == 1 ? 2 : 1); module++) {
            if(semesters != 0) {
              this.subjectForm.hours_modules.push({
                hour: 0,
                course: course+1,
                semester: semester+1,
                module: moduleNumber++,
                individual_task_id: 3,
                form_control_id: 4
              });
            }
          }
          semesters--;
        }
      }
      this.subjectDialog = true;
    },
    editSubject({subject, cycle}) {
      this.subjectForm = Object.assign(this.subjectForm, subject);
      this.cycleForm = cycle;
      this.subjectForm.sumSubjectsCredits = this.sumArray(cycle.subjects, 'credits') - subject.credits;
      var semesters = this.plan.study_term.semesters;
      var index = 0;
      var newHoursModules = [];
      for (let course = 0; course < this.plan.study_term.course; course++) {
        let moduleNumber = 1;
        for (let semester = 0; semester < 2; semester++) {
          for (let module = 0; module < (this.plan.form_organization.id == 1 ? 2 : 1); module++) {
            if(semesters != 0) {
              if(this.subjectForm.hours_modules[index]) {
                newHoursModules.push(this.subjectForm.hours_modules[index]);
              } else {
                newHoursModules.push({
                  hour: 0,
                  course: course+1,
                  semester: semester+1,
                  module: moduleNumber++,
                  individual_task_id: 3,
                  form_control_id: 4
                })
              }
            }
            index++;
          }
          semesters--;
        }
      }
      this.subjectForm.hours_modules = newHoursModules;
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
            this.apiGetPlanId();
          }).catch((errors) => {
            console.log(errors.response.data)
          });
        }
      })
    },
    saveSubject() {
      if(this.subjectForm.id) {
        api.patch(API.SUBJECTS, this.subjectForm.id, this.subjectForm).then(() => {
          this.alertErrorCycle = [];
          this.indexComponent += 1;
          this.subjectDialog = false;
        }).catch((errors) => {
          console.log(errors.response.data)
        });
      } else {
        api.post(API.SUBJECTS, this.subjectForm).then(() => {
          this.apiGetPlanId();
          this.subjectDialog = false;
        }).catch((errors) => {
          console.log(errors.response.data)
        });
      }
    },
    saveCycle(item = null) {
      if(item != null) {
        api.patch(API.CYCLES, item.id, item).then(() => {
          this.alertErrorCycle = [];
          this.indexComponent += 1;
        }).catch((errors) => {
          console.log(errors.response.data)
        });
      } else {
        this.cycleForm.plan_id = this.$route.params.id;
        api.post(API.CYCLES, this.cycleForm).then(() => {
          this.apiGetPlanId();
          this.cycleDialog = false;
        }).catch((errors) => {
          console.log(errors.response.data)
        });
      }
    },
    addCycle(item) {
      this.cycleForm = {
        title: "",
        credit: 0,
        cycle_id: item.id,
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
            this.apiGetPlanId();
          }).catch((errors) => {
            console.log(errors.response.data)
          });
        }
      })
    },
    errorCycle(item) {
      if(item && this.alertErrorCycle.indexOf(item) == -1) {
        this.alertErrorCycle.push(item)
      }
    },
    submit(data) {
      this.$store.dispatch('plans/store', data).then( (response) => {
        const { message } = response.data;
        this.$swal.fire({
          position: "center",
          icon: "success",
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });
        this.$router.push({name: 'EditPlan', params: {id: response.data.id, title: data.title }});
      }).catch((errors) => {
        console.log(errors.response.data)
      });
    },

    sumArray(array, field) {
      return array.map(item => item[field]).reduce((prev, curr) => +prev + +curr, 0);
    },

    apiGetSelectiveDiscipline() {
      api.get(API.SELECTIVE_DISCIPLINES).then(({data}) => {
        this.selectiveDiscipline = data.data
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

    apiGetPlanId() {
      // api.show(API.PLANS, this.$route.params.id).then((response) => {
      //   this.plan = response.data.data;
      //   this.alertErrorCycle = [];
      //   this.indexComponent += 1;
      // })
      this.$store.dispatch('plans/show', this.$route.params.id).then(({data}) => {
        this.alertErrorCycle = [];
        this.indexComponent += 1;


        // this.$router.afterEach((to,from,failure) => {
        //   console.log('to',to)
        //   console.log('from',from)
        //   console.log('failure',failure)
        // } )

        // const resolved = this.$router.resolve({
        //   name: 'EditPlan',
        //   params: { id: this.$route.params.id, title: data.data.title }
        // })
        // this.$route.params.title = 'bio';
        console.log('this.$route', this.$route.params ,data.data.title)
      }).catch((errors) => {
        console.log('apiGetPlanId',errors.response.data)
      });
      // api.show(API.PLANS, this.$route.params.id).then((response) => {
      //   this.plan = response.data.data;
      // })
    },

  }
}

</script>

<style lang="css" scoped>
  table.table-modules {
    margin: auto;
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
