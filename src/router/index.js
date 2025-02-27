import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import RegisterView from '@/views/RegisterView.vue';
import LoginView from '@/views/LoginView.vue';
import ConfirmEmailView from '@/views/ConfirmEmailView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/confirm-email',
    name: 'confirm-email',
    component: ConfirmEmailView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

