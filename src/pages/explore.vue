<template>
    <main class="explore main-layout" v-if="gigs">
        <h2 v-if="searchTxt">Results for " {{ searchTxt }} "</h2>
        <h2 v-if="searchTags">{{ searchTags }}</h2>
        <filter-by @filter="filter" />
        <gigs-list :gigs="getGigs" />
        <!-- <p>{{gigs}}</p> -->
    </main>
</template>

<script>
import gigsList from "../cmps/gigs-list.vue";
import filterBy from "../cmps/explore-filter.vue";
export default {
    components: {
        gigsList,
        filterBy,
    },
    data() {
        return {
            gigs: [],
            searchTxt: "",
            searchTags: "",
        };
    },
    methods: {
        async filter(filterBy) {
            try {
                this.searchTxt = filterBy.txt;
                this.searchTags = filterBy.tags;
                this.$store.commit({ type: "setFilter", filterBy });
                await this.$store.dispatch("loadGigs");
                console.log("filterBy", filterBy);
            } catch (err) {
                console.log("cannot load gigs", err);
                throw err;
            }
        },
    },
    computed: {
        getGigs() {
            this.gigs = this.$store.getters.gigsToShow;
            return this.$store.getters.gigsToShow;
        },
        filterByCopy() {
            return JSON.parse(JSON.stringify(this.$store.getters.filterToShow));
        },
        setGigStoreFilter() {
            var filter = this.filterByCopy;
            filter.txt = "";
            this.filter(filter);
        },
    },
    async created() {
        try {
            this.$store.dispatch({ type: "loadGigs" });
        } catch (err) {
            console.log("cannot load gigs", err);
            throw err;
        }
    },
    destroyed() {
        this.setGigStoreFilter;
    },
};
</script>
