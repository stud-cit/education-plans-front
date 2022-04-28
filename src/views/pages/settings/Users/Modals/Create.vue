<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="800px"
    >
      <v-card>
        <validation-observer
          ref="observer"
          v-slot="{ invalid }"
        >
          <form @submit.prevent="submit" @keyup.enter="submit">
            <v-card-title>
              <span class="text-h5">Створити користувача</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <validation-provider
                  v-slot="{ errors }"
                  name="ПІБ"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="user"
                    :items="users"
                    :error-messages="errors"
                    :item-text="(item) => `${item.full_name}${item.department_id}`"
                    item-disabled="disabled"
                    return-object
                    :loading="loader"
                    label="ПІБ"
                    :filter="filterObject"
                    @change="setFaculty"
                  >
                    <template v-slot:selection="data">
                      {{ data.item.full_name }}
                    </template>

                    <template v-slot:item="{parent, item}">
                      <v-list-item-content>
                        <v-list-item-title v-html="parent.genFilteredText(item.full_name)"></v-list-item-title>
                        <v-list-item-subtitle v-html="parent.genFilteredText(item.department)"></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Факультет"
                  rules="required"
                >
                  <v-text-field
                    :value="user.faculty"
                    :loading="facultyLoader"
                    :error-messages="errors"
                    label="Факультет"
                    disabled
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Кафедра"
                  rules="required"
                >
                  <v-text-field
                    :value="user.department"
                    :error-messages="errors"
                    label="Кафедра"
                    disabled
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Роль"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="user.role_id"
                    :items="roles"
                    :error-messages="errors"
                    item-text="label"
                    item-value="id"
                    label="Роль"
                  ></v-autocomplete>
                </validation-provider>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="secondary"
                @click="close"
              >
                Закрити
              </v-btn>
              <v-btn
                color="primary"
                @click="submit"
                :disabled="invalid"
              >
                Зберегти
              </v-btn>
            </v-card-actions>
          </form>
        </validation-observer>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import api from "@/api";
import {API} from "@/api/constants-api";

export default {
  name: 'CreateUserModal',
  data: () => ({
    loader: false,
    facultyLoader: false,
    user: {},
    users: [],
  }),
  props: {
    roles: {
      type: Array,
      default() {
        return [];
      }
    },
    dialog: {
      type: Boolean,
      default() {
        return false;
      }
    },
  },
  mounted() {
    this.apiWorkers();
  },
  methods: {
    apiWorkers() {
      this.loader = true;

      api.get(API.WORKERS).then((response) => {
        const {data} = response;
        this.users = data;
        this.loader = false;
      });
    },
    apiGetFacultyByWorker(worker) {
      this.facultyLoader = true;

      api.get(API.FACULTY_BY_WORKER, {department_id: worker.department_id}).then(({data}) => {
        this.user.faculty = data.name
        this.user.faculty_id = data.id
        this.facultyLoader = false;
      })
    },
    filterObject(item, queryText) {
      return (
        item.full_name.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
        -1 ||
        item.department.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
      );
    },
    setFaculty(worker) {
      if (worker !== null) {
        this.apiGetFacultyByWorker(worker);
      } else {
        this.clear();
      }
    },
    submit() {
      this.$refs.observer.validate().then((validated) => {
        if (validated) {
          this.$emit('submit', this.user);
          this.clear();
        }
      })
    },
    close() {
      this.$emit('close');
      this.clear();
    },
    clear() {
      this.$refs.observer.reset()
      this.user = {}
    }
  }
}
</script>
