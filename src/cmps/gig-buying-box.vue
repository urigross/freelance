<template>
    <section class="gig-package">
        <h4>
            <span></span> <span>${{ gig.price }}</span>
        </h4>
        <h4>{{ gig.title }}</h4>
        <p>
            <span class="el-icon-time"></span>&nbsp;{{ gig.deliveryDays }} Days
            Delivery
        </p>
        <p>What's Included</p>
        <ul>
            <!-- <include :include="gig.packages" :key="gig._id" v-for="wer in gig.packages" /> -->
            <li>
                <span class="el-icon-check"></span>&nbsp;{{ gig.packages[0] }}
            </li>
            <li>
                <span class="el-icon-check"></span>&nbsp;{{ gig.packages[1] }}
            </li>
            <li>
                <span class="el-icon-check"></span>&nbsp;{{ gig.packages[2] }}
            </li>
        </ul>
        <p></p>
        <router-link :to="'/checkout/' + gig._id">
            <button>Hire</button>
        </router-link>
    </section>
</template>

<script>
import include from "./packageInclude.vue";
export default {
    props: {
        gig: Object,
    },
    components: {
        include,
    },
};
</script>
