#!/usr/bin/env node

/**
 * Servidor simple para el Dashboard de Inventario
 * 
 * Uso:
 *   node serve.js [puerto]
 * 
 * Ejemplos:
 *   node serve.js 3000
 *   node serve.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.argv[2] || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Parsear URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Si es la raíz, servir index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  // Obtener ruta del archivo
  const filePath = path.join(ROOT_DIR, pathname);
  const extname = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Verificar si el archivo existe
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Archivo no encontrado
      if (err.code === 'ENOENT') {
        // Intentar servir index.html para rutas SPA
        if (pathname.startsWith('/api/')) {
          // Rutas API - devolver 404
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          // Para rutas de la aplicación, servir index.html
          serveFile(path.join(ROOT_DIR, 'index.html'), 'text/html', res);
        }
      } else {
        // Otro error
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Archivo encontrado, servirlo
      serveFile(filePath, contentType, res);
    }
  });
});

function serveFile(filePath, contentType, res) {
  // Leer y servir el archivo
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Server Error: ${err.code}`);
    } else {
      // Configurar headers CORS para desarrollo
      const headers = {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      };
      
      res.writeHead(200, headers);
      res.end(content, 'utf-8');
    }
  });
}

// API endpoints simulados
function handleApiRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Endpoint: /api/inventory
  if (pathname === '/api/inventory' && req.method === 'GET') {
    const inventoryData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'inventory.json'), 'utf8'));
    
    // Simular latencia de red
    setTimeout(() => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(inventoryData));
    }, 300);
    
    return true;
  }
  
  // Endpoint: /api/update-stock (simulación)
  if (pathname === '/api/update-stock' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      const data = JSON.parse(body);
      
      // Simular actualización
      const response = {
        success: true,
        message: `Stock actualizado para producto ${data.productId}`,
        timestamp: new Date().toISOString(),
        newStock: Math.floor(Math.random() * 20) + 1 // Stock aleatorio
      };
      
      setTimeout(() => {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(response));
      }, 500);
    });
    
    return true;
  }
  
  return false;
}

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`
  🚀 Dashboard de Inventario - Servidor iniciado
  📍 URL: http://localhost:${PORT}
  📁 Directorio: ${ROOT_DIR}
  
  📊 Características:
  • Dashboard interactivo completo
  • Gráficos en tiempo real
  • Exportación a PDF/Excel
  • Filtros y búsqueda
  • Datos de ejemplo incluidos
  
  🛑 Para detener: Ctrl+C
  `);
  
  // Mostrar rutas disponibles
  console.log('\n📂 Archivos disponibles:');
  const files = fs.readdirSync(ROOT_DIR);
  files.forEach(file => {
    const stat = fs.statSync(path.join(ROOT_DIR, file));
    if (stat.isFile()) {
      console.log(`  • ${file} (${(stat.size / 1024).toFixed(2)} KB)`);
    }
  });
  
  console.log('\n📁 Subdirectorios:');
  const dirs = fs.readdirSync(ROOT_DIR).filter(item => {
    return fs.statSync(path.join(ROOT_DIR, item)).isDirectory();
  });
  dirs.forEach(dir => {
    console.log(`  • ${dir}/`);
  });
});

// Manejar cierre elegante
process.on('SIGINT', () => {
  console.log('\n\n👋 Servidor detenido. ¡Hasta luego!');
  process.exit(0);
});

// Manejar errores no capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Error no capturado:', err);
  process.exit(1);
});