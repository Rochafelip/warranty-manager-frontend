<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input
        type="email"
        v-model="email"
        placeholder="Digite seu email"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Digite sua senha"
        required
      />
      <button type="submit">Entrar</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <!-- Botão para navegar para a tela de criação de usuário -->
    <p>Não tem uma conta? <router-link to="/register"><button class="btn-register">Criar Conta</button></router-link></p>
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
        // Envia os dados de login via POST para o endpoint do Devise Token Auth
        const response = await axios.post('http://localhost:4000/auth/sign_in', {
          email: this.email,
          password: this.password,
        });

        // Certifique-se de que a resposta tem os dados esperados
        const userName = response.data.data.name;  // Nome do usuário na resposta do Devise Token Auth
        const token = response.headers['access-token'];
        const client = response.headers['client'];
        const uid = response.headers['uid'];

        if (token && client && uid) {
          // Salva o token e os dados no sessionStorage
          sessionStorage.setItem('token', token);  // Salva o token no sessionStorage
          sessionStorage.setItem('user.name', userName);  // Salva o nome do usuário no sessionStorage
          sessionStorage.setItem('access-token', token);
          sessionStorage.setItem('client', client);
          sessionStorage.setItem('uid', uid);

          // Redireciona para o dashboard
          this.$router.push('/dashboard');
        } else {
          this.errorMessage = 'Erro ao tentar autenticar. Dados do token inválidos.';
        }
      } catch (error) {
        // Exibe a mensagem de erro, se houver
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.errors || 'Erro ao tentar fazer login.';
        } else {
          this.errorMessage = 'Erro de conexão. Tente novamente.';
        }
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
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
  background: #ff7f00; /* cor laranja */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.error {
  color: red;
}
</style>
