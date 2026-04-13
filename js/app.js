// Continuación del archivo app.js

function orderReplenishment(productId) {
    const product = inventoryData.criticalProducts.find(p => p.id === productId);
    
    if (product) {
        const quantity = prompt(`📦 Ordenar reposición para:\n${product.name} - Talla ${product.size}\n\n¿Cuántas unidades desea ordenar?`, "10");
        
        if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
            const orderNumber = 'ORD-' + Date.now().toString().slice(-6);
            alert(`✅ Orden creada exitosamente!\n\n` +
                  `Número de orden: ${orderNumber}\n` +
                  `Producto: ${product.name}\n` +
                  `Talla: ${product.size}\n` +
                  `Cantidad: ${quantity} unidades\n` +
                  `Código: ${product.barcode}\n\n` +
                  `La orden ha sido enviada al departamento de producción.`);
            
            // Aquí normalmente enviaríamos la orden a un backend
            console.log(`Orden creada: ${orderNumber} - ${product.name} - ${quantity} unidades`);
        }
    }
}

function scrollToCritical() {
    document.getElementById('critical-section').scrollIntoView({
        behavior: 'smooth'
    });
}

// Exportación a PDF
function exportToPDF() {
    const { summary, criticalProducts } = inventoryData;
    
    const docDefinition = {
        content: [
            { text: '📊 REPORTE DE INVENTARIO - LALALOU', style: 'header' },
            { text: `Temporada: Invierno 2026 | Fecha: ${new Date().toLocaleDateString('es-ES')}`, style: 'subheader' },
            
            { text: '\nRESUMEN EJECUTIVO', style: 'section' },
            {
                columns: [
                    { width: '*', text: `Stock disponible: ${summary.totalStock} unidades` },
                    { width: '*', text: `Ventas semanales: ${summary.weeklySales} uds` },
                    { width: '*', text: `Semanas restantes: ${summary.weeksRemaining}` }
                ]
            },
            {
                columns: [
                    { width: '*', text: `Tallas agotadas: ${summary.outOfStockSizes}/${summary.totalSizes}` },
                    { width: '*', text: `Tallas críticas: ${summary.criticalSizes}` },
                    { width: '*', text: `Producción total: ${summary.totalProduced}` }
                ]
            },
            
            { text: '\n🚨 PRODUCTOS CRÍTICOS', style: 'section' },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: [
                        ['Producto', 'Talla', 'Stock', 'Ventas/Sem', 'Semanas', 'Estado'],
                        ...criticalProducts
                            .filter(p => p.status === 'critical' || p.status === 'warning')
                            .map(p => [
                                p.name,
                                p.size,
                                p.stock.toString(),
                                p.weeklySales.toString(),
                                p.weeksRemaining.toFixed(1),
                                p.status === 'critical' ? 'CRÍTICO' : 'ADVERTENCIA'
                            ])
                    ]
                }
            },
            
            { text: '\n🎯 RECOMENDACIONES', style: 'section' },
            {
                ul: [
                    'Reponer urgentemente productos con stock crítico (≤1 semana)',
                    'Auditar bodega física vs sistema por 65 unidades faltantes',
                    'Documentar muestras/regalos/traspasos no registrados',
                    'Aumentar producción de top 3 productos más vendidos',
                    'Implementar alertas diarias de stock bajo'
                ]
            },
            
            { text: '\n📅 PRÓXIMA REVISIÓN: 20 de Abril 2026', style: 'footer' }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
                alignment: 'center'
            },
            subheader: {
                fontSize: 12,
                margin: [0, 0, 0, 20],
                alignment: 'center',
                color: 'gray'
            },
            section: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            footer: {
                fontSize: 10,
                italics: true,
                margin: [0, 20, 0, 0],
                alignment: 'center'
            }
        }
    };
    
    pdfMake.createPdf(docDefinition).download(`Reporte_Inventario_Lalalou_${new Date().toISOString().slice(0,10)}.pdf`);
}

// Exportación a Excel
function exportToExcel() {
    const { summary, criticalProducts, categories } = inventoryData;
    
    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    // Hoja 1: Resumen
    const summaryData = [
        ['REPORTE DE INVENTARIO - LALALOU', '', '', ''],
        ['Temporada: Invierno 2026', '', 'Fecha:', new Date().toLocaleDateString('es-ES')],
        ['', '', '', ''],
        ['RESUMEN EJECUTIVO', '', '', ''],
        ['Métrica', 'Valor', 'Detalle', ''],
        ['Stock disponible', summary.totalStock, 'unidades', ''],
        ['Ventas semanales', summary.weeklySales, 'unidades/semana', ''],
        ['Semanas restantes', summary.weeksRemaining, 'semanas', ''],
        ['Tallas agotadas', summary.outOfStockSizes, `de ${summary.totalSizes} tallas`, ''],
        ['Tallas críticas', summary.criticalSizes, 'tallas (≤1 semana)', ''],
        ['Producción total', summary.totalProduced, 'unidades', ''],
        ['', '', '', ''],
        ['VENTAS POR CATEGORÍA', '', '', ''],
        ['Categoría', 'Ventas/sem', 'Porcentaje', ''],
        ...categories.map(c => [c.name, c.sales, `${c.percentage}%`])
    ];
    
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, "Resumen");
    
    // Hoja 2: Productos Críticos
    const criticalData = [
        ['PRODUCTOS CON STOCK CRÍTICO', '', '', '', '', '', ''],
        ['Producto', 'Categoría', 'Talla', 'Stock', 'Ventas/Sem', 'Semanas Rest.', 'Estado'],
        ...criticalProducts.map(p => [
            p.name,
            p.category,
            p.size,
            p.stock,
            p.weeklySales,
            p.weeksRemaining.toFixed(1),
            p.status === 'critical' ? 'CRÍTICO' : p.status === 'warning' ? 'ADVERTENCIA' : 'BUENO'
        ])
    ];
    
    const ws2 = XLSX.utils.aoa_to_sheet(criticalData);
    XLSX.utils.book_append_sheet(wb, ws2, "Productos Críticos");
    
    // Hoja 3: Top Productos
    const topData = [
        ['TOP 5 PRODUCTOS MÁS VENDIDOS', '', ''],
        ['Producto', 'Ventas/Semana', 'Porcentaje'],
        ...inventoryData.topProducts.map(p => [
            p.name,
            p.sales,
            `${p.percentage}%`
        ])
    ];
    
    const ws3 = XLSX.utils.aoa_to_sheet(topData);
    XLSX.utils.book_append_sheet(wb, ws3, "Top Productos");
    
    // Guardar archivo
    XLSX.writeFile(wb, `Inventario_Lalalou_${new Date().toISOString().slice(0,10)}.xlsx`);
    
    alert('✅ Archivo Excel generado exitosamente!\n\nEl archivo contiene 3 hojas:\n1. Resumen ejecutivo\n2. Productos críticos\n3. Top productos');
}

// Simulación de actualización en tiempo real
function simulateRealTimeUpdate() {
    // Esta función simularía actualizaciones en tiempo real
    // En un sistema real, esto vendría de un WebSocket o API
    
    setInterval(() => {
        // Simular pequeñas variaciones en el stock
        const randomProduct = inventoryData.criticalProducts[
            Math.floor(Math.random() * inventoryData.criticalProducts.length)
        ];
        
        if (randomProduct.stock > 0) {
            const change = Math.random() > 0.7 ? -1 : 0; // 30% de chance de reducir stock
            randomProduct.stock = Math.max(0, randomProduct.stock + change);
            
            // Recalcular semanas restantes
            if (randomProduct.weeklySales > 0) {
                randomProduct.weeksRemaining = randomProduct.stock / randomProduct.weeklySales;
            }
            
            // Actualizar estado
            if (randomProduct.weeksRemaining <= 1) {
                randomProduct.status = 'critical';
            } else if (randomProduct.weeksRemaining <= 3) {
                randomProduct.status = 'warning';
            } else {
                randomProduct.status = 'good';
            }
            
            // Solo renderizar si hay cambios visibles
            if (change !== 0) {
                renderTable();
                
                // Mostrar notificación
                showNotification(`Stock actualizado: ${randomProduct.name} - Talla ${randomProduct.size}: ${randomProduct.stock} unidades`);
            }
        }
    }, 30000); // Cada 30 segundos
}

function showNotification(message) {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-y-full opacity-0 transition-all duration-300';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-info-circle mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-y-full', 'opacity-0');
        notification.classList.add('translate-y-0', 'opacity-100');
    }, 100);
    
    // Animar salida después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('translate-y-0', 'opacity-100');
        notification.classList.add('translate-y-full', 'opacity-0');
        
        // Eliminar del DOM después de la animación
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Iniciar simulación de actualización en tiempo real
// Comentar esta línea si no se desea la simulación
// simulateRealTimeUpdate();

// Funciones adicionales de utilidad
function calculateReorderQuantity(product) {
    // Fórmula simple para calcular cantidad de reposición
    const weeklySales = product.weeklySales;
    const leadTimeWeeks = 2; // Supuesto: 2 semanas para producción
    const safetyStock = weeklySales * 0.5; // Stock de seguridad del 50%
    
    return Math.ceil(weeklySales * leadTimeWeeks + safetyStock - product.stock);
}

function getStatusColor(status) {
    switch(status) {
        case 'critical': return '#dc2626';
        case 'warning': return '#d97706';
        case 'good': return '#059669';
        default: return '#6b7280';
    }
}

function formatNumber(num) {
    return num.toLocaleString('es-ES');
}

// Exportar funciones para uso global
window.filterByStatus = filterByStatus;
window.filterByCategory = filterByCategory;
window.nextPage = nextPage;
window.previousPage = previousPage;
window.showProductDetails = showProductDetails;
window.orderReplenishment = orderReplenishment;
window.scrollToCritical = scrollToCritical;
window.exportToPDF = exportToPDF;
window.exportToExcel = exportToExcel;