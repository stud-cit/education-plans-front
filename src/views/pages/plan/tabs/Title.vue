<template>
  <div>
    <table>
      <tr>
        <th :colspan="year.weeks + 1">
          І . ГРАФІК НАВЧАЛЬНОГО ПРОЦЕСУ, тижні
        </th>
      </tr>
      <tr>
        <td rowspan="2">
          Курс
        </td>
        <td v-for="(month, index) in year.header" :key="index" :colspan="month.countWeek">
          {{ month.monthTitle }}
        </td>
      </tr>
      <tr>
        <td v-for="(week, i) in year.weeks" :key="i">
          {{i + 1}}
        </td>
      </tr>
      <tr v-for="(k, cursIndex) in year.courses" :key="cursIndex">
        <td>
          {{ cursIndex + 1 }}
        </td>
        <td v-for="(week, i) in k" :key="i">
          <input type="text" v-model="week.val">
        </td>
      </tr>
      <tr>
        <td :colspan="year.weeks + 1" class="text-left pa-2">
          ПОЗНАЧЕННЯ: Т – теоретична підготовка; Т* – атестаційний тиждень, проводиться в межах теоретичної підготовки; С – семестровий контроль (екзаменаційна сесія); П – практична підготовка; К – канікули; А – атестація; Д – підготовка кваліфікаційної роботи.
        </td>
      </tr>
    </table>
    <br>
    <table>
      <tr>
        <th colspan="8">ІІ. ЗВЕДЕНІ ДАНІ ПРО БЮДЖЕТ ЧАСУ, тижні</th>
      </tr>
      <tr>
        <td rowspan="2">Курс</td>
        <td rowspan="2">Теоретична підготовка</td>
        <td rowspan="2">Екзаме-наційна сесія</td>
        <td rowspan="2">Пратична підготовка</td>
        <td colspan="2">Атестація</td>
        <td rowspan="2">Канікули</td>
        <td rowspan="2">Усього</td>
      </tr>
      <tr>

        <td>Кваліфікаційна робота бакалавра</td>
        <td>Квалфікаційні (атестаційні) іспити</td>
      </tr>
      <tr v-for="i in data.study_term.course" :key="i">
        <td>{{ i }}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
    <br>
    <v-row>
      <v-col>
        <table>
          <tr>
            <th colspan="5">ІІІ. ПРАКТИЧНА ПІДГОТОВКА</th>
          </tr>
          <tr>
            <td>
              №
            </td>
            <td>
              Назва
            </td>
            <td>
              Семестр
            </td>
            <td>
              Число тижнів
            </td>
            <td>
              Число кредитів
            </td>
          </tr>
          <tr v-for="i in 2" :key="i">
            <td>{{ i }}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </v-col>
      <v-col>
        <table>
          <tr>
            <th colspan="3">
              ІV. АТЕСТАЦІЯ
            </th>
          </tr>
          <tr>
            <td>
              №
            </td>
            <td>
              Форма
            </td>
            <td>
              Семестр
            </td>
          </tr>
          <tr v-for="i in 4" :key="i">
            <td>{{i}}</td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </v-col>
    </v-row>
    <v-btn
      class="mt-4"
      type="submit"
      color="primary"
      @click="save()"
    >
      Зберегти
    </v-btn>
  </div>
</template>
<script>
export default {
  name: "Title",
  props: {
    data: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      year: {
        weeks: 0,
        header: [],
        courses: []
      },
      month: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']
    }
  },
  mounted() {
    this.start();
  },
  methods: {
    save() {
      console.log(this.year)
    },

    start() {
      for (let index = 0; index < this.data.study_term.course; index++) {
        this.year.courses.push([]);
      }

      for (let index = 0; index < 12; index++) {
        var date = new Date(this.data.year, 9 + index, 0);
        var countWeek = this.getWeeks(date.getFullYear(), date.getMonth(), 0);
        this.year.weeks += countWeek;

        this.year.header.push({
          monthTitle: this.month[date.getMonth()],
          countWeek
        });

        for (let course = 0; course < this.year.courses.length; course++) {
          for (let countWeekIndex = 0; countWeekIndex < countWeek; countWeekIndex++) {
            this.year.courses[course].push({
              month: index,
              course,
              val: ""
            });
          }
        }
      }
    },

    getWeeks(year, month) {
      var l=new Date(year, month+1, 0);
      var result = Math.floor( (l.getDate()- (l.getDay()?l.getDay():7))/7+1);
      return result;
    }
  }
}
</script>
<style lang="css" scoped>
  table {
    width: 100%;
    font-size: 12px;
    border: 1px solid #dee2e6;
    border-collapse: collapse;
  }
  table td {
    text-align: center;
    color: #000;
    font-size: 14px;
    border: 1px solid #dee2e6;
    width: 19.5px;
  }
  table th {
    padding: 10px 0;
  }
  table td input {
    width: 100%;
    height: 100%;
    text-align: center;
    outline: none;
    text-transform: uppercase;
  }
  table td input:focus {
    border: 1px solid #000;
    box-sizing: border-box;
  }
</style>