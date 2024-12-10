<template>
  <div>
    <!-- Barra de Navegação (Navbar) -->
    <nav class="navbar">
      <div class="navbar-content">
        <!-- Nome do usuário no lado esquerdo -->
        <div class="navbar-user">
          <span>Bem-vindo, {{ capitalizedUserName }}</span> <!-- Exibe o nome do usuário com a primeira letra maiúscula -->
        </div>

        <!-- Logo -->
        <a href="/" class="navbar-logo">Minha Aplicação</a>
        <!-- Links de navegação -->
        <ul class="navbar-links">
          <li><a href="/">Dashboard</a></li>
          <li><a href="/invoices">Notas Fiscais</a></li>
          <li><a href="/profile">Perfil</a></li>
          <li><a href="/logout">Sair</a></li>
        </ul>
      </div>
    </nav>

    <!-- Conteúdo do Dashboard -->
    <div class="dashboard-container">
      <h1>Minhas Notas Fiscais</h1>

      <!-- Botão para adicionar nova nota fiscal -->
      <button @click="addInvoice">Adicionar Nota Fiscal</button>

      <table v-if="invoices.length > 0">
        <thead>
          <tr>
            <th>Número</th>
            <th>Data</th>
            <th>Produto</th>
            <th>Loja</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td>{{ invoice.number }}</td>
            <td>{{ invoice.issue_date }}</td>
            <td>{{ invoice.product }}</td>
            <td>{{ invoice.store_name }}</td>
            <td>{{ invoice.total_value }}</td>
            <td>{{ invoice.warranty_status }}</td>
            <td>
              <button @click="viewDetails(invoice.id)">Ver Detalhes</button>
              <button @click="deleteInvoice(invoice.id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>Você não tem notas fiscais registradas.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: sessionStorage.getItem('user.name') || 'nome',  // Carrega o nome do usuário ou um valor padrão
      invoices: [
        // Dados das notas fiscais
      ],
    };
  },
  computed: {
    // Computed property para formatar o nome do usuário com a primeira letra maiúscula
    capitalizedUserName() {
      if (!this.userName) return '';
      return this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
    }
  },
  methods: {
    viewDetails(id) {
      // Ação para ver os detalhes da nota fiscal
      console.log(`Ver detalhes da nota fiscal ${id}`);
    },
    deleteInvoice(id) {
      // Ação para excluir a nota fiscal
      console.log(`Excluir a nota fiscal ${id}`);
    },
    addInvoice() {
      // Redireciona para a página de adicionar nota fiscal (aqui você pode ajustar a rota conforme necessário)
      this.$router.push('/create-invoice');
    }
  }
};
</script>

<style scoped>
/* Estilos para a Barra de Navegação */
.navbar {
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.navbar-user {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-right: auto; /* Alinha para a esquerda */
}

.navbar-logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.navbar-links {
  list-style-type: none;
  display: flex;
  gap: 20px;
}

.navbar-links li a {
  color: white;
  text-decoration: none;
  font-size: 16px;
}

.navbar-links li a:hover {
  text-decoration: underline;
}

/* Estilos para a Tabela de Notas Fiscais */
.dashboard-container {
  padding: 20px;
}

button {
  padding: 10px 20px;
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

button:hover {
  background-color: #e65c00;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
