<template>
  <section @click="clickOutsideModal" class="add-gig hidden" ref="addGig">
    <main>
      <p>hey{{loggedInUser}}</p>
      <h1>Create Gig</h1>
      <form class @submit.prevent="addGig">
        <div class="gig-input">
          <p>Title</p>
          <el-input
            class="title-input"
            type="text"
            placeholder="title"
            v-model="gigToAdd.title"
          />
        </div>
        <div class="gig-input-numbers">
          <div class="gig-input">
            <p>Price</p>
            <el-input
              class="number-input"
              type="number"
              placeholder="price"
              v-model="gigToAdd.price"
            />
          </div>
          <div class="gig-input">
            <p>Delivery Days</p>
            <el-input
              class="delivery-input"
              type="number"
              placeholder="delivery days"
              v-model="gigToAdd.deliveryDays"
            />
          </div>
        </div>
        <div class="gig-input">
          <p>Description</p>
          <el-input
            class="desc-input"
            type="textarea"
            autosize
            placeholder="description"
            v-model="gigToAdd.description"
          >
          </el-input>
        </div>

        <div class="gig-input">
          <p>Tags</p>
          <el-select
            class="tag-input"
            v-model="gigToAdd.tags"
            multiple
            placeholder="tags"
          >
            <el-option
              style="margin-bottom: 5px"
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="gig-input">
          <p>Feature:</p>
          <el-input
            maxlength="25"
            show-word-limit
            class="package1-input"
            type="text"
            placeholder="Feature"
            v-model="gigToAdd.packages[0]"
          />
          <p>Feature:</p>
          <el-input
            maxlength="25"
            show-word-limit
            class="package2-input"
            type="text"
            placeholder="Feature"
            v-model="gigToAdd.packages[1]"
          />
          <p>Feature:</p>
          <el-input
            maxlength="25"
            show-word-limit
            class="package3-input"
            type="text"
            placeholder="Feature"
            v-model="gigToAdd.packages[2]"
          />
        </div>

        <div class="img-upload-container">
          <template v-if="!isLoading">
            <label
              class="img-upload"
              for="imgUploader"
              @drop.prevent="handleFileGig"
              @dragover.prevent="isDragOver = true"
              @dragleave="isDragOver = false"
              :class="{ drag: isDragOver }"
            >
              <div class="upload-call">
                <h3>Upload images</h3>
                <p class="el-icon-upload"></p>
              </div>
            </label>

            <input
              class="hidden"
              type="file"
              name="img-uploader"
              id="imgUploader"
              @change="handleFileGig"
            />
          </template>

          <img
            class="loader"
            v-else
            src="https://motiongraphicsphoebe.files.wordpress.com/2018/10/8ee212dac057d412972e0c8cc164deee.gif?w=545&h=409"
            alt=""
          />
        </div>

        <div class="img-upload-list">
          <img
            class="img-upload-preview"
            v-for="imgUrl in imgList"
            :key="imgUrl"
            :src="imgUrl"
            alt=""
          />
        </div>

        <button>Add gig</button>
      </form>
    </main>
  </section>
</template>

<script>
import { eventBusService } from "../services/event-bus.service.js";
import { uploadImg } from "@/services/img-upload.service.js";
export default {
  computed: {
    imgList() {
      return this.gigToAdd.imgUrls;
    },

   loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
  },

  data() {
    return {
      sellerDetails: {
        specialty: null,
        sellerInfo: "",
        location: "",
      },
      isHidden: true,
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
      isLoading: false,
      isDragOver: false,
      options: [
        {
          value: "Graphic design",
          label: "Graphic design",
        },
        {
          value: "Web development",
          label: "Web development",
        },
        {
          value: "Voice acting",
          label: "Voice acting",
        },
        {
          value: "Podcast expertise",
          label: "Podcast expertise",
        },
        {
          value: "Logo",
          label: "Logo",
        },
        {
          value: "Cooking",
          label: "Cooking",
        },
        {
          value: "Business plan",
          label: "Business plan",
        },
      ],
    };
  },
  created() {
    eventBusService.$on("open-create", this.toggleCreate);
  },
  destroyed() {
    eventBusService.$off("open-create", this.toggleCreate);
  },


  methods: {
    async addGig() {
      try {
        //making gig ready for save
        console.log("add gig start");
        const userToEdit= JSON.parse(JSON.stringify(this.$store.getters.loggedinUser))
        console.log(userToEdit);
        this.gigToAdd.seller._id = userToEdit._id;
        this.gigToAdd.seller.fullname = userToEdit.fullname;
        this.gigToAdd.seller.imgUrl = userToEdit.imgUrl;

        this.gigToAdd.reviews = [];
        //linking user to gig

        if (!this.gigToAdd.imgUrls || this.gigToAdd.imgUrls.length === 0)
          this.gigToAdd.imgUrls = [
            "https://res.cloudinary.com/cookiecloud/image/upload/v1626858802/hxsjfiiaireuyulffzhy.jpg",
          ];
        this.gigToAdd = await this.$store.dispatch({
          type: "addGig",
          gig: this.gigToAdd,
        });

        const miniGig = {};
        console.log("creating minigig");
        miniGig._id = this.gigToAdd._id;
        miniGig.title = this.gigToAdd.title;
        miniGig.imgUrls = this.gigToAdd.imgUrls;

        const userToUpdate = userToEdit;
        console.log(userToUpdate)
        userToUpdate.seller.gigs.push(miniGig);

        this.gigToAdd = {
          title: "",
          description: "",
          price: null,
          tags: [],
          deliveryDays: null,
          seller: {},
          packages: ["", "", ""],
        };
        this.$store.dispatch({ type: "updateUser", user: userToUpdate });
        this.toggleCreate();
      } catch (err) {
        console.log("error!", err);
        throw err;
      }
    },

    toggleCreate() {
      if (this.isHidden) this.$refs.addGig.classList.remove("hidden");
      else this.$refs.addGig.classList.add("hidden");
      this.isHidden = !this.isHidden;
    },
    clickOutsideModal(event) {
      if (event.target.classList.value === "add-gig") this.toggleCreate();
    },
    handleFileGig(ev) {
      console.log("adding gig photo");
      let file;
      if (ev.type === "change") file = ev.target.files[0];
      else if (ev.type === "drop") file = ev.dataTransfer.files[0];
      this.onUploadImg(file);
    },

    async onUploadImg(file) {
      this.isLoading = true;
      this.isDragOver = false;
      const res = await uploadImg(file);
      this.isLoading = false;
      this.gigToAdd.imgUrls.push(res.url);
      console.log(this.gigToAdd);
    },
  },
};
</script>

<style>
</style>