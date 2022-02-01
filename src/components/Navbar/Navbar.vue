<template>
    <v-app-bar
            color="primary"
            dark
    >
        <v-toolbar-title>My files</v-toolbar-title>

        <v-spacer></v-spacer>

        <template v-for="item in menu" >
            <v-btn :to="{name: item.route}" text :key="item.route" exact>
                {{item.title}}
            </v-btn>
        </template>

        <v-btn to="/profile" text>
            Вихід
        </v-btn>

    </v-app-bar>
</template>

<script>
    import navigation from "../../services/navigation";
    export default {
        name: "Navbar",
        data() {
            return {
                menu: null,
            }
        },
        mounted() {
            this.getMenu();
        },
        methods: {
          getMenu() {
              localStorage.setItem('user', JSON.stringify({role_id: 1})); //TODO::delete string
              const user = JSON.parse(localStorage.getItem('user'));
              this.menu = navigation.getItems(user)
          }
        }
    }
</script>

<style scoped>

</style>