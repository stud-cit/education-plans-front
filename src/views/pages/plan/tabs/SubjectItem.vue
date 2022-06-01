<template>
  <div>
    <v-row :class="['cycle-subject', subjectIndexError == subject.id ? 'error' : '', 'ma-0', 'mb-1']">
      <v-col cols="7" class="pa-0 text-left">
        {{subject.selective_discipline_id ?  subject.selective_discipline.title : subject.title}}
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
        <v-btn small icon @click="editSubject(subject, item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn small icon @click="delSubject(subject)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row> 
  </div>
</template>
<script>
import {eventBus} from '@/main'
export default {
  name: "SubjectItem",
  props: {
    subject: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      subjectIndexError: null
    }
  },
  mounted() {
    this.checkCredit();
  },
  methods: {
    checkCredit() {
      let sumCredits = this.item.subjects.map(subjectItem => subjectItem.credits).reduce((prev, curr) => prev + curr, 0);
      if(sumCredits > this.item.credit) {
        this.subjectIndexError = this.subject.id;
        this.$store.dispatch('plans/setErrorsPlan', "Перевищено суму кредитів дисциплін в циклі " + this.item.title + ": " + sumCredits + " із " + this.item.credit);
      } else {
        this.subjectIndexError = null;
        this.$store.dispatch('plans/setErrorsPlan', null);
      }
    },
    editSubject(subject, cycle) {
      eventBus.$emit('editSubject', {subject, cycle})
    },
    delSubject(subject) {
      eventBus.$emit('delSubject', subject)
    },
  }
}
</script>