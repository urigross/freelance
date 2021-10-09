<template>
    <section class="hp-category-list">
          <button class="home-page-category-before-btn el-icon-arrow-left" @click.prevent="catBtnClicked(-1)"></button>
        <ul class="home-page-category-list">
          <li v-for="cat in categories" :key="cat.id">
            <transition :name="direction" mode="in-out">ל
              <hp-category-preview class="carousel-slide" v-if="see" @catName="emitCatName" :cat="cat"/>
            </transition>
          </li>
        </ul>
          <button class="home-page-category-next-btn el-icon-arrow-right" @click.prevent="catBtnClicked(1)"></button>
    </section>
</template>
<script>
import hpCategoryPreview from '../cmps/hp-category-preview.vue'

export default {
    props:{categories:Array},
  components: {
    hpCategoryPreview
  },
  data() {
      return {
        direction:'left',
        see:true
          
      }
  },
  methods: {
    catBtnClicked(diff){
      diff === 1 ? this.direction ='right' : this.direction = 'left';
      this.see=!this.see;
      setTimeout(() => {
        this.see=!this.see;
      }, 1);
      this.$emit('categoryBtnPressed', diff);
    },
    emitCatName(catName){
      this.$emit('catName',catName);
    }
  },
  computed: {},
  created() {},
  destroyed() {},
};
</script>