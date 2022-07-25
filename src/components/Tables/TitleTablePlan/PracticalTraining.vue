<template>
  <div>
    <table>
      <tr>
        <th colspan="5">ІІІ. ПРАКТИЧНА ПІДГОТОВКА</th>
      </tr>
      <tr>
        <td>№</td>
        <td>Назва</td>
        <td>Семестр</td>
        <td>Число тижнів</td>
        <td>Число кредитів</td>
        <td>Дії</td>
      </tr>
      <tr v-for="(item, index) in result" :key="item.id">
        <td>{{ ++index }}</td>
        <td>
          <input type="text" v-model="item.name">
        </td>
        <td>
          <input type="text" v-model="item.semester">
        </td>
        <td>
          <input type="text" v-model="item.week">
        </td>
        <td>
          <input type="text" v-model="item.credit">
        </td>
        <td>
          <v-icon
            small
            color="red"
            @click="deleted(item)"
          >
            mdi-trash-can-outline
          </v-icon>
        </td>
      </tr>
    </table>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          large
          class="d-block mx-auto"
          v-bind="attrs"
          v-on="on"
          @click="addItem"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Додати позицію</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: "PracticalTraining",
  data: () => {
    return {
      result: [],
      item: {
        id: null,
        name: null,
        semester: null,
        week: null,
        credit: null
      }
    }
  },
  mounted() {
    this.result = this.items
  },
  props: ['items'],
  methods: {
    addItem() {
      this.result.push({...this.item, id: this.generatorId(this.result)})
    },
    deleted(item) {
      this.result = this.result.filter(i => i.id !== item.id);
    },
    generatorId(obj) {
      const  ids = obj.map(function(o) { return o.id; })
      return ids.length ? Math.max.apply(Math, ids) + 1 : 1;
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
  margin-bottom: 5px;
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
