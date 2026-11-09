import { test, expect, type Page } from "@playwright/test";
import { articles, places, resources } from "../src/data";
import { suppliers } from "../src/suppliers";
import { articleHref } from "../src/catalog";

const base = "/underwater-hockey-atlas/";
const mainRoutes = [
  ["atlas", "Hockey, below the surface."],
  ["learn", "Understand the game."],
  ["clubs", "Clubs & places"],
  ["equipment", "Know your kit."],
  ["equipment/suppliers", "Suppliers"],
  ["library", "Source library"],
  ["clubs/timber-whales", "UNBC Timber Whales"],
] as const;
const place = places.find((record) => record.id === "ca-nova")!;
const supplier = suppliers.find((record) => record.id === "uwr-colombia")!;
const source = resources.find((record) => record.id === "coaching-atlantis")!;

async function openPrimaryNavigation(page: Page) {
  const nav = page.getByRole("navigation", {
    name: "Main navigation",
    exact: true,
  });
  if (!(await nav.isVisible()))
    await page
      .getByRole("button", { name: "Toggle navigation", exact: true })
      .click();
  return nav;
}

async function assertNoOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
    )
    .toBeLessThanOrEqual(1);
}

async function openSearch(page: Page) {
  const field = page.getByLabel("Search the atlas", { exact: true });
  if (!(await field.isVisible())) {
    await page.getByRole("button", { name: "Open site search", exact: true }).click();
  }
  return field;
}

async function search(page: Page, query: string) {
  const field = await openSearch(page);
  await field.fill(query);
  await field.press("Enter");
  await expect(page).toHaveURL(/#\/search\?q=/);
}

test("primary navigation uses four sections and equipment has its own secondary navigation", async ({
  page,
}) => {
  await page.goto(`${base}#/atlas`);
  const nav = await openPrimaryNavigation(page);
  for (const name of ["Learn", "Clubs & places", "Equipment", "Library"]) {
    await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
  }
  await expect(
    nav.getByRole("link", { name: "Timber Whales", exact: true }),
  ).toHaveCount(0);
  await expect(
    nav.getByRole("link", { name: "Suppliers", exact: true }),
  ).toHaveCount(0);
  await nav.getByRole("link", { name: "Equipment", exact: true }).click();
  await expect(page).toHaveURL(/#\/equipment$/);
  const equipmentNav = page.getByRole("navigation", {
    name: "Equipment navigation",
    exact: true,
  });
  await equipmentNav
    .getByRole("link", { name: "Suppliers", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/equipment\/suppliers$/);
  await expect(
    equipmentNav.getByRole("link", { name: "Suppliers", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("home gives a direct first-session entry and keeps the club featured", async ({
  page,
}) => {
  await page.goto(`${base}#/atlas`);
  await expect(
    page.locator('main a[href="#/clubs/timber-whales"]').first(),
  ).toBeVisible();
  await page.locator('main a[href="#/wiki/first-session"]').first().click();
  await expect(
    page.getByRole("heading", { name: "Your first session", level: 1 }),
  ).toBeVisible();
});

test("main sections render cleanly and produce review screenshots", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [route, heading] of mainRoutes) {
    await page.goto("about:blank");
    await page.goto(`${base}#/${route}`);
    await expect(
      page.getByRole("heading", { name: heading, level: 1, exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Page not found", { exact: true })).toHaveCount(
      0,
    );
    await assertNoOverflow(page);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.screenshot({
      path: `test-results/${route.replaceAll("/", "-")}-${testInfo.project.name}.png`,
      fullPage: route === "atlas",
      animations: "disabled",
    });
  }
  expect(errors).toEqual([]);
});

test("legacy section and club bookmarks resolve to the reorganized pages", async ({
  page,
}) => {
  const aliases = [
    ["wiki", "learn"],
    ["world", "clubs"],
    ["resources", "library"],
    ["suppliers", "equipment/suppliers"],
    ["club", "clubs/timber-whales"],
    ["wiki/timber-whales", "clubs/timber-whales"],
  ];
  for (const [oldRoute, canonical] of aliases) {
    await page.goto(`${base}#/${oldRoute}`);
    await expect(page).toHaveURL(new RegExp(`#/${canonical}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Page not found", { exact: true })).toHaveCount(
      0,
    );
  }
});

test("every article remains reachable with sources and a clear primary section", async ({
  page,
}) => {
  test.setTimeout(60_000);
  for (const article of articles) {
    await page.goto(`${base}${articleHref(article.id)}`);
    await expect(
      page.getByRole("heading", {
        name: article.title,
        level: 1,
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Article not found" }),
    ).toHaveCount(0);
    expect(await page.locator("main .source-card").count()).toBeGreaterThan(0);
  }
  await page.goto(`${base}#/wiki/equipment-care`);
  const nav = await openPrimaryNavigation(page);
  await expect(
    nav.getByRole("link", { name: "Equipment", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("global search finds a directory record and opens that exact place", async ({
  page,
}) => {
  await page.goto(`${base}#/atlas`);
  await search(page, place.name);
  await page.locator(`main a[href*="selected=${place.id}"]`).first().click();
  await expect(page).toHaveURL(new RegExp(`#/clubs\\?.*selected=${place.id}`));
  const detail = page.getByTestId("selected-record");
  await expect(
    detail.getByRole("heading", { name: place.name, exact: true }),
  ).toBeInViewport();
  await expect(detail).toBeFocused();
  await expect(detail).toContainText(place.precision);
});

test("supplier search opens the selected record with shipping qualifications", async ({
  page,
}) => {
  await page.goto(`${base}#/atlas`);
  await search(page, supplier.name);
  await page.locator(`main a[href*="selected=${supplier.id}"]`).first().click();
  await expect(page).toHaveURL(
    new RegExp(`#/equipment/suppliers\\?.*selected=${supplier.id}`),
  );
  const detail = page.getByTestId("selected-record");
  await expect(
    detail.getByRole("heading", { name: supplier.name, exact: true }),
  ).toBeInViewport();
  await expect(detail).toBeFocused();
  await expect(detail).toContainText(supplier.canadaShipping);
  await expect(detail).toContainText(supplier.shippingEvidence);
});

test("source search preserves source context and the original outbound link", async ({
  page,
}) => {
  await page.goto(`${base}#/atlas`);
  await search(page, source.title);
  await page.locator(`main a[href*="selected=${source.id}"]`).first().click();
  const detail = page.getByTestId("selected-record");
  await expect(
    detail.getByRole("heading", { name: source.title, exact: true }).first(),
  ).toBeInViewport();
  await expect(detail).toBeFocused();
  await expect(detail).toContainText(source.note);
  await expect(detail).toContainText(source.access);
  await expect(detail.locator(`a[href="${source.url}"]`)).toBeVisible();
});

test("all matching directory and supplier links preserve the global search result count", async ({
  page,
}) => {
  await page.goto(`${base}#/atlas`);
  await search(page, "session");
  const placeCount = Number(
    await page.locator("#search-places .heading-count").innerText(),
  );
  expect(placeCount).toBeGreaterThan(0);
  await page
    .getByRole("link", { name: "All matching places", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/clubs\?q=session/);
  await expect(
    page
      .getByRole("region", { name: "Directory results", exact: true })
      .getByRole("status"),
  ).toContainText(`${placeCount} directory`);
  await search(page, "shipping");
  const supplierCount = Number(
    await page.locator("#search-suppliers .heading-count").innerText(),
  );
  expect(supplierCount).toBeGreaterThan(0);
  await page
    .getByRole("link", { name: "All matching suppliers", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/equipment\/suppliers\?q=shipping/);
  await expect(page.getByTestId("supplier-result")).toHaveCount(supplierCount);
});

test("library paginates the complete collection and resets the page when filtering", async ({
  page,
}) => {
  await page.goto(`${base}#/library`);
  const rows = page.getByTestId("resource-result");
  await expect(rows).toHaveCount(20);
  await expect(
    page.getByRole("navigation", { name: "Pagination", exact: true }),
  ).toContainText(`of ${resources.length}`);
  const firstPageId = await rows.first().getAttribute("data-resource-id");
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(rows).toHaveCount(20);
  expect(await rows.first().getAttribute("data-resource-id")).not.toBe(
    firstPageId,
  );
  await page
    .getByLabel("Search resources", { exact: true })
    .fill("definitely-no-resource-zzzz");
  await expect(rows).toHaveCount(0);
  await expect(page).not.toHaveURL(/page=2/);
  await expect(
    page.getByRole("heading", { name: "No matching resources" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await expect(rows).toHaveCount(20);
});

test("library filters use readable facets and stay visible when more filters are closed", async ({
  page,
}) => {
  await page.goto(`${base}#/library`);
  const topic = page.getByLabel("Topic", { exact: true });
  await topic.selectOption({ label: "Equipment" });
  await expect(page).toHaveURL(/topic=Equipment/);
  const moreFilters = page
    .locator("summary")
    .filter({ hasText: "More filters" });
  await moreFilters.click();
  for (const label of ["Source type", "Access", "Audience"])
    await expect(page.getByLabel(label, { exact: true })).toBeVisible();
  await page
    .getByLabel("Language", { exact: true })
    .selectOption({ label: "English" });
  await moreFilters.click();
  await expect(
    page.getByRole("button", { name: /Remove .*English.* filter/ }),
  ).toBeVisible();
  await expect(page.getByTestId("resource-result").first()).toBeVisible();
  await page.reload();
  await expect(topic).toHaveValue("Equipment");
  await expect(page.getByLabel("Language", { exact: true })).toHaveValue(
    "English",
  );
});

test("Back restores collection filters and pagination, and search input follows its URL", async ({
  page,
}) => {
  await page.goto(`${base}#/library?language=English&page=2`);
  await expect(page.getByLabel("Language", { exact: true })).toHaveValue(
    "English",
  );
  const firstId = await page
    .getByTestId("resource-result")
    .first()
    .getAttribute("data-resource-id");
  const nav = await openPrimaryNavigation(page);
  await nav.getByRole("link", { name: "Learn", exact: true }).click();
  await expect(page).toHaveURL(/#\/learn$/);
  await page.goBack();
  await expect(page).toHaveURL(/language=English/);
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByLabel("Language", { exact: true })).toHaveValue(
    "English",
  );
  await expect(page.getByTestId("resource-result").first()).toHaveAttribute(
    "data-resource-id",
    firstId!,
  );
  await page.goto(`${base}#/search?q=equipment`);
  await expect(
    page.getByLabel("Search the atlas", { exact: true }),
  ).toHaveValue("equipment");
  await search(page, "rules");
  await page.goBack();
  await expect(
    page.getByLabel("Search the atlas", { exact: true }),
  ).toHaveValue("equipment");
});

test("opening a guide and returning restores its topic and scroll position", async ({
  page,
}) => {
  await page.goto(`${base}#/learn?group=skills-tactics`);
  await expect(
    page.getByRole("button", { name: "Skills & tactics", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const lastGuide = page.locator(".learn-results .article-card").last();
  await lastGuide.scrollIntoViewIfNeeded();
  const scrollBefore = await page.evaluate(() => window.scrollY);
  expect(scrollBefore).toBeGreaterThan(0);
  await lastGuide.click();
  await expect(page).toHaveURL(/#\/wiki\//);
  await page.goBack();
  await expect(page).toHaveURL(/#\/learn\?group=skills-tactics$/);
  await expect(
    page.getByRole("button", { name: "Skills & tactics", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(scrollBefore - 10);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeLessThan(scrollBefore + 10);
});

test("directory keeps all records searchable and map selection independent of pagination", async ({
  page,
}) => {
  await page.goto(`${base}#/clubs`);
  await expect(
    page.getByRole("button", { name: "List", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("place-result")).toHaveCount(20);
  await expect(
    page.getByRole("navigation", { name: "Pagination", exact: true }),
  ).toContainText(`of ${places.length}`);
  await page.getByRole("button", { name: "Map", exact: true }).click();
  const pins = page.locator(".map-pin");
  await expect(pins).toHaveCount(
    places.filter((record) => record.lat !== null && record.lon !== null)
      .length,
  );
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(pins).toHaveCount(
    places.filter((record) => record.lat !== null && record.lon !== null)
      .length,
  );
  await pins.first().focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("selected-record")).toBeVisible();
  await page.getByLabel("Search places", { exact: true }).fill("zzzz-no-place");
  await expect(page.getByTestId("place-result")).toHaveCount(0);
  await expect(page.getByTestId("selected-record")).toHaveCount(0);
  await expect(pins).toHaveCount(0);
});

test("an explicit map view survives a mobile reload and unpinned records remain accessible", async ({
  page,
}) => {
  const unpinned = places.find((record) => record.lat === null)!;
  await page.goto(`${base}#/clubs?view=map&selected=${unpinned.id}`);
  await expect(
    page.getByRole("button", { name: "Map", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("selected-record")).toContainText(
    unpinned.name,
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Map", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("selected-record")).toContainText(
    unpinned.precision,
  );
});

test("supplier filters and evidence retain the original record qualifications", async ({
  page,
}) => {
  await page.goto(`${base}#/equipment/suppliers`);
  const first = suppliers[0];
  await page
    .getByLabel("Gear category", { exact: true })
    .selectOption(first.categories[0]);
  await page
    .getByLabel("Supplier country", { exact: true })
    .selectOption(first.country);
  await expect(page.getByTestId("supplier-result")).toHaveCount(
    suppliers.filter(
      (record) =>
        record.categories.includes(first.categories[0]) &&
        record.country === first.country,
    ).length,
  );
  await expect(page.getByTestId("supplier-result").first()).toContainText(
    first.canadaShipping,
  );
  await page.getByRole("button", { name: "Clear all", exact: true }).click();
  await expect(page.getByTestId("supplier-result")).toHaveCount(
    suppliers.length,
  );
  const spearmaster = page
    .getByTestId("supplier-result")
    .filter({ hasText: "Spearmaster" });
  await spearmaster.locator("summary").click();
  const links = await spearmaster
    .locator("a")
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("href")),
    );
  expect(links.length).toBeGreaterThan(0);
  expect(links.every((href) => href === "https://spearmaster.co.za/")).toBe(
    true,
  );
});

test("skip link keeps the route and keyboard navigation closes cleanly", async ({
  page,
  isMobile,
}, testInfo) => {
  await page.goto(`${base}#/learn`);
  const initialUrl = page.url();
  const skip = page.getByRole("link", { name: "Skip to content", exact: true });
  await skip.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(page).toHaveURL(initialUrl);
  const searchField = await openSearch(page);
  await searchField.focus();
  await expect(searchField).toBeFocused();
  await page.screenshot({
    path: `test-results/search-focus-${testInfo.project.name}.png`,
  });
  if (isMobile) {
    const toggle = page.getByRole("button", {
      name: "Toggle navigation",
      exact: true,
    });
    await toggle.click();
    const nav = page.getByRole("navigation", {
      name: "Main navigation",
      exact: true,
    });
    await nav.getByRole("link", { name: "Library", exact: true }).focus();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  }
});

test("repeated header searches move focus to results and result jumps clear the masthead", async ({ page }) => {
  await page.goto(`${base}#/search?q=equipment`);
  await search(page, "rules");
  await expect(page.locator("main")).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("rules");
  await page.locator(".search-jumps").getByRole("button", { name: /^Sources/ }).click();
  await expect(page.locator("#search-sources")).toBeFocused();
  const layout = await page.evaluate(() => ({
    headingTop: document.querySelector("#search-sources")!.getBoundingClientRect().top,
    headerBottom: document.querySelector(".site-header")!.getBoundingClientRect().bottom,
  }));
  expect(layout.headingTop).toBeGreaterThanOrEqual(layout.headerBottom);
});

test("search shortcut requires a modifier and mobile Escape restores its trigger", async ({ page, isMobile }) => {
  await page.goto(`${base}#/atlas`);
  const searchField = page.getByLabel("Search the atlas", { exact: true });
  await page.keyboard.press("/");
  await expect(searchField).not.toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(searchField).toBeFocused();
  await searchField.fill("puck/control");
  await expect(searchField).toHaveValue("puck/control");
  await page.keyboard.press("Escape");
  if (isMobile) {
    const trigger = page.getByRole("button", { name: "Open site search", exact: true });
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(searchField).not.toBeVisible();
  }
});

test("busy layouts reflow at 320, 360 and 768 CSS pixels", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Viewport coverage is shared between projects",
  );
  for (const width of [320, 360, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "atlas",
      "learn",
      "clubs/timber-whales",
      "clubs?view=map",
      "library",
      "equipment/suppliers",
    ]) {
      await page.goto(`${base}#/${route}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await assertNoOverflow(page);
      await page.screenshot({
        path: `test-results/reflow-${width}-${route.replace(/[/?=]/g, "-")}.png`,
      });
    }
  }
});

test("desktop content reflows at 720 CSS pixels with 2x pixel density", async ({
  browser,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "A dedicated context simulates the effective 1440px viewport at 200% zoom",
  );
  const context = await browser.newContext({
    viewport: { width: 720, height: 500 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  for (const route of ["library", "equipment/suppliers", "clubs?view=map"]) {
    await page.goto(`http://127.0.0.1:4173${base}#/${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await assertNoOverflow(page);
    await page.screenshot({
      path: `test-results/reflow-2x-${route.replace(/[/?=]/g, "-")}.png`,
    });
  }
  await context.close();
});
