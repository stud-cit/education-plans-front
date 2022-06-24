<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loader"
      loading-text="Завантаження... Будь ласка зачекайте"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:item.index="{ index }">
        {{ ++index }}
      </template>

    </v-data-table>

  </v-container>
</template>

<script>
import api from '@/api';
import { API } from '@/api/constants-api';

export default {
  name: 'ListCycles',
  components: { },
  data() {
    return {
      headers: [
        { text: '№', value: 'index', sortable: false, width: '20px' },
        { text: 'Назва', value: 'title', sortable: false},
      ],
      items: [],
      loader: true,
    }
  },
  mounted() {
    this.getListCycles();
  },
  methods: {
    getListCycles() {
      this.apiListCycles().then( (response)  => {
        const { data } = response;
        this.items = data.data;
        this.loader = false;
      });
    },
    apiListCycles() {
      return api.get(API.LIST_CYCLES);
    },
  }
}
</script>
