<template>
  <div>
    <validation-observer
      ref="observer"
      v-slot="{ invalid }"
    >
    <v-form @submit.prevent="save" @keyup.enter="save">
    <v-container>
      <v-row v-for="(item, index) in signatures" :key="index">
        <v-col
          cols="12"
          md="7"
        >
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

        <v-col cols="12" md="4">
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

        <v-col cols="12" md="1">
          <div class="text-center pt-3">
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

    <v-btn
      class="mt-4"
      color="primary"
      :disabled="invalid"
      type="submit"
    >
      Зберегти
    </v-btn>
  </v-form>
  </validation-observer>

  </div>
</template>
<script>
import api from "@/api";
import { API } from "@/api/constants-api";
import { mapGetters } from "vuex";

export default {
  name: "Signatures",
  props: {
    data: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      signatures: [],
      positions: [],
      positionLoader: true,
      workers: [],
      workerLoader: true,
    }
  },
  computed: {
     ...mapGetters({
      plan: "plans/plan",
    })
  },
  mounted() {
    this.getSignatures();
    this.getPositions();
    this.apiWorkers();
  },
  methods: {
    getPositions() {
      this.apiPositions().then( (response)  => {
        const { data } = response;
        this.positions = data.data;
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
    addItem() {
      const plan_id = this.data.id;
      const item = { id: null, plan_id, position_id: null, asu_id: null };
      this.signatures.push(item);
    },
    save() {
       this.$refs.observer.validate().then((response) => {
         if (response) {
          api.post(API.SIGNATURES, this.signatures).then( (response) => {
            console.log(response.data)
            const { message, data } = response.data;
            console.log(data);
            this.$swal.fire({
              position: "center",
              icon: "success",
              title: message,
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
            api.destroy(API.SIGNATURES,id).then( (response) => {
              const { message } = response.data;
              this.$swal.fire({
                position: "center",
                icon: "success",
                title: message,
                showConfirmButton: false,
                timer: 1500,
              });
            });
          }
        }
        this.signatures.splice(index, 1);
      })

    },
    getSignatures() {
      if (this.plan.signatures) {
        this.signatures = this.plan.signatures;
      }
    }
  }
}
</script>
<style lang="css" scoped>
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
</style>
