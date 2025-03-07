import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import RegisterView from '@/views/RegisterView.vue';
import LoginView from '@/views/LoginView.vue';
import ConfirmEmailView from '@/views/ConfirmEmailView.vue';
import QuestionsView from '@/views/QuestionsView.vue';
import QuestionDetailView from "@/views/QuestionDetailView.vue";
import CreateQuestionView from "@/views/CreateQuestionView.vue";
import EditQuestionView from "@/views/EditQuestionView.vue";


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
  },
  {
    path: '/questions',
    name: 'questions',
    component: QuestionsView
  },
  {
    path: '/question/:id',
    name: 'question-detail',
    component: QuestionDetailView
  },
  {
    path: '/question/:id',
    name: 'question-detail',
    component: QuestionDetailView
  },
  {
    path:"/create-question",
    name: 'create-question',
    component: CreateQuestionView
  },
  {
    path:"/edit-question/:id",
    name: 'edit-question',
    component: EditQuestionView
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

