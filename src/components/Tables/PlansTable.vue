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
        <template v-slot:item.index="{ index }">
            {{ (options.page - 1) * options.itemsPerPage + (index + 1)}}
        </template>
    </v-data-table>
</template>

<script>
    export default {
        name: "PlansTable",
        data () {
            return {
                options: {},
                headers: [
                    { text: '№', value: 'index', sortable: false},
                    { text: 'Назва', value: 'title'},
                    { text: 'Факультет', value: 'faculty'},
                    { text: 'Кафедра', value: 'department'},
                    { text: 'Рік', value: 'year'},
                    { text: 'Дата створення', value: 'created_at'},
                    { text: 'Дії', value: 'action', sortable: false},
                ],
            }
        },
        props: {
            items: {
              type: Array,
              default:() => []
            },
            total: {
                type: Number,
                default:() => 0
            },
            loading: {
                type: Boolean,
                default:() => true
            }
        },
        watch: {
            options: {
                handler () {
                    this.update();
                },
                deep: true,
            },
        },
        methods: {
            update() {
                this.$emit('update', this.options)
            }
        },
    }
</script>