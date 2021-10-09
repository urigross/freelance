import Vue from 'vue'
import Vuex from 'vuex'

import { userStore } from './user-store.js'
import { reviewStore } from './review-store.js'
import { gigStore } from './gig-store.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
    strict: true,
    modules: {
        userStore,
        reviewStore,
        gigStore,
    },
    state: {},
    mutations: {},
    actions: {}
})