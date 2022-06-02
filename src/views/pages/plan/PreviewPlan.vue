<template>
  <v-container>
    Preview
    <div v-if="plan">
      <table ref="exportable_table" width="100%">
        <tbody >
        <tr>
          <td colspan="3" style="text-align: center">
            {{plan.title}}
          </td>
        </tr>
        <tr>
          <td>Row 2 - Column 1</td>
          <td>Row 2 - Column 2</td>
          <td>Row 2 - Column 3</td>
        </tr>
        <tr>
          <td>Row 3 - Column 1</td>
          <td>Row 3 - Column 2</td>
          <td>Row 3 - Column 3</td>
        </tr>
        </tbody>
      </table>
      <input type="text" v-model="name">
      <button @click="ExportExcel('xls')">Export table to excel xls</button>
      <button @click="ExportExcel('xlsx')">Export table to excel xlsx</button>
    </div>



    <pre>
      {{plan}}
    </pre>
  </v-container>
</template>

<script>
// import * as XLSX from 'xlsx/xlsx.mjs';
// import { writeFileXLSX as XLSX } from "xlsx";
import * as XLSX from 'xlsx/xlsx.mjs';
// import XLSX from 'xlsx'
import {mapGetters} from "vuex";

export default {
  name: "PreviewPlan",
  data() {
    return {
      name: 'test'
    }
  },
  computed: {
    ...mapGetters({
      plan: 'plans/plan'
    })
  },
  mounted() {
    this.apiPreviewPlan();
  },
  methods: {
    apiPreviewPlan() {
      const id = this.$route.params.id
      if (id) {
        this.$store.dispatch('plans/show', id)
      }
    },
    ExportExcel(type, fn, dl) {
      var elt = this.$refs.exportable_table;

      var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
      return dl ?
        XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
        XLSX.writeFile(wb, fn || ((this.name + '.'|| 'SheetJSTableExport.') + (type || 'xlsx')));
    }
  }
}
</script>

<style scoped>

</style>
