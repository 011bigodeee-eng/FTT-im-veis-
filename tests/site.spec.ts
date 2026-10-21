import {test,expect} from '@playwright/test';
import {properties} from '../lib/properties';
test.beforeEach(async({page})=>{await page.addInitScript(()=>sessionStorage.setItem('ftt-visited','yes'))});
test('all public routes, local images and noindex metadata are available',async({page})=>{for(const path of ['/','/imoveis','/favoritos','/comparar','/privacidade','/imoveis/casa-horizonte']){const response=await page.goto(path);expect(response?.status()).toBe(200);await expect(page.locator('main')).toBeVisible();await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/)}await page.goto('/');await expect(page.getByRole('heading',{name:'Seu próximo capítulo começa no lugar certo.'})).toBeVisible();await expect(page.locator('.hero-art')).toBeVisible();await expect.poll(()=>page.locator('.hero-photo-0 img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>100)).toBe(true);expect((await page.request.get('/robots.txt')).status()).toBe(200);expect((await page.request.get('/imoveis/inexistente')).status()).toBe(404)});
test('combined search, empty state, sorting, view persistence and hero search',async({page})=>{await page.goto('/imoveis?purpose=Comprar&type=Apartamento&city=Campinas');await expect(page.locator('.property-card')).toHaveCount(1);await expect(page.locator('.property-card h3')).toHaveText('Apartamento Lumina');await page.getByLabel('Pesquisar imóveis').fill('não existe');await expect(page.getByText('Vamos tentar outra combinação?')).toBeVisible();await page.getByRole('button',{name:'Limpar filtros',exact:true}).last().click();await expect(page.locator('.property-card')).toHaveCount(12);await page.getByLabel('Ordenar imóveis').selectOption('price-asc');await expect(page.locator('.property-card h3').first()).toHaveText('Sala Perspectiva');await page.getByRole('button',{name:'Visualização em lista'}).click();await page.reload();await expect(page.locator('.catalog-grid')).toHaveClass(/list-view/);await page.goto('/');await page.locator('.search-tabs').getByRole('link',{name:'Alugar',exact:true}).click();await expect(page).toHaveURL(/purpose=Alugar/);await expect(page.locator('.property-card')).toHaveCount(5)});
test('favorites survive reload and comparison caps at three with removal',async({page})=>{await page.goto('/imoveis');await page.getByRole('button',{name:'Adicionar aos favoritos: Casa Horizonte'}).click();await page.goto('/favoritos');await expect(page.locator('.property-card')).toHaveCount(1);await page.reload();await expect(page.locator('.property-card h3')).toHaveText('Casa Horizonte');await page.getByRole('button',{name:'Remover dos favoritos: Casa Horizonte'}).click();await expect(page.getByText('Sua próxima inspiração começa aqui.')).toBeVisible();await page.goto('/imoveis');for(let i=0;i<4;i++)await page.locator('.property-card').nth(i).getByRole('button',{name:'Comparar',exact:true}).click();await expect(page.getByRole('status')).toContainText(['Você pode comparar até 3 imóveis.']);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('ftt-compare')||'[]').length)).toBe(3);await page.goto('/comparar');await expect(page.locator('thead th')).toHaveCount(4);await page.getByRole('button',{name:'Remover'}).first().click();await expect(page.locator('thead th')).toHaveCount(3)});
test('gallery keyboard navigation, honest WhatsApp inquiry and visit validation',async({page})=>{await page.goto('/imoveis/casa-horizonte');await page.getByRole('button',{name:'Abrir galeria ampliada'}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('ArrowRight');await expect(page.getByRole('dialog')).toContainText('2/3');await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();const href=await page.locator('.interest-card a').first().getAttribute('href');expect(decodeURIComponent(href||'')).toContain('exemplo demonstrativo FTT-001');await page.getByRole('button',{name:'Preparar solicitação'}).click();await expect(page.getByText('Informe seu nome.')).toBeVisible();await page.getByLabel('Seu nome',{exact:true}).fill('Maria Silva');await page.getByLabel('Telefone com DDD',{exact:true}).fill('19999999999');await page.getByLabel('Data desejada').fill('2099-10-25');await page.getByLabel('Horário',{exact:true}).fill('14:30');await page.getByRole('button',{name:'Preparar solicitação'}).click();await expect(page.getByRole('link',{name:/Solicitação preparada/})).toHaveAttribute('href',/wa.me/)});
test('contact validation prepares message without sending and finance responds to input',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Preparar conversa'}).click();await expect(page.getByText('Informe seu nome completo.')).toBeVisible();await page.getByLabel('Nome completo').fill('Maria Silva');await page.getByLabel('Telefone com DDD').fill('19999999999');await page.getByLabel('E-mail',{exact:true}).fill('maria@example.com');await page.getByLabel('Assunto').selectOption('Quero comprar');await page.getByLabel('Mensagem',{exact:true}).fill('Gostaria de conhecer oportunidades reais.');await page.getByRole('button',{name:'Preparar conversa'}).click();await expect(page.getByRole('link',{name:'Abrir WhatsApp',exact:true})).toHaveAttribute('href',/maria%40example.com/);await page.getByLabel('Juros anuais efetivos (%)').fill('0');await expect(page.locator('.finance-result strong')).toHaveText(/1.978/)});
test('mobile navigation, filter drawer and page width',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await page.getByRole('button',{name:'Abrir menu'}).click();await page.getByRole('navigation',{name:'Principal'}).getByRole('link',{name:'Imóveis',exact:true}).click();await expect(page).toHaveURL(/imoveis/);await page.getByRole('button',{name:'Filtros',exact:true}).click();await expect(page.getByLabel('Filtros de imóveis')).toBeVisible();await page.getByLabel('Tipo de imóvel',{exact:true}).selectOption('Terreno');await page.getByRole('button',{name:'Ver 2 resultados'}).click();await expect(page.locator('.property-card')).toHaveCount(2);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await page.goto('/imoveis/casa-horizonte');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)});

test('every local listing has a valid detail route',async({page})=>{for(const p of properties){const response=await page.goto(`/imoveis/${p.slug}`);expect(response?.status()).toBe(200);await expect(page.getByRole('heading',{name:p.title,exact:true})).toBeVisible();await expect(page.locator('.interest-card a').first()).toHaveAttribute('href',new RegExp(p.id));}});

test('animated background can be paused and services reveal as the visitor scrolls', async ({ page }) => {
  await page.goto('/');
  const art = page.locator('.hero-art');
  await expect(page.locator('.hero-photo-0 .hero-photo-camera')).toBeVisible();
  expect(await page.locator('.hero-photo-0 .hero-photo-camera').evaluate(el => getComputedStyle(el).animationName)).toBe('hero-camera-drift');
  const initialTransform = await page.locator('.hero-photo-0 .hero-photo-camera').evaluate(el => getComputedStyle(el).transform);
  await expect.poll(() => page.locator('.hero-photo-0 .hero-photo-camera').evaluate(el => getComputedStyle(el).transform)).not.toBe(initialTransform);
  await expect(page.locator('.hero-photo')).toHaveCount(3);
  await page.getByRole('button', { name: 'Pausar animação do fundo' }).click();
  await expect(art).toHaveClass(/is-paused/);
  expect(await page.locator('.hero-photo-0 .hero-photo-camera').evaluate(el => getComputedStyle(el).animationPlayState)).toBe('paused');
  await page.getByRole('button', { name: 'Retomar animação do fundo' }).click();
  expect(await page.locator('.hero-photo-0 .hero-photo-camera').evaluate(el => getComputedStyle(el).animationPlayState)).toBe('running');
  const cards = page.locator('.service-reveal');
  await expect(cards).toHaveCount(6);
  await expect(cards.last()).toHaveCSS('opacity', '0');
  await cards.last().scrollIntoViewIfNeeded();
  await expect(cards.last()).toHaveCSS('opacity', '1');
  await expect(page.getByRole('heading', { name: 'Avaliações particulares e judiciais' })).toBeVisible();
  const url = await page.getByRole('link', { name: 'Consultar sobre avaliação técnica' }).getAttribute('href');
  expect(decodeURIComponent(url || '')).toContain('orçamento para avaliação técnica');
  const category = page.locator('.category-wrap').last();
  await expect(category).toHaveCSS('opacity', '0');
  await category.scrollIntoViewIfNeeded();
  await expect(category).toHaveCSS('opacity', '1');
});
test('reduced motion disables background animation and mobile services stay within viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Pausar animação do fundo' })).not.toBeVisible();
  expect(await page.locator('.hero-photo-0 .hero-photo-camera').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.locator('#avaliacao').scrollIntoViewIfNeeded();
  await expect(page.locator('.service-reveal').last()).toHaveCSS('opacity', '1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('Comprar and Alugar open filtered listings from both the header and hero', async ({ page }) => {
  await page.goto('/');
  await page.locator('.search-tabs').getByRole('link', { name: 'Comprar', exact: true }).click();
  await expect(page).toHaveURL(/imoveis\?purpose=Comprar/);
  await expect(page.getByRole('heading', { name: 'Imóveis para comprar.' })).toBeVisible();
  await expect(page.locator('.property-card')).toHaveCount(7);
  await expect(page.locator('.property-badge').filter({ hasText: 'Locação' })).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Alugar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Imóveis para alugar.' })).toBeVisible();
  await expect(page.locator('.property-card')).toHaveCount(5);
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Comprar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Imóveis para comprar.' })).toBeVisible();
  await expect(page.locator('.property-card')).toHaveCount(7);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('.search-tabs').getByRole('link', { name: 'Comprar', exact: true }).click();
  await expect(page.locator('.property-card')).toHaveCount(7);
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Alugar', exact: true }).click();
  await expect(page.locator('.property-card')).toHaveCount(5);
});

test('cinematic slideshow advances automatically and has keyboard-accessible manual controls', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-photo-0')).toHaveClass(/is-active/);
  await expect(page.locator('.hero-photo-1')).toHaveClass(/is-active/, { timeout: 12000 });
  await page.getByRole('button', { name: 'Ver imagem 3: O conforto de pertencer' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.hero-photo-2')).toHaveClass(/is-active/);
  await expect(page.getByRole('button', { name: 'Ver imagem 3: O conforto de pertencer' })).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('button', { name: 'Retomar animação do fundo' })).toBeVisible();
  await page.getByRole('button', { name: 'Imagem anterior do slideshow' }).click();
  await expect(page.locator('.hero-photo-1')).toHaveClass(/is-active/);
  await page.getByRole('button', { name: 'Próxima imagem do slideshow' }).click();
  await expect(page.locator('.hero-photo-2')).toHaveClass(/is-active/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Ver imagem 1: Linhas que inspiram' }).click();
  await expect(page.locator('.hero-photo-0')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-photo-2')).toHaveCSS('opacity', '0');
});

test('redesigned hero search combines rental, type, city, neighborhood and budget', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Preço máximo', { exact: true }).selectOption('1000000');
  await page.getByLabel('Finalidade da busca').selectOption('Alugar');
  await expect(page.getByLabel('Preço máximo', { exact: true })).toHaveValue('');
  await page.getByLabel('Tipo de imóvel', { exact: true }).selectOption('Casa');
  await page.getByLabel('Cidade', { exact: true }).selectOption('Campinas');
  await page.getByLabel('Bairro', { exact: true }).selectOption('Cambuí');
  await page.getByLabel('Cidade', { exact: true }).selectOption('Valinhos');
  await expect(page.getByLabel('Bairro', { exact: true })).toHaveValue('');
  await page.getByLabel('Bairro', { exact: true }).selectOption('Jardim Paiquerê');
  await page.getByLabel('Preço máximo', { exact: true }).selectOption('7000');
  await expect(page.locator('.search-footnote')).toContainText('1 possibilidade demonstrativa');
  await page.getByRole('button', { name: 'Buscar imóveis' }).click();
  await expect(page.locator('.property-card')).toHaveCount(1);
  await expect(page.locator('.property-card h3')).toHaveText('Casa Jardim');
  await expect(page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Alugar', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('premium layouts fit mobile, tablet and desktop and the mobile menu traps focus', async ({ page }) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('.premium-search').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('#sobre').scrollIntoViewIfNeeded();
    await expect(page.locator('.about-copy')).toHaveCSS('opacity', '1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('.architecture-feature').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: 'Espaços extraordinários. Novas possibilidades.' })).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu de navegação' })).toBeVisible();
  await page.getByRole('button', { name: 'Fechar menu' }).focus();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('#mobile-navigation'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Menu de navegação' })).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused();
});
