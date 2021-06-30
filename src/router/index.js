import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Collection from '../views/Collection.vue'
import Volume from '../views/Volume.vue'
import Read from '../views/Read.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true
  },
  {
    path: '/content/:library',
    name: 'Collection',
    component: Collection,
    props: true
  },
  {
    path: '/content/:library/:collection',
    name: 'Volume',
    component: Volume,
    props: true
  },
  {
    path: '/content/:library/:collection/:volume',
    name: 'Read',
    component: Read,
    props: true
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
