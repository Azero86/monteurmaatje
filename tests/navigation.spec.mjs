import { test, expect } from "@playwright/test";

const BASE = "http://127.0.0.1:4173/";

async function openApp(page) {
  await page.goto(BASE);
  await page.waitForSelector('[data-nav-target="knowledge"]');
}

test("Tools detail -> Tools -> Home gebruikt maar twee terugstappen", async ({ page }) => {
  await openApp(page);
  await page.locator('[data-nav-target="knowledge"]').click();
  await expect(page).toHaveURL(/#tools$/);
  await page.locator('[data-tool-open="elga"]').click();
  await expect(page).toHaveURL(/#tools\/elga$/);

  await page.goBack();
  await expect(page).toHaveURL(/#tools$/);
  await expect(page.locator("#toolsHome")).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/#home$/);
  await expect(page.locator('[data-app-view="home"]')).toBeVisible();
});

test("ROG(A)FA viewer sluit eerst met Terug en blijft daarna hiërarchisch", async ({ page }) => {
  await openApp(page);
  await page.locator('[data-nav-target="regulations"]').click();
  await expect(page).toHaveURL(/#guidelines$/);

  await page.locator('[data-guideline-open="rogafa"]').click();
  await expect(page).toHaveURL(/#guidelines\/rogafa$/);

  const firstTopic = page.locator("#guidelineRogafaView .regulation-topic").first();
  await firstTopic.locator("summary").first().click();

  const system = firstTopic.locator(".rogafa-system").first();
  await system.locator("summary").first().click();

  const diagram = system.locator(".diagram-toggle").first();
  await diagram.locator("summary").click();
  await diagram.locator("img").click();

  await expect(page.locator("#diagramViewer")).toBeVisible();
  await page.goBack();
  await expect(page.locator("#diagramViewer")).toBeHidden();
  await expect(page).toHaveURL(/#guidelines\/rogafa$/);

  await page.goBack();
  await expect(page).toHaveURL(/#guidelines$/);

  await page.goBack();
  await expect(page).toHaveURL(/#home$/);
});

test("Viewer zoom, slepen, begrenzen en Passend werken op desktop", async ({ page }) => {
  await openApp(page);
  await page.locator('[data-nav-target="regulations"]').click();
  await page.locator('[data-guideline-open="rogafa"]').click();

  const topic = page.locator("#guidelineRogafaView .regulation-topic").first();
  await topic.locator("summary").first().click();
  const system = topic.locator(".rogafa-system").first();
  await system.locator("summary").first().click();
  const diagram = system.locator(".diagram-toggle").first();
  await diagram.locator("summary").click();
  await diagram.locator("img").click();

  const stage = page.locator("#diagramViewerStage");
  const image = page.locator("#diagramViewerImage");
  await expect(image).toBeVisible();

  const box = await stage.boundingBox();
  if (!box) throw new Error("Viewer stage niet meetbaar");

  await stage.hover({ position: { x: box.width / 2, y: box.height / 2 } });
  await page.mouse.wheel(0, -800);
  await expect.poll(async () => await image.evaluate(el => el.style.transform)).toContain("scale(");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width + 500, box.y + box.height + 500, { steps: 8 });
  await page.mouse.up();

  const state = await image.evaluate(el => ({
    transform: el.style.transform,
    imageRect: el.getBoundingClientRect().toJSON(),
  }));
  expect(state.transform).toContain("translate3d(");

  await page.locator("#diagramViewerFit").click();
  await expect.poll(async () => await image.evaluate(el => el.style.transform))
    .toBe("translate3d(0px, 0px, 0) scale(1)");
});

test("Basis-tools zijn na eerste installatie offline beschikbaar", async ({ page, context }) => {
  await openApp(page);
  await page.evaluate(() => navigator.serviceWorker?.ready);
  await page.waitForTimeout(500);

  await context.setOffline(true);
  await page.reload();
  await page.locator('[data-nav-target="knowledge"]').click();

  await page.locator('[data-tool-open="elga"]').click();
  await expect(page.locator("#toolElgaView")).toBeVisible();
  await expect(page.locator("#elgaFlowParams")).not.toBeEmpty();

  await page.locator("[data-tool-back]").click();
  await page.locator('[data-tool-open="xtend"]').click();
  await expect(page.locator("#toolXtendView")).toBeVisible();
  await expect(page.locator("#xtendControlParams")).not.toBeEmpty();
});
