<template>
    <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="total"
        :loading="loading"
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
                        @click="update"
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
            {{ (options.page - 1) * options.itemsPerPage + (index + 1)}}
        </template>

        <template v-slot:item.actions="{ item }">
            <v-icon
                small
                class="mr-2"
                color="primary"
                @click="copy(item.id)"
            >
                mdi-content-copy
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
                options: {},
                headers: [
                    {text: '№', value: 'index', sortable: false},
                    {text: 'Назва', value: 'title'},
                    {text: 'Факультет', value: 'faculty'},
                    {text: 'Кафедра', value: 'department'},
                    {text: 'Рік', value: 'year'},
                    {text: 'Дата створення', value: 'created_at'},
                    {text: 'Дії', value: 'actions', sortable: false},
                ],
            }
        },
        props: {
            items: {
                type: Array,
                default: () => []
            },
            total: {
                type: Number,
                default: () => 0
            },
            loading: {
                type: Boolean,
                default: () => true
            }
        },
        watch: {
            options: {
                handler() {
                    this.update();
                },
                deep: true,
            },
        },
        methods: {
            update() {
                const params = {
                    searchTitle: this.searchTitle,
                    page: 1
                };

                this.$emit('update', {...this.options, ...params})
            },
            copy(id) {
                console.log(id);
            }
        },
    }
</script>
