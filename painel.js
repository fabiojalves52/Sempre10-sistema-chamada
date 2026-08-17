const socket = io();
const painelContainer = document.getElementById('painel-container');
const idleContent = document.getElementById('idle-content');
const chamadaContent = document.getElementById('chamada-content');
const displayCaixa = document.getElementById('caixa-numero');
const flashOverlay = document.getElementById('flash-overlay');
const audioDing = document.getElementById('audio-ding');
const videoPlayer = document.getElementById('video-player');

let idleTimer;
let videoList = [];
let currentVideoIndex = 0;

// Carregar lista de vídeos do servidor
async function carregarVideos() {
    try {
        const response = await fetch('/api/videos');
        videoList = await response.json();
        console.log("Vídeos encontrados:", videoList);
        if (videoList.length > 0) {
            iniciarPlaylist();
        }
    } catch (e) {
        console.error("Erro ao carregar vídeos:", e);
    }
}

function iniciarPlaylist() {
    if (videoList.length === 0) return;
    
    videoPlayer.src = `/videos/${videoList[currentVideoIndex]}`;
    
    // Quando o vídeo terminar, vai para o próximo
    videoPlayer.onended = () => {
        currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
        videoPlayer.src = `/videos/${videoList[currentVideoIndex]}`;
        videoPlayer.play();
    };
}

function gerenciarModoEspera() {
    if (videoList.length > 0) {
        videoPlayer.classList.remove('hidden');
        painelContainer.classList.add('video-active');
        videoPlayer.play().catch(e => console.log("Aguardando interação para vídeo"));
    } else {
        idleContent.classList.remove('hidden');
    }
}

// Escuta novas chamadas
socket.on('nova-chamada', (numero) => {
    exibirChamada(numero);
});

function exibirChamada(numero) {
    // Para o vídeo se estiver rodando
    videoPlayer.pause();
    videoPlayer.classList.add('hidden');
    painelContainer.classList.remove('video-active');

    // Efeito de Flash
    flashOverlay.classList.remove('flash-active');
    void flashOverlay.offsetWidth;
    flashOverlay.classList.add('flash-active');

    // Alterna para Modo Chamada
    idleContent.classList.add('hidden');
    chamadaContent.classList.remove('hidden');
    displayCaixa.innerText = `CAIXA ${numero}`;

    tocarSom();

    setTimeout(() => {
        falar(`Caixa ${numero}`);
    }, 2000);

    // Volta para o modo espera após 10 segundos (Conforme solicitado)
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        chamadaContent.classList.add('hidden');
        gerenciarModoEspera();
    }, 10000);
}

function tocarSom() {
    if (audioDing) {
        audioDing.volume = 1.0;
        audioDing.currentTime = 0;
        audioDing.play().catch(() => {});
    }
}

function falar(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance();
        msg.text = texto;
        msg.lang = 'pt-BR';
        msg.volume = 1.0;
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    }
}

// ANTI-SONO
setInterval(() => {
    fetch('/').catch(() => {});
}, 600000);

// Inicialização
carregarVideos();
document.addEventListener('click', () => {
    if (videoList.length > 0 && chamadaContent.classList.contains('hidden')) {
        videoPlayer.play();
    }
}, { once: true });
