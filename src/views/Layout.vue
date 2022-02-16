<template>
    <div>
        <navbar/>
        <router-view/>
    </div>
</template>

<script>
    import Navbar from "@c/Navbar/Navbar";
    export default {
        components: {Navbar},
    }
</script>

<style scoped>

</style>