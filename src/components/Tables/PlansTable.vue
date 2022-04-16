<template>
    <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :server-items-length="meta.total"
        :options.sync="options"
        :footer-props="{ 'items-per-page-options' : [15,25,50] }"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-row>
                <v-col cols="12" md="6">
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
                    <v-btn
                        color="primary"
                        outlined
                        class="ml-2"
                        @click="search"
                    >
                        Пошук
                    </v-btn>
                    <v-btn
                        color="primary"
                        class="ml-2"
                        outlined
                        :input-value="filterToggle"
                        @click="filterToggle = !filterToggle"
                    >
                        <v-icon>
                            mdi-filter
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <div v-show="filterToggle">

            </div>

        </template>

        <template v-slot:item.index="{ index }">
            {{ (meta.current_page - 1) * meta.per_page + (index + 1)}}
        </template>

        <template v-slot:item.actions="{ item }">

          <v-icon
                small
                class="mr-1"
                color="primary"
                @click="$emit('copy', item.id)"
            >
                mdi-content-copy
            </v-icon>
            <v-icon
                small
                class="mr-1"
                color="primary"
                @click="$emit('edit', item.id)"
            >
              mdi-pencil-outline
            </v-icon>
            <v-icon
                small
                color="red"
                @click="$emit('delete', item.id)"
            >
              mdi-trash-can-outline
            </v-icon>
        </template>


    </v-data-table>
</template>

<script>
    export default {
        name: "PlansTable",
        data() {
            return {
                filterToggle: false,
                searchTitle: '',
                headers: [
                    {text: '№', value: 'index', sortable: false},
                    {text: 'Назва', value: 'title'},
                    {text: 'Факультет', value: 'faculty', sortable: false},
                    {text: 'Кафедра', value: 'department', sortable: false},
                    {text: 'Рік', value: 'year', width: '80px'},
                    {text: 'Дата створення', value: 'created_at', width: '150px'},
                    {text: 'Дії', value: 'actions', width: '100px', sortable: false},
                ],
            }
        },
        props: {
            items: {
                type: Array,
                default: () => []
            },
            meta: {
                type: Object,
                default: () => {}
            },
        },
        computed: {
            loading() {
                return this.$store.state.plans.loading
            },
            options: {
                get: function () {
                    return this.$store.state.plans.options
                },
                // сеттер:
                set: function (newValue) {
                    this.$store.dispatch('plans/setOptions', newValue)
                    this.update()
                }
            }
        },
        methods: {
            update() {
                this.$emit('update', this.options)
            },
            search() {
                this.options.searchTitle = this.searchTitle;
                this.resetPage();
            },
            resetPage() {
                if (this.options.page == 1) {
                   this.update();

                } else {
                    this.options.page = 1;
                }
            }
        },
    }
</script>
