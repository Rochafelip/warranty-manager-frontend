import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Certifique-se de que o Vue Router esteja importado

const app = createApp(App);

// Configura o roteador na aplicação Vue
app.use(router);

// Monta a aplicação no elemento #app
app.mount('#app');
