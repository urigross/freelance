import { reviewService } from '../services/review.service.js'
import { socketService, SOCKET_EVENT_REVIEW_ADDED, SOCKET_EVENT_REVIEW_ABOUT_YOU } from '../services/socket.service'

export const reviewStore = {
    state: {
        reviews: []
    },
    getters: {
        reviews(state) { return state.reviews },
    },
    mutations: {
        setReviews(state, { reviews }) {
            state.reviews = reviews;
        },
        addReview(state, { review }) {
            state.reviews.push(review)
        },
        removeReview(state, { reviewId }) {
            state.reviews = state.reviews.filter(review => review._id !== reviewId)
        },
    },
    actions: {
        async addReview(context, { review }) {
            try {
                review = await reviewService.add(review)
                context.commit({ type: 'addReview', review })
                // context.dispatch({type: 'increaseScore'})

                return review;
            } catch (err) {
                console.log('reviewStore: Error in addReview', err)
                throw err
            }
        },
        async loadReviews(context) {
            try {
                const reviews = await reviewService.query();
                context.commit({ type: 'setReviews', reviews })
                socketService.off(SOCKET_EVENT_REVIEW_ADDED)
                socketService.on(SOCKET_EVENT_REVIEW_ADDED, review => {
                    console.log('Got review from socket', review);
                    context.commit({ type: 'addReview', review })
                })
                socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU)
                socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, review => {
                    console.log('Review about me!', review);

                })

            } catch (err) {
                console.log('reviewStore: Error in loadReviews', err)
                throw err
            }
        },
        async removeReview(context, { reviewId }) {
            try {
                await reviewService.remove(reviewId);
                context.commit({ type: 'removeReview', reviewId })
            } catch (err) {
                console.log('reviewStore: Error in removeReview', err)
                throw err
            }
        },

    }
}