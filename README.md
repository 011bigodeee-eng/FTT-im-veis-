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
