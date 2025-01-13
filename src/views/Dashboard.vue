<template>
  <div class="app-container">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-user"><h1>Bem-vindo, {{ capitalizedUserName }}</h1></div>
        <ul class="navbar-links">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/invoices">Notas Fiscais</a></li>
          <li><a href="/profile">Perfil</a></li>
          <li><a href="/logout">Sair</a></li>
        </ul>        
      </div>
      <div>
          <h2>Minhas Notas Fiscais</h2>
      </div>
    </nav>

    <!-- Dashboard -->
    <div class="dashboard-container">      

      <!-- Botões principais -->
      <div class="actions">
        <button @click="addInvoice" class="btn-primary">Adicionar Nota Fiscal</button>
        <button @click="fetchInvoices" class="btn-secondary">Sincronizar Notas Fiscais</button>
      </div>

      <!-- Carregamento -->
      <p v-if="isLoading" class="loading">Carregando notas fiscais...</p>

      <!-- Tabela de Notas Fiscais -->
      <table v-if="invoices.length > 0 && !isLoading" class="invoice-table">
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
            <td>{{ invoice.invoice_number }}</td>
            <td>{{ invoice.issue_date }}</td>
            <td>
              <ul>
                <li v-for="product in invoice.products" :key="product.id">{{ product.name }}</li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="product in invoice.products" :key="product.id">{{ product.store.name }}</li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="product in invoice.products" :key="product.id">
                  R$ {{ product.price.toFixed(2) }}
                </li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="product in invoice.products" :key="product.id">
                  {{ checkWarrantyStatus(product.warranty_expiry_date) }}
                </li>
              </ul>
            </td>
            <td class="actions-cell">
              <button @click="viewDetails(invoice.id)" class="btn-icon">
                <i class="fas fa-eye"></i>
              </button>
              <!-- Botão de editar -->
              <button @click="editInvoice(invoice.id)" class="btn-icon edit">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteInvoice(invoice.id)" class="btn-icon delete">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mensagem caso não tenha notas fiscais -->
      <p v-else-if="!isLoading" class="no-data">Você não tem notas fiscais registradas.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userName: sessionStorage.getItem('user.name') || 'nome',
      invoices: [],
      products: [],
      isLoading: false,
    };
  },
  computed: {
    capitalizedUserName() {
      if (!this.userName) return '';
      return this.userName.charAt(0).toUpperCase() + this.userName.slice(1);
    },
  },
  methods: {
    // Função para verificar o status da garantia
    checkWarrantyStatus(expiryDate) {
      const today = new Date();
      const expiry = new Date(expiryDate);
      return expiry < today ? 'Expirada' : 'Válida';
    },

    // Função para carregar as invoices e seus produtos
    async fetchInvoices() {
      this.isLoading = true;
      try {
        console.log('Sincronizando notas fiscais...');
        const invoiceResponse = await axios.get('http://localhost:4000/invoices', {
          headers: {
            'Authorization': sessionStorage.getItem('Authorization'),
            'Content-Type': 'application/json',
          },
        });

        // Carrega as invoices
        const invoices = invoiceResponse.data;

        // Carregar os produtos do usuário
        const productResponse = await axios.get('http://localhost:4000/products', {
          headers: {
            'Authorization': sessionStorage.getItem('Authorization'),
            'Content-Type': 'application/json',
          },
        });

        // Filtra os produtos por invoice_id e associa a cada invoice
        invoices.forEach(invoice => {
          invoice.products = productResponse.data.filter(product => product.invoice_id === invoice.id);
        });

        this.invoices = invoices;
        console.log('Notas fiscais sincronizadas:', this.invoices);
      } catch (error) {
        console.error('Erro ao sincronizar notas fiscais:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // Ações para cada nota fiscal
    viewDetails(id) {
      this.$router.push({ name: 'InvoiceDetails', params: { id } });
    },
    editInvoice(id) {
      console.log(`Editar nota fiscal ${id}`);
      this.$router.push(`/invoices/edit/${id}`);
    },
    deleteInvoice(id) {
  // Exibir um alerta de confirmação
  if (confirm("Tem certeza que deseja excluir esta nota fiscal? Esta ação não pode ser desfeita!")) {
    // Enviar a requisição DELETE ao backend
    fetch(`http://localhost:4000/invoices/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('Authorization'), // Se necessário, incluir token de autenticação
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao excluir a nota fiscal.");
        }
        alert("Nota fiscal excluída com sucesso!");
        this.fetchInvoices(); // Atualiza a lista após deletar
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao excluir a nota fiscal. Tente novamente.");
      });
  } else {
    console.log("Exclusão cancelada pelo usuário.");
  }
},

    addInvoice() {
      this.$router.push('/create-invoice');
    },
    checkWarrantyStatus(expiryDate) {
      const today = new Date();
      return new Date(expiryDate) < today ? 'Expirada' : 'Válida';
    },
  },
  mounted() {
    this.fetchInvoices(); // Carrega as invoices automaticamente
  },
};
</script>

<style scoped>
/* Estilo para Botões de Ação */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: #ff6600;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-right: 5px;
  /* Adiciona espaço entre os botões */
}

.btn-icon.edit {
  background-color: #ffc107; /* Cor amarelo para editar */
  color: #fff;
}

.btn-icon.edit:hover {
  background-color: #e0a800; /* Tom mais escuro no hover */
}

.btn-icon.delete {
  background-color: #dc3545;
  margin-right: 0;
  /* Remove o margin-right no último botão */
}

.btn-icon:hover {
  background-color: #ff6600;
  transform: scale(1.05);
}

.btn-icon.delete:hover {
  background-color: #b21f2d;
  transform: scale(1.05);
}

/* Barra de Navegação */
.navbar {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
}

.navbar-user {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-right: auto;
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
  margin: 0;
  padding: 0;
}

.navbar-links li a {
  color: white;
  text-decoration: none;
  font-size: 16px;
}

.navbar-links li a:hover {
  text-decoration: underline;
}

/* Responsividade para a Navbar */
@media (max-width: 768px) {
  .navbar-links {
    flex-direction: column;
    gap: 10px;
  }

  .navbar-links li {
    text-align: center;
  }
}

/* Estilo do Container do Dashboard */
.dashboard-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Estilo para Botões do Dashboard */
button {
  padding: 10px 20px;
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  margin-right: 15px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #e65c00;
  transform: translateY(-2px);
}

/* Estilo da Tabela */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 15px;
  border: 1px solid #ddd;
  text-align: center;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

td ul {
  padding: 0;
  list-style-type: none;
}

.error {
  color: red;
  margin-top: 10px;
}

/* Responsividade para Tabela */
@media (max-width: 768px) {

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  th,
  td {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
  }

  th {
    background-color: #f4f4f4;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
  }

  td {
    border-bottom: 1px solid #ddd;
  }
}
</style>
