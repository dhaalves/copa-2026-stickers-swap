# Plano de Implementação: Compactar Código de Compartilhamento do Álbum

## Goal
Substituir o formato de geração do código do álbum por um formato binário compactado usando Bitmask (para figurinhas possuídas) + lista de repetidas codificado em Base64URL. Garantir que o parser continue aceitando o formato antigo por compatibilidade.

## Assumptions
- O total de figurinhas é fixo em 994 (definido em `StickerParser.TOTAL_STICKERS`).
- O Base64URL gerado não conterá o caractere `|`, o que nos permite diferenciar os dois formatos.

## Plan

### Step 1: Atualizar o arquivo do Parser com algoritmos de compactação
- **Files**: [js/parser.js](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/parser.js)
- **Change**:
  - Implementar funções auxiliares de codificação/decodificação Base64URL para `Uint8Array`.
  - Atualizar `StickerParser.generateAlbumCode` para converter o estado do álbum em um buffer binário (`Uint8Array`) e retornar a string codificada em Base64URL.
  - Atualizar `StickerParser.parseAlbumCode` para verificar se a string contém o caractere `|`. Se não contiver, decodificar a partir do formato binário compactado; caso contrário, decodificar usando o parseador antigo.
- **Verify**: Garantir que as funções não geram erros de sintaxe ou runtime básico.

### Step 2: Atualizar os testes unitários do Parser
- **Files**: [js/test_parser.js](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/test_parser.js)
- **Change**:
  - Adicionar um novo caso de teste em `js/test_parser.js` que cria um estado de álbum com dados esparsos e repetidas, gera o código comprimido e verifica se ele é descompactado de volta exatamente para o mesmo estado inicial (cobrindo owned e repeated).
  - Adicionar um teste de compatibilidade garantindo que o formato antigo ainda é analisado perfeitamente.
- **Verify**: Executar `node js/test_parser.js` e verificar se todos os testes passam com sucesso.

### Step 3: Validar no Aplicativo
- **Files**: Ninguém (apenas validação manual e do browser subagent)
- **Change**: Nenhuma mudança de código além de abrir a página e testar o fluxo completo.
- **Verify**: Copiar o link com algumas figurinhas marcadas, abrir o link em uma nova aba privada (ou simular no subagent) e verificar se o estado do parceiro é carregado e comparado de forma idêntica.

## Risks & mitigations
- **Compatibilidade**: Testado explicitamente no Step 2 garantindo que strings antigas geradas anteriormente ainda funcionam e importam normalmente.
- **Ambiente sem btoa/atob**: Os navegadores modernos e o Node.js v16+ suportam as APIs necessárias (`btoa` / `atob`).

## Rollback plan
- Descartar alterações usando `git checkout js/parser.js js/test_parser.js`
