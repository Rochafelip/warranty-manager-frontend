<template>
  <div class="create-invoice-container">
    <h1>Criar Nota Fiscal</h1>

    <!-- Formulário para criar a nota fiscal -->
    <form @submit.prevent="createInvoice">
      <div class="form-group">
        <label>Número da Nota Fiscal:</label>
        <input
          type="text"
          v-model="invoice.invoice_number"
          placeholder="Digite o número da nota fiscal"
          required
        />
      </div>
      <div class="form-group">
        <label>Data de Compra:</label>
        <input type="date" v-model="invoice.purchase_date" required />
      </div>
      <div class="form-group">
        <label>Data de Emissão:</label>
        <input type="date" v-model="invoice.issue_date" required />
      </div>
      <div class="form-group">
        <label>Carregar Nota Fiscal (PDF):</label>
        <input
          type="file"
          @change="handleFileUpload"
          accept=".pdf"
          required
        />
      </div>
      <button type="submit" class="btn-primary">Criar Nota Fiscal</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      invoice: {
        invoice_number: '',
        purchase_date: '',
        issue_date: '',
        pdf_url: null, // Para armazenar o arquivo PDF
      },
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.invoice.pdf_url = file;
    },
    async createInvoice() {
      try {
        const authorizationHeader = sessionStorage.getItem('Authorization');

        if (!authorizationHeader) {
          alert('Token de autenticação não encontrado');
          return;
        }

        // Cria o objeto FormData
        const formData = new FormData();
        formData.append('invoice[invoice_number]', this.invoice.invoice_number);
        formData.append('invoice[issue_date]', this.invoice.issue_date);
        formData.append('invoice[purchase_date]', this.invoice.purchase_date);
        formData.append('invoice[pdf]', this.invoice.pdf_url);

        const response = await axios.post('http://localhost:4000/invoices', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': authorizationHeader,
          },
        });

        const invoiceId = response.data.id; // Captura o ID da Invoice
      
        this.$router.push(`/add-products/${invoiceId}`); // Redireciona para a tela de adicionar produtos
      } catch (error) {
        console.error('Erro ao criar a nota fiscal:', error);
        alert('Erro ao criar a nota fiscal.');
      }
    },
  },
};
</script>


<style scoped>
/* Fonte personalizada */
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

/* Paleta de cores */
:root {
  --orange: #ff6a00;
  --orange-dark: #e65c00;
  --gray-light: #f5f5f5;
  --gray-dark: #333;
  --white: #fff;
}

/* Aplicação da fonte */
body {
  font-family: "Roboto", sans-serif;
  background-color: var(--gray-light);
}

/* Container principal */
.create-invoice-container {
  max-width: 960px;
  margin: 60px auto;
  padding: 40px;
  background-color: var(--white);
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Título */
h1 {
  text-align: center;
  color: var(--orange);
  font-size: 2rem;
  margin-bottom: 30px;
}

/* Estilização do formulário */
form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Grupos de formulário */
.form-group {
  display: flex;
  flex-direction: column;
}

/* Rótulos */
label {
  font-weight: 500;
  font-size: 1.1rem;
  color: var(--orange);
  margin-bottom: 8px;
}

/* Campos de entrada */
input[type="text"],
input[type="date"],
input[type="file"] {
  padding: 14px;
  border: 1px solid var(--gray-dark);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--gray-light);
  color: var(--gray-dark);
  transition: border-color 0.3s, box-shadow 0.3s;
}

input::placeholder {
  color: #aaa;
  font-style: italic;
}

/* Campos focados */
input:focus {
  border-color: var(--orange);
  box-shadow: 0 0 8px rgba(255, 106, 0, 0.5);
}

/* Botão primário */
button.btn-primary {
  align-self: center;
  padding: 14px 24px;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: var(--orange);
  color: var(--white);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

/* Botão ao passar o mouse */
button.btn-primary:hover {
  background-color: var(--orange-dark);
  box-shadow: 0 6px 12px rgba(255, 106, 0, 0.4);
}
</style>
