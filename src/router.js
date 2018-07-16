import Vue from 'vue'
import Router from 'vue-router'
import Smoothies from './views/smoothies/Index.vue'
import SmoothieNew from './views/smoothies/New.vue'
import SmoothieEdit from './views/smoothies/Edit.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/Smoothies',  name: 'Smoothies',  component: Smoothies },
    { path: '/SmoothieNew',  name: 'SmoothieNew',  component: SmoothieNew },
    { path: '/SmoothieEdit/:id',  name: 'SmoothieEdit',  component: SmoothieEdit, props: true }
  ],
  mode:'history'
})
