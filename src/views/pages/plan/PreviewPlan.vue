<template>
  <v-container>
    Preview



    <pre>
      {{plan}}
    </pre>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "PreviewPlan",
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      plan: 'plans/plan'
    })
  },
  mounted() {
    this.apiPreviewPlan();
  },
  methods: {
    apiPreviewPlan() {
      const id = this.$route.params.id
      if (id) {
        this.$store.dispatch('plans/show', id)
      }
    }
  }
}
</script>

<style scoped>

</style>
