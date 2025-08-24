// DEM Moda Infantil - Sistema Administrativo e Interatividade

// Estado da aplicação
let products = [];
let cart = [];
let currentEditingProduct = null;

// Produtos iniciais de exemplo
const initialProducts = [
    {
        id: 1,
        name: "Conjunto Infantil Menino Estiloso",
        price: 89.90,
        category: "menino",
        brand: "DEM Kids",
        material: "100% Algodão",
        care: "Lavar à máquina 30°C",
        sizes: ["2", "3", "4", "6", "8"],
        colors: "Preto, Branco",
        description: "Conjunto moderno e confortável para meninos, perfeito para o dia a dia. Inclui camiseta e bermuda com design exclusivo.",
        image: "/home/ubuntu/upload/search_images/wZ1y5UNtw0hz.jpg",
        ageRange: "2-8 anos"
    },
    {
        id: 2,
        name: "Kit Roupas Infantil Menino Sortido",
        price: 156.90,
        category: "menino",
        brand: "DEM Collection",
        material: "Meia malha 100% Algodão",
        care: "Lavar à máquina, não usar alvejante",
        sizes: ["2", "4", "6", "8", "10", "12", "14"],
        colors: "Azul, Verde, Amarelo",
        description: "Kit completo com 8 peças sortidas para meninos. Inclui camisetas e shorts em cores vibrantes e estampas divertidas.",
        image: "/home/ubuntu/upload/search_images/CxpbdmgW4aQg.jpg",
        ageRange: "2-14 anos"
    },
    {
        id: 3,
        name: "Vestido Infantil Menina Floral",
        price: 122.90,
        category: "menina",
        brand: "DEM Princess",
        material: "Viscose e Elastano",
        care: "Lavar à mão, secar à sombra",
        sizes: ["2", "3", "4", "6", "8", "10"],
        colors: "Rosa, Verde, Marinho",
        description: "Lindo vestido com estampa floral delicada. Tecido macio e confortável, perfeito para ocasiões especiais.",
        image: "/home/ubuntu/upload/search_images/ozrAMpN03TAJ.jpg",
        ageRange: "2-10 anos"
    },
    {
        id: 4,
        name: "Conjunto Infantil Menina Blogueirinha",
        price: 98.90,
        category: "menina",
        brand: "DEM Style",
        material: "Cotton Premium",
        care: "Lavar à máquina 40°C",
        sizes: ["4", "6", "8", "10", "12"],
        colors: "Rosa, Lilás, Branco",
        description: "Conjunto moderno estilo blogueirinha com top e saia. Design atual e muito estilo para meninas fashionistas.",
        image: "/home/ubuntu/upload/search_images/kyPlkRiAlEAA.jpg",
        ageRange: "4-12 anos"
    },
    {
        id: 5,
        name: "Conjunto Bebê Marca Infanti",
        price: 76.90,
        category: "bebe",
        brand: "DEM Baby",
        material: "Algodão Orgânico",
        care: "Lavar com sabão neutro",
        sizes: ["RN", "P", "M", "G"],
        colors: "Azul, Rosa, Amarelo",
        description: "Conjunto delicado para bebês com tecido extra macio. Ideal para os primeiros meses de vida.",
        image: "/home/ubuntu/upload/search_images/StNx9sHdfvnF.jpg",
        ageRange: "0-2 anos"
    },
    {
        id: 6,
        name: "Roupa Bebê Menino Conjunto",
        price: 84.90,
        category: "bebe",
        brand: "DEM Baby Boy",
        material: "Malha 100% Algodão",
        care: "Lavar separadamente",
        sizes: ["RN", "P", "M", "G"],
        colors: "Azul, Verde, Cinza",
        description: "Conjunto completo para bebê menino com body e calça. Conforto e praticidade para o dia a dia.",
        image: "/home/ubuntu/upload/search_images/ZCtbJVAzmHBs.jpg",
        ageRange: "0-2 anos"
    }
];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carregar produtos do localStorage ou usar produtos iniciais
    const savedProducts = localStorage.getItem('demProducts');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = [...initialProducts];
        saveProducts();
    }
    
    // Carregar carrinho
    const savedCart = localStorage.getItem('demCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
    
    // Renderizar produtos
    renderProducts();
    renderAdminProducts();
    
    // Event listeners
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Formulário de produto
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    
    // Filtros de categoria
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterProducts(this.dataset.filter);
        });
    });
    
    // Modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('productModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Admin panel
    window.addEventListener('click', function(e) {
        const adminPanel = document.getElementById('adminPanel');
        if (e.target === adminPanel) {
            toggleAdminPanel();
        }
    });
}

// Funções do Admin Panel
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel.style.display === 'flex') {
        panel.style.display = 'none';
    } else {
        panel.style.display = 'flex';
        renderAdminProducts();
    }
}

function showTab(tabName) {
    // Remover active de todas as tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Ativar tab selecionada
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    if (tabName === 'manage-products') {
        renderAdminProducts();
    }
}

// Manipulação de produtos
function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const sizes = Array.from(document.querySelectorAll('.size-checkboxes input:checked')).map(cb => cb.value);
    
    const product = {
        id: currentEditingProduct ? currentEditingProduct.id : Date.now(),
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        brand: document.getElementById('productBrand').value,
        material: document.getElementById('productMaterial').value,
        care: document.getElementById('productCare').value,
        sizes: sizes,
        colors: document.getElementById('productColors').value,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value,
        ageRange: getAgeRangeFromSizes(sizes)
    };
    
    if (currentEditingProduct) {
        // Editar produto existente
        const index = products.findIndex(p => p.id === currentEditingProduct.id);
        products[index] = product;
        currentEditingProduct = null;
    } else {
        // Adicionar novo produto
        products.push(product);
    }
    
    saveProducts();
    renderProducts();
    renderAdminProducts();
    
    // Limpar formulário
    e.target.reset();
    document.querySelectorAll('.size-checkboxes input').forEach(cb => cb.checked = false);
    
    // Mostrar mensagem de sucesso
    showNotification('Produto salvo com sucesso!', 'success');
}

function getAgeRangeFromSizes(sizes) {
    const sizeAgeMap = {
        'RN': '0-3m',
        'P': '3-6m',
        'M': '6-12m',
        'G': '1-2a',
        '2': '2a',
        '3': '3a',
        '4': '4a',
        '6': '6a',
        '8': '8a',
        '10': '10a',
        '12': '12a',
        '14': '14a',
        '16': '16a'
    };
    
    if (sizes.length === 0) return '';
    
    const ages = sizes.map(size => sizeAgeMap[size] || size);
    const minAge = ages[0];
    const maxAge = ages[ages.length - 1];
    
    if (minAge === maxAge) return minAge;
    return `${minAge} - ${maxAge}`;
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    currentEditingProduct = product;
    
    // Preencher formulário
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productBrand').value = product.brand;
    document.getElementById('productMaterial').value = product.material;
    document.getElementById('productCare').value = product.care;
    document.getElementById('productColors').value = product.colors;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImage').value = product.image;
    
    // Marcar tamanhos
    document.querySelectorAll('.size-checkboxes input').forEach(cb => {
        cb.checked = product.sizes.includes(cb.value);
    });
    
    // Mudar para tab de adicionar produto
    showTab('add-product');
    
    showNotification('Produto carregado para edição', 'info');
}

function deleteProduct(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
        renderAdminProducts();
        showNotification('Produto excluído com sucesso!', 'success');
    }
}

// Renderização
function renderProducts(filteredProducts = null) {
    const grid = document.getElementById('productsGrid');
    const productsToRender = filteredProducts || products;
    
    if (productsToRender.length === 0) {
        grid.innerHTML = '<div class="no-products"><h3>Nenhum produto encontrado</h3><p>Adicione produtos através do painel administrativo</p></div>';
        return;
    }
    
    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-category="${product.category}" onclick="showProductModal(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDMwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNTAgMTI1QzE2MS4wNDYgMTI1IDE3MCAzMzYuOTU0IDE3MCAzMjVDMTcwIDMxMy4wNDYgMTYxLjA0NiAzMDUgMTUwIDMwNUMxMzguOTU0IDMwNSAxMzAgMzEzLjA0NiAxMzAgMzI1QzEzMCAzMzYuOTU0IDEzOC45NTQgMTI1IDE1MCAxMjVaIiBmaWxsPSIjQ0NDIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+Cjwvc3ZnPg=='">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                <div class="product-details">
                    <div class="product-detail">
                        <span>Marca:</span>
                        <strong>${product.brand}</strong>
                    </div>
                    <div class="product-detail">
                        <span>Material:</span>
                        <strong>${product.material}</strong>
                    </div>
                    <div class="product-detail">
                        <span>Idade:</span>
                        <strong>${product.ageRange}</strong>
                    </div>
                </div>
                <div class="product-sizes">
                    ${product.sizes.map(size => `<span class="size-tag">${size}</span>`).join('')}
                </div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
}

function renderAdminProducts() {
    const container = document.getElementById('productsList');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="no-products"><h4>Nenhum produto cadastrado</h4><p>Use o formulário acima para adicionar produtos</p></div>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <div class="admin-product-info">
                <h4>${product.name}</h4>
                <p>R$ ${product.price.toFixed(2).replace('.', ',')} - ${product.category} - ${product.sizes.join(', ')}</p>
            </div>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// Filtros
function filterProducts(category) {
    if (category === 'all') {
        renderProducts();
    } else {
        const filtered = products.filter(product => product.category === category);
        renderProducts(filtered);
    }
}

// Modal do produto
function showProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <div class="modal-product">
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIyMS4wNDYgMTUwIDI0MCAzMzEuMDQ2IDI0MCAzMTBDMjQwIDI4OC45NTQgMjIxLjA0NiAyNzAgMjAwIDI3MEM0NzguOTU0IDI3MCAzNjAgMjg4Ljk1NCAzNjAgMzEwQzM2MCAzMzEuMDQ2IDM3OC45NTQgMTUwIDIwMCAxNTBaIiBmaWxsPSIjQ0NDIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+Cjwvc3ZnPg=='">
            </div>
            <div class="modal-product-info">
                <h2>${product.name}</h2>
                <div class="modal-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                
                <div class="modal-details">
                    <div class="detail-row">
                        <strong>Marca:</strong> ${product.brand}
                    </div>
                    <div class="detail-row">
                        <strong>Material:</strong> ${product.material}
                    </div>
                    <div class="detail-row">
                        <strong>Cuidados:</strong> ${product.care}
                    </div>
                    <div class="detail-row">
                        <strong>Cores:</strong> ${product.colors}
                    </div>
                    <div class="detail-row">
                        <strong>Idade:</strong> ${product.ageRange}
                    </div>
                </div>
                
                <div class="modal-sizes">
                    <h4>Tamanhos disponíveis:</h4>
                    <div class="sizes-grid">
                        ${product.sizes.map(size => `<span class="size-tag">${size}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-description">
                    <h4>Descrição:</h4>
                    <p>${product.description}</p>
                </div>
                
                <button class="add-to-cart modal-add-cart" onclick="addToCart(${product.id}); closeModal();">
                    <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} adicionado ao carrinho!`, 'success');
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Navegação suave
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Persistência de dados
function saveProducts() {
    localStorage.setItem('demProducts', JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem('demCart', JSON.stringify(cart));
}

// Notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos inline para a notificação
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Adicionar estilos de animação para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .modal-product {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        align-items: start;
    }
    
    .modal-product-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 15px;
    }
    
    .modal-price {
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary-pink);
        margin: 15px 0;
    }
    
    .modal-details {
        margin: 20px 0;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid var(--light-gray);
    }
    
    .modal-sizes {
        margin: 20px 0;
    }
    
    .sizes-grid {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 10px;
    }
    
    .modal-description {
        margin: 20px 0;
    }
    
    .modal-description p {
        line-height: 1.6;
        color: var(--dark-gray);
    }
    
    .modal-add-cart {
        width: 100%;
        margin-top: 20px;
    }
    
    .no-products {
        text-align: center;
        padding: 60px 20px;
        color: var(--dark-gray);
        grid-column: 1 / -1;
    }
    
    .no-products h3, .no-products h4 {
        color: var(--primary-navy);
        margin-bottom: 10px;
    }
    
    @media (max-width: 768px) {
        .modal-product {
            grid-template-columns: 1fr;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Funcionalidades adicionais
document.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Exportar dados (funcionalidade extra)
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dem-produtos.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Produtos exportados com sucesso!', 'success');
}

// Importar dados (funcionalidade extra)
function importProducts(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedProducts = JSON.parse(e.target.result);
            if (Array.isArray(importedProducts)) {
                products = importedProducts;
                saveProducts();
                renderProducts();
                renderAdminProducts();
                showNotification('Produtos importados com sucesso!', 'success');
            } else {
                showNotification('Arquivo inválido!', 'error');
            }
        } catch (error) {
            showNotification('Erro ao importar arquivo!', 'error');
        }
    };
    reader.readAsText(file);
}

// Tornar funções globais para uso no HTML
window.toggleAdminPanel = toggleAdminPanel;
window.showTab = showTab;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.showProductModal = showProductModal;
window.closeModal = closeModal;
window.addToCart = addToCart;
window.scrollToSection = scrollToSection;
window.exportProducts = exportProducts;
window.importProducts = importProducts;

