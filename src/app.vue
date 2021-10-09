<template>
  <div id="app">


     <user-msg />
    <login-modal />
    <sign-up-modal />
    <create-gig/>
    
    <app-header />
    <router-view />
  </div>
</template>

<script>
import appHeader from "./cmps/app-header";
import userMsg from "./cmps/user-msg";
import LoginModal from "./cmps/login-modal.vue";
import signUpModal from "./cmps/sign-up-modal.vue";
import createGig from './cmps/create-gig.vue'

export default {


  components: {
    appHeader,
    userMsg,
    LoginModal,
    signUpModal,
    createGig,
  },
};
</script>

