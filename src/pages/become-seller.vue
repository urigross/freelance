<template>
  <main class="become-seller-container">
    <h1></h1>
    <div class="become-seller">
      <h1>Become seller!</h1>

      <form @submit.prevent="becomeSeller">
        <h3>What is your specialty?</h3>

        <el-select v-model="sellerDetails.specialty" placeholder="choose">
          <el-option value="graphic design">graphic design</el-option>
          <el-option value="web development">web development</el-option>
          <el-option value="voice acting">voice acting</el-option>
          <el-option value="podcast expertise">podcast expertise</el-option>
          <el-option value="translation">translation</el-option>
          <el-option value="Logo">Logo</el-option>
          <el-option value="cooking">cooking</el-option>
          <el-option value="Busieness management">Busieness management</el-option>
          
        </el-select>
        <h3>Tell us about yourself!</h3>

        <el-input
          type="textarea"
          v-model="sellerDetails.sellerInfo"
          cols="30"
          rows="10"
        ></el-input>
        <h3>Where are you from?</h3>
        <el-input
          type="text"
          v-model="sellerDetails.location"
          cols="30"
          rows="10"
        ></el-input>

        <button>become a seller!</button>
      </form>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      sellerDetails: {
        specialty: null,
        sellerInfo: "",
        location: "",
      },
      addGigActive: false,
      isLoading: false,
      isDragOver: false,
      options: [
        {
          value: "graphic design",
          label: "graphic design",
        },
        {
          value: "web development",
          label: "web development",
        },
        {
          value: "voice acting",
          label: "voice acting",
        },
        {
          value: "podcast expertise",
          label: "podcast expertise",
        },
        {
          value: "translation",
          label: "translation",
        },
      ],
      value: "",
    };
  },

  computed: {
    user() {
      return this.$store.getters.loggedinUser;
    },
  },

  methods: {
    async becomeSeller() {
      this.user.seller = this.sellerDetails;
      this.user.seller.reviews = [];
      this.user.seller.gigs = [];
      this.user.seller.orders = [];
      const userToSend = this.user;
      try {
        await this.$store.dispatch({
          type: "becomeSeller",
          userToUpdate: userToSend,
        });
        this.$router.push("/backOffice");
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>