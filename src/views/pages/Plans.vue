<template>
  <v-container>
    <plans-table :items="items"
                 :meta="meta"
                 @update="getPlansList"
                 @copy="apiCopyPlan"
                 @edit="apiEditPlan"
                 @preview="apiPreviewPlan"
                 @delete="apiDeletePlan"
    />
    <v-tooltip left color="info" 
    v-if="allowedRoles(
      [
        ROLES.ID.admin, 
        ROLES.ID.root, 
        ROLES.ID.training_department, 
        ROLES.ID.practice_department, 
        ROLES.ID.educational_department_deputy, 
        ROLES.ID.educational_department_chief
      ]
    )">
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
import RolesMixin from "@/mixins/RolesMixin";
import {ROLES} from "@/utils/constants";

export default {
  name: 'Plans',
  components: {PlansTable},
  data() {
    return {
      ROLES,
    }
  },

  mixins: [RolesMixin],
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

    apiEditPlan(id, title) {
      this.$store.dispatch('plans/clear');
      this.$router.push({name: 'EditPlan', params: { id, title }});
    },

    apiPreviewPlan(id, title) {
      this.$router.push({name: 'PreviewPlan', params: { id, title }});
    },

    apiDeletePlan(id, title = '') {
      this.$swal.fire({
        title: `Ви хочете видалити план ?`,
        text: `${title}`,
        showDenyButton: true,
        focusDeny: true,
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
