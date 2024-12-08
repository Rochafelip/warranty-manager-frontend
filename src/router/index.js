import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'; // Importe o componente de Login
import Dashboard from '../views/Dashboard.vue'; // Importe o componente de Dashboard
import Register from '../views/Register.vue'; // Importe o componente de Register
import AddWarranty from '../views/AddWarranty.vue';


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
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const token = sessionStorage.getItem('token');
      if (token) {
        next();  // Se houver um token, permitir acesso
      } else {
        next('/login');  // Caso contrário, redirecionar para o login
      }
    },
  },
  {
    path: '/register', // Definindo a rota de criação de usuário
    name: 'register',
    component: Register, // Este é o seu componente de registro
  },
  {
    path: '/add-invoice',
    name: 'CreateInvoice', // Nome da rota atualizado
    component: AddWarranty, // Componente atualizado para o correto
  },
];

const router = createRouter({
  history: createWebHistory(), // Usa o histórico da web
  routes, // Define as rotas
});

export default router;
