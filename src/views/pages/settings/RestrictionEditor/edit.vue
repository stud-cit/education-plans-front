<template>
  <v-container>
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">

        <ValidationProvider
          v-slot="{ errors }"
          name="Значення"
          rules="required|numeric|min:1|max:3"
        >
          <v-text-field
            v-model="value"
            :counter="3"
            :error-messages="errors"
            label="Значення"
            required
          ></v-text-field>
        </ValidationProvider>
        <br>
        <v-btn class="mr-4" type="submit" :disabled="invalid"> Зберегти </v-btn>
        <v-btn @click="clear"> Очистити </v-btn>
      </form>
    </ValidationObserver>
  </v-container>
</template>
<script>
import api from "@/api";
import { API } from "@/api/constants-api";
import { required, numeric, max } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
} from "vee-validate";

extend("numeric", {
  ...numeric,
  message: "Поле {_field_} повинно бути цифровим",
});

extend("required", {
  ...required,
  message: "Поле {_field_} не може бути пустим",
});

extend("max", {
  ...max,
  message: "Поле {_field_} не повинно мати більше {length} символів",
});

export default {
  name: "RestrictEdit",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      value: null,
    };
  },
  created() {
    this.getSettings();
  },
  methods: {
    getSettings() {
      this.apiSettings().then((response) => {
        const { data } = response.data;
        this.value = data.value;
      });
    },
    apiSettings() {
      return api.show(API.SETTINGS,this.$route.params.id);
    },
    submit() {
      this.$refs.observer.validate().then((response) => {
        if (response) {
          let options = {
            value: this.value,
          };
          api.put(`${API.SETTINGS}/${this.$route.params.id}`, options).then((response) => {
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
      });
    },
    clear() {
      this.value = null;
      this.$refs.observer.reset();
    },
  },
};
</script>
