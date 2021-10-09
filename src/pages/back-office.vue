<template>
  <div class="edit-seller">
    <div class="seller-details">
      <form @submit.prevent="updateSeller">
        <img class="profile-pic" :src="this.user.imgUrl" alt="profile pic" />
        <h3>{{ user.fullname }}</h3>
        <div class="form-content">
          <div class="form-option">
            <h3>Specialty:</h3>

            <p>{{ user.seller.specialty }}</p>
            <!-- <select class="form-input" v-model="userToEdit.seller.specialty">
              <option value="Graphic design">Graphic design</option>
              <option value="Web development">Web development</option>
              <option value="Voice acting">Voice acting</option>
              <option value="Podcast expertise">Podcast expertise</option>
              <option value="Translation">Translation</option> -->
            <!-- </select> -->
          </div>
          <div class="form-option">
            <h3>Description:</h3>
            <p>{{ user.seller.sellerInfo }}</p>
            <!-- <el-input
              class="form-input"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 3 }"
              v-model="userToEdit.seller.sellerInfo"
            ></el-input> -->
          </div>
          <div class="form-option">
            <h3>Location:</h3>
            <p>{{ user.seller.location }}</p>
            <!-- <input class="form input" v-model="userToEdit.seller.location" /> -->
          </div>
        </div>
        <!-- <button>Update</button> -->
      </form>
    </div>
    <div class="user-gigs">
      <div class="gigs-container">
        <h2>Your gigs</h2>
        <gigs-list-user :gigs="this.user.seller.gigs" />
      </div>
    </div>

    <!-- <p>{{this.user.seller.orders}}</p> -->
    <order-table
      :orders="this.user.seller.orders"
      @updateOrders="updateOrders"
    />
    <!-- <h1>Under Construction</h1> -->
  </div>
</template>

<script>
import orderTable from "../cmps/order-table.vue";
import { eventBusService } from "../services/event-bus.service";

import gigsListUser from "../cmps/gigs-list-user.vue";
export default {
  components: {
    gigsListUser,
    orderTable,
  },

  data() {
    return {
      sellerDetails: {
        specialty: null,
        sellerInfo: "",
        location: "",
      },
      gigToAdd: {
        title: "",
        description: "",
        price: null,
        tags: [],
        deliveryDays: null,
        seller: {},
        imgUrls: [],
        packages: ["", "", ""],
      },
      value: "",
      // userToEdit: JSON.parse(JSON.stringify(this.$store.getters.loggedinUser)),
    };
  },

  created() {
    eventBusService.$on("remove-gig", this.removeGig);
  },
  destroyed() {
    eventBusService.$off("remove-gig", this.removeGig);
  },

  computed: {
    getGigs() {
      return this.$store.getters.gigsToShow;
    },
    user() {
      return this.$store.getters.loggedinUser;
    },
  },

  methods: {
    async updateSeller() {
      const userToSend = JSON.parse(JSON.stringify(this.user));
      try {
        await this.$store.dispatch({
          type: "becomeSeller",
          userToUpdate: userToSend,
        });
      } catch (err) {
        throw err;
      }
    },

    updateOrders(orders) {
      this.user.seller.orders = orders;
      const userToSend = JSON.parse(JSON.stringify(this.user));
      this.$store.dispatch({ type: "updateUser", user: this.userToSend });
    },

    async removeGig(_id) {
      try {
        console.log("in try");
        const idx = this.user.seller.gigs.findIndex((gig) => gig._id === _id);
        const userToUpdate = JSON.parse(JSON.stringify(this.user))

        userToUpdate.seller.gigs.splice(idx, 1);
        console.log("user to update gigs");
        console.log(userToUpdate);
        await this.$store.dispatch({ type: "updateUser", user: userToUpdate });
        await this.$store.dispatch({ type: "removeGig", gigId: _id });

      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
</style>