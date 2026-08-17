const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Relatório em Memória (Zera se o servidor reiniciar)
let relatorio = {
    total: 0,
    caixas: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
};

app.use(express.static(__dirname));

// API para listar vídeos
app.get('/api/videos', (req, res) => {
    const videosPath = path.join(__dirname, 'videos');
    if (!fs.existsSync(videosPath)) return res.json([]);
    const files = fs.readdirSync(videosPath);
    const videoFiles = files.filter(file => ['.mp4', '.webm', '.ogg'].includes(path.extname(file).toLowerCase()));
    res.json(videoFiles);
});

// Rota do Relatório (Simples, em memória)
app.get('/relatorio', (req, res) => {
    let html = `<html><head><title>Relatório Sempre 10</title><style>body{font-family:sans-serif;padding:50px;text-align:center;}table{width:100%;max-width:600px;margin:auto;border-collapse:collapse;}th,td{padding:15px;border:1px solid #ddd;}th{background:#ff9800;color:white;}</style></head><body>`;
    html += `<h1>Relatório de Produtividade - Sempre 10</h1>`;
    html += `<h3>Total de Chamadas Hoje: ${relatorio.total}</h3>`;
    html += `<table><tr><th>Caixa</th><th>Chamadas</th></tr>`;
    for (let i = 1; i <= 5; i++) {
        html += `<tr><td>Caixa ${i}</td><td>${relatorio.caixas[i]}</td></tr>`;
    }
    html += `</table><br><button onclick="location.reload()">Atualizar</button></body></html>`;
    res.send(html);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/painel', (req, res) => res.sendFile(path.join(__dirname, 'painel.html')));

io.on('connection', (socket) => {
    socket.on('chamar-caixa', (numero) => {
        relatorio.total++;
        relatorio.caixas[numero]++;
        io.emit('nova-chamada', numero);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor Sempre 10 V2.2 rodando na porta ${PORT}`));
