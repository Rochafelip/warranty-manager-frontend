<template>
  <div class="register-container">
    <h1>Criar Conta</h1>
    <form @submit.prevent="handleRegister">
      <input
        type="text"
        v-model="name"
        placeholder="Digite seu nome"
        required
      />
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
      <input
        type="password"
        v-model="confirm_password"
        placeholder="Confirme sua senha"
        required
      />
      <button type="submit">Cadastrar</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirm_password: '', // Novo campo para confirmação de senha
      errorMessage: null, // Para exibir mensagens de erro
    };
  },
  methods: {
    async handleRegister() {
      // Verificar se as senhas coincidem antes de enviar a requisição
      if (this.password !== this.confirm_password) {
        this.errorMessage = 'As senhas não coincidem.';
        return;
      }

      try {
        // Enviar a requisição POST para a API para criar o usuário
        const response = await axios.post('http://localhost:4000/auth', {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        // Redireciona para o login se o cadastro for bem-sucedido
        this.$router.push('/login');
      } catch (error) {
        // Lidar com erros na requisição
        if (error.response && error.response.data) {
          // Exibir a mensagem de erro retornada pela API
          this.errorMessage = error.response.data.error || 'Erro ao criar conta.';
        } else {
          this.errorMessage = 'Erro de conexão. Tente novamente.';
        }
      }
    },
  },
};
</script>

<style scoped>
/* Estilo para a tela de registro */
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f9f9f9;
  text-align: center;
}
.register-container input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
}
.register-container button {
  padding: 10px 20px;
  background: #ff6600; /* Cor laranja */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
