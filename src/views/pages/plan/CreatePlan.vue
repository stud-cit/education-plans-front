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
          <v-toolbar-title>Нова дисципліна</v-toolbar-title>
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
                  label="Кредитів"
                  required
                  v-model="subjectForm.credits"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  label="Обсяг годин лекцій"
                  required
                  v-model="subjectForm.hours"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  label="Обсяг годин практичних занять"
                  required
                  v-model="subjectForm.practices"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  label="Обсяг годин лабораторних занять"
                  required
                  v-model="subjectForm.laboratories"
                ></v-text-field>
              </v-col>
            </v-row>

            <table class="table-modules" v-if="data.id">
              <tr>
                <td :colspan="countModules * 2">Розподіл годин на тиждень за курсами, семестрами і модульними атестаційними циклами</td>
              </tr>
              <tr>
                <td colspan="4" v-for="index in data.study_term.course" :key="index">{{ index }} курс</td>
              </tr>
              <tr>
                <td :colspan="countModules * 2">Семестри</td>
              </tr>
              <tr>
                <td colspan="2" v-for="index in data.study_term.module" :key="index">{{ index }}</td>
              </tr>
              <tr v-if="data.form_organization.id == 1">
                <td :colspan="countModules * 2">Модульні атестаційні цикли</td>
              </tr>
              <tr>
                <td :colspan="data.form_organization.id == 1 ? 0 : 2" v-for="(subject, index) in subjectForm.hours_modules" :key="index" :class="{ activMod: index === activMod }">
                  <v-text-field 
                    v-model="subject.hour"
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
                        :items="['Залік','Диференційний залік','Іспит']"
                        label="Форма контролю"
                        v-model="moduleNumber.form_control_id"
                      ></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        :items="['Контрольна робота','Курсова робота','Без завдання']"
                        label="Індивідуальні завдання"
                        v-model="moduleNumber.individual_task"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </td>
              </tr>
              <tr>
                <td :colspan="countModules * 2">Розподіл кредитів на вивчення за семестрами</td>
              </tr>
              <tr>
                <td colspan="2" v-for="index in data.study_term.module" :key="index">
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
              required
            ></v-text-field>

            <v-text-field
              label="Кредитів"
              v-model="cycleForm.credit"
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
            @click="saveCycle"
          >
            Зберегти
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-tabs v-model="tab">
      <v-tab>Загальна інформація</v-tab>
      <v-tab :disabled="$route.name == 'CreatePlan'">Цикли / предмети</v-tab>
      <v-tab :disabled="$route.name == 'CreatePlan'">Графіки</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <General
          @submit="submit"
          :data="data"
        />
      </v-tab-item>
      <v-tab-item>

        <CycleItem
          :item="item"
          :index="index"
          v-for="(item, index) in data.cycles"
          :key="item.id"
          @addSubject="addSubject"
          @editSubject="editSubject"
          @delSubject="delSubject"
          @addCycle="addCycle"
          @editCycle="editCycle"
          @delCycle="delCycle"/>

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
        <Title></Title>
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
      subjectDialog: false,
      dialog: true,
      cycleForm: {
        title: "",
        credit: 0,
        plan_id: null,
        cycle_id: null
      },
      subjectForm: {
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

      data: Object,
    }
  },
  computed: {
    ...mapGetters({
      plan: "plans/plan"
    }),
    countModules() {
      return this.data.study_term.module;
    }
  },
  mounted() {
    this.apiGetSelectiveDiscipline();
    if(this.$route.name == 'EditPlan') {
      this.apiGetPlanId();
    }
  },

  methods: {
    addSubject(item) {
      this.activMod = null;
      this.moduleNumber = null;
      this.subjectForm = {
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
      var semesters = this.data.study_term.semesters;
      for (let course = 0; course < this.data.study_term.course; course++) {
        let moduleNumber = 1;
        for (let semester = 0; semester < 2; semester++) {
          for (let module = 0; module < (this.data.form_organization.id == 1 ? 2 : 1); module++) {
            if(semesters != 0) {
              this.subjectForm.hours_modules.push({
                hour: 0,
                course: course+1,
                semester: semester+1,
                module: moduleNumber++
              })
            }
          }
          semesters--;
        }
      }
      this.subjectDialog = true;
    },
    editSubject(item) {
      this.subjectForm = Object.assign(this.subjectForm, item);
      var semesters = this.data.study_term.semesters;
      var index = 0;
      var newHoursModules = [];
      for (let course = 0; course < this.data.study_term.course; course++) {
        let moduleNumber = 1;
        for (let semester = 0; semester < 2; semester++) {
          for (let module = 0; module < (this.data.form_organization.id == 1 ? 2 : 1); module++) {
            if(semesters != 0) {
              if(this.subjectForm.hours_modules[index]) {
                newHoursModules.push(this.subjectForm.hours_modules[index]);
              } else {
                newHoursModules.push({
                  hour: 0,
                  course: course+1,
                  semester: semester+1,
                  module: moduleNumber++
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
      console.log(item)
    },
    saveSubject() {
      console.log('save')
      this.subjectDialog = false;
    },
    saveCycle() {
      if(this.cycleForm.id) {
        api.patch(API.CYCLES, this.cycleForm.id, this.cycleForm).then(() => {
          this.cycleDialog = false;
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
        cycle_id: item.id
      }
      this.cycleDialog = true;
    },
    editCycle(item) {
      this.cycleForm = Object.assign(item, {});
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
        this.$router.push({path: '/plan/edit/'+response.data.id});
      }).catch((errors) => {
        console.log(errors.response.data)
      });
    },

    apiGetSelectiveDiscipline() {
      api.get(API.SELECTIVE_DISCIPLINES).then(({data}) => {
        this.selectiveDiscipline = data.data
      })
    },

    apiGetPlanId() {
      api.show(API.PLANS, this.$route.params.id).then((response) => {
        this.data = response.data.data;
      })
    },

  }
}

</script>

<style lang="css" scoped>
  table.table-modules {
    margin: auto;
    margin-top: 20px;
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
    background: #dedede;
  }
</style>
