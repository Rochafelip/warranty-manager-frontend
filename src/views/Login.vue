<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="Digite seu email" required />
      <input type="password" v-model="password" placeholder="Digite sua senha" required />
      <button type="submit">Entrar</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <!-- Botão para navegar para a tela de criação de usuário -->
    <p>Não tem uma conta? <router-link to="/register"><button class="btn-register">Criar Conta</button></router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: null,
    };
  },
  methods: {
    async handleLogin() {
      try {        
        const response = await axios.post('http://localhost:4000/auth/sign_in', {
          email: this.email,
          password: this.password,
        });

        console.log(response.headers); // Verifique os headers
        console.log(response.data);    // Verifique os dados retornados

        // Obtém o header Authorization
        const authorizationHeader = response.headers['authorization'];

        // Obtém os dados de autenticação dos headers
        const userName = response.data.data.name
        const token = response.headers['access-token'];
        const client = response.headers['client'];
        const uid = response.headers['uid'];

        if (!authorizationHeader) {
          throw new Error('Header Authorization não encontrado.');
        }

        // Salva o header Authorization no sessionStorage
        sessionStorage.setItem('Authorization', authorizationHeader);
        sessionStorage.setItem('access-token', token);
        sessionStorage.setItem('client', client);
        sessionStorage.setItem('uid', uid);
        sessionStorage.setItem('user.name', userName); 

        this.$router.push('/dashboard');
      } catch (error) {
        // Trata erros de requisição e conexão
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.errors || 'Erro ao tentar fazer login.';
        }
        console.error('Erro ao realizar login:', error);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 50px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f9f9f9;
  text-align: center;
}

.login-container input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
}

.login-container button {
  padding: 10px 20px;
  background: #ff7f00;
  /* cor laranja */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.error {
  color: red;
}
</style>
