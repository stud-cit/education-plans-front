<template>
  <div class="d-flex justify-space-between flex-wrap">
    <template v-for="(item, index) in items">
      <template v-if="item.show">
        <v-btn
          v-if="item.id"
          :key="item.year"
          :class="['flex-grow-1 mb-2', index > 0 ? 'ml-2' : '' ]"
          color="success"
          small
          depressed
          :to="{ name: 'EditPlan', params: { id: item.id, title: item.title } }"
          target="_blank"
        >
          {{ item.label}}
        </v-btn>
        <v-btn
          v-else
          :class="['flex-grow-1 mb-2', index > 0 ? 'ml-2' : '' ]"
          :key="item.year"
          small
          depressed
          color="primary"
          @click="generateShortedByYear(item)"
        >
          {{ item.label}}
        </v-btn>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "ShortedByYearBtns",
  props: {
    items: {
      type: Array,
      required: true
    },
    planId: {
      required: true
    }
  },
  methods: {
    generateShortedByYear({year, label}) {
      this.$swal.fire({
        title: label + ' ?',
        showDenyButton: true,
        confirmButtonText: 'Так',
        denyButtonText: `Ні`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.dispatch('plans/generateShortedByYear', {year, id: this.planId})
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
