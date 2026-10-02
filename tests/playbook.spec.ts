import { test, expect } from '@playwright/test';
import { scenarios, drills, formations } from '../src/playbook/data';

test('every tactical snapshot renders real positions, availability, carrier and complete action paths', async ({ page }) => {
  test.setTimeout(90_000); // This case inspects all ten scenarios and 36 complete result frames.
  for (const scenario of scenarios) {
    await page.goto(`/underwater-hockey-atlas/#/board/${scenario.id}`);
    const player = page.locator('.scenario-player');
    await expect(player.getByRole('heading', { name: scenario.title, exact: true })).toBeVisible();
    await expect(player.getByText(scenario.surfacingPolicy, { exact: true })).toBeVisible();
    for (let frame = 0; frame <= scenario.steps.length; frame++) {
      const step = frame ? scenario.steps[frame - 1] : undefined;
      if (step) await page.getByRole('button', { name: `Step ${frame}: ${step.title}`, exact: true }).click();
      const state = step?.state ?? scenario.initialState;
      for (const actor of state.players) {
        const marker = player.locator(`[data-player-id="${actor.id}"]`);
        await expect(marker).toHaveAttribute('data-x', String(actor.position.x));
        await expect(marker).toHaveAttribute('data-y', String(actor.position.y));
        await expect(marker).toHaveAttribute('data-availability', actor.availability);
      }
      await expect(player.locator('[data-puck-carrier]')).toHaveAttribute('data-puck-carrier', state.puck.carrierId ?? 'none');
      if (step) {
        await expect(player.locator('.step-reading [aria-live]')).toContainText(step.description);
        await expect(player.locator('.action-list li')).toHaveCount(step.actions.length);
        const visibleActions = step.actions.filter(action => ['pass', 'move', 'carry'].includes(action.kind));
        await expect(player.locator('[data-action-kind]')).toHaveCount(visibleActions.length);
        for (const [index, action] of visibleActions.entries()) {
          const line = player.locator('[data-action-kind]').nth(index).locator('polyline').last();
          const expected = action.path.map(point => `${65 + point.x * 4.7},${40 + point.y * 3.5}`).join(' ');
          await expect(line).toHaveAttribute('points', expected);
          if (action.kind === 'pass') await expect(line).toHaveAttribute('stroke-dasharray', '7 5');
        }
        await page.getByRole('button', { name: 'If the option closes', exact: true }).click();
        await expect(player.locator('.coaching-answer')).toHaveText(step.ifUnavailableOrClosed);
      }
    }
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: 'Restart scenario', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Initial frame', exact: true })).toHaveAttribute('aria-current', 'step');
  }
});

test('board controls work by keyboard, reset on scenario change and link to local practice', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/board');
  const next = page.getByRole('button', { name: 'Next', exact: true });
  await next.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.step-reading')).toContainText('STEP 1');
  await page.getByLabel('Compare starting positions for this step').check();
  await expect(page.locator('.frame-state')).toContainText('Positions before');
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Initial frame', exact: true })).toHaveAttribute('aria-current', 'step');
  await page.getByLabel('Choose a scenario').selectOption(scenarios[1].id);
  await expect(page).toHaveURL(new RegExp(`#/board/${scenarios[1].id}$`));
  await expect(page.getByRole('button', { name: 'Initial frame', exact: true })).toHaveAttribute('aria-current', 'step');
  await page.locator('.scenario-player a[href^="#/drills/"]').first().click();
  await expect(page.getByRole('heading', { name: 'Run the drill', exact: true })).toBeVisible();
  await page.locator('aside a[href^="#/wiki/"]').first().click();
  await expect(page.locator('.article-contents')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('formation choices render all six reference roles and complete teaching notes', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/board');
  const board = page.locator('.formation-section');
  for (const formation of formations) {
    await board.getByRole('button', { name: formation.name, exact: true }).click();
    await expect(board.locator('[data-player-id]')).toHaveCount(6);
    await expect(board.locator('[data-availability="reference"]')).toHaveCount(6);
    await expect(board.getByText(formation.explanation, { exact: true })).toBeVisible();
    for (const role of formation.roleResponsibilities) await expect(board.getByText(role.responsibility, { exact: true })).toBeVisible();
    for (const text of [...formation.inPossession, ...formation.outOfPossession, ...formation.onTurnover, ...formation.tradeoffs]) await expect(board.getByText(text, { exact: true })).toBeVisible();
  }
});

test('every drill has full procedure, rotation, coaching guidance, adaptations and safety', async ({ page }) => {
  for (const drill of drills) {
    await page.goto(`/underwater-hockey-atlas/#/drills/${drill.id}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(drill.title);
    for (const text of [drill.setup, ...drill.procedure, drill.resetAndRotation, ...drill.coachObservations, drill.adaptations.easier, drill.adaptations.harder, ...drill.debriefQuestions, ...drill.safety]) await expect(page.getByText(text, { exact: true })).toBeVisible();
    await page.locator('.playbook-sources summary').click();
    await expect(page.locator('.playbook-sources a')).toHaveCount(drill.sourceIds.length);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});

test('drill filtering and shared search open local lessons, drills and boards', async ({ page }) => {
  await page.goto('/underwater-hockey-atlas/#/drills');
  await page.getByRole('textbox', { name: 'Search drills', exact: true }).fill('no-such-drill-zzzz');
  await expect(page.getByRole('heading', { name: 'No matching drills', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset drill filters' }).click();
  await expect(page.locator('.article-grid a')).toHaveCount(drills.length);
  const search = page.getByRole('textbox', { name: 'Search atlas and wiki' });
  await search.fill('support'); await search.press('Enter');
  await expect(page.locator('main a[href^="#/wiki/"]').first()).toBeVisible();
  await expect(page.locator('main a[href^="#/drills/"]').first()).toBeVisible();
  await expect(page.locator('main a[href^="#/board/"]').first()).toBeVisible();
});

test('mobile navigation has distinct touch targets and does not cover the page', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile menu test');
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/underwater-hockey-atlas/#/board');
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await expect(page.locator('header > nav a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Toggle navigation' })).toBeFocused();
    await page.keyboard.press('Enter');
    const links = page.locator('header > nav a');
    for (const link of await links.all()) {
      const box = await link.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    const navBox = await page.locator('header > nav').boundingBox();
    const mainBox = await page.locator('main').boundingBox();
    expect(navBox!.y + navBox!.height).toBeLessThanOrEqual(mainBox!.y);
    await page.locator('header > nav').getByRole('link', { name: 'Board', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Toggle navigation' })).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});
