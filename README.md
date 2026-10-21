# FTT Imóveis

Prévia comercial autoral em Next.js App Router, React, TypeScript e Tailwind CSS. Motion, Lucide, React Hook Form e Zod completam a interface. Sem banco, autenticação, credenciais ou APIs pagas.

## Executar

Requer Node.js 20.9+ (validado com Node 24) e npm.

```sh
npm ci
npm run dev
```

Para produção:

```sh
npm run lint
npm test
npm run build
npm start
```

Use o checkout existente; tarefas na nuvem já são isoladas e não exigem worktrees.

## O que está incluído

- 12 exemplos locais em `lib/properties.ts`, com URLs próprias, metadata e imagens locais otimizadas por Next Image.
- Busca combinada por finalidade, tipo, cidade, bairro, preço, quartos e texto; ordenação e grade/lista.
- Favoritos e comparação de até três imóveis, persistidos no navegador.
- Galeria em diálogo nativo com miniaturas, teclado, zoom, tela cheia e gesto horizontal.
- Compartilhamento nativo ou cópia do link.
- Simulação Price com taxa anual efetiva editável, inclusive juros zero.
- Formulários validados: preparam uma mensagem e oferecem um link para abrir o WhatsApp; não simulam envio ao servidor. Visitas dependem da confirmação do corretor.
- Fundo fotográfico com movimento suave de câmera e transições entre três cenas, com pausa, introdução de sessão e suporte a movimento reduzido.
- Revelação individual de cards, categorias e seções durante a rolagem.
- Área de avaliação imobiliária com os serviços fornecidos pelo responsável: avaliação técnica conforme ABNT, análise de acabamento, regularização, anexação, estudo de viabilidade e avaliações particulares e judiciais.
- Dados pessoais de formulários nunca são persistidos.

## Verificação de interface

```sh
CHROMIUM_PATH=/usr/bin/chromium npx playwright test
```

O teste inicia o servidor de produção; execute `npm run build` antes. Se Chromium estiver em outro caminho, ajuste `CHROMIUM_PATH`. Os testes cobrem navegação, imagens, noindex, busca, preferências, comparação, galeria, formulários, cálculo, mobile, revelação na rolagem, pausa e movimento reduzido.

## Publicação demonstrativa na Vercel

Importe este repositório, selecione o framework Next.js e mantenha os comandos padrão (`npm run build`). Nenhuma variável de ambiente é necessária. A publicação não é realizada por este projeto nem exige serviços de dados.

A prévia tem `noindex,nofollow`, robots bloqueando rastreamento e sitemap deliberadamente vazio. Para uma versão oficial, substituir todos os exemplos por ofertas verificadas, configurar o domínio real, preencher o sitemap e só então ativar indexação e Open Graph com URLs absolutas.

## Identidade e conteúdo

Os contatos do cartão são usados sem inventar endereço, números de vendas ou depoimentos. O componente `Brand` em `components/site.tsx` é uma representação SVG temporária inspirada no cartão, preparada para substituição pelo arquivo vetorial oficial. O monograma do corretor reserva espaço para um retrato e uma biografia reais.

As fotografias são referências de espaços, sem correspondência com localizações, imóveis ou categorias reais. Consulte `CREDITS.md`. Na apresentação e em cada detalhe, fotos e dados são claramente identificados como ilustrativos.

## Evolução

`lib/properties.ts` concentra o catálogo, os filtros e as funções financeiras. Uma futura camada de consulta pode substituir o array sem acoplar a interface a um provedor. A interface não coleta leads em backend. Para produção, revisar dados, fotos e política de privacidade com o responsável.

Descrição original do repositório: site corretora.

## Direção visual 2.0

A evolução preserva todas as rotas e funcionalidades. O hero tem três cenas controladas, navegação por teclado, progresso, pausa e avanço automático a cada oito segundos. A rotação pausa fora da tela e em abas ocultas; a seleção manual pausa o slideshow. Movimento reduzido mantém a navegação manual e elimina parallax, zoom e revelações animadas. A imagem principal é uma ilustração arquitetônica gerada por IA, otimizada em WebP e identificada como ilustrativa; não é uma oferta real.

A busca combina finalidade, tipo, cidade, bairro e orçamento. Trocar a cidade limpa um bairro incompatível; trocar a finalidade limpa o orçamento. Os atalhos Comprar e Alugar continuam abrindo o catálogo diretamente. O menu mobile usa um diálogo nativo com foco contido e fechamento por Escape. A navegação indica a finalidade ou a seção atual. A seção institucional utiliza uma composição editorial, e a faixa “Espaços extraordinários. Novas possibilidades.” acrescenta profundidade com parallax discreto.

## Abertura cinematográfica sem flash

A decisão de exibição ocorre no script inline de `lib/intro.ts`, colocado no `<head>` antes do corpo. Ele lê `sessionStorage` e movimento reduzido antes do primeiro frame. CSS crítico inline mantém o fundo azul quase preto e o restante da página invisível durante a apresentação. O atributo inicial é controlado deliberadamente no elemento HTML com `suppressHydrationWarning`; a estrutura renderizada pelo servidor e hidratada pelo React permanece a mesma.

`components/cinematic-intro.tsx` é renderizado no servidor. A timeline nativa de três segundos desenha a marca, atravessa um feixe dourado, revela nome e assinatura e abre uma máscara para o hero. `components/brand-mark.tsx` compartilha exatamente a mesma geometria entre a marca do cabeçalho e a intro. A animação é código SVG/CSS, sem vídeos, áudio ou novas bibliotecas.

Os eventos nativos de animação liberam a página e o scroll mesmo antes da hidratação. O botão Pular abertura, a tecla Escape e a navegação por Tab funcionam no bootstrap. Existe apenas um temporizador de segurança para **liberar** a página caso eventos ou estilos falhem; ele nunca esconde conteúdo e não conduz a timeline normal. Quando a abertura termina ou é pulada, `ftt-visited=yes` evita repetição na sessão. Movimento reduzido abre diretamente. Se o armazenamento estiver bloqueado, a abertura continua terminando normalmente.

O título do hero acompanha a revelação por CSS, e o slideshow espera a liberação da intro. A transição da página mantém seu conteúdo SSR visível por trás da máscara para não criar uma tela vazia se o React atrasar.

`tests/intro.spec.ts` verifica os frames iniciais, recarga, navegação, sessão nova, celular, teclado, preferência de movimento reduzido, hidratação atrasada, armazenamento bloqueado e interrupção da animação. Para rever a abertura manualmente, use uma nova sessão do navegador ou remova apenas a chave `ftt-visited` do sessionStorage do site e recarregue.
