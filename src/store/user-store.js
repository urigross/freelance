import { userService } from '../services/user.service.js'
import { socketService, SOCKET_EMIT_USER_WATCH, SOCKET_EVENT_USER_UPDATED } from '../services/socket.service'

// var localLoggedinUser = null;
// if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user || null);

export const userStore = {
    state: {
        loggedinUser: userService.getLoggedinUser(),
        users: [],
        watchedUser: null
    },
    getters: {
        users({ users }) { return users },
        loggedinUser({ loggedinUser }) { return loggedinUser },
        watchedUser({ watchedUser }) { return watchedUser },
        heroUsersToShow(state) {
            var imageList = state.users.map(user => user.profileImg);
            var imageList = state.users;

            return imageList
        },
    },
    mutations: {
        setLoggedinUser(state, { user }) {

            state.loggedinUser = (user) ? { ...user } : null;
        },
        setWatchedUser(state, { user }) {
            state.watchedUser = user;
        },
        setUsers(state, { users }) {
            state.users = users;
        },
        removeUser(state, { userId }) {
            state.users = state.users.filter(user => user._id !== userId)
        },
        setUserScore(state, { score }) {
            state.loggedinUser.score = score
        },
    },
    actions: {
        async login({ commit }, { userCred }) {
            try {

                const user = await userService.login(userCred);
                // socketService.emit("user-topic", loggedInUser._id);
                commit({ type: 'setLoggedinUser', user })
                return user;
            } catch (err) {
                throw err
            }
        },
        async signup({ commit }, { userCred }) {
            try {

                const user = await userService.signup(userCred)
                commit({ type: 'setLoggedinUser', user })
                return user;
            } catch (err) {
                console.log('userStore: Error in signup', err)
                throw err
            }

        },
        async logout({ commit }) {
            try {
                await userService.logout()
                commit({ type: 'setLoggedinUser', user: null })
            } catch (err) {
                console.log('userStore: Error in logout', err)
                throw err
            }
        },



        async loadAndWatchUser({ commit }, { userId }) {
            try {
                const user = await userService.getById(userId);
                commit({ type: 'setWatchedUser', user })
                socketService.emit(SOCKET_EMIT_USER_WATCH, userId)
                socketService.off(SOCKET_EVENT_USER_UPDATED)
                socketService.on(SOCKET_EVENT_USER_UPDATED, user => {
                    commit({ type: 'setWatchedUser', user })
                })
            } catch (err) {
                console.log('userStore: Error in loadAndWatchUser', err)
                throw err
            }
        },
        async removeUser({ commit }, { userId }) {
            try {
                await userService.remove(userId);
                commit({ type: 'removeUser', userId })
            } catch (err) {
                console.log('userStore: Error in removeUser', err)
                throw err
            }
        },
        async updateUser({ commit }, { user }) {
            try {
                user = await userService.update(user);
                console.log('user updated')
                console.log(user.seller.gigs)
             
            
                commit({ type: 'setLoggedinUser', user })
            } catch (err) {
                console.log('userStore: Error in updateUser', err)
                throw err
            }

        },
        async addOrder({ commit }, { user }) {
            
            try {
                
                user = await userService.update(user);
                // socketService.on(SOCKET_EVENT_USER_UPDATED, user)
                // socketService.off(SOCKET_EVENT_USER_UPDATED)
                // socketService.on(SOCKET_EVENT_USER_UPDATED, user => {
                //     commit({type:'setLoggedinUser',user})
                // })
                // socketService.on(SOCKET_EVENT_USER_UPDATED, user => {
                //     commit({ type: 'setWatchedUser', user })
                // })
                // socketService.on()
                socketService.emit('user-updated',user)
            } catch (err) {
                console.log('userStore: Error in updateUser', err)
                throw err
            }

        },
        async becomeSeller({ commit }, { userToUpdate }) {
            try {
                let user = await userService.update(userToUpdate);
                console.log(user)
                commit({ type: 'setLoggedinUser', user })

            } catch (err) {
                console.log('userStore: Error in updateUser', err)
                throw err
            }
        }

    }
}