<template>
  <div>
    <v-row :class="['cycle-subject', 'cycle', cycleIndexError == item.id ? 'error' : '', 'ma-0', 'mb-1']">
      <v-col cols="10" class="pa-0">
        <input type="text" :disabled="cycleIndex != item.id" v-model="item.title">
      </v-col>
      <v-col class="pa-0">
        <input 
          type="text" 
          class="credits"
          :disabled="cycleIndex != item.id" 
          v-model="item.credit"
          @input="checkCredit(parentItem, item)"
        >
      </v-col>
      <v-col class="pa-0 text-right">
        <v-btn small icon @click="cycleIndex = item.id" v-if="cycleIndex != item.id">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn small icon @click="saveCycle(item)" v-else>
          <v-icon>mdi-floppy</v-icon>
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

    <v-row class="cycle-subject head ma-0 mb-1" v-if="item.subjects && item.subjects.length > 0">
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

    <SubjectItem
      v-for="(subject, subjectIndex) in item.subjects" 
      :key="subjectIndex"
      :subject="subject"
      :item="item"/>

    <CycleItem 
      :parentItem="item"
      v-bind:item="child"
      :index="subIndex"
      :indexComponent="indexComponent"
      v-for="(child, subIndex) in item.cycles"
      :key="'cycle' + child.id + indexComponent"
      @addCycle="addCycle"
      @addSubject="addSubject"
      @saveCycle="saveCycle"
      @editCycle="editCycle"
      @delCycle="delCycle"
      @errorCycle="errorCycle"/>

  </div>
</template>
<script>
import SubjectItem from '@/views/pages/plan/tabs/SubjectItem.vue';
export default {
  name: "CycleItem",
  components: {
    SubjectItem
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    indexComponent: {
      type: Number,
      required: true
    },
    parentItem: {
      required: false
    },
    data: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      cycleIndex: null,
      cycleIndexError: null
    }
  },
  mounted() {
    this.checkCredit(this.parentItem, this.item);
  },
  methods: {
    checkCredit(parentItem, item) {
      if(parentItem) {
        this.checkCreditMethod(
          parentItem, 
          item, 
          parentItem.credit, 
          "Перевищена кількість кредитів в циклі " + parentItem.title + ": "
        );
      } else {
        this.checkCreditMethod(
          this.data, 
          item, 
          this.data.credits, 
          "Перевищена загальна кількість кредитів: "
        );
      }
    },
    checkCreditMethod(data, item, limitCredit, message) {
      var cycles = data.cycles;
      var credints = [];
      (function flat(cycles) {
        cycles.forEach(function(el) {
          if (Array.isArray(el)) flat(el);
          else credints.push(el.credit);
        });
      })(cycles);
      let sumCredits = credints.reduce((prev, curr) => +prev + +curr, 0);
      if(limitCredit < sumCredits) {
        this.cycleIndexError = item.id;
        if(this.cycleIndex == null) {
          this.errorCycle(message + sumCredits + " із " + limitCredit);
        }
      } else {
        this.cycleIndexError = null;
        this.errorCycle(null);
      }
    },
    addSubject(item) {
      this.$emit('addSubject', item)
    },
    addCycle(item) {
      this.$emit('addCycle', item)
    },
    editCycle(item) {
      this.$emit('editCycle', item)
    },
    saveCycle(item) {
      this.$emit('saveCycle', item)
      this.cycleIndex = null
    },
    delCycle(item) {
      this.$emit('delCycle', item)
    },
    errorCycle(item) {
      this.$emit('errorCycle', item)
    },
  }
}
</script>
<style>
  .cycle-subject {
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
  .cycle-subject.error, .cycle-subject.error input, .cycle-subject.error i {
    color: #fff !important;
  }
  .cycle-subject input {
    width: 90%;
    text-align: center;
  }
  .cycle-subject.head {
    text-align: center;
    color: #9b9b9b;
  }
  .cycle-subject.cycle {
    background: #f8f8f8;
  }
</style>