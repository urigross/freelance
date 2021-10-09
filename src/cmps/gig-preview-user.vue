<template>
  <div class="gig-preview seller-preview">



 <router-link v-if="isGigCloudinary" :to="'/explore/' + gig._id">
      <img :src="gig.imgUrls[0]" />
    </router-link>

    <router-link v-else :to="'/explore/' + gig._id">
      <img :src="require(`../assets/images/${gigImgUrl}`)" />
    </router-link>

    <p> {{ gig.title }}</p>
    <p>{{ gig.description }}</p>
    <div class="gig-actions">
 
        <span  @click="deleteClicked(gig._id)">Remove</span>
           <router-link :to="'/explore/' + gig._id">View</router-link>
        </div>
  </div>
</template>

<script>
import gigTags from "./gig-tags.vue";
import {eventBusService} from "../services/event-bus.service"
export default {
  props: {
    gig: Object,
  },
  components: {
    gigTags,
  },
  data() {
    return {
      img: null,
    };
  },
  computed: {
    imgUrl() {
      return this.gig.imgUrls[0].substring(26);
    },
         isGigCloudinary(){
      console.log(this.gig.imgUrls[0].includes('cloud'))
      return (this.gig.imgUrls[0].includes('cloud'))
      
    },

     isSellerCloudinary(){
       console.log(this.gig.seller.imgUrl.includes('cloud'))
      return (this.gig.seller.imgUrl.includes('cloud'))
      
    }
  },
  methods:{
    deleteClicked(_id){
      console.log('click')
 eventBusService.$emit('remove-gig',_id)
    }
  },
 
};
</script>
