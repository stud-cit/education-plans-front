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
          <v-toolbar-title>Предмет</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="subjectDialog = false"
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
                  class="ma-0"
                  label="Дисципліна за вибором"
                ></v-checkbox>
              </v-col>
              <v-col cols="9" class="py-0">
                <v-autocomplete
                  :items="[1,2,3,4]"
                  label="Предмет"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  label="Кредитів"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  label="Обсяг годин лекцій"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  label="Обсяг годин практичних занять"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  label="Обсяг годин лабораторних занять"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <table class="table-modules">
              <tr>
                <td colspan="16">Розподіл годин на тиждень за курсами, семестрами і модульними атестаційними циклами</td>
              </tr>
              <tr>
                <td colspan="4" v-for="index in 4" :key="index">{{ index }} курс</td>
              </tr>
              <tr>
                <td colspan="16">Семестри</td>
              </tr>
              <tr>
                <td colspan="2" v-for="index in 8" :key="index">{{ index }}</td>
              </tr>
              <tr>
                <td colspan="16">Модульні атестаційні цикли</td>
              </tr>
              <tr>
                <td v-for="(item, i) in 16" :key="i">
                  <v-text-field>
                  </v-text-field>
                </td>
              </tr>
              <tr>
                <td colspan="16">
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        :items="[1,2,3,4]"
                        label="Форма контролю"
                      ></v-autocomplete>
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        :items="[1,2,3,4]"
                        label="Індивідуальні завдання"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </td>
              </tr>
              <tr>
                <td colspan="16">Розподіл кредитів на вивчення за семестрами</td>
              </tr>
              <tr>
                <td colspan="2" v-for="index in 8" :key="index">
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
            @click="cycleDialog = false"
          >
            Зберегти
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-tabs v-model="tab">
      <v-tab>Загальна інформація</v-tab>
      <v-tab>Цикли / предмети</v-tab>
      <v-tab>Титульний лист</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <General
          :fields="generalTabFields"
          @submit="submit"
        />
      </v-tab-item>
      <v-tab-item>

        <CycleItem
          :item="item"
          :index="index"
          v-for="(item, index) in cycles"
          :key="item.id"
          @addSubject="addSubject"
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
        3
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import CycleItem from '@/views/pages/plan/tabs/CycleItem.vue';
import api from "@/api";
import {API} from "@/api/constants-api";
import General from "@/views/pages/plan/tabs/General";

export default {
  name: "CreatePlan",
  components: {
    General,
    CycleItem
  },
  data() {
    return {
      tab: 1,
      cycles: [],
      cycleDialog: false,
      subjectDialog: false,
      dialog: true,
      cycleForm: {
        title: "",
        credit: 0,
      },
      subjectForm: {
        
      },

      generalTabFields: null,
    }
  },

  mounted() {
    this.apiGetFields();
    this.apiGetCycles();
  },

  methods: {
    addSubject(item) {
      console.log(item)
      this.subjectDialog = true;
    },
    addCycle(item) {
      console.log(item)
      this.cycleForm = {title: "", credit: 0}
      this.cycleDialog = true;
    },
    editCycle(item) {
      this.cycleDialog = true;
      this.cycleForm = Object.assign(item, {});
    },
    delCycle(item) {
      console.log(item)
    },

    submit(data) {
      api.post(API.PLANS, data).then((response) => {
        const { message } = response.data;
        this.$swal.fire({
          position: "center",
          icon: "success",
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
      console.log(data)
    },

    apiGetFields() {
      api.get(API.PLAN_CREATE).then(({data}) => {
        this.generalTabFields = data
      })
    },

    // for tests
    apiGetCycles() {
      api.get(API.CYCLES).then(({data}) => {
        this.cycles = data;
      })
    },
  }
}

</script>

<style lang="css" scoped>
  table.table-modules {
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
</style>