<template>
  <v-container class="preview-plan" v-if="plan">
    <div class="print">
      <div class="by-created-pdf" v-if="statusPlanSuccess === plan.status">
        {{byCreatedPDF}}
      </div>
      <table ref="exportableTitle"
             width="100%"
             class="table plan-title-table"
      >
        <tbody >
          <tr class="table-title">
            <td :colspan="fullColspanTitle" align="center">
              СУМСЬКИЙ ДЕРЖАВНИЙ УНІВЕРСИТЕТ
            </td>
          </tr>
          <tr class="table-faculty">
            <td :colspan="fullColspanTitle">
              {{plan.faculty}}
            </td>
          </tr>
          <tr class="table-text">
            <td colspan="13">
              Затверджено рішенням вченої ради.
            </td>
          </tr>
          <tr class="table-text">
            <td colspan="13">
              Протокол від ____._____________._____р.№____
            </td>
          </tr>
          <tr class="table-text">
            <td colspan="13">
              Голова ради ________________ А.В.Васильєв
            </td>
          </tr>
          <tr class="table-text">
            <td colspan="7" style="text-align: right">
              (підпис)
            </td>
          </tr>
          <tr class="table-text">
            <td colspan="13">
              ______ ________________________ ________ р.
            </td>
          </tr>
          <tr class="table-text">
            <td colspan="7" style="text-align: right">
              М.П.
            </td>
          </tr>
          <tr></tr>
          <tr class="table-title">
            <td :colspan="fullColspanTitle" align="center">
              НАВЧАЛЬНИЙ ПЛАН
            </td>
          </tr>
          <tr></tr>
          <tr v-for="(td, index) in professions" :key="'tr_' + index">
            <td v-for="(item, i) in td"
                :colspan="item.hasOwnProperty('colspan') ? item.colspan :
                          item.hasOwnProperty('acolspan') ? ( fullColspanTitle - item.acolspan * 2 ) / 2 : ''"
                :class="[
                        {'table-profession-title': item.hasOwnProperty('title')},
                        {'table-profession-text': item.hasOwnProperty('key')}
                        ]"
                :key="index + '_' + i"
            >
              <template v-if="item.hasOwnProperty('title')">
                {{ item.title}}
              </template >
              <template v-else-if="item.hasOwnProperty('key')" >
                <template v-if="parseKey(item.key, plan)">
                  {{ parseKey(item.key, plan) }}
                </template>
                <template v-else>
                  <div style="border-bottom: 1px solid black; height: 10pt"></div>
                </template>
              </template>
            </td>
          </tr>

          <tr></tr>

          <tr class="table-subtitle">
            <td :colspan="fullColspanTitle">
              І . ГРАФІК НАВЧАЛЬНОГО ПРОЦЕСУ, тижні
            </td>
          </tr>
          <template v-if="plan.schedule_education_process && plan.schedule_education_process.length !== 0">
            <ScheduleEducationalProcessMonth :items="plan.schedule_education_process.header"/>
            <ScheduleEducationalProcessWeeks :items="plan.schedule_education_process.weeks"/>
            <tr v-for="(k, cursIndex) in plan.schedule_education_process.courses"
                :key="cursIndex"
                class="table-month text-center"
            >
              <td class="border-table">
                {{ cursIndex + 1 }}
              </td>
              <td v-for="(week, i) in k" :key="i" class="table-week border-table">
                {{week.val}}
              </td>
            </tr>
          </template>
          <template v-else>
            <tr class="text-center">
              <td rowspan="2" class="border-table">
                Курс
              </td>
              <td class="border-table"
                v-for="(month, index) in year.header" :key="index" :colspan="month.countWeek">
                {{ month.monthTitle }}
              </td>
            </tr>
            <tr>
              <td class="border-table" v-for="(week, i) in year.weeks" :key="i">
                {{i + 1}}
              </td>
            </tr>
            <tr v-for="(k, cursIndex) in year.courses" :key="cursIndex">
              <td class="border-table">
                {{ cursIndex + 1 }}
              </td>
              <td v-for="(week, i) in k" :key="i" class="border-table"></td>
            </tr>
          </template>

          <tr>
            <td :colspan="fullColspanTitle" class="table-sing">
              ПОЗНАЧЕННЯ: {{plan.notes.notes}}
            </td>
          </tr>
          <tr></tr>

          <tr class="table-subtitle">
            <td colspan="20" class="border-table">
              ІІ. ЗВЕДЕНІ ДАНІ ПРО БЮДЖЕТ ЧАСУ, тижні
            </td>
            <td></td>
            <td></td>
            <td colspan="17" class="border-table">
              ІІІ. ПРАКТИЧНА ПІДГОТОВКА
            </td>
            <td></td>
            <td></td>
            <td colspan="13" class="border-table">
              ІV. АТЕСТАЦІЯ
            </td>
          </tr>
          <tr class="subtable">
            <td rowspan="2" colspan="1" class="border-table">Курс</td>
            <td rowspan="2" colspan="2" class="border-table">Теоретична підготовка</td>
            <td rowspan="2" colspan="2" class="border-table">Екзаменаційна сесія</td>
            <td rowspan="2" colspan="2" class="border-table">Практична підготовка</td>
            <td colspan="9" class="border-table">Атестація</td>
            <td rowspan="2" colspan="2" class="border-table">Канікули</td>
            <td rowspan="2" colspan="2" class="border-table">Усього</td>

            <td></td>
            <td></td>

            <td colspan="1" rowspan="2" class="border-table">№</td>
            <td colspan="5" rowspan="2" class="border-table">Назва</td>
            <td colspan="4" rowspan="2" class="border-table">Семестр</td>
            <td colspan="3" rowspan="2" class="border-table">Число тижнів</td>
            <td colspan="4" rowspan="2" class="border-table">Число кредитів</td>

            <td></td>
            <td></td>

            <td colspan="1" rowspan="2" class="border-table">№</td>
            <td colspan="8" rowspan="2" class="border-table">Форма</td>
            <td colspan="3" rowspan="2" class="border-table">Семестр</td>
          </tr>
          <tr class="subtable">
            <td colspan="5" class="border-table">Кваліфікаційна робота бакалавра</td>
            <td colspan="4" class="border-table">Кваліфікаційні (атестаційні) іспити</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr class="subtable"
            v-for="(item, index) in Math.max(
              plan.exams_table.length,
              plan.summary_data_budget_time.length,
              plan.practical_training.length,
              Math.ceil(plan.number_semesters / 2)
            )"
            :key="'test_' + item"
          >
            <template v-if="plan.summary_data_budget_time[index]">
              <td colspan="1" class="border-table">{{plan.summary_data_budget_time[index].course}}</td>
              <td colspan="2" class="border-table">{{plan.summary_data_budget_time[index].theoretical_training}}</td>
              <td colspan="2" class="border-table">{{plan.summary_data_budget_time[index].exam_session}}</td>
              <td colspan="2" class="border-table">{{plan.summary_data_budget_time[index].practical_training}}</td>
              <td colspan="5" class="border-table">{{plan.summary_data_budget_time[index].bachelor_qualifying_work}}</td>
              <td colspan="4" class="border-table">{{plan.summary_data_budget_time[index].attestation_qualifying_exams}}</td>
              <td colspan="2" class="border-table">{{plan.summary_data_budget_time[index].vacation}}</td>
              <td colspan="2" class="border-table">{{plan.summary_data_budget_time[index].all}}</td>
            </template>
            <template v-else>
              <td colspan="1" :class="{'border-table': plan.study_term.course > index }">
                {{ plan.study_term.course > index ? index + 1 : ''}}
              </td>
              <td colspan="2" :class="{'border-table': plan.study_term.course > index}"></td>
              <td colspan="2" :class="{'border-table': plan.study_term.course > index}"></td>
              <td colspan="2" :class="{'border-table': plan.study_term.course > index}"></td>
              <td colspan="5" :class="{'border-table': plan.study_term.course > index}"></td>
              <td colspan="4" :class="{'border-table': plan.study_term.course > index}"></td>
              <td colspan="2" :class="{'border-table': plan.study_term.course > index}"></td>
              <td colspan="2" :class="{'border-table': plan.study_term.course > index}"></td>
            </template>

            <td></td>
            <td></td>
            <template v-if="plan.practical_training[index]">
              <td colspan="1" class="border-table">{{ index + 1 }}</td>
              <td colspan="5" class="border-table">{{plan.practical_training[index].name}}</td>
              <td colspan="4" class="border-table">{{plan.practical_training[index].semester}}</td>
              <td colspan="3" class="border-table">{{plan.practical_training[index].week}}</td>
              <td colspan="4" class="border-table">{{plan.practical_training[index].credit}}</td>
            </template>
            <template v-else>
              <td colspan="1"></td>
              <td colspan="5"></td>
              <td colspan="4"></td>
              <td colspan="3"></td>
              <td colspan="4"></td>
            </template>



            <td></td>
            <td></td>

            <template v-if="plan.exams_table[index]">
              <td colspan="1" class="border-table">{{ plan.exams_table[index] ? index + 1 : '' }}</td>
              <td colspan="8" class="border-table">
                {{ plan.exams_table[index] ? plan.exams_table[index].title : '' }}
              </td>
              <td colspan="3" class="border-table">
                {{ plan.exams_table[index] ? plan.exams_table[index].semester : '' }}
              </td>
            </template>
            <template v-else>
              <td colspan="1"></td>
              <td colspan="8"></td>
              <td colspan="3"></td>
            </template>
          </tr>
        </tbody>
      </table>

      <table ref="exportablePlan" class="table table-plan mt-5 page-break-before" v-if="plan" width="100%">

          <ModularCyclicHeaderTable
            v-if="plan.form_organization_id === FORM_ORGANIZATIONS.modular_cyclic"
            :plan="plan"
          />
          <SemesterHeaderTable
            v-if="plan.form_organization_id === FORM_ORGANIZATIONS.semester"
            :plan="plan"
          />

        <tbody>
          <template v-for="(cycle, index) in cycles">
            <tr v-if="cycle.cycle_id === null" class="table-subtitle" :key="index">
              <td class="border-table"
                  :colspan="14 + plan.study_term.semesters * FORM_ORGANIZATIONS_TABLE[plan.form_organization_id] * 2"
              >
                {{cycle.title}}
              </td>
            </tr>
            <tr v-if="cycle.asu_id || cycle.selective_discipline_id" :key="'subject_' + index">
              <td class="border-table">{{cycle.index}}</td>
              <td class="border-table">{{ cycle.asu_id ? cycle.title : cycle.selective_discipline.title}}</td>
              <td class="border-table">{{ cycle.exams }}</td><!--Екзамени-->
              <td class="border-table">{{ cycle.test }}</td><!--Заліки-->
              <td class="border-table">{{ cycle.individual_tasks + (cycle.list_cycle_id == 10 ? plan.exams_table[cycle.index - 1].semester : '') }}</td><!--Індивідуальні завдання-->
              <td class="border-table">{{ cycle.credits }}</td><!--Кількість кредитів ЄКТС-->
              <td class="border-table">{{ cycle.total_volume_hour }}</td><!--загальний обсяг-->
              <td class="border-table">{{ cycle.total_classroom }}</td><!--всього-->
              <td class="border-table">{{ cycle.hours }}</td><!--лекції-->
              <td class="border-table">{{ cycle.practices }}</td><!--практичні, семінарські-->
              <td class="border-table">{{ cycle.laboratories }}</td><!--лабораторні-->
              <td class="border-table">{{ cycle.individual_work }}</td><!--самостійна робота-->

              <td
                v-for="semester in plan.study_term.semesters"
                class="border-table no-print"
                :key="'semester_noprint_' + semester"
              >
                <template v-if="cycle.semesters_credits">
                  {{cycle.semesters_credits[semester]}}
                </template>
              </td>

              <td
                v-for="(hour, idx) in cycle.hours_modules.length > 0 ?
                  cycle.hours_modules :
                  plan.study_term.semesters * FORM_ORGANIZATIONS_TABLE[plan.form_organization_id]"
                :key="'hour_' + idx"
                class="border-table"
              >
                <template v-if="hour.hasOwnProperty('hour')">
                  {{hour.hour}}
                </template>
              </td><!--Todo for course-->

              <td class="border-table">{{cycle.department}}</td>
              <td class="border-table"></td><!--Todo Потоки-->
            </tr>

            <tr v-if="cycle.total" :key="'total_' + index" class="table-bold">
              <td class="border-table">{{cycle.index}}</td>
              <td class="border-table">{{cycle.title}}</td>
              <td class="border-table"></td><!--Екзамени-->
              <td class="border-table"></td><!--Заліки-->
              <td class="border-table"></td><!--Індивідуальні завдання-->
              <td class="border-table">{{cycle.credits}}</td><!--Кількість кредитів ЄКТС-->
              <td class="border-table">{{ cycle.total_volume_hour }}</td><!--загальний обсяг-->
              <td class="border-table">
                {{ cycle.total_classroom }}
              </td><!--Todo всього-->
              <td class="border-table">{{ cycle.hours }}</td><!--лекції-->
              <td class="border-table">{{ cycle.practices }}</td><!--практичні, семінарські-->
              <td class="border-table">{{ cycle.laboratories }}</td><!--лабораторні-->
              <td class="border-table">{{cycle.individual_work}}</td><!--самостійна робота-->

              <td
                v-for="semester in plan.study_term.semesters"
                class="border-table no-print"
                :key="'semester_noprint_' + semester"
              >
                <template v-if="cycle.semesters_credits">
                  {{cycle.semesters_credits[semester]}}
                </template>
              </td>

              <td
                v-for="(hour, idx) in cycle.hours_modules.length > 0 ?
                 cycle.hours_modules :
                 plan.study_term.semesters * FORM_ORGANIZATIONS_TABLE[plan.form_organization_id]"
                :key="'hour_' + idx"
                class="border-table"
              >
                {{cycle.hours_modules.length > 0 ? hour : 0}}
              </td>

              <td class="border-table"></td>
              <td class="border-table"></td><!--Todo Потоки-->
            </tr>

            <tr v-if="cycle.cycle_id !== null && cycle.asu_id === undefined && !cycle.total" :key="'cycle_' + index" >
              <td :colspan="14 + plan.study_term.semesters * FORM_ORGANIZATIONS_TABLE[plan.form_organization_id] * 2"
                  class="table-bold border-table"
              >
                {{cycle.title}}
              </td>
            </tr>

            </template>
            <tr class="table-bold">
              <td class="border-table"></td>
              <td colspan="1" class="text-left border-table">Загальна кількість</td>
              <td class="border-table" v-for="td in 3" :key="'td_1_' + td"></td>
              <td class="border-table">{{ totalPlan.credits }}</td><!--Кількість кредитів ЄКТС-->
              <td class="border-table">{{ totalPlan.total_volume_hour }}</td><!--загальний обсяг-->
              <td class="border-table">{{ totalPlan.total_classroom }}</td><!--всього-->
              <td class="border-table">{{ totalPlan.hours }}</td><!--лекції-->
              <td class="border-table">{{ totalPlan.practices }}</td><!--практичні, семінарські-->
              <td class="border-table">{{ totalPlan.laboratories }}</td><!--лабораторні-->
              <td class="border-table">{{ totalPlan.individual_work }}</td><!--самостійна робота-->
              <td
                v-for="semester in plan.study_term.semesters"
                class="border-table no-print"
                :key="'semester_noprint_' + semester"
              >
                <template v-if="totalPlan.semesters_credits">
                  {{totalPlan.semesters_credits[semester]}}
                </template>
              </td>
              <td
                v-for="(hour, idx) in totalPlan.hours_modules.length > 0 ?
                   totalPlan.hours_modules :
                   plan.study_term.semesters * FORM_ORGANIZATIONS_TABLE[plan.form_organization_id]"
                :key="'total_plan_' + idx"
                class="border-table"
              >
                {{totalPlan.hours_modules.length > 0 ? hour : 0}}
              </td>
              <td class="border-table" v-for="td in 2" :key="'td_2_' + td"></td>
            </tr>
            <tr class="table-bold">
              <td class="border-table"></td>
              <td colspan="11" class="text-left border-table">Кількість годин на тиждень</td>
              <td
                v-for="semester in plan.study_term.semesters"
                class="border-table no-print"
                :key="'semester_noprint_' + semester"
              ></td>
              <td
                v-for="(hour, idx) in totalPlan.hours_modules.length > 0 ?
                   totalPlan.hours_modules :
                   plan.study_term.semesters * FORM_ORGANIZATIONS_TABLE[plan.form_organization_id]"
                :key="'hour_' + idx"
                class="border-table"
              >
                {{totalPlan.hours_modules.length > 0 ? hour : 0}}
              </td>
              <td class="border-table" v-for="td in 2" :key="td"></td>
            </tr>
            <tr class="table-bold">
              <td class="border-table"></td>
              <td colspan="11" class="text-left border-table">Кількість екзаменів</td>
              <td
                v-for="semester in plan.study_term.semesters"
                class="border-table no-print"
                :key="'semester_noprint_' + semester"
              ></td>
              <td class="border-table" v-for="(td, index) in plan.count_exams" :key="'count_exams_' + index">{{td}}</td>
              <td class="border-table"></td>
              <td class="border-table"></td>
            </tr>
            <tr class="table-bold">
              <td class="border-table"></td>
              <td colspan="11" class="text-left border-table">Кількість заліків</td>
              <td
                v-for="semester in plan.study_term.semesters"
                class="border-table no-print"
                :key="'semester_noprint_' + semester"
              ></td>
              <td class="border-table" v-for="(td, index) in plan.count_tests" :key="'count_tests_' + index">{{td}}</td>
              <td class="border-table"></td>
              <td class="border-table"></td>
            </tr>
            <tr class="table-bold">
              <td class="border-table"></td>
              <td colspan="11" class="text-left border-table">Кількість курсових робіт</td>
              <td
                v-for="semester in plan.study_term.semesters"
                class="border-table no-print"
                :key="'semester_noprint_' + semester"
              ></td>
              <td class="border-table" v-for="(td, index) in plan.count_coursework" :key="'count_coursework_' + index">{{td}}</td>
              <td class="border-table"></td>
              <td class="border-table"></td>
            </tr>
            <tr>
              <td colspan="11" class="text-left">* у кожному семестрі з каталога обирається 1 навчальна дисципліна обсягом 5 кредитів ЄКТС</td>
              <td v-for="td in fullColspanPlan - 13" :key="td"></td>
            </tr>

          <tr v-for="tr in 2" :key="'tr_1_' + tr"></tr>

          <template v-for="signature in plan.signatures">
            <tr class="text-left signature-position" v-if="signature.agreed" :key="'signature_agreed_' + signature.id">
              <td colspan="5">ПОГОДЖЕНО:</td>
            </tr>

            <tr :key="'signature_1_' + signature.id">
              <td colspan="7" rowspan="3" class="text-left signature-position">
                {{signature.position}}
              </td>
              <td rowspan="3"></td>
              <td rowspan="3"></td>
            </tr>
            <tr :key="'signature_2_' + signature.id">
              <td class="signature">
                ________________
              </td>
              <td></td>
              <td colspan="7" class="signature-position name">{{signature.name}} {{signature.surname}}</td>
            </tr>

              <tr :key="'signature_3_' + signature.id">
                <td class="text-center">
                  (підпис)
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr :key="'signature_tr_' + signature.id"></tr>
            </template>


        </tbody>
      </table>
    </div>
    <v-speed-dial
        v-model="exports"
        bottom
        right
        fixed
        transition="scale-transition"
        class="no-print"
      >
        <template v-slot:activator>
          <v-btn
            v-model="exports"
            color="success"
            dark
            fab
          >
            <v-icon v-if="exports">
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-cloud-download-outline
            </v-icon>
          </v-btn>
        </template>
        <v-btn
          fab
          dark
          small
          color="red accent-4"
          @click="exportPDF()"
        >
          <v-icon>mdi-pdf-box</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="green darken-4"
          @click="exportExcel('xlsx'/*'xls'*/)"
        >
          <v-icon>
            mdi-file-excel
          </v-icon>
        </v-btn>
      </v-speed-dial>
  </v-container>
</template>

<script>
import api from "@/api";
import {API} from "@/api/constants-api";
import ModularCyclicHeaderTable from '@c/Tables/PreviewTablePlan/ModularCyclicHeaderTable'
import SemesterHeaderTable from "@c/Tables/PreviewTablePlan/SemesterHeaderTable";
import {FORM_ORGANIZATIONS, FORM_ORGANIZATIONS_TABLE, VERIFICATION_STATUS} from '@/utils/constants'
import * as XLSX from 'xlsx/xlsx.mjs';
import ScheduleEducationalProcessWeeks
  from "@c/Tables/PreviewTablePlan/ScheduleEducationalProcess/ScheduleEducationalProcessWeeks";
import ScheduleEducationalProcessMonth
  from "@c/Tables/PreviewTablePlan/ScheduleEducationalProcess/ScheduleEducationalProcessMonth";
import ScheduleEducationalProcess from "@/mixins/GenerateTable/ScheduleEducationalProcess";

export default {
  name: "PreviewPlan",
  components: {
    ScheduleEducationalProcessMonth,
    ScheduleEducationalProcessWeeks,
    ModularCyclicHeaderTable,
    SemesterHeaderTable
  },
  data() {
    return {
      statusPlanSuccess: VERIFICATION_STATUS.success,
      byCreatedPDF: process.env.VUE_APP_BY_CREATED_PDF,
      cycles: [],
      exports: false,
      plan: null,
      totalPlan: null,
      fullColspanTitle: 54,
      fullColspanPlan: 22,
      FORM_ORGANIZATIONS: FORM_ORGANIZATIONS,
      FORM_ORGANIZATIONS_TABLE: FORM_ORGANIZATIONS_TABLE,
      professions : [
        [
          { title: 'Галузь знань', colspan: 6 },
          { key: 'field_knowledge', acolspan: 6},
          { title: 'Кваліфікація', colspan: 6 },
          { key: 'qualification', acolspan: 6},
        ],
        [],
        [
          { title: 'Спеціальність', colspan: 6 },
          { key: 'speciality', acolspan: 6},
          { title: 'Термін навчання', colspan: 6 },
          { key: 'study_term.title', acolspan: 6},
        ],
        [],
        [
          { title: 'Спеціалізація', colspan: 6 },
          { key: 'specialization', acolspan: 6},
          { title: 'Форма навчання', colspan: 6 },
          { key: 'form_study.title', acolspan: 6},
        ],
        [],
        [
          { title: 'Освітня програма', colspan: 9 },
          { key: 'education_program', acolspan: 9 },
        ],
        [],
        [
          { title: 'Освітній (освітньо-науковий) рівень', colspan: 13 },
          { key: 'education_level.title', acolspan: 13 },
          { title: 'Рік прийому', colspan: 6 },
          { key: 'year', acolspan: 6},
        ],
      ],
    }
  },
  mounted() {
    this.apiPreviewPlan();
  },
  mixins: [
    ScheduleEducationalProcess
  ],
  methods: {
    apiPreviewPlan() {
      const id = this.$route.params.id
      if (id) {
        api.show(API.PLANS, id, {showLoader: true}).then((response) => {
          if (response.status === 200) {
            this.plan = response.data.data;
            this.getFullColspan();
            this.generateTable(this.plan);
            this.updateCycles(this.getCyclesRow(this.plan.cycles));
          }
        })
      }
    },
    parseKey(path, obj) {
      return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
      }, obj || self)
    },
    getFullColspan() {
      if (this.plan && this.plan.schedule_education_process && this.plan.schedule_education_process.length !== 0) {
        this.fullColspanTitle = this.plan.schedule_education_process.weeks + 1;
      }

      if (this.plan && this.plan.study_term && this.plan.study_term.semesters ) {
        this.fullColspanPlan = 14 + this.plan.study_term.semesters * FORM_ORGANIZATIONS_TABLE[this.plan.form_organization_id]
      }
    },

    exportExcel(type, fn, dl) {
      const title = this.$refs.exportableTitle;
      const plan = this.$refs.exportablePlan;
      const workbook = XLSX.utils.book_new();
      const worksheetPlan = XLSX.utils.table_to_sheet(plan, {cellStyles: true});
      const worksheetTitle = XLSX.utils.table_to_sheet(title, {cellStyles: true});

      worksheetTitle["!cols"] = [
        ...[ ...Array(this.fullColspanTitle).keys() ].map(() => { return {wch: 2} })
      ];

      worksheetPlan["!cols"] = [
        {wch: 2},
        {wch: 40},
        ...[ ...Array(10).keys() ].map(() => { return {wch: 10} }),
        ...[ ...Array(this.plan.study_term.semesters * 2).keys() ].map(() => { return {wch: 4} }),
        ...[ ...Array(2).keys() ].map(() => { return {wch: 10} }),
      ];

      XLSX.utils.book_append_sheet(workbook, worksheetPlan, 'План');
      XLSX.utils.book_append_sheet(workbook, worksheetTitle, 'Титульний аркуш');

      return dl ?
        XLSX.write(workbook, {bookType:type, bookSST:true, type: 'base64'}) :
        XLSX.writeFile(workbook, fn || (this.plan.title + '.' + (type || 'xlsx')));
    },

    updateCycles(cycles) {
      let prev = 0;
      let total_cycles = [];

      this.cycles = cycles.map((cycle, index) => {
        if (cycle.full_total) {
          const total = cycles.slice(prev, index).filter((cycle) => cycle.total && !cycle.full_total);
          prev = index;

          const data = {
            credits: this.GlobalSumPropertyInArray(total, 'credits'),
            total_volume_hour: this.GlobalSumPropertyInArray(total, 'total_volume_hour'),
            hours: this.GlobalSumPropertyInArray(total, 'hours'),
            practices: this.GlobalSumPropertyInArray(total, 'practices'),
            laboratories: this.GlobalSumPropertyInArray(total, 'laboratories'),
            total_classroom: this.GlobalSumPropertyInArray(total, 'total_classroom'),
            individual_work: this.GlobalSumPropertyInArray(total, 'individual_work'),
            hours_modules: this.getHoursModulesTotal(total),
            semesters_credits: this.getSumSemestersCredits(total)
          }

          cycle = {...cycle, ...data }
          total_cycles.push(cycle);
        }
        return cycle;
      })

      this.totalPlan = {
        credits: this.GlobalSumPropertyInArray(total_cycles, 'credits'),
        total_volume_hour: this.GlobalSumPropertyInArray(total_cycles, 'total_volume_hour'),
        hours: this.GlobalSumPropertyInArray(total_cycles, 'hours'),
        practices: this.GlobalSumPropertyInArray(total_cycles, 'practices'),
        laboratories: this.GlobalSumPropertyInArray(total_cycles, 'laboratories'),
        total_classroom: this.GlobalSumPropertyInArray(total_cycles, 'total_classroom'),
        individual_work: this.GlobalSumPropertyInArray(total_cycles, 'individual_work'),
        hours_modules: this.getHoursModulesTotal(total_cycles),
        semesters_credits: this.getSumSemestersCredits(total_cycles)
      }
    },

    getCyclesRow(cycles) {
      let _cycles = [];

      for (let cycle of cycles) {
        const _cycle = {...cycle};
        delete _cycle.subjects;
        delete _cycle.cycles;

        _cycles.push(_cycle)

        if (cycle.subjects.length > 0) {
          cycle.subjects.map((el,index) => el.index = ++index)

          cycle.subjects.map((subject) => {
            subject.total_classroom = this.totalClassroom(subject.hours_modules)
            subject.individual_work = (subject.total_volume_hour - subject.hours - subject.practices -subject.laboratories)
          })

          _cycles.push(...cycle.subjects)

          const total = {
            total: true,
            parent_id: cycle.cycle_id === null ? cycle.id : null,
            title: 'Усього',
            credits: this.GlobalSumPropertyInArray(cycle.subjects, 'credits'),
            total_volume_hour: this.GlobalSumPropertyInArray(cycle.subjects, 'total_volume_hour'),
            hours: this.GlobalSumPropertyInArray(cycle.subjects, 'hours'),
            practices: this.GlobalSumPropertyInArray(cycle.subjects, 'practices'),
            laboratories: this.GlobalSumPropertyInArray(cycle.subjects, 'laboratories'),
            total_classroom: this.GlobalSumPropertyInArray(cycle.subjects, 'total_classroom'),
            individual_work: this.GlobalSumPropertyInArray(cycle.subjects, 'individual_work'),
            hours_modules: this.getHoursModulesTotal(cycle.subjects, true),
            semesters_credits: this.getSumSemestersCredits(cycle.subjects)
          }
          _cycles.push(total);
        }

        if (cycle.cycles.length > 0) {
          _cycles.push(...this.getCyclesRow(cycle.cycles));
        }

        if (
          cycle.cycle_id === null
        ) {
          const fullTotal = {
            total: true,
            full_total: true,
            title: 'Усього за цикл',
            hours_modules: [] //Todo is if check total
          }
          _cycles.push(fullTotal);
        }
      }
      return _cycles;
    },
    exportPDF() {
      window.print();
    },
    totalClassroom(hours_modules) {
      const hours_modules_length = hours_modules.length
      let total = 0;

      if (hours_modules_length || hours_modules_length === this.plan.hours_weeks_semesters.length) {
        this.plan.hours_weeks_semesters.forEach((element, index) => {
          total += element.hour * hours_modules[index].hour;
        })
      }

      return total;
    },
    getHoursModulesTotal(obj, inside_hour = false ) {
      let hours_modules_total = [];
      obj.forEach((item) => {
        if (item.hours_modules.length) {
          item.hours_modules.forEach((hours_module, index) => {
            if (hours_modules_total[index]) {
              hours_modules_total[index] += inside_hour ? hours_module.hour : hours_module
            } else {
              hours_modules_total[index] = inside_hour ? hours_module.hour : hours_module
            }
          })
        }
      })
      return hours_modules_total;
    },
    getSumSemestersCredits(subjects) {
      let semestersCredits = {};

      subjects.map((subject) => {
        if (Object.keys(subject.semesters_credits).length > 0) {
          Object.assign([], subject.semesters_credits).map((semesterCredit, key) => {
            semestersCredits[key] ?
              semestersCredits[key] += semesterCredit :
              semestersCredits[key] = semesterCredit
          })
        }
      })

      return semestersCredits;
    }
  }
}
</script>

<style>
  .table {
    font-family: "Times New Roman";
    border-collapse: collapse;
  }
  .plan-title-table td {
    width: 30px;
    max-width: 40px;
    overflow: hidden;
  }
  .subtable {
    font-size: 8pt;
    text-align: center;
  }
  .table-bold {
    font-weight: bold;
  }
  .table tr {
    min-height: 10pt;
    height: 10pt;
  }
  .table td {
    min-width: 20px;
    padding: 2px;
  }
  .table-title {
    text-transform: uppercase;
    font-size: 14pt;
    font-weight: bold;
    text-align: center;
  }
  .table-subtitle {
    font-size: 10pt;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
  }
  .table-faculty {
    text-align: center;
    font-weight: bold;
    font-size: 10pt;
  }
  .table-text {
    font-size: 10pt;
    white-space: nowrap;
  }
  .table-week {
    text-transform: uppercase;
    text-align: center;
    font-size: 8pt;
  }
  .table-month {
    font-size: 8pt;
    text-align: center;
  }
  .table-sing {
    font-size: 7pt;
  }
  .table-plan {
    font-size: 8pt;
    text-align: center;
    vertical-align: middle;
  }
  table .signature {
    text-align: center;
    vertical-align: bottom;
  }
  table .signature-position {
    font-size: 12pt;
    vertical-align: top;
  }
  table .signature-position.name {
    vertical-align: bottom;
  }
  table tfoot {
    border: 2px solid black;
  }
  table tfoot tr {
    border: 2px solid black;
  }
  .border-table {
    border: 1px solid black;
  }
  .by-created-pdf {
    display: none;
    text-align: right;
    opacity: .6;
    font-size: 8pt;
  }
  .table-plan thead {
    display: table-row-group;
  }
</style>
<style scoped>
  @media print {
    .by-created-pdf {
      display: block;
    }
    @page { size: A4 landscape; }
  }
</style>
