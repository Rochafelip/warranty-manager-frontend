<template>
  <div class="add-products-container">
    <h1>Adicionar Produtos</h1>

    <!-- Formulário para adicionar produtos -->
    <form @submit.prevent="addProduct">
      <div>
        <label>Nome do Produto:</label>
        <input type="text" v-model="product.name" required />
      </div>
      <div>
        <label>Descrição:</label>
        <input type="text" v-model="product.description" required />
      </div>
      <div>
        <label>Categoria:</label>
        <input type="number" v-model="product.category" required />
      </div>
      <div>
        <label>Preço:</label>
        <input type="number" v-model="product.price" required />
      </div>
      <div>
        <label>Serial Number:</label>
        <input type="text" v-model="product.serial_number" required />
      </div>
      <div>
        <label>Data de Expiração da Garantia:</label>
        <input type="date" v-model="product.warranty_expiry_date" required />
      </div>
      <div>
        <label>ID da Loja:</label>
        <input type="number" v-model="product.store_id" required />
      </div>
      <button type="submit">Adicionar Produto</button>
    </form>

    <ul>
      <li v-for="(p, index) in productList" :key="index">
        {{ p.name }} - {{ p.quantity }} - {{ p.price }}
      </li>
    </ul>

    <button @click="goToStore">Associar Loja</button>
  </div>
</template>

  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      product: {
        name: '',
        description: '',
        category: '',
        price: '',
        serial_number: '',
        warranty_expiry_date: '',
        store_id: '',
      },
      productList: [],
    };
  },
  props: ['invoiceId'], // Recebe o ID da invoice via rota
  methods: {
    async addProduct() {
      try {
        const authorizationHeader = sessionStorage.getItem('Authorization');
        const productData = { ...this.product, invoice_id: this.invoiceId };

        const response = await axios.post('http://localhost:4000/products', { product: productData }, {
          headers: {
            'Authorization': authorizationHeader,
            'Content-Type': 'application/json', // Para garantir que o corpo da requisição seja JSON
          },
        });

        this.productList.push(response.data);
        this.product = { name: '', description: '', category: '', price: '', serial_number: '', warranty_expiry_date: '', store_id: '' };
        alert('Produto adicionado com sucesso!');
      } catch (error) {
        alert('Erro ao adicionar o produto.');
      }
    },
    goToStore() {
      this.$router.push(`/add-store/${this.invoiceId}`);
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
  