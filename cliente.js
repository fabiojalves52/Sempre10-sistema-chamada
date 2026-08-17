const socket = io({
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000
});

const indicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');

// Atualiza interface de status
socket.on('connect', () => {
    indicator.classList.remove('offline');
    indicator.classList.add('online');
    statusText.innerText = "online";
});

socket.on('disconnect', () => {
    indicator.classList.remove('online');
    indicator.classList.add('offline');
    statusText.innerText = "offline";
});

/**
 * Envia chamada do caixa
 */
function chamar(numero) {
    if (socket.connected) {
        console.log(`Chamando Caixa ${numero}`);
        socket.emit('chamar-caixa', numero);
    } else {
        // Se estiver offline (servidor dormindo), recarrega para acordar
        location.reload();
    }
}
