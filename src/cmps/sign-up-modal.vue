modal<template>
  <section @click="clickOutsideModal" class="signup hidden" ref="signupModal">
    <section class="signup-container">
      <header><h4>Join Freelancer</h4></header>
      <form @submit.prevent="registerUser">
        <input
          v-model="user.username"
          type="text"
          placeholder="Choose a Username"
        />

        <input
          v-model="user.password"
          type="password"
          placeholder="Choose a Password"
        />
        <button>join</button>
      </form>
      <p>
        By joining, you agree to Freelance’s<span class="tos">
          Terms of Service,</span
        >
        as well as to receive occasional emails from us
      </p>
      <footer>
        <p>
          Already a member?
          <button class="link-button" @click="signinClicked()">Sign in</button>
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
      user:{
        username: '',
        password:'',
      }
    };
  },
  created() {
    eventBusService.$on("toggle-signup", this.toggleSignUp);
  },
  destroyed() {
    eventBusService.$off("toggle-signup", this.toggleSignUp);
  },
  methods: {

        async registerUser() {
      try{
       await this.$store.dispatch({ type: "signup", userCred: this.user }); 
       this.user = {
         username:'',
         password:''
       };
       this.toggleSignUp()
      }catch (err){
        console.log('cant login',err)
           this.userInfo = {};
        throw err;
      }
    },

    toggleSignUp() {
      if (this.isHidden) this.$refs.signupModal.classList.remove("hidden");
      else this.$refs.signupModal.classList.add("hidden");
      this.isHidden = !this.isHidden;
    },
    clickOutsideModal(event) {
  
      if (event.target.classList.value === "signup") this.toggleSignUp();
    },
    signinClicked(){
  this.toggleSignUp()
  eventBusService.$emit('toggle-login')
    }
  }
};
</script>

<style>
</style>