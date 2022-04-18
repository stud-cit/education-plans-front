<template>
  <v-container>
    <plans-table :items="items"
                 :meta="meta"
                 @update="getPlansList"
                 @copy="apiCopyPlan"
                 @edit="apiEditPlan"
                 @delete="apiDeletePlan"
    />
    <v-tooltip left color="info">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
              color="primary"
              dark
              fixed
              bottom
              right
              fab
              v-bind="attrs"
              v-on="on"
              :to="{name: 'CreatePlan'}"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>Створити план</span>
    </v-tooltip>
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
