<template>
  <section @click="clickOutsideModal" class="log-in hidden" ref="loginModal">
    <section class="login-container">
      <header><h4>Sign in to Freelancer</h4></header>
      <form @submit.prevent="attemptLogin">
        <input
          v-model="loginInfo.username"
          type="text"
          placeholder="Username"
        />

        <input
          v-model="loginInfo.password"
          type="password"
          placeholder="Password"
        />
        <button>Continue</button>
      </form>

      <footer>
        <p>
          Not a member yet?
          <button class="link-button" @click="signupClicked()">Join now</button>
        </p>
      </footer>
    </section>
  </section>
</template>

<script>
import { eventBusService } from "../services/event-bus.service.js";
export default {
  data() {
    return {
      isHidden: true,
      loginInfo: {
        username: "",
        password: "",
      },
    };
  },
  created() {
    eventBusService.$on("toggle-login", this.toggleLogin);
  },
  destroyed() {
    eventBusService.$off("toggle-login", this.toggleLogin);
  },
  methods: {
    async attemptLogin() {
      try{
       await this.$store.dispatch({ type: "login", userCred: this.loginInfo }); 
       this.loginInfo = {
         username:'',
         password:''
       };
       this.toggleLogin()
      }catch (err){
        console.log('cant login',err)
           this.userInfo = {};
        throw err;
      }
    },

    toggleLogin() {
      if (this.isHidden) this.$refs.loginModal.classList.remove("hidden");
      else this.$refs.loginModal.classList.add("hidden");
      this.isHidden = !this.isHidden;
    },
    clickOutsideModal(event) {
      if (event.target.classList.value === "log-in") this.toggleLogin();
    },

    signupClicked() {
      this.toggleLogin();
   eventBusService.$emit('toggle-signup')
    },
  },
};
</script>

<style>
</style>