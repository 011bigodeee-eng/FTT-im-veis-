import { test, expect } from '@playwright/test';

type IntroFrame = { state?: string; visibility: string; overlay: string; time: number };
declare global { interface Window { introFrames: IntroFrame[] } }

async function recordFrames(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    window.introFrames = [];
    const started = performance.now();
    function record() {
      const stage = document.getElementById('site-stage');
      const intro = document.getElementById('ftt-intro');
      if (stage && intro) window.introFrames.push({ state: document.documentElement.dataset.fttIntro, visibility: getComputedStyle(stage).visibility, overlay: getComputedStyle(intro).display, time: performance.now() });
      if (performance.now() - started < 6500) requestAnimationFrame(record);
    }
    requestAnimationFrame(record);
  });
}

test('first paint is gated by the SSR intro; the native timeline reveals and unlocks the site', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && /hydrat|didn't match/i.test(message.text())) errors.push(message.text()); });
  await recordFrames(page);
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  const html = await response!.text();
  expect(html.indexOf('id="ftt-intro-bootstrap"')).toBeLessThan(html.indexOf('<body'));
  expect(html).toContain('id="ftt-intro-critical"');
  expect(html).toContain('id="ftt-intro"');
  await expect(page.locator('html')).toHaveAttribute('data-ftt-intro', 'playing');
  await expect(page.getByRole('dialog', { name: 'Abertura da FTT Imóveis' })).toBeVisible();
  await expect(page.locator('#site-stage')).toHaveCSS('visibility', 'hidden');
  await expect(page.locator('html')).toHaveCSS('overflow', 'hidden');
  await page.mouse.wheel(0, 500);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('html')).toHaveAttribute('data-ftt-intro', 'done', { timeout: 5000 });
  await expect(page.locator('#ftt-intro')).not.toBeVisible();
  await expect(page.locator('#site-stage')).toHaveCSS('visibility', 'visible');
  expect(await page.evaluate(() => sessionStorage.getItem('ftt-visited'))).toBe('yes');
  const frames = await page.evaluate(() => window.introFrames);
  const beforeReveal = frames.filter(frame => frame.state === 'playing');
  expect(beforeReveal.length).toBeGreaterThan(0);
  expect(beforeReveal.every(frame => frame.visibility === 'hidden' && frame.overlay === 'flex')).toBe(true);
  expect(frames.some(frame => frame.state === 'revealing')).toBe(true);
  expect(errors).toEqual([]);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test('skip works immediately; refresh and internal navigation do not repeat the intro', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Pular abertura' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-ftt-intro', 'done');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-ftt-intro', 'done');
  await expect(page.locator('#ftt-intro')).not.toBeVisible();
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Comprar', exact: true }).click();
  await expect(page.locator('.property-card')).toHaveCount(7);
  await expect(page.locator('#ftt-intro')).not.toBeVisible();
});

test('a fresh browser session gets its own opening, including mobile and Escape', async ({ browser }) => {
  const first = await browser.newContext();
  const page = await first.newPage();
  await page.goto('/');
  await page.getByRole('button', { name: 'Pular abertura' }).click();
  await first.close();
  const second = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobile = await second.newPage();
  await mobile.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(mobile.locator('html')).toHaveAttribute('data-ftt-intro', 'playing');
  await expect(mobile.getByRole('button', { name: 'Pular abertura' })).toBeVisible();
  await mobile.keyboard.press('Tab');
  await expect(mobile.getByRole('button', { name: 'Pular abertura' })).toBeFocused();
  await mobile.keyboard.press('Tab');
  await expect(mobile.getByRole('button', { name: 'Pular abertura' })).toBeFocused();
  expect(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await mobile.keyboard.press('Escape');
  await expect(mobile.locator('html')).toHaveAttribute('data-ftt-intro', 'done');
  await mobile.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(mobile.getByRole('dialog', { name: 'Menu de navegação' })).toBeVisible();
  await second.close();
});

test('reduced motion opens the site directly without a scroll lock or intro delay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-ftt-intro', 'done');
  await expect(page.locator('#ftt-intro')).not.toBeVisible();
  await expect(page.locator('#site-stage')).toHaveCSS('visibility', 'visible');
  expect(await page.locator('html').evaluate(element => getComputedStyle(element).overflow)).not.toBe('hidden');
});

test('delayed React hydration cannot expose the site before the opening or break its completion', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && /hydrat|didn't match/i.test(message.text())) errors.push(message.text()); });
  await recordFrames(page);
  await page.route('**/_next/static/**/*.js', async route => { await new Promise(resolve => setTimeout(resolve, 4500)); await route.continue(); });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-ftt-intro', 'playing');
  await expect(page.locator('#site-stage')).toHaveCSS('visibility', 'hidden');
  await expect(page.locator('html')).toHaveAttribute('data-ftt-intro', 'done', { timeout: 5000 });
  await expect(page.locator('.hero-content')).toBeVisible();
  await expect(page.locator('.ftt-hero-word').last()).toHaveCSS('opacity', '1');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Ver imagem 2: O extraordinário no cotidiano' }).click();
  await expect(page.locator('.hero-photo-1')).toHaveClass(/is-active/);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => window.introFrames.filter(frame => frame.state === 'playing').every(frame => frame.visibility === 'hidden'))).toBe(true);
});

test('blocked sessionStorage never prevents the opening from finishing', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError'); }; Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); }; });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-ftt-intro', 'playing');
  await expect(page.locator('html')).toHaveAttribute('data-ftt-intro', 'done', { timeout: 5000 });
  await expect(page.locator('#site-stage')).toHaveCSS('visibility', 'visible');
});

test('an interrupted CSS timeline fails open instead of trapping the visitor', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ content: '#ftt-intro{animation:none!important}' });
  await expect(page.locator('html')).toHaveAttribute('data-ftt-intro', 'playing');
  await expect(page.locator('html')).toHaveAttribute('data-ftt-intro', 'done', { timeout: 5500 });
  await expect(page.locator('#ftt-intro')).not.toBeVisible();
  await expect(page.locator('#site-stage')).toHaveCSS('visibility', 'visible');
});
