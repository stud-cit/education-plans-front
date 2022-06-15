<template>
  <v-container>
    <div v-if="plan">
      <div class="print">
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
                {{plan.title}}
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
            <template v-if="this.plan.schedule_education_process && this.plan.schedule_education_process.length !== 0">
              <ScheduleEducationalProcessMonth :items="this.plan.schedule_education_process.header"/>
              <ScheduleEducationalProcessWeeks :items="this.plan.schedule_education_process.weeks"/>
              <tr v-for="(k, cursIndex) in this.plan.schedule_education_process.courses"
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
                ПОЗНАЧЕННЯ: Т – теоретична підготовка;
                Т* – атестаційний тиждень,проводиться в межах теоретичної підготовки;
                С – семестровий контроль (екзаменаційна сесія);
                П – практична підготовка; К – канікули; А – атестація;
                Д – підготовка кваліфікаційної роботи.
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

            <tr class="subtable">
              <td colspan="1" class="border-table"></td>
              <td colspan="2" class="border-table"></td>
              <td colspan="2" class="border-table"></td>
              <td colspan="2" class="border-table"></td>
              <td colspan="5" class="border-table"></td>
              <td colspan="4" class="border-table"></td>
              <td colspan="2" class="border-table"></td>
              <td colspan="2" class="border-table"></td>

              <td></td>
              <td></td>

              <td colspan="1" class="border-table"></td>
              <td colspan="5" class="border-table"></td>
              <td colspan="4" class="border-table"></td>
              <td colspan="3" class="border-table"></td>
              <td colspan="4" class="border-table"></td>

              <td></td>
              <td></td>

              <td colspan="1" class="border-table"></td>
              <td colspan="8" class="border-table"></td>
              <td colspan="3" class="border-table"></td>
            </tr>
          </tbody>
        </table>

        <table ref="exportablePlan" class="table table-plan mt-5" v-if="plan" width="100%">

          <template v-if="plan.form_organization_id === FORM_ORGANIZATIONS.modular_cyclic">
            <ModularCyclicHeaderTable :plan="plan"/>
          </template>
          <template v-else-if="plan.form_organization_id === FORM_ORGANIZATIONS.semester">
            <SemesterHeaderTable :plan="plan"/>
          </template>

          <tbody>
            <template v-for="(cycle, index) in getCyclesRow(this.plan.cycles)">
              <tr v-if="cycle.cycle_id === null" class="table-subtitle" :key="index">
                <td class="border-table" :colspan="14 + plan.study_term.semesters * 2">
                  {{cycle.title}}
                </td>
              </tr>
              <tr v-if="cycle.asu_id || cycle.selective_discipline_id" :key="'subject_' + index">
                <td class="border-table">{{cycle.index}}</td>
                <td class="border-table">{{ cycle.asu_id ? cycle.title : cycle.selective_discipline.title}}</td>
                <td class="border-table"></td><!--Todo Екзамени-->
                <td class="border-table"></td><!--Todo Заліки-->
                <td class="border-table"></td><!--Todo Індивідуальні завдання-->
                <td class="border-table"></td><!--Todo Кількість кредитів ЄКТС-->
                <td class="border-table"></td><!--Todo загальний обсяг-->
                <td class="border-table"></td><!--Todo всього-->
                <td class="border-table"></td><!--Todo лекції-->
                <td class="border-table"></td><!--Todo практичні, семінарські-->
                <td class="border-table"></td><!--Todo лабораторні-->
                <td class="border-table"></td><!--Todo самостійна робота-->

                <td v-for="(hour, idx) in cycle.hours_modules.length > 0 ? cycle.hours_modules : plan.study_term.semesters * 2"
                    :key="'hour_' + idx"
                    class="border-table"
                >
                  <template v-if="hour.hasOwnProperty('hour')">
                    {{hour.hour}}
                  </template>
                </td><!--Todo for course-->

                <td class="border-table"></td><!--Todo Кафедра викладання -->
                <td class="border-table"></td><!--Todo Потоки-->
              </tr>

              <tr v-if="cycle.total" :key="'total_' + index" class="table-bold">
                <td class="border-table">{{cycle.index}}</td>
                <td class="border-table">{{cycle.title}}</td>
                <td class="border-table"></td><!--Todo Екзамени-->
                <td class="border-table"></td><!--Todo Заліки-->
                <td class="border-table"></td><!--Todo Індивідуальні завдання-->
                <td class="border-table"></td><!--Todo Кількість кредитів ЄКТС-->
                <td class="border-table"></td><!--Todo загальний обсяг-->
                <td class="border-table"></td><!--Todo всього-->
                <td class="border-table"></td><!--Todo лекції-->
                <td class="border-table"></td><!--Todo практичні, семінарські-->
                <td class="border-table"></td><!--Todo лабораторні-->
                <td class="border-table"></td><!--Todo самостійна робота-->

                <td v-for="(hour, idx) in plan.study_term.semesters * 2"
                    :key="'hour_' + idx"
                    class="border-table"
                >

                </td><!--Todo for course-->

                <td class="border-table"></td><!--Todo Кафедра викладання -->
                <td class="border-table"></td><!--Todo Потоки-->
              </tr>
              <tr v-if="cycle.cycle_id !== null && cycle.asu_id === undefined && !cycle.total" :key="'cycle_' + index" >
                <td :colspan="14 + plan.study_term.semesters * 2" class="table-bold border-table">
                  {{cycle.title}}
                </td>
              </tr>
            </template>
            <tr class="table-bold">
              <td class="border-table"></td>
              <td colspan="1" class="text-left border-table">Усього атестації</td>
              <td class="border-table" v-for="td in this.fullColspanPlan - 2" :key="td"></td>
            </tr>
            <tr class="table-bold">
              <td class="border-table"></td>
              <td colspan="1" class="text-left border-table">Загальна кількість</td>
              <td class="border-table" v-for="td in this.fullColspanPlan - 2" :key="td"></td>
            </tr>
            <tr class="table-bold">
              <td class="border-table"></td>
              <td colspan="11" class="text-left border-table">Кількість годин на тиждень</td>
              <td class="border-table" v-for="td in this.fullColspanPlan - 12" :key="td"></td>
            </tr>
            <tr class="table-bold">
              <td class="border-table"></td>
              <td colspan="11" class="text-left border-table">Кількість екзаменів</td>
              <td class="border-table" v-for="td in this.fullColspanPlan - 12" :key="td"></td>
            </tr>
            <tr class="table-bold">
              <td class="border-table"></td>
              <td colspan="11" class="text-left border-table">Кількість заліків</td>
              <td class="border-table" v-for="td in this.fullColspanPlan - 12" :key="td"></td>
            </tr>
            <tr class="table-bold">
              <td class="border-table"></td>
              <td colspan="11" class="text-left border-table">Кількість курсових робіт</td>
              <td class="border-table" v-for="td in this.fullColspanPlan - 12" :key="td"></td>
            </tr>
            <tr>
              <td colspan="11" class="text-left">* у кожному семестрі з каталога обирається 1 навчальна дисципліна обсягом 5 кредитів ЄКТС</td>
              <td v-for="td in this.fullColspanPlan - 13" :key="td"></td>
            </tr>
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
          @click="ExportPDF()"
        >
          <v-icon>mdi-pdf-box</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="green darken-4"
          @click="ExportExcel('xlsx'/*'xls'*/)"
        >
          <v-icon>
            mdi-file-excel
          </v-icon>
        </v-btn>
      </v-speed-dial>
    </div>
  </v-container>
</template>

<script>
import api from "@/api";
import {API} from "@/api/constants-api";
// import * as XLSX from 'xlsx/xlsx.mjs';
// import { writeFileXLSX as XLSX } from "xlsx";
import ModularCyclicHeaderTable from '@c/Tables/PreviewTablePlan/ModularCyclicHeaderTable'
import SemesterHeaderTable from "@c/Tables/PreviewTablePlan/SemesterHeaderTable";
import {FORM_ORGANIZATIONS, FORM_ORGANIZATIONS_TABLE} from '@/utils/constants'
import * as XLSX from 'xlsx/xlsx.mjs';
// import XLSX from 'xlsx'
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
      exports: false,
      plan: null,
      fullColspanTitle: 54,
      fullColspanPlan: 22,
      FORM_ORGANIZATIONS: FORM_ORGANIZATIONS,
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

    ExportExcel(type, fn, dl) {
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
        ...[ ...Array(this.plan.study_term.semesters * 2).keys() ].map(() => { return {wch: 2} }),
        ...[ ...Array(2).keys() ].map(() => { return {wch: 10} }),
      ];

      XLSX.utils.book_append_sheet(workbook, worksheetPlan, 'План');
      XLSX.utils.book_append_sheet(workbook, worksheetTitle, 'Титульний аркуш');

      return dl ?
        XLSX.write(workbook, {bookType:type, bookSST:true, type: 'base64'}) :
        XLSX.writeFile(workbook, fn || (this.plan.title + '.' + (type || 'xlsx')));
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
          _cycles.push(...cycle.subjects)

          const total = {
            total: true,
            title: 'Усього',
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
            title: 'Усього за навчальними дисциплінами загальної підготовки',
          }
          _cycles.push(fullTotal);
        }
      }
      return _cycles;
    },
    ExportPDF() {
      window.print();
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
  table tfoot .foot-title {
    text-align: left;
    font-size: 8pt;
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
</style>
<style scoped>
  @media print {
    @page {size: A4 landscape}
  }
</style>
