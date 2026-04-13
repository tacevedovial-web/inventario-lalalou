// Dashboard Inteligente - Inventario Lalalou
// Datos y lógica JavaScript

// Datos del inventario
const inventoryData = {
    summary: {
        totalStock: 802,
        weeklySales: 298,
        weeksRemaining: 2.7,
        criticalProducts: 5,
        missingUnits: 65,
        depletionDate: "25 Abril 2026"
    },
    
    topSellingProducts: [
        {
            id: 1,
            name: "PANTALON BOLOGNA TERCIOPELO CHOCOLATE",
            category: "Pantalones",
            weeklySales: 5,
            stock: 1,
            weeksRemaining: 0.2,
            status: "critical",
            price: 89990,
            margin: 49.9
        },
        {
            id: 2,
            name: "BLAZER WAIST TERCIOPELO CHOCOLATE",
            category: "Blazers",
            weeklySales: 3,
            stock: 1,
            weeksRemaining: 0.3,
            status: "critical",
            price: 129990,
            margin: 50.0
        },
        {
            id: 3,
            name: "PANTALON LALALOU GABARDINA NEGRA",
            category: "Pantalones",
            weeklySales: 4,
            stock: 2,
            weeksRemaining: 0.5,
            status: "critical",
            price: 79990,
            margin: 48.5
        },
        {
            id: 4,
            name: "POLERA RIB ALGODÓN BLANCA",
            category: "Poleras",
            weeklySales: 28,
            stock: 150,
            weeksRemaining: 5.4,
            status: "good",
            price: 29990,
            margin: 52.3
        },
        {
            id: 5,
            name: "ABRIGO LANA MERINO NEGRO",
            category: "Abrigos",
            weeklySales: 25,
            stock: 120,
            weeksRemaining: 4.8,
            status: "good",
            price: 159990,
            margin: 51.8
        },
        {
            id: 6,
            name: "BLUSA SEDA ESTAMPADA",
            category: "Blusas",
            weeklySales: 22,
            stock: 100,
            weeksRemaining: 4.5,
            status: "good",
            price: 69990,
            margin: 49.2
        },
        {
            id: 7,
            name: "VESTIDO MIDI FLORAL",
            category: "Vestidos",
            weeklySales: 12,
            stock: 50,
            weeksRemaining: 4.2,
            status: "good",
            price: 89990,
            margin: 50.5
        },
        {
            id: 8,
            name: "JEAN SKINNY AZUL",
            category: "Jeans",
            weeklySales: 18,
            stock: 75,
            weeksRemaining: 4.2,
            status: "good",
            price: 59990,
            margin: 47.8
        },
        {
            id: 9,
            name: "CHAQUETA CUERO NEGRA",
            category: "Chaquetas",
            weeklySales: 8,
            stock: 35,
            weeksRemaining: 4.4,
            status: "good",
            price: 189990,
            margin: 53.2
        },
        {
            id: 10,
            name: "FALDA PLISADA NEGRA",
            category: "Faldas",
            weeklySales: 6,
            stock: 25,
            weeksRemaining: 4.2,
            status: "good",
            price: 49990,
            margin: 46.9
        }
    ],
    
    lowSellingProducts: [
        {
            id: 11,
            name: "CINTURÓN PIEL MARÓN",
            category: "Accesorios",
            weeklySales: 1,
            stock: 15,
            weeksRemaining: 15.0,
            status: "warning",
            price: 24990,
            margin: 45.2
        },
        {
            id: 12,
            name: "BOLSO TOTE BEIGE",
            category: "Accesorios",
            weeklySales: 2,
            stock: 20,
            weeksRemaining: 10.0,
            status: "warning",
            price: 89990,
            margin: 52.1
        },
        {
            id: 13,
            name: "GORRO LANA GRIS",
            category: "Accesorios",
            weeklySales: 1,
            stock: 12,
            weeksRemaining: 12.0,
            status: "warning",
            price: 19990,
            margin: 44.8
        },
        {
            id: 14,
            name: "BUFANDA CASHMERE ROJA",
            category: "Accesorios",
            weeklySales: 3,
            stock: 25,
            weeksRemaining: 8.3,
            status: "warning",
            price: 39990,
            margin: 48.3
        },
        {
            id: 15,
            name: "GUANTES PIEL NEGROS",
            category: "Accesorios",
            weeklySales: 1,
            stock: 10,
            weeksRemaining: 10.0,
            status: "warning",
            price: 34990,
            margin: 47.5
        }
    ],
    
    categories: [
        { name: "Pantalones", sales: 45, percentage: 15.1, stock: 180 },
        { name: "Blazers", sales: 32, percentage: 10.7, stock: 95 },
        { name: "Poleras", sales: 28, percentage: 9.4, stock: 150 },
        { name: "Abrigos", sales: 25, percentage: 8.4, stock: 120 },
        { name: "Blusas", sales: 22, percentage: 7.4, stock: 100 },
        { name: "Vestidos", sales: 12, percentage: 4.0, stock: 50 },
        { name: "Jeans", sales: 18, percentage: 6.0, stock: 75 },
        { name: "Accesorios", sales: 8, percentage: 2.7, stock: 82 }
    ]
};

// Variables globales
let currentTab = 'overview';
let chartInstance = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('es-ES', options);
    
    // Cargar datos iniciales
    loadTopProducts();
    loadLowProducts();
    initCharts();
    setupEventListeners();
    
    console.log('Dashboard cargado correctamente');
});

// Cargar top productos
function loadTopProducts() {
    const tableBody = document.getElementById('top-products-table');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    inventoryData.topSellingProducts.forEach(product => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 cursor-pointer';
        row.onclick = () => showProductDetail(product.id);
        
        // Determinar clase de estado
        let statusClass = 'badge-success';
        let statusText = 'Bueno';
        if (product.status === 'critical') {
            statusClass = 'badge-critical';
            statusText = 'Crítico';
        } else if (product.status === 'warning') {
            statusClass = 'badge-warning';
            statusText = 'Advertencia';
        }
        
        row.innerHTML = `
            <td class="py-3">
                <div class="font-medium text-gray-900">${product.name}</div>
                <div class="text-sm text-gray-500">${product.category}</div>
            </td>
            <td class="py-3">
                <div class="font-semibold text-gray-900">${product.weeklySales}</div>
                <div class="text-xs text-gray-500">uds/semana</div>
            </td>
            <td class="py-3">
                <div class="font-semibold ${product.stock < 5 ? 'text-red-600' : 'text-gray-900'}">${product.stock}</div>
                <div class="text-xs text-gray-500">unidades</div>
            </td>
            <td class="py-3">
                <div class="font-semibold ${product.weeksRemaining < 1 ? 'text-red-600' : product.weeksRemaining < 3 ? 'text-yellow-600' : 'text-gray-900'}">
                    ${product.weeksRemaining.toFixed(1)}
                </div>
                <div class="text-xs text-gray-500">semanas</div>
            </td>
            <td class="py-3">
                <span class="${statusClass}">${statusText}</span>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Cargar productos con baja rotación
function loadLowProducts() {
    const tableBody = document.getElementById('low-products-table');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    inventoryData.lowSellingProducts.forEach(product => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        // Determinar acción recomendada
        let actionText = 'Monitorear';
        let actionClass = 'bg-gray-100 text-gray-800';
        if (product.weeksRemaining > 12) {
            actionText = 'Promocionar';
            actionClass = 'bg-yellow-100 text-yellow-800';
        } else if (product.weeksRemaining > 8) {
            actionText = 'Revisar';
            actionClass = 'bg-blue-100 text-blue-800';
        }
        
        row.innerHTML = `
            <td class="py-3">
                <div class="font-medium text-gray-900">${product.name}</div>
            </td>
            <td class="py-3">
                <span class="text-sm text-gray-600">${product.category}</span>
            </td>
            <td class="py-3">
                <div class="font-semibold text-gray-900">${product.stock}</div>
            </td>
            <td class="py-3">
                <div class="font-semibold text-gray-900">${product.weeklySales}</div>
            </td>
            <td class="py-3">
                <div class="font-semibold ${product.weeksRemaining > 10 ? 'text-yellow-600' : 'text-gray-900'}">
                    ${product.weeksRemaining.toFixed(1)}
                </div>
            </td>
            <td class="py-3">
                <button class="px-3 py-1 rounded-lg text-sm font-medium ${actionClass}">
                    ${actionText}
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Inicializar gráficos
function initCharts() {
    const ctx = document.getElementById('projectionChart');
    if (!ctx) return;
    
    // Destruir gráfico anterior si existe
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    // Datos para el gráfico
    const weeks = [0, 1, 2, 3, 4, 5, 6];
    const stockData = [802, 504, 206, 0, 0, 0, 0]; // Proyección lineal
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks.map(w => `Semana ${w}`),
            datasets: [{
                label: 'Stock Proyectado',
                data: stockData,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Stock: ${context.raw} unidades`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Unidades en Stock'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Semanas'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// Cambiar pestañas
function switchTab(tabName) {
    // Actualizar tabs activos
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activar tab seleccionado
    const activeTab = document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Mostrar contenido correspondiente
    const contentId = `${tabName}-tab`;
    const content = document.getElementById(contentId);
    if (content) {
        content.classList.add('active');
    }
    
    currentTab = tabName;
    
    // Actualizar gráficos si es necesario
    if (tabName === 'analytics') {
        setTimeout(initCharts, 100);
    }
}

// Ordenar por ventas
function sortBySales(order) {
    if (order === 'desc') {
        inventoryData.topSellingProducts.sort((a, b) => b.weeklySales - a.weeklySales);
    } else {
        inventoryData.topSellingProducts.sort((a, b) => a.weeklySales - b.weeklySales);
    }
    loadTopProducts();
}

// Ordenar por semanas restantes
function sortByWeeks(order) {
    if (order === 'asc') {
        inventoryData.topSellingProducts.sort((a, b) => a.weeksRemaining - b.weeksRemaining);
    } else {
        inventoryData.topSellingProducts.sort((a, b) => b.weeksRemaining - a.weeksRemaining);
    }
    loadTopProducts();
}

// Filtrar por estado
function filterByStatus(status) {
    alert(`Filtrando por: ${status === 'all' ? 'Todos' : status === 'critical' ? 'Críticos' : status === 'warning' ? 'Advertencia' : 'Buen Estado'}`);
    // En una implementación real, aquí se filtrarían los datos
}

// Mostrar productos más vendidos
function showTopSelling() {
    switchTab('overview');
    setTimeout(() => {
        document.getElementById('top-products-table').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Mostrar productos menos vendidos
function showLowSelling() {
    switchTab('overview');
    setTimeout(() => {
        const lowTable = document.getElementById('low-products-table');
        if (lowTable) {
            lowTable.parentElement.parentElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

// Mostrar acciones críticas
function showCriticalActions() {
    const actions = `
1. 🚨 REPONER INMEDIATAMENTE los 5 productos con stock crítico:
   • PANTALON BOLOGNA TERCIOPELO CHOCOLATE (1 unidad, 0.2 semanas)
   • BLAZER WAIST TERCIOPELO CHOCOLATE (1 unidad, 0.3 semanas)
   • PANTALON LALALOU GABARDINA NEGRA (2 unidades, 0.5 semanas)

2. 🔍 AUDITAR BODEGA por 65 unidades faltantes

3. 📈 AUMENTAR PRODUCCIÓN del top 3 productos más vendidos

4. 📊 REVISAR productos con baja rotación para promociones

¿Quieres que genere órdenes de compra automáticas?`;
    
    alert(actions);
}

// Exportar datos
function exportData(format) {
    if (format === 'excel') {
        alert('Generando archivo Excel... Descarga iniciada.');
        // En una implementación real, aquí se generaría el Excel
    } else if (format === 'pdf') {
        alert('Generando reporte PDF... Descarga iniciada.');
        // En una implementación real, aquí se generaría el PDF
    }
}

// Refrescar dashboard
function refreshDashboard() {
    const refreshBtn = document.querySelector('button[onclick="refreshDashboard()"]');
    const originalHtml = refreshBtn.innerHTML;
    
    // Mostrar loader
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
    refreshBtn.disabled = true;
    
    // Simular actualización
    setTimeout(() => {
        // Actualizar datos (en una implementación real, aquí se haría una petición al servidor)
        console.log('Datos actualizados');
        
        // Restaurar botón
        refreshBtn.innerHTML = originalHtml;
        refreshBtn.disabled = false;
        
        // Mostrar mensaje