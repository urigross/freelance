<template>
  <section class="gigs-list-user">
    
    <gig-preview-user v-for="gig in gigs" :gig="gig" :key="gig._id"/>
        <button @click="openCreateGig" class="add-button el-icon-plus"></button>

   
  </section>
</template>

<script>
import gigPreviewUser from "./gig-preview-user.vue";
import {eventBusService} from '../services/event-bus.service'
export default {
  components: {
    gigPreviewUser,
  },
  props: {
    gigs: Array,
  },
  data() {
    return {};
  },
  methods: {
openCreateGig(){
     eventBusService.$emit('open-create')
}
  },
  computed: {},
  created() {},
  destroyed() {},
};
</script>