import Vue from 'vue'
import Router from 'vue-router'
import home from './pages/home-page.vue'
import explorePage from './pages/explore.vue'
import gigDetails from './pages/gig-details.vue'
import becomeSeller from './pages/become-seller.vue'
import userDetails from './pages/user-details.vue'
import checkout from './pages/checkout.vue'
import backOffice from './pages/back-office.vue'
import transactionDone from './pages/transaction-done.vue'



Vue.use(Router)

export const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes: [{
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/explore',
            name: 'explore',
            component: explorePage
        },
        {
            path: '/explore/:gigId',
            name: 'gig-details',
            component: gigDetails
        },
        {
            path: '/becomeSeller',
            name: 'becomeSeller',
            component: becomeSeller
        },
        {
            path: '/user/:id',
            name: 'user-details',
            component: userDetails
        },
        {
            path: '/checkout/:gigId',
            name: 'checkout',
            component: checkout
        },
        {
            path: '/backOffice',
            name: 'back-office',
            component: backOffice
        },
        {
            path: '/end',
            name: 'transaction-done',
            component: transactionDone
        }
    ]
})