<template>
    <section v-if="hero" class="hp-hero-image-list">
        <img class="hero-image" :src="hero.imgUrl" width="600px">
        <div class="hp-hero-details-container">
            <el-rate class="hp-hero-rate" v-model="hero.rate" disabled text-color="#ff9900"></el-rate>
            <div class="hp-image-preview-hero-text">
            <p>{{hero.fullname}}, <b>{{hero.specialty}}</b></p>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    props:{hero:Object},
  components: {
  },
  data() {
      return {
          
      }
  },
  methods: {},
  computed: {},
  created() {},
  destroyed() {},
};
</script>