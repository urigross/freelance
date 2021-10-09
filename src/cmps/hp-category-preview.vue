<template>
    <section class="hp-category-preview">
        <li v-if="cat" class="home-page-category-image-wrapper" @click="emitCatName(cat.catName)">
            <div  class="home-page-category-text-container">
                <h4>{{cat.txt}}</h4>
                <h2>{{cat.title}}</h2>
            </div>
            <img :src=cat.url>
        </li>
    </section>
</template>
<script>
//imports
export default {
    props:{cat:Object},
  components: {
    
  },
  data() {
      return {
          data:{
              show:true
          }
          
      }
  },
  methods: {
      emitCatName(catName){
          console.log(catName)
          this.$emit('catName',catName);
          this.toExplorePage();
      },
       toExplorePage() {
      this.$router.push("/explore");
    }
  },
  computed: {},
  created() {},
  destroyed() {},
};
</script>