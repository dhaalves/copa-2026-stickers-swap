# Plano de Implementação: Compartilhar Link do Álbum Preenchido

## Goal
Adicionar um botão de compartilhamento de link do álbum preenchido no cabeçalho do aplicativo. Quando clicado, ele tentará usar a Web Share API (para uma experiência nativa em dispositivos móveis) ou copiará o link diretamente para a área de transferência com feedback visual. O link gerado conterá o código do álbum no parâmetro `partner`, permitindo que o destinatário abra o aplicativo e compare as figurinhas automaticamente.

## Assumptions
- O estado atual do álbum está acessível via `state.myAlbum` no arquivo `js/app.js`.
- O método `StickerParser.generateAlbumCode` é usado para gerar o código comprimido.
- A função `checkQueryParams()` na inicialização do app já lê o parâmetro `partner` da URL para realizar a comparação automática.

## Plan

### Step 1: Atualizar o HTML
- **Files**: [index.html](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/index.html)
- **Change**:
  - Modificar a linha 31 para envolver os botões de ação em uma div `.header-actions`.
  - Mudar o botão `#btn-copy-my-code` para ter o ícone `📋` e o título `"Copiar Código do Álbum (Copia & Cola)"`.
  - Adicionar o botão `#btn-copy-my-link` com a classe `header-share-btn`, o ícone `🔗` e o título `"Copiar Link do Álbum"`.
- **Verify**: Inspecionar visualmente o HTML ou abrir a página para ver se os dois botões aparecem no cabeçalho.

### Step 2: Estilizar os Botões de Ação no Cabeçalho
- **Files**: [style.css](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/style.css)
- **Change**:
  - Adicionar uma regra para `.header-actions` com `display: flex; gap: 8px; align-items: center;` para posicionar os dois botões redondos lado a lado harmoniosamente.
- **Verify**: Abrir o aplicativo localmente e verificar o alinhamento dos botões no cabeçalho.

### Step 3: Implementar a Lógica de Compartilhamento de Link
- **Files**: [js/app.js](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/app.js)
- **Change**:
  - Adicionar a referência de `btnCopyMyLink` ao objeto `el` mapeando `document.getElementById('btn-copy-my-link')`.
  - Vincular um evento de clique a `btnCopyMyLink` na função `bindEvents`.
  - No handler do clique, obter o código comprimido do álbum.
  - Montar a URL de compartilhamento: `const shareUrl = `${window.location.origin}${window.location.pathname}?partner=${encodeURIComponent(code)}`;`
  - Se `navigator.share` estiver disponível, compartilhar usando a API nativa.
  - Caso contrário (ou em caso de erro na API nativa), usar `navigator.clipboard.writeText(shareUrl)` para copiar para o clipboard.
  - Exibir feedback visual de sucesso temporário (trocar o ícone do botão para `✅` e estilizar a borda/fundo temporariamente como é feito para o outro botão, restaurando após 1500ms).
- **Verify**: Testar a funcionalidade de cópia de link gerada e colar em uma nova aba do navegador para verificar se ela pré-carrega o álbum compartilhado como parceiro e abre a aba de comparação.

## Risks & mitigations
- **Comprimento da URL**: Para álbuns extremamente cheios, a URL pode ficar longa, mas como o formato do código do álbum é altamente otimizado por compressão de intervalos (`4,21,24-27`), o tamanho ficará muito abaixo do limite do navegador (~2000 caracteres).
- **Incompatibilidade do navigator.share**: Em navegadores desktop normais ou contextos não-seguros (HTTP), `navigator.share` não é suportado. Mitigado usando o fallback robusto de cópia para clipboard com tratamento de erros.

## Rollback plan
- Descartar as alterações feitas usando `git checkout index.html style.css js/app.js` se algo der errado.
