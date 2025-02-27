<template>
    <div class="app-container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="navbar-content">
          <div>
            <h1>Editar Nota Fiscal</h1>
          </div>
          <ul class="navbar-links">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/invoices">Notas Fiscais</a></li>
            <li><a href="/profile">{{ capitalizedUserName }}</a></li>
            <li><a href="/logout">Sair</a></li>
          </ul>
        </div>
      </nav>
  
      <!-- Container principal -->
      <div class="dashboard-container">
        <h2>Detalhes da Nota Fiscal</h2>
        <div v-if="invoice" class="invoice-details">
          <!-- Informações básicas da Nota Fiscal -->
          <div class="info-section">
            <p><strong>Nota Fiscal:</strong> {{ invoice.invoice_number }}</p>
            <p><strong>Data de Compra:</strong> {{ formatDate(invoice.purchase_date) }}</p>
            <p><strong>Data de Emissão:</strong> {{ formatDate(invoice.issue_date) }}</p>
            <p>
              <strong>Visualizar Nota Fiscal:</strong>
              <a :href="invoice.pdf_url" target="_blank" rel="noopener noreferrer" class="link">
                Abrir PDF
              </a>
            </p>
          </div>
  
          <!-- Produtos associados à Nota Fiscal -->
          <h2>Produtos Comprados</h2>
          <ul class="products-list">
            <li v-for="product in products" :key="product.id" class="product-item">
              <div class="product-info">
                <strong>Nome:</strong> {{ product.name }}<br />
                <strong>Descrição:</strong> {{ product.description }}<br />
                <strong>Número de Série:</strong> {{ product.serial_number }}<br />
                <strong>Preço:</strong> R$ {{ formatPrice(product.price) }}<br />
                <strong>Garantia Válida até:</strong> {{ formatDate(product.warranty_expiry_date) }}<br />
              </div>
              <!-- Informações da loja associada -->
              <div class="store-info">
                <h4>Loja</h4>
                <strong>Nome:</strong> {{ product.store.name }}<br />
                <strong>Endereço:</strong> {{ product.store.address }}<br />
                <strong>Contato:</strong> {{ product.store.contact }}<br />
              </div>
            </li>
          </ul>
        </div>
        <button @click="$router.go(-1)" class="btn-icon">Voltar</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    props: ["id"], // Recebe o ID da invoice como parâmetro
    data() {
      return {
        invoice: null, // Dados da invoice
        products: [], // Produtos relacionados à invoice
      };
    },
    methods: {
      async fetchInvoiceDetails() {
        try {
          const invoiceResponse = await axios.get(
            `http://localhost:4000/invoices/${this.id}`,
            {
              headers: {
                Authorization: sessionStorage.getItem("Authorization"),
                "Content-Type": "application/json",
              },
            }
          );
          this.invoice = invoiceResponse.data;
  
          const productResponse = await axios.get(
            `http://localhost:4000/products?q[invoice_id_eq]=${this.id}`,
            {
              headers: {
                Authorization: sessionStorage.getItem("Authorization"),
                "Content-Type": "application/json",
              },
            }
          );
          this.products = productResponse.data;
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      },
      formatDate(date) {
        if (!date) return "Data inválida";
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
      },
      formatPrice(price) {
        return parseFloat(price).toFixed(2).replace(".", ",");
      },
    },
    mounted() {
      this.fetchInvoiceDetails();
    },
  };
  </script>
  
  <style scoped>
  
  .navbar {
    background-color: #333;
    color: white;
    padding: 10px 20px;
    margin-bottom: 10px;
    border-radius: 10px;
  }
  
  .navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .navbar-links {
    list-style: none;
    display: flex;
    gap: 15px;
  }
  
  .navbar-links a {
    color: white;
    text-decoration: none;
  }
  
  .dashboard-container {
    background-color: #c7c3c3;
    padding: 20px;
    border-radius: 10px;
  }
  
  .btn-icon {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-icon:hover {
    background-color: #0056b3;
  }
  
  .link {
    color: #007bff;
    text-decoration: none;
  }
  
  .products-list {
    list-style: none;
    padding: 0;
  }
  
  .product-item {
    background: #fff;
    padding: 20px;
    border: 1px solid #000000;
    border-radius: 15px;
    margin: 10px;
    box-shadow: 6px 10px 5px rgba(0, 0, 0, 0.4);
  }

  .product.info {
    padding: 10px;
  }
  </style>
  