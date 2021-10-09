<template>
    <section class="hp-tag-buttons">
        <div class="home-page-tag-buttons">Popular:
         <!-- TODO: ask how to shortcut it -->
            <button @click.prevent="chosenTag('Web development')">Web development</button>
            <button @click.prevent="chosenTag('Business Plan')">Business Plan</button>
            <button @click.prevent="chosenTag('Podcast expertise')">Podcast</button>
            <button @click.prevent="chosenTag('Cooking')">Cooking</button>
        </div>
    </section>
</template>
<script>
export default{
    computed: {
        filterByCopy(){
            return JSON.parse(JSON.stringify(this.$store.getters.filterToShow));
            },
    },
    
    methods:{
        chosenTag(tag) {
            var filter = this.filterByCopy;
            filter.tags=tag;           
      this.$emit("catChoice", JSON.parse(JSON.stringify(filter)));
      this.toExplorePage();
    },

    // chosenTag(choice){
    //         this.tag = choice;
    //         this.$emit('catChoice',choice);
    //         this.toExplorePage();
    //     },
    toExplorePage() {
      this.$router.push("/explore");
    }
    },
};

</script>
