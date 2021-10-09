import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { socketService, SOCKET_EVENT_USER_UPDATED } from './socket.service.js'


const USER_KEY = 'userDB';
const defaultUsers = require('../../data/user.json')


const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
var gWatchedUser = null;





export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
}

window.userService = userService
// Note: due to async, must run one by one...
// userService.signup({ fullname: 'Puki Norma', username: 'user1', password: '123', score: 100, isAdmin: false })
// userService.signup({ fullname: 'Master Adminov', username: 'admin', password: '123', score: 100, isAdmin: true })
// userService.signup({ fullname: 'Muki G', username: 'muki', password: '123', score: 100 })

function getUsers() {
    return httpService.get(`user`)
    // return storageService.query('user')
    // return storageService.query(USER_KEY)
    //     .then(users => {
    //         if (!users.length) {
    //             storageService.postMany(USER_KEY, defaultUsers)
    //             return defaultUsers
    //         }
    //         return users;
    //     })
}

async function getById(userId) {
    // const user = await storageService.get(USER_KEY, userId)
    const user = await httpService.get(`user/${userId}`)
    // gWatchedUser = user;
    return user;
}

function remove(userId) {
    // return storageService.remove(USER_KEY, userId)
    return httpService.delete(`user/${userId}`)
}

async function update(user) {
    // await storageService.put(USER_KEY, user)
    user = await httpService.put(`user/${user._id}`, user)
    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) _saveLocalUser(user)
    return user;
}

async function login(userCred) {
    // const users = await storageService.query(USER_KEY)
    // try {
    //     console.log(users)
    //     const user = users.find(user => { return (user.password === userCred.password && user.username === userCred.username) })
    //     if (user) {
    //         return _saveLocalUser(user)
    //     } else throw 'wrong creds'
    // } catch (err) {
    //     throw err
    // }
    try {
        console.log('in login')

        const user = await httpService.post('auth/login', userCred)
        if (user) {
            const savedUser = _saveLocalUser(user)
            console.log(savedUser._id)
            socketService.emit('set-user-socket', savedUser._id)

            console.log('emmitted to socket')
            return savedUser
        }
    }
    catch (err) {
        throw err
    } // socketService.emit('login', user._id);

}
async function signup(userCred) {
    console.log(userCred)
    userCred.fullname = userCred.username;
    userCred.imgUrl = "https://res.cloudinary.com/cookiecloud/image/upload/v1626702838/defaultUser.png"
    userCred.createdAt = Date.now();
    // const user = await storageService.post(USER_KEY, userCred)
    const user = await httpService.post('auth/signup', userCred)
    socketService.emit('set-user-socket', user._id);
    return _saveLocalUser(user)
}
async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    socketService.emit('unset-user-socket');
    return await httpService.post('auth/logout')
}


function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
}

// This IIFE functions for Dev purposes 
// It allows testing of real time updates (such as sockets) by listening to storage events
(async () => {
    var user = getLoggedinUser()
    // Dev Helper: Listens to when localStorage changes in OTHER browser

    // Here we are listening to changes for the watched user (comming from other browsers)
    window.addEventListener('storage', async () => {
        if (!gWatchedUser) return;
        const freshUsers = await storageService.query('user')
        const watchedUser = freshUsers.find(u => u._id === gWatchedUser._id)
        if (!watchedUser) return;
        if (gWatchedUser.score !== watchedUser.score) {
            console.log('Watched user score changed - localStorage updated from another browser')
            socketService.emit(SOCKET_EVENT_USER_UPDATED, watchedUser)
        }
        gWatchedUser = watchedUser
    })
})();

// This is relevant when backend is connected
(async () => {
    var user = getLoggedinUser()
    if (user) {
        console.log('user is in!')
        socketService.emit('set-user-socket', user._id)
    }
})();

function _saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}