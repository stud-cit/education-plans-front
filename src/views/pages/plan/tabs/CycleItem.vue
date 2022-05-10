<template>
  <div>
    <v-row class="cycle ma-0 mb-1">
      <v-col cols="10" class="pa-0">
        {{ item.title }}
      </v-col>
      <v-col class="pa-0">
        {{ item.credit }}
      </v-col>
      <v-col class="pa-0 text-right">
        <v-btn small icon @click="editCycle(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn small icon @click="delCycle(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-menu
          bottom
          right
        >
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  icon
                  small
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Додати</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item link>
              <v-list-item-title @click="addCycle(item)">Цикл</v-list-item-title>
            </v-list-item>
            <v-list-item link>
              <v-list-item-title @click="addSubject(item)">Дисципліна</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <CycleItem 
      :parentItem="item"
      v-bind:item="child"
      :index="subIndex"
      v-for="(child, subIndex) in item.cycles"
      :key="child.id"
      @addCycle="addCycle"
      @addSubject="addSubject"
      @editSubject="editSubject"
      @editCycle="editCycle"
      @delCycle="delCycle"/>


      <v-row class="subject head ma-0 mb-1" v-if="item.subjects && item.subjects.length > 0">
        <v-col cols="7" class="pa-0 text-left">
          Назва предмету
        </v-col>
        <v-col class="pa-0">
          Лекцій
        </v-col>
        <v-col class="pa-0">
          Практичних
        </v-col>
        <v-col class="pa-0">
          Лабораторних
        </v-col>
        <v-col class="pa-0">
          Кредитів
        </v-col>
        <v-col class="pa-0"></v-col>
      </v-row>

      <v-row class="subject ma-0 mb-1" v-for="(subject, subjectIndex) in item.subjects" :key="subjectIndex">
        <v-col cols="7" class="pa-0 text-left">
          {{subject.title ? subject.title : subject.selective_discipline.title}}
        </v-col>
        <v-col class="pa-0">
          {{ subject.hours }}
        </v-col>
        <v-col class="pa-0">
          {{ subject.practices }}
        </v-col>
        <v-col class="pa-0">
          {{ subject.laboratories }}
        </v-col>
        <v-col class="pa-0">
          {{ subject.credits }}
        </v-col>
        <v-col class="pa-0 text-right">
          <v-btn small icon @click="editSubject(subject)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn small icon @click="delSubject(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row> 
  </div>
</template>
<script>
export default {
  name: "CycleItem",
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    parentItem: {
      required: false
    }
  },
  methods: {
    addSubject(item) {
      this.$emit('addSubject', item)
    },
    editSubject(item) {
      this.$emit('editSubject', item)
    },
    delSubject(item) {
      this.$emit('delSubject', item)
    },
    addCycle(item) {
      this.$emit('addCycle', item)
    },
    editCycle(item) {
      this.$emit('editCycle', item)
    },
    delCycle(item) {
      this.$emit('delCycle', item)
    },
  }
}
</script>
<style scoped>
  .cycle, .subject {
    width: 100%;
    padding: 5px 10px 5px 10px;
    background: #fff;
    box-shadow: 0px 1px 2px #dedede;
    border-radius: 5px;
    margin-bottom: 2px;
    font-size: 14px;
    text-align: center;
    display: flex;
    align-items: center;
  }
  .subject.head {
    text-align: center;
    color: #9b9b9b;
  }
  .cycle {
    background: #fbfbfb;
  }
</style>