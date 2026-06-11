# Plano de Implementação: Super-compactação do Código do Álbum

## Goal
Implementar codificação híbrida (Modos: Bitmask, Owned Ranges, Missing Ranges) para reduzir a URL a até 7 caracteres em álbuns vazios/completos e cerca de 60 caracteres em coleções iniciais, garantindo compatibilidade com códigos legados.

## Plan

### Step 1: Atualizar js/parser.js com a compressão híbrida
- **Files**: [js/parser.js](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/parser.js)
- **Change**:
  - Adicionar a função auxiliar `getRanges(numbers)` para agrupar números em pares `[start, end]`.
  - Atualizar `encodeStateToBinary` para calcular o menor tamanho entre Bitmask (125 bytes), Owned Ranges (intervalos de possuídas * 4 bytes) e Missing Ranges (intervalos de faltantes * 4 bytes), escolhendo a melhor opção.
  - Atualizar `decodeBinaryToState` para interpretar o cabeçalho (`0x01`, `0x02` ou `0x03`) e descompactar o álbum com base no modo selecionado.
- **Verify**: Verificação estática da lógica.

### Step 2: Expandir a suíte de testes em js/test_parser.js
- **Files**: [js/test_parser.js](file:///c:/Users/uel/.gemini/antigravity/scratch/copa-2026-stickers/js/test_parser.js)
- **Change**:
  - Atualizar e expandir testes unitários para cobrir todos os três modos novos:
    - Estado vazio (deve usar modo 2 de ranges e ter tamanho de string mínimo).
    - Estado cheio (deve usar modo 3 de ranges e ter tamanho de string mínimo).
    - Estado esparso e complexo (deve usar o fallback de bitmask do modo 1 se os intervalos forem muitos).
  - Executar `node js/test_parser.js` para garantir que a compactação e decodificação funcionam de forma idêntica em todos os casos e que a compatibilidade com o formato legado é preservada.

### Step 3: Validação do fluxo no navegador
- **Files**: Ninguém (validação manual do fluxo).
- **Verify**: Abrir o navegador, marcar algumas figurinhas, copiar o link compactado (que agora deve ser consideravelmente menor), abrir em outra aba e testar se a decodificação carrega corretamente.

## Approval
**Approve this plan? Reply APPROVED if it looks good.**
