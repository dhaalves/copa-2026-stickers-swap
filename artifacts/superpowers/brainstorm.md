# Brainstorm: Super-compactação do Código de Compartilhamento

## Goal
Tornar a URL de compartilhamento ainda mais curta, especialmente para álbuns com poucas figurinhas (início de coleção) ou quase completos (fim de coleção), sem perder a robustez para álbuns intermediários/esparsos.

## Constraints
- **Sem Bibliotecas de Compressão Pesadas**: Manter o código JS vanilla limpo e de fácil manutenção.
- **Compatibilidade Retroativa**: Continuar suportando a importação de códigos de texto legados (`SA26|1|...`).

## Risks
- **Desempenho**: O cálculo de intervalos (ranges) deve ser rápido, o que é garantido pela ordenação de arrays nativa do JS.
- **Limite de Bytes**: Assegurar que o algoritmo escolha dinamicamente a menor representação possível para evitar que a URL exceda o limite físico sob qualquer circunstância.

## Options

### Opção 1: Formato Híbrido Dinâmico (Recomendado)
- Definir 3 modos de codificação binária:
  - **Modo 1 (Bitmask)**: Usado quando o álbum tem muitas figurinhas espalhadas de forma aleatória. Usa 125 bytes fixos para representar o álbum.
  - **Modo 2 (Owned Ranges)**: Usado quando há poucos intervalos de figurinhas possuídas (e.g. no começo da coleção). Codifica apenas os intervalos de figurinhas que o colecionador possui (4 bytes por intervalo).
  - **Modo 3 (Missing Ranges)**: Usado quando o colecionador está quase completando o álbum (poucos intervalos de figurinhas faltantes). Codifica os intervalos das figurinhas que faltam (4 bytes por intervalo).
- O encoder calcula o custo de cada modo em bytes e seleciona automaticamente o menor formato para gerar a URL.
- **Tamanho Estimado**:
  - Álbum vazio: 5 bytes (~7 caracteres Base64URL).
  - Álbum cheio: 5 bytes (~7 caracteres Base64URL).
  - Coleção iniciante (10 figurinhas esparsas): 45 bytes (~60 caracteres Base64URL).
  - Pior caso (aleatório esparso intermediário): 128 bytes (~172 caracteres Base64URL).

### Opção 2: Compressão LZW Simples sobre Bitmask
- Gerar o bitmask fixo de 125 bytes e aplicar um compressor LZW em JavaScript por cima dele.
- **Desvantagem**: A complexidade do código aumenta significativamente, é mais difícil debugar e, para álbuns quase vazios ou quase cheios, ainda seria maior do que o formato Híbrido Dinâmico.

## Recommendation
**Opção 1 (Formato Híbrido Dinâmico)** é ideal. Ela atinge níveis extremos de compressão para os estados mais comuns (início e fim de coleção) e tem um limite máximo garantido extremamente pequeno para o pior caso, sem complexidade de algoritmos de compressão de dados genéricos.

## Acceptance criteria
1. O parser detecta dinamicamente qual modo foi usado pelo primeiro byte do buffer (`0x01`, `0x02` ou `0x03`).
2. Testes de unidade em `test_parser.js` validam a compactação perfeita e reversibilidade para os três modos (vazio, cheio, esparso).
