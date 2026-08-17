# Painel de Chamada Sempre 10 - V2.2 Final

Esta é a versão definitiva e personalizada para a **Sempre 10**, integrando sinalização digital, produtividade e mobilidade.

## Novidades da Versão 2.2 Final

1.  **Sinalização Digital (Vídeos):** O painel agora reproduz vídeos automaticamente na pasta `/videos` quando inativo por 10 segundos.
2.  **Identidade Visual:** Logo da **Sempre 10** integrada de forma fixa no painel da TV.
3.  **Suporte PWA (App):** O sistema pode ser instalado como um aplicativo no celular ou tablet dos atendentes (ícone na tela inicial).
4.  **Relatório de Produtividade:** Acesse `/relatorio` para ver o total de chamadas do dia por caixa (dados em memória, sem banco de dados).
5.  **Transição Suave:** Efeito de cross-fade profissional entre os vídeos e as chamadas.
6.  **Responsividade Gigante:** Fontes ultra-bold e tamanhos monumentais para máxima visibilidade em qualquer TV.
7.  **Anti-Sono e Reconexão:** Mantém o servidor do Render sempre ativo enquanto a TV estiver ligada.

## Estrutura de Arquivos (Tudo na Raiz)

- `server.js`: Servidor Node.js otimizado.
- `index.html`: Tela dos Atendentes com indicador de status.
- `painel.html`: Visor central com relógio e efeitos.
- `style.css`: Estilização responsiva e moderna.
- `cliente.js`: Lógica de controle e monitoramento de conexão.
- `painel.js`: Lógica do visor, relógio, flash e anti-sono.
- `ding.mp3`: Som de notificação agudo e profissional.

## Como Instalar e Executar

1.  Certifique-se de ter o **Node.js** instalado.
2.  Na pasta do projeto, execute:
    ```bash
    npm install
    ```
3.  Inicie o servidor:
    ```bash
    npm start
    ```
4.  Acesse:
    - **Atendentes:** `http://localhost:3000`
    - **Painel (TV):** `http://localhost:3000/painel`

## Dicas de Uso na Loja

- **TV:** Após abrir o painel, clique uma vez na tela para habilitar o som e aperte **F11** para tela cheia.
- **Caixas:** O indicador verde no topo da tela confirma que o sistema está pronto para uso.
