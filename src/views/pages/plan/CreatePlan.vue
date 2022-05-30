<template>
  <v-container>

    <v-dialog
      v-model="modalVerification.open"
      max-width="370"
    >
      <v-card>
        <v-card-title class="text-h6">
          Причина відхилення верифікації
        </v-card-title>

        <v-card-text class="pb-0 body-1">
          {{ modalVerification.comment }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="modalVerification.open = false"
          >
            Закрити
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="text-right" v-if="plan.verification && $route.name === 'EditPlan'">
      <v-btn
        small
        depressed
        color="primary"
        @click="verification({verification_statuses_id: 1, status: true})"
      >
        Верифікувати з освітньою програмою
      </v-btn>
      <v-btn
        small
        depressed
        color="primary"
        class="ml-2"
        :disabled="plan.verification.length == 0"
      >
        Верифікувати
      </v-btn>
      <v-btn
        small
        depressed
        color="error"
        class="ml-2"
        :disabled="plan.verification.length == 0"
      >
        Відхилити верифікацію
      </v-btn>
    </div>

    <v-stepper elevation="1" class="my-2" v-if="$route.name === 'EditPlan' && plan.verification && plan.verification.length > 0">
      <v-stepper-header>
        <template v-for="(item, index) in checkVerification">
          <v-stepper-step
            :key="`${index}-step`"
            :step="index + 1"
            :complete="item.status"
            :rules="[() => item.status == null || item.status]"
          >
            {{item.titleHead}}
            <v-btn
              icon
              small
              v-if="item.comment"
              @click="openDialog(item.comment)"
              color="error"
            >
              <v-icon small>mdi-bell-ring</v-icon>
            </v-btn>
            <small>{{item.title}}</small>
          </v-stepper-step>
          <v-divider v-if="index != verifications.length - 1" :key="index"></v-divider>
        </template>
      </v-stepper-header>
    </v-stepper>

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
          @submit="submit"
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
import api from "@/api";
import {API} from "@/api/constants-api";

export default {
  name: "CreatePlan",
  components: {
    General,
    Title,
    Cycles
  },
  data() {
    return {
      tab: 0,
      verifications: [],
      modalVerification: {
        open: false,
        comment: ""
      }
    }
  },
  computed: {
    checkVerification() {
      return this.verifications.map(element => {
        let isStatus = this.plan.verification.find((i) => element.id == i.verification_statuses_id);
        element.titleHead = 'Не перевірено';
        if(isStatus) {
          element.status = !!isStatus.status;
          element.titleHead = isStatus.status ? 'Верифіковано' : 'Не верифіковано';
          element.comment = isStatus.comment;
        }
        return element;
      });
    },
    ...mapGetters({
      plan: "plans/plan"
    })
  },
  mounted() {
    if(this.$route.name === 'EditPlan') {
      this.apiGetPlanId();
      this.apiGetOptions();
      this.apiGetVerifications();
    } else {
      this.$store.dispatch('plans/clear');
    }
  },

  methods: {
    verification(status) {
      api.patch(API.PLAN_VERIFICATION, this.$route.params.id, status).then(() => {
        this.apiGetPlanId();
      }).catch((errors) => {
        console.log(errors.response.data)
      });
    },

    openDialog(comment) {
      this.modalVerification.open = true;
      this.modalVerification.comment = comment;
    },

    submit(data) {
      let path = 'plans/store';

      if (this.$route.name === 'EditPlan') {
        data.id = this.$route.params.id;
        path = 'plans/update'
      }

      this.$store.dispatch(path, data).then( (response) => {
        const { message } = response.data;
        this.$swal.fire({
          position: "center",
          icon: "success",
          title: message,
          showConfirmButton: false,
          timer: 1500,
        });
        if (this.$route.name === 'CreatePlan') {
          this.$router.push({name: 'EditPlan', params: {id: response.data.id, title: data.title }});
        }
        this.apiGetPlanId();
        this.apiGetOptions();
        this.apiGetVerifications();
      }).catch((errors) => {
        console.log(errors.response.data)
      });
    },

    apiGetPlanId() {
      this.$store.dispatch('plans/show', this.$route.params.id);
    },

    apiGetOptions() {
      this.$store.dispatch('plans/getOptions');
    },

    apiGetVerifications() {
      api.get(API.VERIFICATIONS).then(({data}) => {
        this.verifications = data.map(item => {
          item.status = null;
          return item;
        })
      })
    }
  }
}

</script>
