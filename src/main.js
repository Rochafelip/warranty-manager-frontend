import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Certifique-se de que o Vue Router esteja importado

const app = createApp(App);

// Verifica se o token existe para redirecionar para o dashboard, caso contrário, vai para o login
router.beforeEach((to, from, next) => {
  const isLoggedIn = sessionStorage.getItem('token'); // Verifica se o token está presente no sessionStorage

  // Se o usuário estiver logado, redireciona para o dashboard
  if (to.path === '/' && isLoggedIn) {
    next('/dashboard');
  } else if (to.path !== '/login' && !isLoggedIn) {
    // Caso não esteja logado e não esteja tentando acessar a página de login, redireciona para o login
    next('/login');
  } else {
    next();  // Permite a navegação
  }
});

app.use(router).mount('#app');
