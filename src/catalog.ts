import {
  articles,
  places,
  resources,
  type Article,
  type Place,
  type Resource,
} from "./data";
import { suppliers, type Supplier } from "./suppliers";

export const learnGroups = [
  {
    id: "getting-started",
    label: "Getting started",
    description: "Understand the game and prepare for your first club session.",
  },
  {
    id: "skills-tactics",
    label: "Skills & tactics",
    description: "Puck control, passing, positioning, and playing together.",
  },
  {
    id: "rules-safety",
    label: "Rules & safety",
    description:
      "Rules, refereeing, equipment standards, and safe participation.",
  },
  {
    id: "coaching",
    label: "Coaching",
    description: "Plan practice, review matches, and develop as a coach.",
  },
  {
    id: "history-research",
    label: "History & research",
    description: "Explore the sport's history and understand its evidence.",
  },
] as const;

export type ArticleOwner = "learn" | "clubs" | "equipment" | "library";

export function articleOwner(article: Article): ArticleOwner {
  if (article.id === "library-navigation") return "library";
  if (article.category === "Equipment") return "equipment";
  if (article.category === "Clubs" || article.category === "World")
    return "clubs";
  return "learn";
}

const articleGroups: Record<string, string> = {
  "Getting started": "getting-started",
  Skills: "skills-tactics",
  Tactics: "skills-tactics",
  Teamplay: "skills-tactics",
  Rules: "rules-safety",
  Safety: "rules-safety",
  "Practice design": "coaching",
  "Match analysis": "coaching",
  Coaching: "coaching",
  History: "history-research",
  "Research literacy": "history-research",
};

/** Non-Learn articles have no primary learning group; their records still resolve. */
export function getArticleGroup(article: Article): string {
  if (articleOwner(article) !== "learn") return "";
  return articleGroups[article.category] ?? "history-research";
}

export function articleHref(id: string): string {
  return id === "timber-whales"
    ? "#/clubs/timber-whales"
    : `#/wiki/${encodeURIComponent(id)}`;
}

export interface ResourceFacets {
  topics: string[];
  languages: string[];
  sourceTypes: string[];
  access: string[];
  audiences: string[];
}

export type FacetKey = keyof ResourceFacets;
export interface ResourceFilters {
  q?: string;
  topic?: string;
  language?: string;
  sourceType?: string;
  access?: string;
  audience?: string;
}

export interface SupplierFilters {
  q?: string;
  category?: string;
  country?: string;
}

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");
const unique = (values: string[]) => [...new Set(values)];
const strings = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value.filter((v): v is string => typeof v === "string")
      : [];

function vocabulary(
  groups: Record<string, readonly string[]>,
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const [label, values] of Object.entries(groups)) {
    for (const value of values)
      map.set(normalize(value), [...(map.get(normalize(value)) ?? []), label]);
  }
  return map;
}

// These are display mappings for explicit catalog fields, never edits to evidence.
// Unrecognized values remain unclassified instead of being guessed from a title.
const topicVocabulary = vocabulary({
  "Getting started": [
    "Getting started",
    "Association beginner manual",
    "Association learning page",
    "Club introduction",
    "beginner",
  ],
  "Skills & tactics": [
    "Community drills",
    "Community technique",
    "Community tactics",
    "Club tactics",
    "technique",
    "skills",
    "tactics",
    "drills",
  ],
  Coaching: [
    "Community coaching",
    "Federation coaching manual",
    "Federation training",
    "Association coaching manual",
    "Association coaching governance",
    "Association training",
    "Federation partnered course",
    "Club coaching manual",
    "Retailer coaching library",
    "Retailer coaching manual",
    "Retailer coaching service",
    "coaching",
    "training",
  ],
  "Rules & refereeing": [
    "Rules",
    "Tournament-regulations",
    "Refereeing",
    "Federation official rules",
    "Federation equipment standard",
    "rules",
    "refereeing",
  ],
  Equipment: [
    "Equipment",
    "Association equipment directory",
    "Retailer equipment",
    "Retailer equipment manufacturer",
    "Association retailer equipment",
    "Association equipment advice",
    "Club equipment / diy",
    "Federation equipment standard",
    "equipment",
  ],
  Safety: ["Safety", "Clean-sport", "safeguarding", "medical"],
  "Clubs & places": [
    "World",
    "Clubs",
    "Community legacy directory",
    "clubs",
    "directory",
    "federation",
    "federations",
    "club-admin",
    "recruitment",
    "governance",
    "geography",
    "map",
    "facilities",
    "club-sessions",
    "schools",
    "development",
  ],
  History: ["History", "history", "origins", "historical-lead"],
  Research: [
    "Research",
    "Primary research",
    "Federation-hosted research library",
    "research",
    "biomechanics",
    "physiology",
  ],
  "Matches & competitions": [
    "Club video library",
    "Federation video directory",
    "Video publisher",
    "video",
    "match-footage",
    "streaming",
    "results",
    "competitions",
    "competition",
    "events",
    "championships",
    "calendar",
    "tournaments",
  ],
  "General reference": ["Community library"],
});

const languageVocabulary = vocabulary({
  English: ["en", "English"],
  French: ["fr", "French"],
  Spanish: ["es", "Spanish"],
  Portuguese: ["pt", "Portuguese"],
  Italian: ["it", "Italian"],
  Turkish: ["tr", "Turkish"],
  German: ["de", "German"],
  Dutch: ["nl", "Dutch"],
  Czech: ["cs", "Czech"],
  "Languages unspecified": ["multilingual-unspecified"],
});

const sourceTypeVocabulary = vocabulary({
  "Sport organization": [
    "Federation",
    "Association",
    "CMAS",
    "CMAS international federation",
    "International federation",
    "National organization",
    "national_organization",
    "national_association",
    "national_federation",
    "regional_organization",
    "regional_federation",
    "international_federation",
    "continental_federation",
    "sport_organization",
    "sport_nonprofit",
    "national_sport_web_presence",
    "suspended_organization",
    "CMAS; public mirror on UWH Australia",
    "CMAS College of Referees",
    "CMAS UWH Referee Committee / College of Referees resource hub",
    "CMAS UWH referee resource hub",
    "CMAS Underwater Hockey Referee Committee; hosted by WUHA",
    "CMAS; hosted by WUHA",
    "CMAS Level 1 training; hosted by WUHA",
    "Wellington Underwater Hockey Association",
    "Underwater Society of America",
    "British Octopush Association",
    "Underwater Hockey New Zealand",
    "Underwater Hockey New Zealand; WUHA mirror",
    "FFESSM Commission Nationale de Hockey Subaquatique",
    "FFESSM CNHS",
    "FFESSM",
    "FFESSM Collège National des Médecins",
    "Federação Portuguesa de Actividades Subaquáticas",
    "NOB underwater hockey programme",
    "FEDAS-hosted CMAS translation",
    "FIPSAS",
    "South African Underwater Hockey Federation",
    "Underwater Hockey Australia",
    "Australian Underwater Federation Queensland",
    "World Anti-Doping Agency",
  ],
  Club: ["Club", "club", "Club guidance", "club_primary", "club_social"],
  "Community resource": [
    "Community / publisher",
    "community_directory",
    "primary_historical_account",
    "open_geographic_data",
    "geographic_directory",
    "Don Mathews; linked by CMAS referee committee",
    "Onderwaterhockey.nl; supported by NOB",
    "Czech underwater hockey community / national sport resource",
    "Czech underwater hockey resource site",
  ],
  "Commercial supplier": ["Commercial vendor", "supplier_primary_source"],
  "Research & education": [
    "Primary research",
    "peer_reviewed_research",
    "peer_reviewed_case_report",
    "university_journal",
    "university",
    "Australian Institute of Sport / Victorian Institute of Sport; UHA mirror",
    "Meisenheimer et al., Cureus; UHA mirror",
    "South Pacific Underwater Medicine Society meeting presentation; UHA host",
    "Divers Alert Network; Jim Chimiak MD and Juan Valdivia-Valdivia MD",
    "Adams, Jones, Partner & Partner; Journal of Science in Sport and Exercise",
  ],
  "Public institution": ["student_union", "municipal", "municipal_link_to_map"],
  "News & media": ["specialist_media", "local_press"],
  "Event platform": [
    "event_platform",
    "event_organizer_platform",
    "tournament_portal",
  ],
  Venue: ["facility_primary"],
});

const accessVocabulary = vocabulary({
  "Listed as public": [
    "Public",
    "Free",
    "Free public library",
    "Free; embedded videos",
    "Free; embedded clips",
    "Free PDF; 111 pages",
    "Free index and downloadable documents",
    "Free PDF; 51 pages",
    "Free PDF; 16 pages",
    "Free PDF; 12 pages",
    "Free PDF; 84 pages",
    "Public information and downloadable course documents",
    "Public webpage or download; no payment observed",
    "read: public; cost: free to read; participation, membership and purchase costs are separate",
    "read: public; cost: free to read",
  ],
  "Preview or index only": [
    "Public information; course participation separate",
    "Public overview; BOA membership required for qualification",
    "Public overview; training enrollment separate",
    "Public overview; enrolled courses separate",
    "Public historical course announcement",
    "Free page; YouTube availability varies",
    "Free public links; destination conditions vary",
    "Public YouTube; availability varies",
    "Free abstract; full article access may differ",
    "Public hub; some downloads require login",
    "Free information; products paid",
    "Public listing; download access unverified",
    "Public listing; document body not retrieved",
    "Public metadata; download redirected to login",
    "Publicly linked; access unverified",
    "Search index readable; full page retrieval not established",
    "Search index readable; document bodies not retrieved",
    "Search listing available; direct open blocked",
    "Listed public PDF; retrieval failed",
    "read: public; cost: May vary by event; playback/paywall not verified",
    "read: public event discovery; account may be needed for registration and administration; cost: public browsing; organization/registration charges not verified",
    "read: PubMed abstract public; full-text rights/access depend on linked publisher; cost: free to read; participation, membership and purchase costs are separate",
    "Public source; platform restrictions may apply",
  ],
  "Login or membership": [
    "Login required",
    "Login required in this check",
    "Canonical download requires login in this check",
    "Login requested by canonical download",
    "Public hub; some downloads require login",
    "Public metadata; download redirected to login",
    "Public overview; BOA membership required for qualification",
  ],
  "Paid content or products": [
    "Paid products",
    "Free information; products paid",
    "Paid; NZD 5 each for three short booklets; NZD 25 school guide observed",
    "Paid PDF; NZD 25 observed",
    "Paid; NZD 60–120 range in collection",
    "Commercial book; retailer not retrievable",
  ],
  "Access unconfirmed": [
    "Course platform; access challenge in retrieval",
    "Online course; price not verified",
    "Free page; YouTube availability varies",
    "Free public links; destination conditions vary",
    "Public YouTube; availability varies",
    "Free abstract; full article access may differ",
    "Public listing; download access unverified",
    "Public listing; document body not retrieved",
    "Publicly linked; access unverified",
    "Commercial book; retailer not retrievable",
    "Site blocked automated retrieval; human accessibility unverified",
    "Search index readable; full page retrieval not established",
    "Search index readable; document bodies not retrieved",
    "Search listing available; direct open blocked",
    "Listed public PDF; retrieval failed",
    "read: public; cost: May vary by event; playback/paywall not verified",
    "read: public event discovery; account may be needed for registration and administration; cost: public browsing; organization/registration charges not verified",
    "read: PubMed abstract public; full-text rights/access depend on linked publisher; cost: free to read; participation, membership and purchase costs are separate",
    "Public source; platform restrictions may apply",
  ],
});

const audienceVocabulary = vocabulary({
  Everyone: ["Everyone"],
  Beginners: ["Beginners", "beginner"],
  Players: ["players", "all players", "competitive athletes"],
  Coaches: ["coaches", "instructors"],
  Referees: [
    "referees",
    "referee candidates",
    "Level 3 candidates",
    "assessors",
  ],
  "Club organizers": [
    "club-organizers",
    "club organisers",
    "club organizers",
    "tournament organisers",
    "organisers",
    "team managers",
  ],
  "Safety & medical teams": [
    "medical staff",
    "club safety officers",
    "safety officers",
  ],
  Spectators: ["spectators"],
  Researchers: ["researchers"],
  "Atlas editors": ["atlas-editors"],
});

function mapped(
  values: string[],
  map: Map<string, string[]>,
  fallback: string,
): string[] {
  const result = unique(
    values.flatMap((value) => map.get(normalize(value)) ?? []),
  );
  return result.length ? result : [fallback];
}

function recordAccess(record: Record<string, unknown>): string[] {
  if (typeof record.access === "string") return [record.access];
  if (
    record.access &&
    typeof record.access === "object" &&
    !Array.isArray(record.access)
  ) {
    const access = record.access as Record<string, unknown>;
    if (typeof access.read === "string" && typeof access.cost === "string") {
      return [`read: ${access.read}; cost: ${access.cost}`];
    }
  }
  return [];
}

export function resourceFacets(resource: Resource): ResourceFacets {
  const records = resource.sourceRecords ?? [];
  const sourceTopics = records.flatMap((record) => [
    ...strings(record.type),
    ...strings(record.category),
    ...strings(record.tags),
  ]);
  const mappedSourceTopics = sourceTopics.flatMap(
    (value) => topicVocabulary.get(normalize(value)) ?? [],
  );
  // The world import uses "World" for research and match archives too. Specific
  // source tags take precedence over that catalog-wide placeholder.
  const topicValues =
    normalize(resource.topic) === "world" && mappedSourceTopics.length
      ? sourceTopics
      : [resource.topic, ...sourceTopics];
  const languages = [
    resource.language,
    ...records.flatMap((r) => [
      ...strings(r.languages),
      ...strings(r.language),
    ]),
  ].flatMap((value) =>
    value
      .split(/[,;&]/)
      .map((part) => part.trim())
      .filter(Boolean),
  );
  const audiences = [
    resource.audience,
    ...records.flatMap((r) => strings(r.audience)),
  ].flatMap((value) =>
    value
      .split(/[,;&]/)
      .map((part) => part.trim())
      .filter(Boolean),
  );
  const sourceTypes = [
    resource.authority,
    ...records.flatMap((r) => [
      ...strings(r.authority),
      ...strings(r.publisher_type),
    ]),
  ];
  const accessValues = [resource.access, ...records.flatMap(recordAccess)];
  let access = unique(
    accessValues.flatMap(
      (value) =>
        accessVocabulary.get(normalize(value)) ?? ["Access unconfirmed"],
    ),
  );
  // Preserve the more specific limitation when merged records also say public.
  // None of these facets claims that a source was independently verified.
  if (access.some((value) => value !== "Listed as public"))
    access = access.filter((value) => value !== "Listed as public");

  return {
    topics: mapped(topicValues, topicVocabulary, "Other topics"),
    languages: mapped(languages, languageVocabulary, "Language unknown"),
    sourceTypes: mapped(
      sourceTypes,
      sourceTypeVocabulary,
      "Source type unknown",
    ),
    access,
    audiences: mapped(audiences, audienceVocabulary, "Audience unspecified"),
  };
}

export function facetOptions(
  records: readonly Resource[],
  key: FacetKey,
): string[] {
  return unique(records.flatMap((record) => resourceFacets(record)[key])).sort(
    (a, b) => a.localeCompare(b),
  );
}

const searchable = (value: string) =>
  normalize(value)
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "");
function matchesQuery(query: string, fields: string[]): boolean {
  const tokens = searchable(query).split(" ").filter(Boolean);
  const text = searchable(fields.join(" "));
  return tokens.every((token) => text.includes(token));
}

const resourceText = (r: Resource) => [
  r.title,
  r.note,
  r.publisher,
  r.topic,
  r.authority,
  r.language,
  r.access,
  r.jurisdiction ?? "",
];

export function filterResources(
  records: readonly Resource[],
  filters: ResourceFilters = {},
): Resource[] {
  const selected: [FacetKey, string | undefined][] = [
    ["topics", filters.topic],
    ["languages", filters.language],
    ["sourceTypes", filters.sourceType],
    ["access", filters.access],
    ["audiences", filters.audience],
  ];
  return records.filter((resource) => {
    if (!matchesQuery(filters.q ?? "", resourceText(resource))) return false;
    const facets = resourceFacets(resource);
    return selected.every(
      ([key, value]) =>
        !value?.trim() ||
        facets[key].some((option) => normalize(option) === normalize(value)),
    );
  });
}

export function filterPlaces(records: readonly Place[], query = ""): Place[] {
  return records.filter((place) =>
    matchesQuery(query, [
      place.name,
      place.country,
      place.region,
      place.description,
      ...strings(place.metadata?.city),
      ...strings(place.metadata?.venue_or_area),
    ]),
  );
}

export function filterSuppliers(
  records: readonly Supplier[],
  filters: SupplierFilters = {},
): Supplier[] {
  return records.filter(
    (supplier) =>
      matchesQuery(filters.q ?? "", [
        supplier.name,
        supplier.country,
        supplier.kind,
        supplier.note,
        ...supplier.categories,
        ...supplier.notes,
      ]) &&
      (!filters.category?.trim() ||
        supplier.categories.some(
          (category) => normalize(category) === normalize(filters.category!),
        )) &&
      (!filters.country?.trim() ||
        normalize(supplier.country) === normalize(filters.country)),
  );
}

export function searchCatalog(query: string): {
  articles: Article[];
  places: Place[];
  suppliers: Supplier[];
  resources: Resource[];
} {
  if (!query.trim())
    return { articles: [], places: [], suppliers: [], resources: [] };
  return {
    articles: articles.filter((article) =>
      matchesQuery(query, [
        article.title,
        article.summary,
        article.category,
        ...article.sections.flatMap((s) => [s.heading, s.body]),
      ]),
    ),
    places: filterPlaces(places, query),
    suppliers: filterSuppliers(suppliers, { q: query }),
    resources: resources.filter((resource) =>
      matchesQuery(query, resourceText(resource)),
    ),
  };
}

export function getPage<T>(
  items: readonly T[],
  requestedPage: number,
  pageSize = 20,
): {
  items: T[];
  page: number;
  pageCount: number;
  total: number;
  start: number;
  end: number;
} {
  const size =
    Number.isFinite(pageSize) && pageSize >= 1 ? Math.floor(pageSize) : 20;
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const requested = Number.isFinite(requestedPage)
    ? Math.floor(requestedPage)
    : 1;
  const page = Math.min(pageCount, Math.max(1, requested));
  const offset = (page - 1) * size;
  return {
    items: items.slice(offset, offset + size),
    page,
    pageCount,
    total: items.length,
    start: items.length ? offset + 1 : 0,
    end: Math.min(offset + size, items.length),
  };
}
