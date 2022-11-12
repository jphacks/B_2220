import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RoomList from '../views/RoomList.vue'
import Login from '../views/Login.vue'
import SingUp from '../views/SignUp.vue'
import Call from '../views/Call.vue'
import First from '../views/First.vue'
import Map from '../views/Map.vue'
import firebase from "@/firebase/firebase"

Vue.use(VueRouter)

const routes = [
    {
        path: '/setting',
        name: 'RoomList',
        component: RoomList,
        meta: { requiresAuth: true },
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SingUp
    },
    {
        path: '/call',
        name: 'Call',
        component: Call,
        meta: { requiresAuth: true },
    },
    {
        path: '/',
        name: 'First',
        component: First
    },
    {
        path: '/map',
        name: 'Map',
        component: Map
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior() {
        return { x: 0, y: 0 }
    }
})

const audio = new Audio('call01.mp3');
audio.play();

const audio2 = new Audio('call02.wav');
audio2.play();

const audio3 = new Audio('call03.wav');
audio3.play();

const audio4 = new Audio('call04.wav');
audio4.play();

const audio5 = new Audio('call05.wav');
audio5.play();

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth) {
        const user = sessionStorage.getItem('user')
        console.log(JSON.parse(user))
        if (!user) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }

        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                next({
                    path: '/login',
                    query: { redirect: to.fullPath }
                })
            } else {
                next()
            }

        })


    } else {
        next() // next() を常に呼び出すようにしてください!
    }
})


export default router
