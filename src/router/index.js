import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
// import UserList from '../views/UserList.vue'
import RoomList from '../views/RoomList.vue'
import ChatBoard from '../views/ChatBoard.vue'
import Login from '../views/Login.vue'
import SingUp from '../views/SignUp.vue'
import Call from '../views/Call.vue'
// import firebase from "@/firebase/firebase"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'RoomList',
        component: RoomList,
        // meta: {requiresAuth: false}
        meta: { title: 'あんしん夜道', desc: '「あんしん夜道」は、”不安な夜道に、少しの安心を”をコンセプトとした、暗く危ない夜道で電話をしているフリができるアプリケーションである。名前・電話番号・位置情報を入力し、発信ボタンを押すと自動的に成人男性に近い声色の自動音声が流れてきて、いかにも第三者と会話をしているように演出することができる。' }
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/chat',
        name: 'ChatBoard',
        component: ChatBoard
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
        meta: { title: '着信', desc: 'フェイクの着信画面' }
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

const audio = new Audio('call01.mp3');
audio.play();

const audio2 = new Audio('call02.wav');
audio2.play();

const audio3 = new Audio('call03.wav');
audio3.play();

// router.beforeEach((to, from, next) => {
//     const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
//     if (requiresAuth) {
//         const user = sessionStorage.getItem('user')
//         console.log(JSON.parse(user))
//         if (!user) {
//             next({
//                 path: '/login',
//                 query: {redirect: to.fullPath}
//             })
//         } else {
//             next()
//         }
//
//         // firebase.auth().onAuthStateChanged((user) => {
//         //     if (!user) {
//         //         next({
//         //             path: '/login',
//         //             query: {redirect: to.fullPath}
//         //         })
//         //     } else {
//         //         next()
//         //     }
//         //
//         // })
//
//
//     } else {
//         next() // next() を常に呼び出すようにしてください!
//     }
// })


export default router
