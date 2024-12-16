<template>
  <div class="create-invoice-container">
    <h1>Criar Nota Fiscal</h1>

    <!-- Formulário para criar a nota fiscal -->
    <form @submit.prevent="createInvoice">
      <div>
        <label>Número da Nota Fiscal:</label>
        <input type="text" v-model="invoice.invoice_number" required />
      </div>
      <div>
        <label>Data de Compra:</label>
        <input type="date" v-model="invoice.purchase_date" required />
      </div>
      <div>
        <label>Data de Emissão:</label>
        <input type="date" v-model="invoice.issue_date" required />
      </div>
      <div>
        <label>Carregar Nota Fiscal (PDF):</label>
        <input type="file" @change="handleFileUpload" accept=".pdf" required />
      </div>
      <button type="submit">Criar Nota Fiscal</button>
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
        alert('Nota fiscal criada com sucesso!');
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
.create-invoice-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f9f9f9;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
