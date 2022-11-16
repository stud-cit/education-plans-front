<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay persistent transition="dialog-bottom-transition">
    <v-card v-if="item">
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{ item !== null ? item.title : '' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <!-- cancel verification -->
      <v-dialog v-model="dialogModalVerification" max-width="500">
        <v-card >
          <v-toolbar dark color="primary">
            <v-toolbar-title v-if="modalVerification.status" class="text-h7"> Введіть причину відхилення верифікації </v-toolbar-title>
            <v-toolbar-title v-else class="text-h6"> Причина відхилення верифікації </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pt-5">
            <v-textarea
              name="input-6-4"
              :disabled="modalVerification.status === false"
              label="Коментар"
              v-model="modalVerification.comment"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="gray" @click="dialogModalVerification = false"> Закрити </v-btn>
            <v-btn
              v-if="modalVerification.status !== null"
              color="primary"
              dark
              @click="authUser.role_id === ROLES.ID.admin ? verification(modalVerification) : ''"
            >
              Надіслати
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- end cancel verification -->

      <!-- stepper -->
      <v-container>
        <v-stepper elevation="1" class="my-2" v-if="checkVerification">
          <v-stepper-header>
            <template v-for="(item, index) in checkVerification">
              <!--
                  authUser.role_id === ROLES.ID.admin
                    ? verification({ verification_status_id: item.id, status: item.status ? false : true })
                    : '' -->
              <v-stepper-step
                @click="authUser.role_id === ROLES.ID.admin ? openDialog(item) : ''"
                :key="`${index}-step`"
                :step="index + 1"
                :complete="item.status"
                :rules="[() => item.status == null || item.status]"
                :editable="authUser.role_id === ROLES.ID.admin"
              >
                <span>{{ item.titleHead }}</span>

                <v-btn icon small v-if="item.comment" @click="openDialog(item)" color="error">
                  <v-icon small>mdi-bell-ring</v-icon>
                </v-btn>

                <small>{{ item.title }}</small>
              </v-stepper-step>
              <v-divider v-if="index != verifications.length - 1" :key="index"></v-divider>
            </template>
          </v-stepper-header>
        </v-stepper>
      </v-container>
      <!-- end stepper -->
      <p class="pt-7 px-3 text-center">СУМСЬКИЙ ДЕРЖАВНИЙ УНІВЕРСИТЕТ</p>
      <p class="px-3 text-center">{{ item.faculty }}</p>
      <p class="px-3 text-center">
        ДИСЦИПЛІНА ЦИКЛУ ЗАГАЛЬНОЇ ПІДГОТОВКИ на {{ item.year }} – {{ item.year + 1 }}н. р.
      </p>
      <table class="table">
        <thead>
          <tr>
            <th class="text-center" rowspan="2">Назва дисципліни</th>
            <th class="text-center" rowspan="2">Мова викладання</th>
            <th class="text-center" rowspan="2">
              Рівень освіти, для якого пропонується дисципліна (перший/другий/третій)
            </th>
            <th class="text-center" rowspan="2">
              Перелік галузей знань / спеціальностей, для яких пропонується дисципліна
            </th>
            <th class="text-center" rowspan="2">Кафедра, що пропонує дисципліну</th>
            <th class="text-center" colspan="2">
              Посада, прізвище та ініціали викладача (ів), який (і) пропонується для викладання
            </th>
            <th class="text-center" rowspan="2">
              Загальна компетентність, на формування або розвиток якої спрямована дисципліна
            </th>
            <th class="text-center" rowspan="2">Результати навчання за навчальною дисципліною</th>
            <th class="text-center" rowspan="2">Види навчальних занять та методи викладання, що пропонуються</th>
            <th class="text-center" rowspan="2">Кількість здобувачів, які можуть записатися на дисципліну</th>
            <th class="text-center" rowspan="2">
              Вхідні вимоги до здобувачів, які хочуть обрати дисципліну / вимоги до матеріально-технічного забезпечення
            </th>
            <th class="text-center" rowspan="2">Обмеження щодо семестру вивчення</th>
          </tr>
          <tr>
            <th class="text-center">Лекції</th>
            <th class="text-center">Семінарські та практичні заняття, лабораторні роботи</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="subject">
            <td>{{ subject.subject_name }}</td>
            <td>{{ subject.language }}</td>
            <td>{{ subject.education_level }}</td>
            <td>{{ subject.list_fields_knowledge }}</td>
            <td>{{ subject.department }}</td>
            <td>{{ subject.lecturers }}</td>
            <td>{{ subject.practice }}</td>
            <td>{{ subject.general_competence }}</td>
            <td>{{ subject.learning_outcomes }}</td>
            <td>{{ subject.types_educational_activities }}</td>
            <td class="text-center">{{ subject.number_acquirers }}</td>
            <td>{{ subject.entry_requirements_applicants }}</td>
            <td>{{ subject.limitation }}</td>
          </tr>
          <tr v-else>
            <td colspan="13" class="text-center">Данні відсутні</td>
          </tr>
        </tbody>
      </table>
      <v-btn class="btn-center" color="primary" dark fixed bottom @click="close">Закрити</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/api';
import { API } from '@/api/constants-api';
import { ROLES } from '@/utils/constants';

export default {
  name: 'PreviewSelectiveDisciplinesCatalogModal',
  data() {
    return {
      ROLES,
      subject: null,
      verifications: [],
      modalVerification: {
        open: false,
        id: null,
        status: null,
        comment: '',
      },
      dialogModalVerification: false,
    };
  },
  props: {
    dialog: {
      type: Boolean,
      default() {
        return false;
      },
    },
    item: null,
  },
  watch: {
    item(v) {
      if (v !== null && this.dialog === true) {
        this.apiGetItem(v.id);
      }
    },
  },
  computed: {
    checkVerification() {
      return this.verifications.map((element, i) => {
        let isStatus = this.subject.verifications.find((i) => element.id == i.verification_status_id);

        if (this.subject.verifications[i]?.id !== undefined) {
          element.id = this.subject.verifications[i].id;
        }

        element.titleHead = 'Не перевірено';
        if (isStatus) {
          element.status = !!isStatus.status;
          element.verification_status_id = this.subject.verifications[i].verification_status_id;
          element.titleHead = isStatus.status ? 'Верифіковано' : 'Не верифіковано';
          element.comment = isStatus.comment;
        }

        return element;
      });
    },
    authUser() {
      return JSON.parse(localStorage.getItem('user'));
    },
  },
  methods: {
    openDialog(item) {
      if (item.status === null) {
        const data = {
          subject_id: this.subject.id,
          verification_status_id: item.id,
          status: true,
          user_id: this.authUser.id,
        };
        this.sendVerification(data);
      } else {
        this.modalVerification = item;
        this.dialogModalVerification = true;
      }
    },

    verification(status) {
      const data = {
        id: status.id,
        subject_id: this.subject.id,
        verification_status_id: status.verification_status_id,
        status: status.status ? false : true,
        user_id: this.authUser.id,
        comment: status.comment,
      };
      this.sendVerification(data);
      this.dialogModalVerification = false;
      data.comment = null;
    },
    sendVerification(status) {
      api
        .patch(API.CATALOG_SELECTIVE_SUBJECTS + '/verification', this.subject.id, status)
        .then(() => {
          this.apiGetItem(this.subject.id);
        })
        .catch((errors) => {
          console.error(errors.response.data);
        });
    },
    apiGetVerifications() {
      api.get(API.VERIFICATION_SUBJECT_STATUSES).then(({ data }) => {
        this.verifications = data.data;
      });
    },
    apiGetItem(id) {
      api
        .show(API.CATALOG_SELECTIVE_SUBJECTS, id, { showLoader: true })
        .then(({ data }) => {
          if (data.data) {
            this.subject = data.data;
          }
        })
        .then(() => this.apiGetVerifications());
    },
    close() {
      this.$emit('close');
    },
    closeModelVerification() {
      this.dialogModalVerification = false;
    },
  },
};
</script>

<style scoped>
.table {
  margin: 40px 20px 60px;
  font-size: 15px;
}
.table th,
.table td {
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.table thead {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.btn-center {
  left: 50%;
  transform: translateX(-50%);
}
</style>
