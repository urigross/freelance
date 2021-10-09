<template>
  <div v-if="alive" class="alert" :class="alertClass">
    {{ msg }}
  </div>
</template>


<script>
import { eventBusService, SHOW_MSG } from "../services/event-bus.service.js";

export default {
  created() {
    eventBusService.$on(SHOW_MSG, (msg) => {
    //   console.log('in show msg',msg)
    //   this.msg = msg;
    //   var delay = msg.delay || 2000000;
    //   this.alive = true;
 
      setTimeout(() => {
        this.alive = false;
      }, delay);
    });
  },
  data() {
    return {
      alive: false,
      msg: null,
    };
  },
  computed: {
    alertClass() {
      if (!this.msg) return;
      return `alert-${this.msg.type}`;
    },
  },
};
</script>