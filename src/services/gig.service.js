import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
const defaultGigs = require('../../data/gig.json')

const GIG_KEY = "gigsDB"
export const gigService = {
    query,
    getById,
    remove,
    save,
    getEmptyReview,
    addReview
}
async function query(filterBy) {
    const gigs = await httpService.get('gig', filterBy)
    try {
        return gigs
    } catch (err) {
        console.log(gigs)
        throw err
    }

    // return storageService.query(GIG_KEY, filterBy)
    //     .then(gigs => {
    //         if (!gigs.length) {
    //             storageService.postMany(GIG_KEY, defaultGigs)
    //             return defaultGigs
    //         }
    //         return gigs;
    //     })
}
function getById(gigId) {
    return httpService.get(`gig/${gigId}`)
        // return storageService.get(GIG_KEY, gigId)
        //     .then(gig => {
        //         return gig
        //     })
}
function remove(gigId) {
    return httpService.delete(`gig/${gigId}`)
    // return storageService.remove(GIG_KEY, gigId)
    //     .then(gigs => { console.log(gigs) })
}
function save(gig) {
    if (gig._id) {
        //     return storageService.put(GIG_KEY, gig)
        //         .then(gig => { return gig })
        return httpService.put(`gig`, gig)
    } else {

        // return storageService.post(GIG_KEY, gig)
        //     .then(gig => { return gig })
        return httpService.post(`gig`, gig)
    }
}
function addReview(gigId, review) {

    getById(gigId).then((gig) => {
        gig.reviews.push(review)
    })
    return gig
}
function getEmptyReview() {
    return {
        id: utilService.makeId(),
        txt: '',
        at: Date.now(),
        rate: null,
        by: {
            fullname: '',
        }
    }
}