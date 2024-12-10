import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'; // Importe o componente de Login
import Dashboard from '../views/Dashboard.vue'; // Importe o componente de Dashboard
import Register from '../views/Register.vue'; // Importe o componente de Register
import CreateInvoice from '../views/CreateInvoice.vue'; // Página para criar nota fiscal

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register', // Rota para a tela de registro
    name: 'Register',
    component: Register,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }, // Requer autenticação
  },
  {
    path: '/create-invoice',
    name: 'CreateInvoice',
    component: CreateInvoice,
    meta: { requiresAuth: true }, // Proteger rota por autenticação
  },
];

const router = createRouter({
  history: createWebHistory(), // Usa o histórico da web
  routes, // Define as rotas
});



router.beforeEach((to, from, next) => {
  const isLoggedIn = sessionStorage.getItem('access-token'); // Verifica se o token está salvo

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login'); // Redireciona para login se não autenticado
  } else if ((to.name === 'Login' || to.name === 'Register') && isLoggedIn) {
    next('/dashboard'); // Impede acesso ao login se já logado
  } else {
    next(); // Permite a navegação
  }
});

export default router;
