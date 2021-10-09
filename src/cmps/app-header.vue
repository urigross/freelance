<template>
    <header class="app-header" :class="[homePageColorSetClass]">
        <div ref="sideMenu" class="side-menu">
            <nav @click="closeMenu" class="side-menu-nav">
                <template v-if="loggedInUser">
                    <img
                        @click="toggleMenu"
                        class="avatar"
                        :src="loggedInUser.imgUrl"
                        alt="avatar"
                    />
                    <router-link
                        raf="becomeSeller"
                        class="header-nav-a"
                        :class="[homePageColorSetClass]"
                        v-if="!isUserSeller"
                        to="/becomeSeller"
                        @click.native="clearSearch"
                        >Become a seller</router-link
                    >
                </template>
                <router-link
                    to="/"
                    @click.native="clearSearch"
                    class="header-nav-a"
                    :class="[homePageColorSetClass]"
                    >Home</router-link
                >
                <router-link
                    to="/explore"
                    @click.native="clearSearch"
                    class="header-nav-a"
                    :class="[homePageColorSetClass]"
                    >Explore</router-link
                >
            </nav>
            <div @click="closeMenu"></div>
        </div>
        <nav class="nav-header">
            <div class="hamburger-menu" @click="openMenu">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div class="logo" :class="[homePageColorSetClass]">
                <router-link to="/" @click.native="clearSearch"
                    >Freelance<span>.</span></router-link
                >
            </div>
            <app-header-search
                class="app-header-search1"
                v-if="serachBar"
                @filter="filter"
            />
            <div class="navigation">
                <!-- Need to change look -->
                <div class="nav-home-explore">
                    <router-link
                        to="/"
                        @click.native="clearSearch"
                        class="header-nav-a"
                        :class="[homePageColorSetClass]"
                        >Home</router-link
                    >
                    <router-link
                        to="/explore"
                        @click.native="clearSearch"
                        class="header-nav-a"
                        :class="[homePageColorSetClass]"
                        >Explore</router-link
                    >
                </div>
                <template class="nav-profile-join">
                    <template v-if="loggedInUser" class="user-control">
                        <router-link
                            class="header-nav-a"
                            :class="[homePageColorSetClass]"
                            v-if="!isUserSeller"
                            to="/becomeSeller"
                            @click.native="clearSearch"
                            >Become a seller</router-link
                        >
                        <img
                            @click="toggleMenu"
                            class="avatar"
                            :src="loggedInUser.imgUrl"
                            alt="avatar"
                        />
                        <user-menu @clear="clearSearch" :user="loggedInUser" />
                    </template>
                    <template v-else>
                        <button
                            class="header-signin"
                            @click="toggleLogin"
                            :class="[homePageColorSetClass]"
                        >
                            Sign In
                        </button>
                        <button @click="toggleSignup">
                            <span
                                class="header-join"
                                :class="[homePageColorSetClass]"
                                >Join</span
                            >
                        </button>
                    </template>
                </template>
            </div>
        </nav>
        <app-header-search
            class="app-header-search2"
            v-if="serachBar"
            @filter="filter"
        />
    </header>
</template>
<script>
import { eventBusService } from "../services/event-bus.service.js";
import appHeaderSearch from "./app-header-search.vue";
import userMenu from "./user-menu.vue";
export default {
    components: {
        appHeaderSearch,
        userMenu,
    },
    data() {
        return {
            // home page styling
            homePageColorSetClass: "",
            // filter
            filterBy: {
                txt: "",
                tags: "",
                price: {
                    min: null,
                    max: null,
                },
                rate: null,
            },
            hamburgerMenu: false,
        };
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedinUser;
        },

        isUserSeller() {
            if (
                this.$store.getters.loggedinUser.seller === null ||
                !this.$store.getters.loggedinUser.seller
            )
                return false;
            else return true;
        },
        serachBar() {
            return this.$route.path !== "/";
        },
        imageName() {
            return this.$store.getters.loggedinUser.imgUrl.substring(27);
        },
    },
    methods: {
        closeMenu() {
            this.hamburgerMenu = false;
            const sideMenu = this.$refs.sideMenu;
            if (!this.hamburgerMenu) {
                sideMenu.style.transform = "translateX(-100%)";
            } else sideMenu.style.transform = "translateX(0)";
        },
        openMenu() {
            this.hamburgerMenu = true;
            const sideMenu = this.$refs.sideMenu;
            if (this.hamburgerMenu) {
                sideMenu.style.transform = "translateX(0)";
            } else sideMenu.style.transform = "translateX(-100%)";
        },
        toggleMenu() {
            eventBusService.$emit("toggle-menu");
        },
        toggleLogin() {
            eventBusService.$emit("toggle-login");
        },
        toggleSignup() {
            eventBusService.$emit("toggle-signup");
        },

        async filter(filterBy) {
            this.filterBy = filterBy;
            try {
                this.$store.commit({
                    type: "setFilter",
                    filterBy: this.filterBy,
                });
                console.log("filterBy", this.filterBy);
            } catch (err) {
                console.log("cannot load gigs", err);
                throw err;
            }
        },
        clearSearch() {
            try {
                this.filterBy = JSON.parse(JSON.stringify(this.filterBy));
                this.filterBy.txt = "";
                this.$store.commit({
                    type: "setFilter",
                    filterBy: this.filterBy,
                });
            } catch (err) {
                console.log("cannot load gigs", err);
                throw err;
            }
        },
        ///////////////////////////////////
        /// styles from homepage section //
        ///////////////////////////////////
        syncHeaderVsHeroStyle() {
            eventBusService.$on("headerChange", (data) => {
                // If there is no data from home page - do not add styling classes
                if (data === "") {
                    this.homePageColorSetClass = data;
                }
                // set styling classes
                else {
                    this.homePageColorSetClass = `home-page-header${data}`;
                }
            });
        },
    },
    created() {
        this.syncHeaderVsHeroStyle();
        // Gets styling class id from homepage hero demo data and set it
    },
    destroyed() {
        eventBusService.$off("headerChange");
        this.clearSearch();
    },
};
</script>