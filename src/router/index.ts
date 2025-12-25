import { createWebHistory, createRouter } from 'vue-router';
import IndexPage from '../pages/IndexPage.vue';

const routes = [
  { path: '/', component: IndexPage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})