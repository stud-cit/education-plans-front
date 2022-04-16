<template>
  <v-container>
    <plans-table :items="items"
                 :meta="meta"
                 @update="getPlansList"
                 @copy="apiCopyPlan"
                 @edit="apiEditPlan"
                 @delete="apiDeletePlan"
    />
  </v-container>
</template>
<script>
import PlansTable from "@c/Tables/PlansTable";

export default {
  name: 'Plans',
  components: {PlansTable},
  data() {
    return {}
  },
  computed: {
    items() {
      return this.$store.getters["plans/items"];
    },
    meta() {
      return this.$store.getters["plans/meta"];
    }
  },
  methods: {
    getPlansList(options) {
      this.$store.dispatch('plans/getListPlans', options)
    },

    apiCopyPlan(id, title = '') {
      this.$swal.fire({
        title: `Ви хочете скопіювати план ?`,
        text: `${title}`,
        showDenyButton: true,
        confirmButtonText: 'Так',
        denyButtonText: `Ні`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.dispatch('plans/copy', id)
        }
      })
    },

    apiEditPlan(id) {
      alert('apiEditPlan id = ' + id);
    },

    apiDeletePlan(id, title = '') {
      this.$swal.fire({
        title: `Ви хочете видалити план ?`,
        text: `${title}`,
        showDenyButton: true,
        confirmButtonText: 'Так',
        denyButtonText: `Ні`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.dispatch('plans/destroy', id)
        }
      })
    }
  }
}
</script>
