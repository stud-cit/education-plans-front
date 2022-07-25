<template>
  <table>
    <tr>
      <th colspan="8">ІІ. ЗВЕДЕНІ ДАНІ ПРО БЮДЖЕТ ЧАСУ, тижні</th>
    </tr>
    <tr>
      <td rowspan="2">Курс</td>
      <td rowspan="2">Теоретична підготовка</td>
      <td rowspan="2">Екзаменаційна сесія</td>
      <td rowspan="2">Практична підготовка</td>
      <td colspan="2">Атестація</td>
      <td rowspan="2">Канікули</td>
      <td rowspan="2">Усього</td>
    </tr>
    <tr>
      <td>Кваліфікаційна робота бакалавра</td>
      <td>Кваліфікаційні (атестаційні) іспити</td>
    </tr>
    <tr v-for="item in result" :key="item.course">
      <td>{{ item.course }}</td>
      <td>
        <input v-model="item.theoretical_training">
      </td>
      <td>
        <input v-model="item.exam_session">
      </td>
      <td>
        <input v-model="item.practical_training">
      </td>
      <td>
        <input v-model="item.bachelor_qualifying_work">
      </td>
      <td>
        <input v-model="item.attestation_qualifying_exams">
      </td>
      <td>
        <input v-model="item.vacation">
      </td>
      <td>
        <input v-model="item.all">
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "SummaryDataBudgetTime",
  data: () => {
    return {
      result: []
    }
  },
  mounted() {
    this.result = !this.items ? this.generatorFields(this.course) : this.items
  },
  props: ['items', 'course'],
  methods: {
    generatorFields(course) {
      let result = [];
      const item = {
        course: null,
        theoretical_training: null,
        exam_session: null,
        practical_training: null,
        vacation: null,
        all: null,
        bachelor_qualifying_work: null,
        attestation_qualifying_exams: null,
      }
      for (let i = 1; i <= course; i++) {
        result.push({...item, course: i});
      }

      return result;
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
  font-size: 12px;
  border: 1px solid #dee2e6;
  border-collapse: collapse;
  margin-bottom: 15px;
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
}
table td input:focus {
  border: 1px solid #000;
  box-sizing: border-box;
}
table tfoot {
  font-weight: bold;
  border: 0;
}
</style>
