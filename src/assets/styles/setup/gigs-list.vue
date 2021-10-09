<template>
  <section class="gigs-list">
    <gig-preview v-for="gig in gigs" :gig="gig" :key="gig._id" />
  </section>
</template>

<script>
import gigPreview from "../cmps/gig-preview.vue";

export default {
  components: {
    gigPreview,
  },
  props: {
    gigs: Array,
  },
  data() {
    return {};
  },
  methods: {},
  computed: {},
  created() {},
  destroyed() {},
};
</script>