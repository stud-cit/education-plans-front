<template>
  <v-container>
    <v-tabs v-model="tab" class="mb-2">
      <v-tab>Загальна інформація</v-tab>
      <v-tab :disabled="$route.name == 'CreatePlan'">Цикли / предмети</v-tab>
      <v-tab :disabled="$route.name == 'CreatePlan'">Графіки</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <General
          @submit="submit"
          :plan="plan"
          :edit="$route.name === 'EditPlan'"
        />
      </v-tab-item>
      <v-tab-item>
        <Cycles
          v-if="$route.name == 'EditPlan'"
          @apiGetPlanId="apiGetPlanId"
          :plan="plan"
        />
      </v-tab-item>
      <v-tab-item>
        <Title
          v-if="$route.name == 'EditPlan'"
          :data="plan"
        ></Title>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import General from "@/views/pages/plan/tabs/General";
import { mapGetters } from 'vuex';
import Title from "@/views/pages/plan/tabs/Title";
import Cycles from "@/views/pages/plan/tabs/Cycles";

export default {
  name: "CreatePlan",
  components: {
    General,
    Title,
    Cycles
  },
  data() {
    return {
      tab: 0
    }
  },
  computed: {
    ...mapGetters({
      plan: "plans/plan"
    })
  },
  mounted() {
    if(this.$route.name === 'EditPlan') {
      this.apiGetPlanId();
      this.apiGetOptions();
    } else {
      this.$store.dispatch('plans/clear');
    }
  },

  methods: {
    submit(data) {
      this.$store.dispatch('plans/store', data).then( (response) => {
        const { message } = response.data;
        this.$swal.fire({
          position: "center",
          icon: "success",
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });
        this.$router.push({name: 'EditPlan', params: {id: response.data.id, title: data.title }});
        this.apiGetPlanId();
      }).catch((errors) => {
        console.log(errors.response.data)
      });
    },

    apiGetPlanId() {
      this.$store.dispatch('plans/show', this.$route.params.id);
    },

    apiGetOptions() {
      this.$store.dispatch('plans/getOptions');
    }
  }
}

</script>
