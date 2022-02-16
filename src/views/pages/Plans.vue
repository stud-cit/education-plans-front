<template>
  <v-container>
    <plans-table :items="plans.items" :total="plans.total" :loading="plans.loader"  @update="getPlansList" />
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
        total: 0,
        plans: {
          items: [],
          total: 0,
          loader: true,
        }
      }
    },
    methods: {
      getPlansList(options) {
        this.apiPlansList(options).then(response => {
        const {data} = response;
        this.plans.items =  data.data;
        this.plans.total = data.meta.total;
        this.plans.loader = false;
        })
      },
      apiPlansList (options) {
        this.plans.loader = true;

        const data = {
          itemsPerPage: options.itemsPerPage,
          page: options.page
        };

        return api.get(API.LIST_PLANS, data);
      },
    }
  }
</script>