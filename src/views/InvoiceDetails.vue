<template>
    <div class="invoice-container">
        <h1>Detalhes da Nota Fiscal</h1>
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
            <h3>Produtos Comprados</h3>
            <ul class="products-list">
                <li v-for="product in products" :key="product.id" class="product-item">
                    <div class="product-info">
                        <strong>Nome:</strong> {{ product.name }}<br>
                        <strong>Descrição:</strong> {{ product.description }}<br>
                        <strong>Número de Série:</strong> {{ product.serial_number }}<br>
                        <strong>Preço:</strong> R$ {{ formatPrice(product.price) }}<br>
                        <strong>Garantia Válida até:</strong> {{ formatDate(product.warranty_expiry_date) }}<br>
                    </div>
                    <!-- Informações da loja associada -->
                    <div class="store-info">
                        <h4>Loja</h4>
                        <strong>Nome:</strong> {{ product.store.name }}<br>
                        <strong>Endereço:</strong> {{ product.store.address }}<br>
                        <strong>Contato:</strong> {{ product.store.contact }}<br>
                    </div>
                </li>
            </ul>
        </div>
        <button @click="$router.go(-1)" class="back-button">Voltar</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['id'], // Recebe o ID da invoice como parâmetro
    data() {
        return {
            invoice: null, // Dados da invoice
            products: [],  // Produtos relacionados à invoice
        };
    },
    methods: {
        async fetchInvoiceDetails() {
            try {
                console.log('Buscando invoice com ID:', this.id);

                // Requisição para os detalhes da invoice
                const invoiceResponse = await axios.get(`http://localhost:4000/invoices/${this.id}`, {
                    headers: {
                        'Authorization': sessionStorage.getItem('Authorization'),
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Invoice carregada:', invoiceResponse.data);
                this.invoice = invoiceResponse.data;

                // Requisição para os produtos associados à invoice
                const productResponse = await axios.get(`http://localhost:4000/products?q[invoice_id_eq]=${this.id}`, {
                    headers: {
                        'Authorization': sessionStorage.getItem('Authorization'),
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Produtos carregados:', productResponse.data);
                this.products = productResponse.data;
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        },
        formatDate(date) {
            if (!date) return 'Data inválida';
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`;
        },
        formatPrice(price) {
            return parseFloat(price).toFixed(2).replace('.', ',');
        },
    },
    mounted() {
        this.fetchInvoiceDetails();
    },
};
</script>

<style scoped>
.invoice-container {
    font-family: Arial, sans-serif;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

.info-section p {
    margin: 5px 0;
    font-size: 16px;
}

.link {
    color: #007BFF;
    text-decoration: none;
    font-weight: bold;
}

.link:hover {
    text-decoration: underline;
}

.products-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;
}

.product-item {
    padding: 15px;
    margin-bottom: 15px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.product-info, .store-info {
    margin-bottom: 10px;
}

h4 {
    font-size: 18px;
    color: #555;
    margin-bottom: 5px;
}

.back-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-align: center;
    margin-top: 20px;
}

.back-button:hover {
    background-color: #0056b3;
}

.back-button:active {
    background-color: #003f8a;
}
</style>
