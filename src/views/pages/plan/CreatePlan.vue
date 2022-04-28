<template>
  <v-container>

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
      tab: 0,
      cycles: [
        {
          id: 1,
          title: "1 ЦИКЛ ДИСЦИПЛІН ЗАГАЛЬНОЇ ПІДГОТОВКИ",
          credit: 65,
          cycle_id: null,
          cycles: [
            {
              id: 2,
              title: "1.1 Обов'язкові навчальні дисципліни",
              credit: 50,
              cycle_id: 1,
              subjects: [
                {
                  title: "Іноземна мова"
                },
                {
                  title: 'Українознавство зі змістовим модулем "Комунікативний курс української мови"'
                },
                {
                  title: "Філософія"
                }
              ]
            },
            {
              id: 3,
              title: "1.2 Вибіркові навчальні дисципліни",
              credit: 15,
              cycle_id: 1,
              subjects: [
                {
                  title: "Фізичне виховання (вибір форм рухової активності)"
                },
                {
                  title: "Вибіркові дисципліни гуманітарного спрямування (додаток 1)"
                },
                {
                  title: "Вибіркові дисципліни інших спеціальностей  (додаток 2)"
                },
                {
                  title: "Іноземна мова"
                },
              ]
            }
          ],
          subjects: []
        },
        {
          id: 4,
          title: "2. ЦИКЛ ДИСЦИПЛІН ПРОФЕСІЙНОЇ ПІДГОТОВКИ",
          credit: 160,
          cycle_id: null,
          cycles: [
            {
              id: 5,
              title: "2.1 Обов'язкові навчальні дисципліни",
              credit: 115,
              cycle_id: 4,
              cycles: [
                {
                  id: 6,
                  title: "2.1.1 Обов’язкові навчальні дисципліни за спеціальністю",
                  credit: 55,
                  cycle_id: 5,
                  subjects: [
                    {
                      title: "Іноземна мова"
                    },
                    {
                      title: 'Українознавство зі змістовим модулем "Комунікативний курс української мови"'
                    },
                    {
                      title: "Філософія"
                    }
                  ]
                },
                {
                  id: 7,
                  title: "2.1.2. Обов'язкові навчальні дисципліни за освітньою програмою",
                  credit: 60,
                  cycle_id: 5,
                  subjects: [
                    {
                      title: "Іноземна мова"
                    },
                    {
                      title: 'Українознавство зі змістовим модулем "Комунікативний курс української мови"'
                    },
                    {
                      title: "Філософія"
                    }
                  ]
                }
              ],
              subjects: []
            },
            {
              id: 8,
              title: "2.2. Вибіркові навчальні дисципліни",
              credit: 45,
              cycle_id: 4,
              cycles: [
                {
                  id: 9,
                  title: "2.2.1 Вибіркові навчальні дисципліни за спецальністю",
                  credit: 10,
                  cycle_id: 8,
                  subjects: [
                    {
                      title: "Вибіркові дисципліни за спеціальністю"
                    }
                  ]
                },
                {
                  id: 10,
                  title: "2.2.2 Вибіркові навчальні дисципліни за освітньою програмою",
                  credit: 35,
                  cycle_id: 8,
                  subjects: [
                    {
                      title: "Вибіркові дисципліни за освітньою програмою"
                    }
                  ]
                }
              ]
            }
          ],
          subjects: []
        },
        {
          id: 11,
          title: "3. Цикл практичної підготовки",
          credit: 10,
          cycle_id: null,
          subjects: [
            {
              title: "Практика"
            },
            {
              title: "Практика"
            }
          ]
        },
        {
          id: 12,
          title: "4. Атестація",
          credit: 5,
          cycle_id: null,
          subjects: [
            {
              title: "Кваліфікаційна робота бакалавра"
            },
            {
              title: "Атестаційний кваліфікаційний іспит"
            }
          ]
        }
      ],
      cycleDialog: false,
      cycleForm: {
        title: "",
        credit: 0,
      },

      generalTabFields: null,
    }
  },

  mounted() {
    this.apiGetFields();
  },

  methods: {
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
  }
}

</script>
