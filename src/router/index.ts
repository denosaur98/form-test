import { createWebHistory, createRouter } from 'vue-router';
import ContactPage from '../pages/ContactPage.vue';

const routes = [
  { path: '/', component: ContactPage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})