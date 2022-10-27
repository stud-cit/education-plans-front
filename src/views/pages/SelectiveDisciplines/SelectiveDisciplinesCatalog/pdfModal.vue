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
        <v-toolbar-title>PDF</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          dark
          @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <p class="pt-7 px-3 text-center">
        СУМСЬКИЙ ДЕРЖАВНИЙ УНІВЕРСИТЕТ
      </p>
      <table class="table">
        <thead>
        <tr>
          <th class="text-center" rowspan="2">Назва дисципліни</th>
          <th class="text-center" rowspan="2">Мова викладання</th>
          <th class="text-center" rowspan="2" >Рівень освіти, для якого пропонується дисципліна (перший/другий/третій)</th>
          <th class="text-center" rowspan="2">Перелік галузей знань / спеціальностей, для яких пропонується дисципліна</th>
          <th class="text-center" rowspan="2">Кафедра, що пропонує дисципліну</th>
          <th class="text-center" colspan="2">Посада, прізвище та ініціали викладача (ів), який (і) пропонується для викладання</th>
          <th class="text-center" rowspan="2">Загальна компетентність, на формування або розвиток якої спрямована дисципліна</th>
          <th class="text-center" rowspan="2">Результати навчання за навчальною дисципліною</th>
          <th class="text-center" rowspan="2">Види навчальних занять та методи викладання, що пропонуються</th>
          <th class="text-center" rowspan="2">Кількість здобувачів, які можуть записатися на дисципліну</th>
          <th class="text-center" rowspan="2">Вхідні вимоги до здобувачів, які хочуть обрати дисципліну / вимоги до матеріально-технічного забезпечення</th>
          <th class="text-center" rowspan="2">Обмеження щодо семестру вивчення</th>
        </tr>
        <tr>
          <th class="text-center">Лекції</th>
          <th class="text-center">Семінарські та практичні заняття, лабораторні роботи</th>
        </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
      <v-btn
        class="btn-center"
        color="primary"
        dark
        fixed
        bottom
        @click="close"
      >Завантажити</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "PdfSelectiveDisciplinesCatalogModal",
  props: {
    dialog: {
      type: Boolean,
      default() {
        return false;
      }
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  }
}
</script>

<style scoped>
  .table {
    margin: 40px 20px 60px;
    font-size: 15px;
  }
  .table th, .table td {
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
  .table thead {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
  .btn-center {
    left: 50%;
    transform: translateX(-50%);
  }
</style>
