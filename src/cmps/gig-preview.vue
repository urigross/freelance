<template>
  <div class="gig-preview" :class="gigPreviewHp">
    <div v-if="isGigCloudinary" @click="routing">
      <el-carousel :interval="5000" :autoplay="false" arrow="always">
        <el-carousel-item v-for="item in 4" :key="item">
          <img v-if="isGigCloudinary" :src="gig.imgUrls[0]" />
          <img v-else :src="require(`../assets/images/${gigImgUrl}`)" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div v-else @click="routing">
      <el-carousel :interval="5000" :autoplay="false" arrow="always">
        <el-carousel-item v-for="item in 4" :key="item">
          <img v-if="isGigCloudinary" :src="gig.imgUrls[0]" />
          <img v-else :src="require(`../assets/images/${gigImgUrl}`)" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <figure class="gig-preview-seller-info">
      <img
        v-if="isSellerCloudinary"
        class="seller-propile-img"
        :src="gig.seller.imgUrl"
      />

      <img
        v-else
        class="seller-propile-img"
        :src="require(`../assets/images/${sellerImgUrl}`)"
      />
      <p>{{ gig.seller.fullname }}</p>
    </figure>
    <div class="gig-preview-gig-info">
      <router-link :to="'/explore/' + gig._id">
        <p class="gig-preview-desc">
          {{ gig.title }}
        </p>
      </router-link>
      <p class="el-icon-star-on">
        <span v-if="gig.reviews[0]">{{ gigPreviewAvg }}</span>
        <span v-else>n/a</span>
        <span class="gig-review-num">({{ gig.reviews.length }})</span>
      </p>
    </div>
    <div class="gig-save-and-price">
      <svg
        @click="saveGig"
        ref="heart"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.4469 1.95625C12.7344 0.496875 10.1875 0.759375 8.61561 2.38125L7.99999 3.01562L7.38436 2.38125C5.81561 0.759375 3.26561 0.496875 1.55311 1.95625C-0.409388 3.63125 -0.512513 6.6375 1.24374 8.45312L7.29061 14.6969C7.68124 15.1 8.31561 15.1 8.70624 14.6969L14.7531 8.45312C16.5125 6.6375 16.4094 3.63125 14.4469 1.95625Z"
        ></path>
      </svg>
      <router-link :to="'/explore/' + gig._id">
        <p>price: ${{ gig.price }}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import gigTags from "./gig-tags.vue";
export default {
  props: {
    gig: Object,
  },
  components: {
    gigTags,
  },
  data() {
    return {
      gigPreviewHp:"",
      img: null,
    };
  },
  methods: {
    saveGig() {
      const like = this.$refs.heart;
      if (like.style.fill === "red") {
        like.style.fill = "#d5d4d2";
        return;
      }
      like.style.fill = "red";
    },
    routing() {
      this.$router.push("/explore/" + this.gig._id);
    },
  },
  computed: {
    gigImgUrl() {
      return this.gig.imgUrls[0].substring(21);
    },
    sellerImgUrl() {
      return this.gig.seller.imgUrl.substring(21);
    },
    isGigCloudinary() {
      return this.gig.imgUrls[0].includes("cloud");
    },

    isSellerCloudinary() {
      return this.gig.seller.imgUrl.includes("cloud");
    },
    gigPreviewAvg() {
      return (
        (this.gig.reviews.reduce((acc, review) => {
          return acc + review.rate;
        }, 0) / this.gig.reviews.length).toFixed(1)
      );
    },
  },
  created() {
    if (this.$route.name === "home") {
      this.gigPreviewHp="gig-preview-hp";
    }
  },
};
</script>
