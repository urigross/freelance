<template>
    <div>
        <div v-if="gigsToShow" class="home-page">
            <div
                v-for="hero in demoHeros"
                :key="hero.id"
                class="home-page-top-container"
                :style="{
                    color: currHero.styleSet.color,
                    backgroundColor: currHero.styleSet.backgroundColor,
                }"
            >
                <div
                    v-if="hero.fullname === currHero.fullname"
                    class="home-page-top main-layout"
                >
                    <!-- image section -->
                    <div class="home-page-image-container">
                        <template>
                            <section>
                                <div class="hp-hero-image-list">
                                    <img
                                        class="hero-image"
                                        :src="hero.imgUrl"
                                        width="600px"
                                    />
                                    <div class="hp-hero-details-container">
                                        <el-rate
                                            class="hp-hero-rate"
                                            v-model="hero.rate"
                                            disabled
                                            text-color="#ff9900"
                                        ></el-rate>
                                        <div class="hp-image-preview-hero-text">
                                            <p>
                                                {{ hero.fullname }},
                                                <b>{{ hero.specialty }}</b>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </template>
                    </div>
                </div>
            </div>
            <!-- search section -->
            <main class="home-page-search">
                <header class="hp-header">
                    <h2 class="slogan-header">
                        <span class="slogan"
                            >You need a <i>freelance</i> in a free world</span
                        >
                    </h2>
                </header>
                <form class="home-page-search-container">
                    <div class="home-page-search-bar-container">
                        <hp-search-bar @filter="filter" />
                    </div>
                </form>
                <hp-tag-buttons @catChoice="filter" />
            </main>
            <!-- botton page section -->
            <div class="home-page-bottom-container main-layout">
                <h2 class="hp-popular-services-header">
                    Popular professional services
                </h2>
                <hp-category-list
                    :categories="categories"
                    @categoryBtnPressed="categoryBtnPressed"
                    @catName="setCatFilter"
                />
                <div class="hp-bottom-header-container">
                    <h2 class="hp-top-rated-gigs-header">Top rated Gigs</h2>
                    <span>
                        <button @click.prevent="toExplorePage">See all</button>
                    </span>
                </div>
                <gigs-list :gigs="topRatedGigsToShow" />
                <div class="hp-bottom-header-container">
                    <h2 class="hp-discover-web-header">
                        Discover Web development
                    </h2>
                    <span>
                        <button @click.prevent="toExplorePage">See all</button>
                    </span>
                </div>
                <template>
                    <gigs-list :gigs="webGigsToShow" />
                    <div class="hp-bottom-header-container">
                        <h2 class="hp-discover-business-header">
                            Discover Business
                        </h2>
                        <span>
                            <button @click.prevent="toExplorePage">
                                See all
                            </button>
                        </span>
                    </div>
                </template>
                <gigs-list :gigs="businessGigsToShow" />
            </div>
        </div>
    </div>
</template>
<script>
import hpSearchBar from "../cmps/hp-search-bar.vue";
import hpTagButtons from "../cmps/hp-tag-buttons.vue";
import hpCategoryList from "../cmps/hp-category-list.vue";
import gigsList from "../cmps/gigs-list.vue";
import hpHeroImagePreview from "../cmps/hp-hero-image-preview.vue";
import { eventBusService } from "../services/event-bus.service.js";
import { socketService } from "../services/socket.service";
export default {
    components: {
        hpSearchBar,
        hpTagButtons,
        hpCategoryList,
        gigsList,
        hpHeroImagePreview,
    },
    data() {
        return {
            mobileMode:null,
            isLoading: false, // loading gigs
            // category gallery
            galleryItemsCount: 5,
            categories: null,
            filterBy: {
                txt: "",
                tags: "",
                price: {
                    min: null,
                    max: null,
                },
                rate: null,
            },
            // style object for the header via eventbus
            styleObject: {
                color: null,
                backgroundColor: null,
                borderBottom: null,
            },
            // hero images demo data
            idx: 0,
            heroInterval: null,
            currHero: null,
            demoHeros: [
                {
                    id: "1",
                    fullname: "keren",
                    rate: 4.5,
                    specialty: "Graphic designer",
                    imgUrl: "https://res.cloudinary.com/urigross/image/upload/v1626634929/hp-hero/pngfind.com-business-woman-png-1612489_2_kn1y2b.png",
                    styleSet: { backgroundColor: "#494949", color: "white" },
                },
                {
                    id: "2",
                    fullname: "danielle",
                    rate: 4.8,
                    specialty: "Web Developer",
                    imgUrl: "https://res.cloudinary.com/urigross/image/upload/v1626705372/hp-hero/pngfind.com-business-man-png-1144946_2_yzvnhb.png",
                    styleSet: { backgroundColor: "#093d10", color: "white" },
                },
                {
                    id: "3",
                    fullname: "venessa",
                    rate: 4.7,
                    specialty: "Strategic Planner",
                    imgUrl: "https://res.cloudinary.com/urigross/image/upload/v1626705830/hp-hero/pngfind.com-ladies-suit-png-248538_2_ljes8n.png",
                    styleSet: { backgroundColor: "#a57563", color: "white" },
                },
                {
                    id: "4",
                    fullname: "june",
                    rate: 5,
                    specialty: "Podcaster",
                    imgUrl: "https://res.cloudinary.com/urigross/image/upload/v1626634928/hp-hero/pngfind.com-woman-png-547411_2_sx13da.png",
                    styleSet: { backgroundColor: "black", color: "white" },
                },
                {
                    id: "5",
                    fullname: "john",
                    rate: 4.6,
                    specialty: "Mobile Developer",
                    imgUrl: "https://res.cloudinary.com/urigross/image/upload/v1626634928/hp-hero/pngaaa.com-1274196_2_pcd11d.png",
                    styleSet: { backgroundColor: "#86535c", color: "white" },
                },
            ],

            // Demo data for categories gallery
            demoCategories: [
                {
                    id: "1",
                    catName: "Logo",
                    txt: "Build your brand",
                    title: "Logo Design",
                    url: "https://res.cloudinary.com/urigross/image/upload/v1626521677/categories/Elegant-CA-letter-logo-4_kh7yqc.jpg",
                },
                {
                    id: "2",
                    catName: "Mobile",
                    txt: "Build your mobile site",
                    title: "Mobile Builders",
                    url: "https://res.cloudinary.com/urigross/image/upload/v1626521677/categories/test-driven-development-t_yr6mzs.jpg",
                },
                {
                    id: "3",
                    catName: "Web development",
                    txt: "learn web development",
                    title: "Fullstack Course",
                    url: "https://res.cloudinary.com/urigross/image/upload/v1626521677/categories/ONLC-2017-4-637x350_sgkf3v.png",
                },
                {
                    id: "4",
                    catName: "Podcast expertise",
                    txt: "Podcast your ideas",
                    title: "Podcast Experts",
                    url: "https://res.cloudinary.com/urigross/image/upload/v1627223782/categories/0_aJoB4ffIunEoT1db_bknksx.jpg",
                },
                {
                    id: "5",
                    catName: "Business",
                    txt: "Business Plan",
                    title: "Plan your Business",
                    url: "https://res.cloudinary.com/urigross/image/upload/a_180/v1627223374/categories/nice-business-desk-black-background_24972-1179_ygur64.jpg",
                },

                {
                    id: "6",
                    catName: "Cooking",
                    txt: "Cooking Recepies",
                    title: "Make the best food!",
                    url: "https://res.cloudinary.com/urigross/image/upload/v1626790679/categories/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3_l6q9wc.jpg",
                },
            ],
        };
    },
    computed: {
        businessGigsToShow() {
            return this.$store.getters.businessGigsToShow;
        },
        webGigsToShow() {
            return this.$store.getters.webGigsToShow;
        },
        topRatedGigsToShow() {
            var modTopRatedGigs = this.gigsToShow;
            var topGigsLng = modTopRatedGigs.length;
            if (topGigsLng > 10) {
                modTopRatedGigs.splice(10, topGigsLng - 10);
                return modTopRatedGigs;
            }
        },

        gigsToShow() {
            return this.$store.getters.gigsToShow;
        },
    },
    // Gallery methods for Popular professional services
    methods: {
        // Set initial categories according to item number.
        initCategories() {
            this.categories = JSON.parse(JSON.stringify(this.demoCategories));
            var newCategoryLng =
                this.categories.length - this.galleryItemsCount;
            this.categories.splice(
                this.categories.length - newCategoryLng,
                newCategoryLng
            );
        },

        categoryBtnPressed(diff) {
            // This moves the carousel forward by adding item to the last and removing the first
            // case pressed forward button
            if (diff === 1) {
                // get demo catIndex
                var demoCatIdx = this.demoCategories.findIndex(
                    (cat) =>
                        cat.id ===
                        this.categories[this.categories.length - 1].id
                );
                // if it's the last item in demoCategories - Push the first item / otherwise push the next item from demoCategories to categories
                if (demoCatIdx === this.demoCategories.length - 1) {
                    this.categories.push(this.demoCategories[0]);
                } else {
                    this.categories.push(this.demoCategories[demoCatIdx + 1]);
                }
                // remove the first item in categories
                this.categories.splice(0, 1);
            }
            // In case carouselle is backwards
            else {
                // find the idx of the category in demoCategories that is the same as the first element in categories.
                var demoCatIdx = this.demoCategories.findIndex(
                    (cat) => cat.id === this.categories[0].id
                );
                // If its the first element in demoCategories - Push the last element in demoCategories to categories.
                var idxToPush;
                if (!demoCatIdx) {
                    idxToPush = this.demoCategories.length - 1;
                }
                // else - push the prev. item in demoCategories to categories,
                else {
                    idxToPush = demoCatIdx - 1;
                }
                // add the category at the start
                this.categories.splice(0, 0, this.demoCategories[idxToPush]);
                // remove category at the end
                this.categories.splice(this.categories.length - 1, 1);
            }
        },

        toExplorePage() {
            this.$router.push("/explore");
        },
        /// Categories by buttons function ///
        setCatFilter(catFilter) {
            this.filterBy.tags = catFilter;
            this.filter(this.filterBy);
        },
        async filter(filterBy) {
            this.filterBy = filterBy;
            try {
                this.$store.commit({ type: "setFilter", filterBy });
            } catch (err) {
                console.log("Cannot load gigs", err);
                throw err;
            }
        },

        // Hero top section methods
        // Default hero for loading page
        loadDefaultHero() {
            this.currHero = this.demoHeros[this.idx];
            this.idx++;
        },
        // styleObject gets the style params of the hero.
        styleDefaultHero() {
            this.styleObject.backgroundColor =
                this.demoHeros[0].styleSet.backgroundColor;
            this.styleObject.color = this.demoHeros[0].styleSet.color;
            this.styleObject.borderBottom = "none";
        },
        // Sending style id to the header
        sendStyleToHeader() {
            eventBusService.$emit("headerChange", this.demoHeros[0].id);
        },
        async loadGigs() {
            this.$store
                .dispatch({ type: "loadGigs" })
                .then(() => (this.isLoading = false));
        },
        // Interval for new hero
        startHeroInterval() {
            this.heroInterval = setInterval(() => {
                    if (this.mobileMode === null ) {

                        this.currHero = this.demoHeros[this.idx];
                        this.idx === this.demoHeros.length - 1 ? (this.idx = 0) : this.idx++;
                        this.styleObject.backgroundColor = this.currHero.styleSet.backgroundColor;
                        // set home-page top section dynamic styles per hero
                        this.styleObject.color = this.currHero.styleSet.color;
                        eventBusService.$emit("headerChange", this.currHero.id);
                    }
                    else{
                        this.currHero.styleSet.backgroundColor = "#023a15";
                                        }
            }, 4900);
        },
        // makes immidiate changes to dom hero and header when toggling from mobile / desktop screen width
        setHpUnder600Px(){
            this.mobileMode=600;
                clearInterval(this.heroInterval);
                this.currHero.styleSet.backgroundColor = "#023a15";
                this.currHero.styleSet.color = "#FFF";
                eventBusService.$emit("headerChange","600");
        },
        setHpUnder900Px(){
            this.mobileMode = 900;
                clearInterval(this.heroInterval);
                this.currHero.styleSet.backgroundColor = "#023a15";
                this.currHero.styleSet.color = "#FFF";
                eventBusService.$emit("headerChange", "900");
        },

        setHpOver900px(){
                if(this.mobileMode !== null){
                    this.mobileMode=null;
                    this.loadDefaultHero();
                    this.styleDefaultHero();
                    this.startHeroInterval();
                }                
                this.styleObject.backgroundColor =
                    this.currHero.styleSet.backgroundColor;
                // set home-page top section dynamic styles per hero
                this.styleObject.color = this.currHero.styleSet.color;
                eventBusService.$emit("headerChange", this.currHero.id);
            
        },


        myEventHandler(e) {
            if (e.target.innerWidth < 600) this.setHpUnder600Px()
            else if (e.target.innerWidth < 900) this.setHpUnder900Px() 
            else this.setHpOver900px();
        },
        setClsWindowWidths(){
            if (window.innerWidth < 600) this.setHpUnder600Px()
            else if(window.innerWidth <900) this.setHpUnder900Px();
            else this.setHpOver900px(); 
        },
    },
    created() {
        // listen to window resize
        window.addEventListener("resize", this.myEventHandler);
        // Hero Image first Interval
       this.loadDefaultHero();
       this.styleDefaultHero();
        //this.sendStyleToHeader();
        this.loadGigs();
        //Hero continues Invervals and Styling
       this.startHeroInterval();
        this.setClsWindowWidths();
        this.initCategories();
        socketService.setup();
        socketService.on("test", () => {
        });
        socketService.emit("user");
    },
    destroyed() {
        window.removeEventListener("resize", this.myEventHandler);
        // clearing header to default styling params and clear hero image interval
        eventBusService.$emit("headerChange", ""); // white background
        clearInterval(this.heroInterval);
    },
};
</script>