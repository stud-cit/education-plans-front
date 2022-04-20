<template>
  <v-container>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <validation-provider
          v-slot="{ errors }"
          name="Ключ"
          rules="required|max:10"
        >
          <v-text-field
            v-model="key"
            :counter="255"
            :error-messages="errors"
            label="Ключ"
            required
          ></v-text-field>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="Заголовок"
          rules="required|max:255"
        >
          <v-text-field
            v-model="title"
            :counter="255"
            :error-messages="errors"
            label="Заголовок"
            required
          ></v-text-field>
        </validation-provider>

        <validation-provider
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
        </validation-provider>

        <v-btn class="mr-4" type="submit" :disabled="invalid"> Зберегти </v-btn>
        <v-btn @click="clear"> Очистити </v-btn>
      </form>
    </validation-observer>
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
  setInteractionMode,
} from "vee-validate";

setInteractionMode("eager");

extend("numeric", {
  ...numeric,
  message: "{_field_} needs to be {length} digits. ({_value_})",
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
  data () {
    return {
      key: '',
      title: '',
      value: null,
    }
  },
  created() {
    this.getSettings();
  },
  methods: {
    getSettings() {
      this.apiSettings().then((response) => {
        const { data } = response.data;
        this.key = data.key;
        this.title = data.title;
        this.value = data.value;
        // this.loader = false;
      });
    },
    apiSettings() {
      // this.loader = true;
      return api.get(`${API.SETTINGS}${this.$route.params.id}`);
    },
    submit() {
      this.$refs.observer.validate().then((response) => {
        if (response) {
          let options = { ...this.data };
          api.put(`${API.SETTINGS}/${this.$route.params.id}`, options).then((response) => {
            console.log(response);
          });
        }
      })
    },
    clear() {
      this.key = '';
      this.title = '';
      this.value = null;
      this.$refs.observer.reset();
    },
  },
};
</script>
