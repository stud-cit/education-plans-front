<template>
  <div>
    <v-container>
      <validation-observer :ref="'observer' + index" v-slot="{ invalid }" v-for="(item, index) in signatures"
        :key="'signature_' + index" >
        <form @submit.prevent="save(item)">

      <v-row>
        <v-col cols="12" md="2">
          <validation-provider
            v-slot="{ errors }"
            name="Посада"
            rules="required"
          >
            <v-autocomplete
              v-model="item.position_id"
              :items="positions"
              :error-messages="errors"
              label="Посада"
              data-vv-name="Посада"
              item-text="position"
              item-value="id"
              required
            ></v-autocomplete>
          </validation-provider>
        </v-col>

        <v-col cols="12" md="5">
          <validation-provider
            v-slot="{ errors }"
            name="Посада"
            rules="required"
          >
            <v-text-field
              v-model="item.manual_position"
              :items="positions"
              :error-messages="errors"
              label="Посада"
              data-vv-name="Посада"
              item-text="manual_position"
              item-value="manual_position"
              required
            ></v-text-field>
          </validation-provider>
        </v-col>

        <v-col cols="12" md="3">
          <validation-provider
            v-slot="{ errors }"
            name="Посадова особа"
            rules="required"
          >
            <v-autocomplete
              v-model="item.asu_id"
              :items="workers"
              :error-messages="errors"
              label="Посадова особа"
              data-vv-name="Посадова особа"
              item-text="full_name"
              item-value="asu_id"
              :loading="workerLoader"
              required
            ></v-autocomplete>
          </validation-provider>
        </v-col>

        <v-col cols="12" md="2">
          <div class="text-center pt-3">
            <v-tooltip bottom v-if="item.id">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mr-3"
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  fab
                  small
                  color="blue"
                  @click="edit(index, item)"
                >
                  <v-icon aria-hidden="false">
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
              <span>Редагувати</span>
            </v-tooltip>

            <v-tooltip bottom v-if="item.id === null">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mr-3"
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  fab
                  small
                  color="blue"
                  :disabled="invalid"
                  type="submit"
                >
                  <v-icon aria-hidden="false">
                    mdi-content-save
                  </v-icon>
                </v-btn>
              </template>
              <span>Зберегти</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  fab
                  small
                  color="red"
                  @click="remove(index, item)"
                >
                  <v-icon aria-hidden="false">
                    mdi-trash-can-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>Видалити</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
      </form>
    </validation-observer>
    </v-container>


<div class="text-center mt-4">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            large
            v-bind="attrs"
            v-on="on"
            @click="addItem()"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Додати позицію</span>
      </v-tooltip>
    </div>

  </div>
</template>
<script>
import api from "@/api";
import { API } from "@/api/constants-api";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Signatures",
  data() {
    return {
      // signatures: [],
      positions: [],
      positionLoader: true,
      workers: [],
      workerLoader: true,
    }
  },
  computed: {
     ...mapGetters({
      plan_id: 'plans/id',
      signatures: 'plans/signatures'
    })
  },
  mounted() {
    //this.getSignatures();
    this.getPositions();
    this.apiWorkers();
  },
  methods: {
    ...mapActions({
      addItem: 'plans/addSignature',
    }),
    getPositions() {
      this.apiPositions().then( (response)  => {
        const { data } = response;
        this.positions = data.data;
         this.positionLoader = false;
      });
    },
    apiPositions() {
      return api.get(API.POSITIONS);
    },
    apiWorkers() {
      api.get(API.WORKERS).then((response) => {
        const {data} = response;
        this.workers = data;
        this.workerLoader = false;
      });
    },
    save(item) {
      this.$refs['observer' + item.index][0].validate().then((response) => {
        if (response) {
          this.$store.dispatch('plans/saveSignature', item).then( () => {
            this.$swal.fire({
              position: "center",
              icon: "success",
              title: 'Дані збережено',
              showConfirmButton: false,
              timer: 1500,
            });
          });
         }
       });
    },
    remove(index, item) {
      this.$swal.fire({
        title: `Ви хочете видалити елемент?`,
        showDenyButton: true,
        confirmButtonText: 'Так',
        denyButtonText: `Ні`,
      }).then((result) => {
        if (result.isConfirmed) {
          const { id } = item;
          if (id) {
            // api.destroy(API.SIGNATURES,id).then( (response) => {
            this.$store.dispatch('plans/removeSignature', { ...item, index}).then( (response) => {
              const { message } = response.data;
              this.$swal.fire({
                position: "center",
                icon: "success",
                title: message,
                showConfirmButton: false,
                timer: 1500,
              });
            });
          } else {
            this.signatures.splice(index, 1);
          }

        }

      })

    },
    // getSignatures() {
    //   if (this.plan.signatures) {
    //     this.signatures = this.plan.signatures;
    //   }
    // }
  }
}
</script>
<style lang="css" scoped>
</style>
