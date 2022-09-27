<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:top>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="searchTitle"
              append-icon="mdi-magnify"
              label="Пошук за назвою"
              single-line
              hide-details
              class="mx-4"
            ></v-text-field>
          </v-col>
          <v-col align-self="center">
            <v-btn color="primary" outlined class="ml-2" @click="search"> Пошук </v-btn>
            <v-btn
              color="primary"
              class="ml-2"
              outlined
              :input-value="filterToggle"
              @click="filterToggle = !filterToggle"
            >
              <v-icon> mdi-filter </v-icon>
            </v-btn>
            <v-btn color="primary" class="ml-2" outlined @click="clear"> Очистити </v-btn>
          </v-col>
        </v-row>

        <v-row class="px-4 pb-4">
          <v-col cols="12">
            <v-autocomplete
              v-model="type"
              :items="types"
              item-text="name"
              item-value="id"
              label="Тип"
              hide-details
              clearable
            ></v-autocomplete>
          </v-col>
        </v-row>
      </template>

      <template v-slot:item.index="{ index }">
        {{ ++index }}
      </template>

    </v-data-table>

    <v-tooltip left color="info">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn color="primary" dark fixed bottom right fab v-bind="attrs" v-on="on" @click="create">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>Додати підсказку</span>
    </v-tooltip>

  </v-container>
</template>

<script>
export default {
  name: "CatalogHelpers",
  data() {
    return {
      searchTitle: '',
      types: [],
      type: '',
      headers: [
        { text: '№', value: 'index', sortable: false, width: '20px' },
        { text: 'Назва', value: 'title', sortable: false},
        { text: 'Тип', value: 'type', sortable: false},
      ],
      items: [],
    }
  },
  methods: {
    create() {
      console.log('create')
    },
    clear() {
      console.log('clear')
    },
    search() {
      console.log('search')
    }
  }
}
</script>

<style scoped>

</style>
