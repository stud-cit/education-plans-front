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
    import api from '@/api';
    import {API} from '@/api/constants-api'
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

            apiCopyPlan(id) {
                return api.post(API.COPY_PLAN, id);
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
