import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Sorteador from '../views/Sorteador.vue';
import Cartela from '../views/Cartela.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/sorteador', component: Sorteador },
  { path: '/cartela', component: Cartela },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
