import test from "node:test";
import assert from "node:assert/strict";
import { articles, places, resources, type Resource } from "../src/data.ts";
import { suppliers } from "../src/suppliers.ts";
import {
  articleHref,
  articleOwner,
  facetOptions,
  filterPlaces,
  filterResources,
  filterSuppliers,
  getArticleGroup,
  getPage,
  learnGroups,
  resourceFacets,
  searchCatalog,
  type FacetKey,
} from "../src/catalog.ts";

const resource = (id: string) => {
  const found = resources.find((entry) => entry.id === id);
  assert.ok(found, `Missing fixture ${id}`);
  return found;
};

test("every current article has one primary home and Learn uses all five groups", () => {
  const ownerCounts = { learn: 0, clubs: 0, equipment: 0, library: 0 };
  for (const article of articles) {
    const owner = articleOwner(article);
    ownerCounts[owner]++;
    const group = getArticleGroup(article);
    if (owner === "learn")
      assert.ok(
        learnGroups.some((entry) => entry.id === group),
        article.id,
      );
    else assert.equal(group, "", article.id);
  }
  assert.deepEqual(ownerCounts, {
    learn: 21,
    clubs: 2,
    equipment: 3,
    library: 1,
  });
  assert.deepEqual(
    new Set(
      articles.filter((a) => articleOwner(a) === "learn").map(getArticleGroup),
    ),
    new Set(learnGroups.map((g) => g.id)),
  );
  for (const id of ["small-sided-games", "video-review", "coaching-pathways"]) {
    assert.equal(
      getArticleGroup(articles.find((a) => a.id === id)!),
      "coaching",
    );
  }
  assert.equal(
    articleOwner(
      articles.find((a) => a.id === "equipment-and-pool-compliance")!,
    ),
    "learn",
  );
});

test("article destinations preserve existing article identities and unify the club profile", () => {
  assert.equal(articleHref("timber-whales"), "#/clubs/timber-whales");
  for (const article of articles.filter((a) => a.id !== "timber-whales")) {
    assert.equal(articleHref(article.id), `#/wiki/${article.id}`);
  }
  assert.equal(articleHref("a/b?c"), "#/wiki/a%2Fb%3Fc");
});

test("all catalog resources receive readable facets without modifying original records", () => {
  const before = JSON.stringify(resources);
  assert.equal(resources.length, 207);
  const keys: FacetKey[] = [
    "topics",
    "languages",
    "sourceTypes",
    "access",
    "audiences",
  ];
  for (const item of resources) {
    const facets = resourceFacets(item);
    for (const key of keys) {
      assert.ok(facets[key].length, `${item.id}: ${key}`);
      assert.equal(new Set(facets[key]).size, facets[key].length);
      assert.ok(
        facets[key].every((value) => !value.includes("_") && value.length < 40),
      );
    }
  }
  for (const key of keys)
    assert.ok(facetOptions(resources, key).length <= 15, key);
  filterResources(resources, { q: "rules", language: "English" });
  searchCatalog("equipment");
  assert.equal(JSON.stringify(resources), before);
});

test("multilingual resources match each explicit language, without assuming an unspecified one", () => {
  const multilingual = resources.find((r) => r.language === "en, fr")!;
  assert.ok(multilingual);
  assert.deepEqual(
    new Set(resourceFacets(multilingual).languages),
    new Set(["English", "French"]),
  );
  assert.ok(
    filterResources(resources, { language: "English" }).includes(multilingual),
  );
  assert.ok(
    filterResources(resources, { language: " French " }).includes(multilingual),
  );
  const unspecified = resources.find(
    (r) => r.language === "multilingual-unspecified",
  )!;
  assert.deepEqual(resourceFacets(unspecified).languages, [
    "Languages unspecified",
  ]);
  assert.ok(
    !filterResources(resources, { language: "English" }).includes(unspecified),
  );
});

test("source metadata separates world research and match archives from generic directory topics", () => {
  assert.deepEqual(resourceFacets(resource("world-science-apnea")).topics, [
    "Research",
  ]);
  assert.ok(
    resourceFacets(resource("world-science-submersion")).topics.includes(
      "Safety",
    ),
  );
  assert.ok(
    resourceFacets(resource("world-cmas-results")).topics.includes(
      "Matches & competitions",
    ),
  );
  assert.ok(
    !resourceFacets(resource("world-cmas-results")).topics.includes(
      "Clubs & places",
    ),
  );
  assert.deepEqual(resourceFacets(resource("world-uwh-map")).topics, [
    "Clubs & places",
  ]);
  assert.deepEqual(resourceFacets(resource("world-cuga-clubs")).sourceTypes, [
    "Sport organization",
  ]);
});

test("access facets preserve explicit restrictions and uncertainty from merged evidence", () => {
  const hub = resourceFacets(resource("coaching-cmas-regulations")).access;
  assert.ok(hub.includes("Login or membership"));
  assert.ok(hub.includes("Preview or index only"));
  assert.ok(!hub.includes("Listed as public"));
  const restricted = resources.find(
    (r) => r.access === "Login requested by canonical download",
  )!;
  assert.deepEqual(resourceFacets(restricted).access, ["Login or membership"]);
  const paid = resources.find((r) => r.access === "Paid products")!;
  assert.deepEqual(resourceFacets(paid).access, ["Paid content or products"]);
  const abstract = resourceFacets(resource("world-science-apnea")).access;
  assert.ok(abstract.includes("Preview or index only"));
  assert.ok(abstract.includes("Access unconfirmed"));
  assert.ok(!abstract.includes("Listed as public"));
  const conflicting = resourceFacets(resource("rules-fipsas-hockey")).access;
  assert.ok(conflicting.includes("Access unconfirmed"));
  assert.ok(!conflicting.includes("Listed as public"));
  const unknown: Resource = {
    ...resources[0],
    topic: "New category",
    language: "zz",
    authority: "Unknown publisher",
    access: "Possibly available",
    audience: "Unspecified",
    sourceRecords: [],
  };
  assert.deepEqual(resourceFacets(unknown), {
    topics: ["Other topics"],
    languages: ["Language unknown"],
    sourceTypes: ["Source type unknown"],
    access: ["Access unconfirmed"],
    audiences: ["Audience unspecified"],
  });
  assert.deepEqual(
    resourceFacets({ ...unknown, sourceRecords: [{ access: "Free" }] }).access,
    ["Access unconfirmed"],
  );
});

test("resource filters operate on the full catalog and match all selected facets", () => {
  const full = filterResources(resources, { q: "  ", topic: "", language: "" });
  assert.equal(full.length, 207);
  assert.equal(full[0], resources[0]);
  const subset = filterResources(resources, {
    topic: "Rules & refereeing",
    language: "English",
    sourceType: "Sport organization",
  });
  assert.ok(subset.length > 20);
  assert.ok(
    subset.every((r) => {
      const f = resourceFacets(r);
      return (
        f.topics.includes("Rules & refereeing") &&
        f.languages.includes("English") &&
        f.sourceTypes.includes("Sport organization")
      );
    }),
  );
  const secondPage = getPage(subset, 2);
  assert.equal(secondPage.items[0], subset[20]);
  assert.deepEqual(filterResources(resources, { topic: "not-a-topic" }), []);
  const publisherMatches = filterResources(resources, {
    q: "  British   OCTOPUSH Association  ",
  });
  assert.ok(
    publisherMatches.some(
      (r) => r.publisher === "British Octopush Association",
    ),
  );
});

test("global search includes directory places and suppliers as well as articles and sources", () => {
  assert.deepEqual(searchCatalog("  "), {
    articles: [],
    places: [],
    suppliers: [],
    resources: [],
  });
  const place = places.find((p) => p.name.includes("Timber Whales"))!;
  assert.ok(place);
  assert.ok(
    searchCatalog("  TIMBER Whales ").places.some((p) => p.id === place.id),
  );
  assert.ok(
    searchCatalog("timber whales").articles.some(
      (a) => a.id === "timber-whales",
    ),
  );
  const supplier = suppliers.find((s) => s.name.includes("Spearmaster"))!;
  assert.ok(
    searchCatalog("  sPeArMaStEr ").suppliers.some((s) => s.id === supplier.id),
  );
  assert.ok(
    searchCatalog("British Octopush Association").resources.some(
      (r) => r.publisher === "British Octopush Association",
    ),
  );
  assert.deepEqual(searchCatalog("no-matching-entry-zzzz"), {
    articles: [],
    places: [],
    suppliers: [],
    resources: [],
  });
});

test("global and directory search share matches from descriptions, metadata, and supplier notes", () => {
  const sessions = filterPlaces(places, "  SESSION  ");
  assert.ok(sessions.some((place) => place.id === "ca-rumblefish"));
  assert.ok(sessions.some((place) => place.id === "ca-seals"));
  assert.deepEqual(searchCatalog("session").places, sessions);
  const shipping = filterSuppliers(suppliers, { q: "  SHIPPING  " });
  assert.deepEqual(
    shipping.map((supplier) => supplier.id),
    ["hydro", "core-uwh"],
  );
  assert.deepEqual(searchCatalog("shipping").suppliers, shipping);
  for (const query of [
    "North   America",
    "pool",
    "Québec",
    "equipment Canada",
  ]) {
    const global = searchCatalog(query);
    assert.deepEqual(global.places, filterPlaces(places, query));
    assert.deepEqual(
      global.suppliers,
      filterSuppliers(suppliers, { q: query }),
    );
  }
  const venue = {
    ...places[0],
    name: "Example club",
    country: "Example",
    region: "Example",
    description: "Practice information",
    metadata: { city: "Montréal", venue_or_area: "East Pool" },
  };
  assert.deepEqual(filterPlaces([venue], "montreal pool"), [venue]);
});

test("supplier search can be narrowed by gear and country without changing its text matches", () => {
  assert.equal(filterSuppliers(suppliers, {}).length, 12);
  assert.equal(filterPlaces(places, " ").length, 57);
  const first = suppliers[0];
  const selected = filterSuppliers(suppliers, {
    q: first.name,
    category: ` ${first.categories[0].toUpperCase()} `,
    country: ` ${first.country.toUpperCase()} `,
  });
  assert.ok(selected.includes(first));
  assert.deepEqual(
    filterSuppliers(suppliers, { q: first.name, country: "not-a-country" }),
    [],
  );
  assert.deepEqual(
    filterSuppliers(suppliers, { category: "not-a-gear-category" }),
    [],
  );
});

test("pagination clamps invalid pages, keeps final results, and reports empty counts consistently", () => {
  const entries = Array.from({ length: 41 }, (_, index) => index + 1);
  assert.deepEqual(getPage(entries, 3), {
    items: [41],
    page: 3,
    pageCount: 3,
    total: 41,
    start: 41,
    end: 41,
  });
  assert.equal(getPage(entries, 999).page, 3);
  assert.equal(getPage(entries, -1).page, 1);
  assert.equal(getPage(entries, Number.NaN).page, 1);
  assert.equal(getPage(entries, Number.POSITIVE_INFINITY).page, 1);
  assert.equal(getPage(entries, 1, 0).items.length, 20);
  assert.equal(getPage(entries, 2, 10).start, 11);
  assert.deepEqual(getPage([], 5), {
    items: [],
    page: 1,
    pageCount: 1,
    total: 0,
    start: 0,
    end: 0,
  });
  assert.equal(entries.length, 41);
});
