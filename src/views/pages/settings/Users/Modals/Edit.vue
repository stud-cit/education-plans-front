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
              <span class="text-h5">Редагувати користувача</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-text-field
                  :value="user.full_name"
                  label="ПІБ"
                  disabled
                ></v-text-field>

                <validation-provider
                  v-slot="{ errors }"
                  name="Роль"
                  rules="required"
                >
                  <v-radio-group v-model="user.role_id">
                    <v-radio
                      v-for="item in roles"
                      :key="item.id"
                      :label="item.label"
                      :error-messages="errors"
                      :value="item.id"
                    ></v-radio>
                  </v-radio-group>
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
export default {
  name: 'EditUserModal',
  data: () => ({}),
  props: {
    roles: {
      type: Array,
      default() {
        return [];
      }
    },
    user: {
      type: Object,
      default() {
        return {};
      }
    },
    dialog: {
      type: Boolean,
      default() {
        return false;
      }
    },
  },
  methods: {
    submit() {
      this.$refs.observer.validate().then((validated) => {
        if (validated) {
          this.$emit('submit', this.user)
        }
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
