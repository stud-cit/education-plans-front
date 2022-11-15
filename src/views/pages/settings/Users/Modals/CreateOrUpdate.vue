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
              <span class="text-h5" v-if="item === null">Створити користувача</span>
              <span class="text-h5" v-else>Редагувати користувача</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <validation-provider
                  v-slot="{ errors }"
                  name="ПІБ"
                  rules="required"
                  vid="asu_id"
                >
                  <v-autocomplete
                    v-model="user"
                    :items="workers"
                    :error-messages="errors"
                    item-text="full_name"
                    item-disabled="disabled"
                    return-object
                    label="ПІБ"
                    :disabled="item !== null"
                  ></v-autocomplete>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Факультет"
                  vid="faculty_id"
                >
                  <v-autocomplete
                    v-model="user.faculty_id"
                    :items="faculties"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    label="Факультет"
                  ></v-autocomplete>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Кафедра"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="user.department_id"
                    :items="departments"
                    :error-messages="errors"
                    :loading="departmentsLoading"
                    :disabled="departmentsLoading"
                    item-text="name"
                    item-value="id"
                    label="Кафедра"
                  ></v-autocomplete>
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
  name: 'CreateOrUpdateUserModal',
  data: () => ({
    facultyLoader: false,
    user: {},
    faculty: null,
    department: null,
    departments: [],
    departmentsLoading: false,
  }),
  props: {
    workers: {
      type: Array,
      default() {
        return [];
      }
    },
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
    item: null,
    faculties: [],
  },
  watch: {
    'user.faculty_id'(v) {
      v ? this.apiGetDepartments(v) : (this.departments = []);
    },
    item(v) {
      if (v !== null) {
        this.user = v;
      }
    }
  },
  methods: {
    apiGetDepartments(id) {
      this.departmentsLoading = true;

      api.show(API.DEPARTMENTS, id).then(({data}) => {
        this.departments = data.data
        this.departmentsLoading = false;
      })
    },
    apiGetFacultyByWorker() {
      api.get(API.LIST_WORKERS).then(({data}) => {
        this.user = data.data
      })
    },
    submit() {
      this.$refs.observer.validate().then((validated) => {
        if (validated) {
          this.$emit(this.item === null ? 'store' : 'update', this.user);
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
    },
    setErrors(errors) {
      this.$refs.observer.setErrors(
        errors
      );
    }
  }
}
</script>
