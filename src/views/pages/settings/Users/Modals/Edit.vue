<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <validation-observer
          ref="observer"
          v-slot="{ invalid }"
        >
          <form @submit.prevent="submit" @keyup.enter="submit">
            <v-card-title>
              <span class="text-h5">
                <template v-if="item.hasOwnProperty('id')">Редагувати користувача</template>
                <template v-else>Створити користувача</template>
              </span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    {{item}}
                    <validation-provider
                      v-slot="{ errors }"
                      name="ПІБ"
                      rules="required"
                    >
                      <v-text-field
                        v-model="item.full_name"
                        :error-messages="errors"
                        label="ПІБ"
                        required
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Факультет"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="item.faculty_id"
                        :items="faculties"
                        :error-messages="errors"
                        item-text="name"
                        item-value="id"
                        label="Факультет"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Кафедра"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="item.department_id"
                        :items="departments"
                        :error-messages="errors"
                        :loading="departmentsLoading"
                        item-text="name"
                        item-value="id"
                        label="Кафедра"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Роль"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="item.role_id"
                        :items="roles"
                        :error-messages="errors"
                        item-text="title"
                        item-value="id"
                        label="Роль"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="secondary"
                text
                @click="close"
              >
                Закрити
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="save"
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
  name: 'EditUserModal',
  data: () => ({
    faculties: [],
    departments: [],
    departmentsLoading: false,
    roles: [],
    // dialog: false,
  }),
  props: {
    dialog: {
      type: Boolean,
      default() {
        return false;
      }
    },
    item: {
      type: Object,
      default() {
        return {
          full_name: '',
          faculty_id: null,
          faculty: '',
          department_id: null,
          department: '',
          role: '',
        }
      }
    }
  },
  mounted() {
    this.apiGetFaculties();
    this.apiGetRoles();
  },
  watch: {
    "item.faculty_id"(v) {
      console.log(v)
      v !== null ? this.apiGetDepartments(v) : this.departments = [];
    },
  },
  methods: {
    apiGetFaculties() {
      api.get(API.FACULTIES).then(({data}) => {
        this.faculties = data.data
        console.log(data.data)
      })
    },
    apiGetDepartments(id) {
      this.departmentsLoading = true;

      api.show(API.DEPARTMENTS, id).then(({data}) => {
        this.departments = data.data
        console.log(data.data)
        this.departmentsLoading = false;
      })
    },

    apiGetRoles() {
      this.roles = [
        {id: 1, title: 'admin'},
        {id: 2, title: 'something'},
      ]
    },

    save() {
      this.$emit('submit', this.item)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
