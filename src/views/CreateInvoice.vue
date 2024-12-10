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

    <div v-if="invoiceId">
      <h2>Adicionar Produtos</h2>
      
      <!-- Formulário para adicionar produtos -->
      <form @submit.prevent="addProduct">
        <div>
          <label>Nome do Produto:</label>
          <input type="text" v-model="product.name" required />
        </div>
        <div>
          <label>Quantidade:</label>
          <input type="number" v-model="product.quantity" required />
        </div>
        <div>
          <label>Preço:</label>
          <input type="number" v-model="product.price" required />
        </div>
        <button type="submit">Adicionar Produto</button>
      </form>

      <ul>
        <li v-for="(p, index) in productList" :key="index">
          {{ p.name }} - {{ p.quantity }} - {{ p.price }}
        </li>
      </ul>
    </div>

    <div v-if="invoiceId">
      <h2>Associar Loja</h2>
      
      <!-- Formulário para associar uma loja -->
      <form @submit.prevent="addStore">
        <div>
          <label>Nome da Loja:</label>
          <input type="text" v-model="store.name" required />
        </div>
        <div>
          <label>Endereço:</label>
          <input type="text" v-model="store.address" required />
        </div>
        <button type="submit">Adicionar Loja</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Importa o axios aqui

export default {
  data() {
    return {
      invoice: {
        invoice_number: '',
        purchase_date: '',
        issue_date: '',
        pdf_url: null, // Para armazenar o arquivo PDF
      },
      invoiceId: null, // ID da nota fiscal criada
      product: {
        name: '',
        quantity: '',
        price: '',
      },
      productList: [], // Lista de produtos adicionados
      store: {
        name: '',
        address: '',
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
        const token = sessionStorage.getItem('access-token');  // Supondo que o token está no sessionStorage

        if (!token) {
          alert('Token de autenticação não encontrado');
          return;
        }

        // Cria um objeto FormData para enviar o arquivo e os dados
        const formData = new FormData();
        formData.append('invoice[invoice_number]', this.invoice.invoice_number);
        formData.append('invoice[issue_date]', this.invoice.issue_date);
        formData.append('invoice[purchase_date]', this.invoice.purchase_date);
        formData.append('invoice[pdf]', this.invoice.pdf_url); // PDF

        // Envia a requisição para criar a invoice com o token no cabeçalho
        const response = await axios.post('http://localhost:4000/invoices', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,  // Token de autenticação
          },
        });

        this.invoiceId = response.data.id; // ID retornado pela API
        alert('Nota fiscal criada com sucesso!');
      } catch (error) {
        console.error('Erro ao criar a nota fiscal:', error);
        alert('Erro ao criar a nota fiscal.');
      }
    },
    async addProduct() {
      try {
        const productData = { ...this.product, invoice_id: this.invoiceId };
        const response = await axios.post('http://localhost:4000/products', productData, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access-token')}`, // Envia o token de autenticação
          },
        });
        this.productList.push(response.data); // Adiciona o produto à lista local
        this.product = { name: '', quantity: '', price: '' }; // Limpa o formulário
        alert('Produto adicionado com sucesso!');
      } catch (error) {
        alert('Erro ao adicionar o produto.');
      }
    },
    async addStore() {
      try {
        const storeData = { ...this.store, invoice_id: this.invoiceId };
        await axios.post('http://localhost:4000/stores', storeData, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access-token')}`, // Envia o token de autenticação
          },
        });
        alert('Loja associada com sucesso!');
      } catch (error) {
        alert('Erro ao associar a loja.');
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
