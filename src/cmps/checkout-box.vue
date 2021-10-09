<template>
    <aside class="checkout-box">
        <h4>Summary</h4>
        <div class="cb-seller-price">
            <span>subtutal</span> <span>${{ gig.price }}</span>
        </div>
        <div class="cb-service-fee">
            <span>Service fee</span><span>$9.90</span>
        </div>
        <div class="cb-total-price">
            <span>Total</span><span>{{ totalPrice }}</span>
        </div>
        <div class="cb-delivery-time">
            <span>Delivery Time</span
            ><span>{{ gig.deliveryDays }} {{ deliveryDays }}</span>
        </div>
        <router-link :to="'/checkout/' + gig._id">
            <button @click="checkout">Continue to Checkout</button>
        </router-link>
        <p class="small">You won't be charged yet</p>
    </aside>
</template>

<script>
import { userService } from "../services/user.service";
import { eventBusService } from "../services/event-bus.service";
import { socketService } from "../services/socket.service";
export default {
    props: ["gig"],
    computed: {
        totalPrice() {
            return this.gig.price + 9.9;
        },
        deliveryDays() {
            const days = this.gig.deliveryDays > 1 ? "Days" : "Day";
            return days;
        },
        loggedinUser() {
            return this.$store.getters.loggedinUser;
        },
    },
    methods: {
        async checkout() {
            if (!this.loggedinUser) {
                this.openWarning();
                return;
            }
            const orderToAdd = {
                id: this.makeId(),
                buyer: this.$store.getters.loggedinUser.fullname,
                price: this.gig.price,
                createdAt: new Date(),
                gig: {
                    _id: this.gig._id,
                    price: this.gig.price,
                    name: this.gig.title,
                    deliveryTime: this.gig.deliveryTime,
                },
                status: "pending",
            };
            const gigSeller = await userService.getById(this.gig.seller._id);
            try {
                gigSeller.seller.orders.push(orderToAdd);
                await this.$store.dispatch({
                    type: "addOrder",
                    user: gigSeller,
                });
                this.openMessage();
            } catch (err) {
                console.log("in catch");

                throw err;
            }
        },

        openMessage() {
            this.$message({
                message: "Transaction complete!",
                type: "success",
                offset: 123,
            });
        },
        openWarning() {
            this.$message({
                message: "You need to be logged in order to buy a gig!",
                type: "warning",
                offset: 123,
            });
        },
        makeId(length = 7) {
            var txt = "";
            var possible =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < length; i++) {
                txt += possible.charAt(
                    Math.floor(Math.random() * possible.length)
                );
            }
            return txt;
        },
    },
};
</script>
