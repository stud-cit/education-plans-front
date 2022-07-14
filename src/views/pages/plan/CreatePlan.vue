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

        <v-card-text class="pb-0 body-1" v-html="modalVerification.comment"></v-card-text>

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

    <v-dialog
      v-if="plan"
      v-model="programsDialog"
      persistent
      max-width="500px"
    >
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
      >
        <form @submit.prevent="verificationOP" @keyup.enter="verificationOP">
          <v-card class="pb-0">
            <v-card-text class="pb-0">
              <v-container>
                <validation-provider
                  v-slot="{ errors }"
                  name="освітня програма"
                  rules="required"
                >
                  <v-autocomplete
                    :items="programs"
                    :loading="programsLoading"
                    v-model="plan.program_op_id"
                    :error-messages="errors"
                    item-text="education_program_name"
                    item-value="program_id"
                    label="Освітня програма"
                    required
                  ></v-autocomplete>
                </validation-provider>
              </v-container>
            </v-card-text>
            <v-card-actions class="pt-0">
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="programsDialog = false"
              >
                Закрити
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="verificationOP()"
                :loading="verificationOPLoading"
                :disabled="invalid"
              >
                Готово
              </v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </validation-observer>
    </v-dialog>

    <div class="text-right" v-if="$route.name === 'EditPlan' && plan">
      <v-btn
        small
        depressed
        color="primary"
        @click="$router.push({name: 'PreviewPlan', params: { id: plan.id, title: plan.title }})"
      >
        Переглянути
      </v-btn>
      <v-btn
        small
        depressed
        color="primary"
        class="ml-2"
        @click="openProgramDialog()"
      >
        Верифікувати з освітньою програмою
      </v-btn>
      <v-btn
        small
        depressed
        color="primary"
        class="ml-2"
        v-show="[2, 3, 4, 5].indexOf(authUser.role_id) != -1"
        @click="verification({verification_statuses_id: authUser.role_id, status: true})"
      >
        Верифікувати
      </v-btn>
      <v-btn
        small
        depressed
        color="error"
        class="ml-2"
        v-show="[2, 3, 4, 5].indexOf(authUser.role_id) != -1"
        @click="verification({verification_statuses_id: authUser.role_id, status: false})"
      >
        Відхилити верифікацію
      </v-btn>
    </div>

    <v-stepper elevation="1" class="my-2" v-if="$route.name === 'EditPlan' && plan">
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
      <v-tab :disabled="$route.name == 'CreatePlan'">Підписи</v-tab>
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
      <v-tab-item>
        <Signatures
          :data="plan"
        ></Signatures>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import General from "@/views/pages/plan/tabs/General";
import { mapGetters } from 'vuex';
import Title from "@/views/pages/plan/tabs/Title";
import Cycles from "@/views/pages/plan/tabs/Cycles";
import Signatures from "@/views/pages/plan/tabs/Signatures";
import api from "@/api";
import {API} from "@/api/constants-api";

export default {
  name: "CreatePlan",
  components: {
    General,
    Title,
    Cycles,
    Signatures,
  },
  data() {
    return {
      tab: 0,
      verifications: [],
      programsLoading: false,
      programsDialog: false,
      verificationOPLoading: false,
      programs: [],
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
    authUser() {
      return JSON.parse(localStorage.getItem("user"));
    },
    ...mapGetters({
      plan: "plans/plan"
    })
  },
  mounted() {
    this.start();
  },

  methods: {
    verificationOP() {
      this.verificationOPLoading = true;
      api.patch(API.PLAN_VERIFICATION_OP, this.$route.params.id, {
        user_id: this.authUser.id,
        status: false,
        program_op_id: this.plan.program_op_id
      }).then(() => {
        this.verificationOPLoading = false;
        this.programsDialog = false;
        this.apiGetPlanId();
      }).catch(() => {
        this.verificationOPLoading = false;
      });
    },

    verification(status) {
      status.user_id = this.authUser.id;
      if(!status.status) {
        this.$swal.fire({
          title: 'Введіть причину відхилення верифікації',
          input: 'textarea',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Надіслати',
          cancelButtonText: 'Відміна'
        }).then((result) => {
          if (result.isConfirmed) {
            status.comment = result.value;
            this.sendVerification(status);
          }
        });
      } else {
        this.sendVerification(status);
      }
    },

    sendVerification(status) {
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

    openProgramDialog() {
      this.apiGetPrograms();
      this.programsDialog = true;
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
    },

    apiGetPrograms() {
      this.programsLoading = true;
      api.get(API.PROGRAMS, {
        year: this.plan.year,
        degree: this.plan.education_level.title
      }).then(({data}) => {
        this.programs = data;
        this.programsLoading = false;
      })
    },

    start() {
      if(this.$route.name === 'EditPlan') {
        this.apiGetPlanId();
        this.apiGetOptions();
        this.apiGetVerifications();
      } else {
        this.$store.dispatch('plans/clear');
      }
    }
  },

  watch: {
    $route() {
      this.start();
    }
  },
}

</script>
