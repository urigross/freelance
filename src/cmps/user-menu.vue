<template>
  <aside class="avatar-menu hidden" ref="avatarMenu">
  
    <ul>
      <li v-if="user.seller">
        <router-link to="/backOffice" @click.native="clear"
          >back-office</router-link
        >
      </li>
  <li>
        <router-link :to="'/user/'+user._id" @click.native="clear"
          >profile</router-link
        >
      </li>

      <li><span v-if="user" @click="signout">sign out</span></li>
    </ul>
  </aside>
</template>

<script>
   import { eventBusService } from "../services/event-bus.service.js";
export default {

    data(){
        return {
              isHidden: true,
        }
    },

     created() {
    eventBusService.$on("toggle-menu", this.toggleMenu);
  },
  destroyed() {
    eventBusService.$off("toggle-menu", this.toggleMenu);
  },
 
  props: { user: Object },

  methods: {
    async signout() {
      await this.$store.dispatch({ type: "logout" });
      this.$router.push("/");
    },

      toggleMenu() {
      if (this.isHidden) this.$refs.avatarMenu.classList.remove("hidden");
      else this.$refs.avatarMenu.classList.add("hidden");
      this.isHidden = !this.isHidden;
    },

    clear(){
        this.toggleMenu();
        this.$emit('clear')
    }
  },
};
</script>


<style>
</style>