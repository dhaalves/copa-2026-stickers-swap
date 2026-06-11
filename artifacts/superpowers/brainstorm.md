# Brainstorm: Compactar Código de Compartilhamento do Álbum

## Goal
Compactar o código gerado do álbum preenchido para evitar URLs extremamente longas, mantendo compatibilidade com o parser de álbuns existente e sem adicionar dependências externas.

## Constraints
- **Sem Dependências**: Deve usar apenas JavaScript vanilla compatível com navegadores modernos (sem `pako`, `zlib`, etc.).
- **Compatibilidade Retroativa**: O aplicativo deve ser capaz de ler tanto os códigos antigos no formato de texto (e.g., `SA26|1|...`) quanto o novo formato compactado.
- **Eficiência**: A URL deve ser o mais curta possível, mesmo quando o usuário possuir centenas de figurinhas marcadas de forma esparsa (não consecutiva).

## Risks
- **Tratamento de Erros**: Se um código compactado estiver corrompido ou for inválido, o app deve falhar silenciosamente ou alertar o usuário sem quebrar o carregamento da página.
- **Caracteres Especiais na URL**: A codificação do buffer deve usar Base64 seguro para URL (Base64URL) para evitar problemas com caracteres como `+`, `/` e `=`.

## Options
1. **Opção 1: Codificação por Bitmask + Base64URL (Recomendado)**
   - Como temos 994 figurinhas fixas, o estado "tenho/não tenho" de cada figurinha pode ser mapeado para 1 bit em uma sequência.
   - 994 bits / 8 bits por byte = 125 bytes.
   - As repetidas podem ser salvas em seguida no buffer como pares `[id (2 bytes), qty (1 byte)]`.
   - Vantagens: Altamente compacta, tamanho determinístico máximo pequeno (~300 bytes), sem dependências, fácil de implementar.
2. **Opção 2: Compressão de Texto (e.g., LZW simplificado em JS)**
   - Implementar um algoritmo LZW ou Huffman simples em JS para comprimir a string original `SA26|1|...`.
   - Vantagens: Reutiliza o formato de texto existente.
   - Desvantagens: Menos eficiente que o bitmask para dados binários esparsos, código do algoritmo é maior e mais propenso a bugs.

## Recommendation
**Opção 1 (Bitmask + Base64URL)** é a melhor escolha. Ela garante que a lista de figurinhas possuídas ocupe sempre exatamente 125 bytes, independentemente de estarem consecutivas ou separadas, o que reduz drasticamente o tamanho em comparação com listas de texto. Ela é robusta, limpa e extremamente rápida.

## Acceptance criteria
1. `StickerParser.generateAlbumCode` retorna o código comprimido em formato Base64URL.
2. `StickerParser.parseAlbumCode` aceita tanto o formato antigo (`SA26|1|...`) quanto o novo formato binário compactado.
3. Testes unitários em `js/test_parser.js` são atualizados para verificar se a compactação e descompactação funcionam de ponta a ponta sem perda de dados.
