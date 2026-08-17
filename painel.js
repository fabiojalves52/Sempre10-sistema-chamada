const socket = io();

const painelContainer = document.getElementById('painel-container');
const idleContent = document.getElementById('idle-content');
const chamadaContent = document.getElementById('chamada-content');
const displayCaixa = document.getElementById('caixa-numero');
const flashOverlay = document.getElementById('flash-overlay');
const audioDing = document.getElementById('audio-ding');
const videoPlayer = document.getElementById('video-player');
const logoFixa = document.querySelector('.logo-fixa');

let idleTimer;
let videoList = [];
let currentVideoIndex = 0;


/* =========================================================
   CONTROLE DA LOGO
   ========================================================= */

function esconderLogo() {
    if (logoFixa) {
        logoFixa.style.display = 'none';
    }
}

function mostrarLogo() {
    if (logoFixa) {
        logoFixa.style.display = '';
    }
}


/* =========================================================
   CARREGAR LISTA DE VÍDEOS
   ========================================================= */

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


/* =========================================================
   PLAYLIST
   ========================================================= */

function iniciarPlaylist() {

    if (videoList.length === 0) return;

    videoPlayer.src = `/videos/${videoList[currentVideoIndex]}`;

    /*
       Quando o vídeo terminar:
       - passa para o próximo
       - mantém a logo escondida
       - continua a reprodução
    */

    videoPlayer.onended = () => {

        currentVideoIndex =
            (currentVideoIndex + 1) % videoList.length;

        videoPlayer.src =
            `/videos/${videoList[currentVideoIndex]}`;

        esconderLogo();

        videoPlayer.play().catch(e => {
            console.log("Aguardando interação para vídeo");
        });
    };
}


/* =========================================================
   MODO ESPERA / PROPAGANDA
   ========================================================= */

function gerenciarModoEspera() {

    if (videoList.length > 0) {

        /*
           Mostra o vídeo
        */

        videoPlayer.classList.remove('hidden');

        /*
           Ativa o modo vídeo
        */

        painelContainer.classList.add('video-active');

        /*
           ESCONDE A LOGO
        */

        esconderLogo();

        /*
           Inicia o vídeo
        */

        videoPlayer.play().catch(e => {
            console.log("Aguardando interação para vídeo");
        });

    } else {

        /*
           Se não houver vídeos,
           mostra o conteúdo normal
        */

        idleContent.classList.remove('hidden');

        mostrarLogo();
    }
}


/* =========================================================
   NOVA CHAMADA
   ========================================================= */

socket.on('nova-chamada', (numero) => {
    exibirChamada(numero);
});


function exibirChamada(numero) {

    /*
       Para o vídeo
    */

    videoPlayer.pause();

    videoPlayer.classList.add('hidden');

    /*
       Remove modo vídeo
    */

    painelContainer.classList.remove('video-active');

    /*
       MOSTRA NOVAMENTE A LOGO
    */

    mostrarLogo();


    /* =====================================================
       EFEITO DE FLASH
       ===================================================== */

    flashOverlay.classList.remove('flash-active');

    void flashOverlay.offsetWidth;

    flashOverlay.classList.add('flash-active');


    /* =====================================================
       MODO CHAMADA
       ===================================================== */

    idleContent.classList.add('hidden');

    chamadaContent.classList.remove('hidden');

    displayCaixa.innerText = `CAIXA ${numero}`;


    /* =====================================================
       SOM
       ===================================================== */

    tocarSom();


    /* =====================================================
       VOZ
       ===================================================== */

    setTimeout(() => {
        falar(`Caixa ${numero}`);
    }, 2000);


    /* =====================================================
       VOLTA AO MODO ESPERA APÓS 10 SEGUNDOS
       ===================================================== */

    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {

        chamadaContent.classList.add('hidden');

        gerenciarModoEspera();

    }, 10000);
}


/* =========================================================
   SOM
   ========================================================= */

function tocarSom() {

    if (audioDing) {

        audioDing.volume = 1.0;

        audioDing.currentTime = 0;

        audioDing.play().catch(() => {});
    }
}


/* =========================================================
   VOZ
   ========================================================= */

function falar(texto) {

    if ('speechSynthesis' in window) {

        window.speechSynthesis.cancel();

        const msg =
            new SpeechSynthesisUtterance();

        msg.text = texto;

        msg.lang = 'pt-BR';

        msg.volume = 1.0;

        msg.rate = 0.9;

        window.speechSynthesis.speak(msg);
    }
}


/* =========================================================
   ANTI-SONO
   ========================================================= */

setInterval(() => {

    fetch('/').catch(() => {});

}, 600000);


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

carregarVideos();


/* =========================================================
   PERMISSÃO PARA REPRODUÇÃO
   ========================================================= */

document.addEventListener('click', () => {

    if (
        videoList.length > 0 &&
        chamadaContent.classList.contains('hidden')
    ) {

        esconderLogo();

        videoPlayer.play().catch(() => {});
    }

}, { once: true });
