<template>
    <section v-if="gig" class="checkout-page">
        <main>
            <div class="package-container">
                <h2>Your Package</h2>
                <div class="package-gig-details">
                    <div class="package-info-container">
                        <div class="img-container">
                            <img v-if="isGigCloudinary" :src="gig.imgUrls[0]" />
                            <img
                                v-else
                                :src="require(`../assets/images/${gigImgUrl}`)"
                            />
                        </div>
                        <div class="h3">
                            <h3>{{ gig.title }}</h3>
                            <el-rate
                                v-model="sellerRate"
                                disabled
                                show-score
                                text-color="#ff9900"
                                score-template="{value}"
                            >
                                <span> ({{ gig.reviews.length }} Reviews)</span>
                            </el-rate>
                            <div class="more-package-info">
                                <button @click="include">
                                    View what's included
                                    <span :class="arrowDirection"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="package-gig-price" v-if="isSmall">
                        $ {{ gig.price }}
                    </div>
                </div>
                <div v-if="isInclude" class="package-include">
                    {{ gig.description }}
                </div>
            </div>
        </main>
        <checkout-box :gig="gig" />
    </section>
</template>

<script>
import { gigService } from "../services/gig.service.js";
import checkoutBox from "../cmps/checkout-box.vue";
export default {
    components: {
        checkoutBox,
    },
    data() {
        return {
            gig: null,
            sellerRate: null,
            isInclude: false,
            isSmall: false,
        };
    },
    methods: {
        averageRate() {
            let sumRate = 0;
            this.gig.reviews.forEach((review) => {
                return (sumRate += review.rate);
            });
            return parseInt(sumRate / this.gig.reviews.length).toFixed(1);
        },
        include() {
            this.isInclude = !this.isInclude;
        },
    },
    computed: {
        gigImgUrl() {
            return this.gig.imgUrls[0].substring(21);
        },
        arrowDirection() {
            if (this.isInclude) {
                return { "el-icon-arrow-up": true };
            }
            return { "el-icon-arrow-down": true };
        },
        isGigCloudinary() {
            return this.gig.imgUrls[0].includes("cloudinary");
        },
    },
    async created() {
        const { gigId } = this.$route.params;
        this.gig = await gigService.getById(gigId);
        this.sellerRate = this.averageRate();
    },
};
</script>