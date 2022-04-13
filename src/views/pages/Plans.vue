<template>
    <v-container>
        <plans-table :items="items" :meta="meta" @update="getPlansList" @copy="apiCopyPlan"/>
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
            return {
            }
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
            }
        }
    }
</script>
