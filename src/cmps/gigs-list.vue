<template>
    <section class="gigs-list" :class="[gigsListHp]">
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
        return {
            gigsListHp: "",
        };
    },
    methods: {},
    computed: {},
    created() {
        if (this.$route.name === "home") {
            this.gigsListHp = "gigs-list-hp";
        }
    },
};
</script>

