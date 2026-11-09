import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search,
  Waves,
  Globe2,
  BookOpen,
  ArrowUpRight,
  Compass,
  Menu,
  X,
  ExternalLink,
  SlidersHorizontal,
  MapPin,
} from "lucide-react";
import { articles, resources, places, type Article } from "./data";
import { WorldMap } from "./WorldMap";
import "./style.css";
import { suppliers, supplierSources, supplierNotice } from "./suppliers";
import { equipment } from "./equipment";
import { FormationBoard as Board, BoardPage } from "./playbook/Board";
import { DrillsPage } from "./playbook/Drills";
import { drills, scenarios } from "./playbook/data";
import { ArticleContents, ArticleSections, ArticlePractice, LessonSourceNotes, Glossary, articleSearchText } from "./wiki/ArticleContent";
import { registerOffline } from "./offline";
import { Club } from "./ClubPage";
import { wikiCatalog, resolveArticleId } from "./wiki/catalog";
const link = (id: string) => `#/wiki/${id}`;
function App() {
  const [hash, setHash] = useState(location.hash || "#/atlas");
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!menu) return;
    document.querySelector<HTMLElement>("header > nav a")?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        document.querySelector<HTMLElement>(".menu")?.focus();
      }
    };
    addEventListener("keydown", closeOnEscape);
    return () => removeEventListener("keydown", closeOnEscape);
  }, [menu]);
  useEffect(() => {
    const f = () => {
      setHash(location.hash || "#/atlas");
      setMenu(false);
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  const path = hash.split("?")[0];
  useEffect(() => {
    document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
  }, [path]);
  const nav = [
    ["atlas", "Explore"],
    ["wiki", "Wiki"],
    ["board", "Board"],
    ["drills", "Drills"],
    ["world", "World"],
    ["resources", "Resources"],
    ["suppliers", "Suppliers"],
    ["club", "Timber Whales"],
  ];
  return (
    <>
      <a className="skip" href="#main" onClick={event => { event.preventDefault(); document.querySelector<HTMLElement>("main")?.focus(); }}>
        Skip to content
      </a>
      <header>
        <a className="brand" href="#/atlas">
          <Waves size={31} />
          <span>
            UNDERWATER HOCKEY<small>ATLAS + WIKI</small>
          </span>
        </a>
        <nav id="main-navigation" aria-label="Main navigation" className={menu ? "open" : ""}>
          {nav.map(([id, name]) => (
            <a
              key={id}
              onClick={() => { setMenu(false); document.querySelector<HTMLElement>("main")?.focus(); }}
              href={`#/${id}`}
              aria-current={path.startsWith("#/" + id) ? "page" : undefined}
            >
              {name}
            </a>
          ))}
        </nav>
        <button
          className="menu"
          aria-label="Toggle navigation"
          aria-controls="main-navigation"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <form
          className="header-search"
          onSubmit={(e) => {
            e.preventDefault();
            location.hash = `/search?q=${encodeURIComponent(query)}`;
          }}
        >
          <Search size={17} />
          <input
            aria-label="Search atlas and wiki"
            placeholder="Search the atlas"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd>↵</kbd>
        </form>
      </header>
      <main id="main" tabIndex={-1}>
        {path === "#/atlas" ? (
          <Atlas />
        ) : path === "#/wiki" ? (
          <Wiki />
        ) : path.startsWith("#/wiki/") ? (
          <ArticlePage key={path} id={decodeURIComponent(path.slice(7))} />
        ) : path === "#/board" || path.startsWith("#/board/") ? (
          <BoardPage id={path.startsWith("#/board/") ? decodeURIComponent(path.slice(8)) : undefined} />
        ) : path === "#/drills" || path.startsWith("#/drills/") ? (
          <DrillsPage key={path} id={path.startsWith("#/drills/") ? decodeURIComponent(path.slice(9)) : undefined} />
        ) : path === "#/glossary" || path.startsWith("#/glossary/") ? (
          <Glossary id={path.startsWith("#/glossary/") ? decodeURIComponent(path.slice(11)) : undefined} />
        ) : path === "#/world" ? (
          <World />
        ) : path === "#/resources" ? (
          <Resources />
        ) : path === "#/suppliers" ? (
          <Suppliers />
        ) : path === "#/club" ? (
          <Club />
        ) : path === "#/search" ? (
          <SearchPage
            query={new URLSearchParams(hash.split("?")[1]).get("q") || ""}
          />
        ) : (
          <div className="page">
            <h1>Page not found</h1>
            <a href="#/atlas">Return to the atlas</a>
          </div>
        )}
      </main>
      <footer>
        <a className="brand" href="#/atlas">
          <Waves />
          <span>
            ATLAS + WIKI<small>A FIELD GUIDE TO THE SPORT BELOW.</small>
          </span>
        </a>
        <p>
          An evolving, independent reference.
          <br />
          Original diagrams. Sources always in view.
        </p>
        <a href="#/resources">
          Explore the source library <ArrowUpRight size={16} />
        </a>
      </footer>
    </>
  );
}
function Atlas() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> THE SPORT BELOW THE SURFACE
          </div>
          <h1>
            A different
            <br />
            depth of play.
          </h1>
          <p>
            Six players. One puck. A whole new perspective.
            <br />
            Explore the game, understand the craft, and find
            <br className="desktop" /> your place in the underwater hockey
            world.
          </p>
          <div className="hero-actions">
            <a className="button aqua" href="#/wiki">
              Open the field guide <BookOpen size={17} />
            </a>
            <a className="text-link" href="#/world">
              Find your community <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="hero-foot">
            <span>01 — EXPLORE & UNDERSTAND</span>
            <span>FOUNDATION EDITION / 2026</span>
          </div>
        </div>
        <div className="hero-board">
          <Board />
          <a className="diagram-link" href="#/board">
            Open the tactical playbook <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">CHOOSE YOUR DEPTH</div>
            <h2>Every way into the game.</h2>
          </div>
          <a className="text-link" href="#/wiki">
            All wiki articles <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="explore-grid">
          {[
            {
              id: "first-session",
              n: "01",
              title: "Start at the surface",
              sub: "NEW TO THE SPORT",
              body: "Your first session, the rhythm of the game, and what to bring.",
              icon: <Waves />,
            },
            {
              id: "puck-control",
              n: "02",
              title: "Develop your craft",
              sub: "SKILLS & TACTICS",
              body: "Puck control, support, positioning, and playing as a team.",
              icon: <Compass />,
            },
            {
              id: "equipment",
              n: "03",
              title: "Know your kit",
              sub: "EQUIPMENT GUIDE",
              body: "From mask to fins: understand the tools of the sport.",
              icon: <Equipment />,
            },
            {
              id: "rules",
              n: "04",
              title: "Understand the game",
              sub: "RULES & REFERENCE",
              body: "Official rules, local variations, and the difference between them.",
              icon: <BookOpen />,
            },
          ].map((c) => (
            <a href={link(c.id)} className="explore-card" key={c.id}>
              <div className="card-art">
                {c.icon}
                <span>{c.n}</span>
              </div>
              <small>{c.sub}</small>
              <h3>
                {c.title} <ArrowUpRight size={18} />
              </h3>
              <p>{c.body}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="community">
        <div>
          <div className="eyebrow">THE GAME HAS NO SINGLE HOME</div>
          <h2>
            One sport.
            <br />A world of communities.
          </h2>
          <p>
            Meet the organizations and clubs keeping the puck moving. Start with
            our home-water spotlight in northern British Columbia.
          </p>
          <a className="button dark" href="#/world">
            Explore the world directory <Globe2 size={18} />
          </a>
        </div>
        <a className="club-feature" href="#/club">
          <div className="club-mark">
            <Waves size={66} />
            <span>TW</span>
          </div>
          <div>
            <small>CLUB SPOTLIGHT · PRINCE GEORGE, CANADA</small>
            <h3>UNBC Timber Whales</h3>
            <p>A northern community with a story beneath the surface.</p>
            <span className="text-link">
              Meet the club <ArrowUpRight size={18} />
            </span>
          </div>
        </a>
      </section>
      <section className="section learning">
        <div>
          <div className="eyebrow">A LITTLE DIRECTION</div>
          <h2>Your first three dives.</h2>
          <p>A reading path for your first club session.</p>
        </div>
        {[
          [
            "first-session",
            "Get your bearings",
            "What to expect when you arrive.",
          ],
          [
            "equipment",
            "Meet the equipment",
            "Fit, function, and club guidance.",
          ],
          ["safety", "Play with care", "Supervision and safe participation."],
        ].map(([id, title, body], i) => (
          <a href={link(id)} key={id}>
            <span>0{i + 1}</span>
            <h3>{title}</h3>
            <p>{body}</p>
            <ArrowUpRight size={18} />
          </a>
        ))}
      </section>
    </>
  );
}
function Equipment() {
  return (
    <svg viewBox="0 0 140 75" role="img" aria-label="Conceptual mask diagram">
      <path
        d="M15 20Q70 1 125 20L118 52Q100 69 82 49L70 33L58 49Q40 69 22 52Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M29 25L55 21L54 42Q40 59 29 43ZM85 21L111 25V43Q100 59 86 42Z"
        fill="currentColor"
        opacity=".16"
      />
    </svg>
  );
}
function PageHeading({
  tag,
  title,
  body,
}: {
  tag: string;
  title: string;
  body: string;
}) {
  return (
    <div className="page-heading">
      <div className="eyebrow">{tag}</div>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
}
function ArticleCard({ a }: { a: Article }) {
  return (
    <a className="article-card" href={link(a.id)}>
      <small>{a.category}</small>
      <h3>
        {a.title}
        <ArrowUpRight size={18} />
      </h3>
      <p>{a.summary}</p>
      <span>{a.sourceIds.length} source references</span>
    </a>
  );
}
function Wiki() {
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("All");
  return (
    <div className="page">
      <PageHeading
        tag="THE CONNECTED FIELD GUIDE"
        title="Knowledge worth diving into."
        body="Move from the visual atlas into the details. Official rules, coaching perspectives, and local knowledge keep their own context."
      />
      <div className="wiki-practice-banner"><a href="#/board">Walk through a tactical sequence <ArrowUpRight size={17} /></a><a href="#/drills">Find a drill to practise <ArrowUpRight size={17} /></a></div>
      <div className="chips" aria-label="Article categories">
        {["All", ...new Set(articles.map((a) => a.category))].map((c) => (
          <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="chips" aria-label="Reading level">{["All", "Newbie", "Intermediate"].map(item => <button key={item} aria-pressed={level === item} onClick={() => setLevel(item)}>{item === "All" ? "All reading levels" : item}</button>)}</div>
      <div className="article-grid">
        {articles
          .filter((a) => (cat === "All" || a.category === cat) && (level === "All" || a.readerLevel === level))
          .map((a) => (
            <ArticleCard key={a.id} a={a} />
          ))}
      </div>
      <section className="reading-paths"><h2>Follow a reading path</h2><div className="article-grid">{wikiCatalog.readingPaths.map(path => <div className="reading-path-card" key={path.id}><h3>{path.title}</h3><ol>{path.chapterIds.map(id => { const article = articles.find(item => item.id === resolveArticleId(id)); return article && <li key={id}><a href={link(article.id)}>{article.title}</a></li>; })}</ol></div>)}</div><a className="text-link" href="#/glossary">Explore the local concept glossary <ArrowUpRight size={17} /></a></section>
    </div>
  );
}
function EquipmentGuide() {
  return (
    <section className="equipment-guide">
      <div className="section-heading">
        <h2>The kit, piece by piece.</h2>
        <a className="text-link" href="#/suppliers">
          Find suppliers <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="equipment-grid">
        {equipment.map((e, i) => (
          <details key={e.item}>
            <summary>
              <span>0{i + 1}</span>
              <strong>{e.item}</strong>
              <small>{e.function}</small>
            </summary>
            <ul>
              {e.compare.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <a href="#/resources">Compare with original sources</a>
          </details>
        ))}
      </div>
      <p className="equipment-note">
        Original research checklist. Fit and preference do not establish
        competition compliance; consult the applicable rules and your club.
      </p>
    </section>
  );
}
function ArticlePage({ id }: { id: string }) {
  if (id === "timber-whales") return <Club />;
  const a = articles.find((a) => a.id === resolveArticleId(id));
  if (!a)
    return (
      <div className="page">
        <h1>Article not found</h1>
        <a href="#/wiki">Browse the wiki</a>
      </div>
    );
  return (
    <div className="page article-page">
      <a className="breadcrumb" href="#/wiki">
        Wiki / {a.category}
      </a>
      <PageHeading tag={a.category} title={a.title} body={a.summary} />
      <div className="article-layout">
        <article>
          <ArticleContents article={a} />
          {id === "formations" && <Board compact />}
          {id === "equipment" && (
            <div className="equipment-panel">
              <Equipment />
              <span>Mask · conceptual equipment illustration</span>
            </div>
          )}
          {id === "equipment" && <EquipmentGuide />}
          <ArticleSections article={a} />
          <ArticlePractice article={a} />
          <section>
            <h2>Sources & further reading</h2>
            <details className="article-sources"><summary>Open {a.sourceIds.length} supporting source notes</summary>
            <LessonSourceNotes article={a} />
            <div className="source-list">
              {a.sourceIds.map((id) => {
                const s = resources.find((r) => r.id === id);
                return s ? <Source key={id} r={s} /> : null;
              })}
            </div>
            </details>
          </section>
        </article>
        <aside>
          <div className="eyebrow">KEEP EXPLORING</div>
          {a.related.map((id) => {
            const other = articles.find((x) => x.id === id);
            return other ? (
              <a key={id} href={link(id)}>
                {other.title}
                <ArrowUpRight size={16} />
              </a>
            ) : null;
          })}
          <p>
            Sources retain their own dates, jurisdictions and access conditions.
            Coaching diagrams are conceptual, not official rule illustrations.
          </p>
          <a href="#/resources">
            Full resource library <ExternalLink size={16} />
          </a>
        </aside>
      </div>
    </div>
  );
}
function Source({ r }: { r: (typeof resources)[number] }) {
  return (
    <div className="source">
      <div className="source-head">
        <span className="badge">{r.authority}</span>
        <span>
          {r.language} · {r.access}
        </span>
      </div>
      <a href={r.url} target="_blank" rel="noreferrer">
        {r.title} <ExternalLink size={15} />
      </a>
      <p>{r.note}</p>
      <small>
        {r.publisher} · {r.status} · {r.date}
        {r.checkedAt && <> · Catalog review {r.checkedAt}</>}
      </small>
      <details className="source-context">
        <summary>Version, geography & reuse</summary>
        <dl>
          <dt>Version / edition</dt>
          <dd>{r.version || "See source; no single edition asserted"}</dd>
          <dt>Jurisdiction / geography</dt>
          <dd>{r.jurisdiction || "See source context"}</dd>
          <dt>Rights</dt>
          <dd>
            {r.rights ||
              "Link only. No permission to redistribute third-party media is assumed."}
          </dd>
        </dl>
      </details>
    </div>
  );
}
function Resources() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");
  const keys = [
    "topic",
    "language",
    "audience",
    "authority",
    "access",
  ] as const;
  const result = resources.filter(
    (r) =>
      (r.title + " " + r.note + " " + r.publisher)
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      keys.every((k) => !filters[k] || r[k] === filters[k]),
  );
  return (
    <div className="page">
      <PageHeading
        tag="FOLLOW THE EVIDENCE"
        title="A library with context."
        body="Read the original. Every resource carries an editorial note, an access label, and a clear indication of what was checked."
      />
      <div className="notice">
        A curated foundation, not an exhaustive encyclopedia. Checked, indexed,
        historical and restricted sources retain their original review notes.
        Inclusion does not imply every linked page was directly inspected.
      </div>
      <div className="filters">
        <label className="resource-search">
          <Search size={18} />
          <input
            aria-label="Search resources"
            placeholder="Search resources"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        {keys.map((k) => (
          <label key={k}>
            {k[0].toUpperCase() + k.slice(1)}
            <select
              aria-label={k[0].toUpperCase() + k.slice(1)}
              value={filters[k] || ""}
              onChange={(e) => setFilters({ ...filters, [k]: e.target.value })}
            >
              <option value="">All</option>
              {[...new Set(resources.map((r) => r[k]))].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="results-line">
        <span>{result.length} resources</span>
        <button
          onClick={() => {
            setFilters({});
            setQ("");
          }}
        >
          Reset filters <SlidersHorizontal size={15} />
        </button>
      </div>
      <div className="resource-grid">
        {result.map((r) => (
          <Source key={r.id} r={r} />
        ))}
      </div>
      {!result.length && (
        <div className="empty">
          <h2>No matching resources</h2>
          <p>Try another term or reset your filters.</p>
        </div>
      )}
    </div>
  );
}
function World() {
  const [view, setView] = useState("Map");
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const shown = places.filter((p) =>
    (p.name + " " + p.country + " " + p.region)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <div className="page">
      <PageHeading
        tag="PEOPLE & PLACES"
        title="Find your patch of blue."
        body="Explore national organizations, representative clubs and known venues. Each record keeps its coordinate precision and evidence; a marker is not a guarantee of a current session."
      />
      <div className="world-controls">
        <label className="resource-search">
          <Search size={18} />
          <input
            aria-label="Search places"
            placeholder="Search country or community"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="segmented light">
          {["Map", "List"].map((v) => (
            <button
              key={v}
              aria-pressed={view === v}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      {view === "Map" && (
        <WorldMap places={shown} selected={selected} onSelect={setSelected} />
      )}
      <div className="results-line">{shown.length} directory entries</div>
      <div className="article-grid">
        {shown
          .sort((a, b) => Number(b.id === selected) - Number(a.id === selected))
          .map((p) => (
            <div
              key={p.id}
              className={`place-card ${p.id === selected ? "selected" : ""}`}
            >
              <small>
                <MapPin size={14} />
                {p.country} · {p.region}
              </small>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <span className="precision">{p.precision}</span>
              {p.sourceIds && (
                <details className="place-evidence">
                  <summary>Source evidence</summary>
                  {p.sourceIds.map((id) => {
                    const source = resources.find((r) => r.id === id);
                    return source ? (
                      <a
                        href={source.url}
                        key={id}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {source.title} · {source.status} · {source.date}
                      </a>
                    ) : null;
                  })}
                </details>
              )}
              <a href={p.url} target="_blank" rel="noreferrer">
                Visit organization <ExternalLink size={15} />
              </a>
            </div>
          ))}
      </div>
      {!shown.length && (
        <div className="empty">
          No matching places. Try a country or community name.
        </div>
      )}
    </div>
  );
}
function Suppliers() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const result = suppliers.filter(
    (s) =>
      (s.name + " " + s.note).toLowerCase().includes(q.toLowerCase()) &&
      (!category || s.categories.includes(category)) &&
      (!country || s.country === country),
  );
  return (
    <div className="page">
      <PageHeading
        tag="EQUIPMENT SOURCES"
        title="Find the people behind the kit."
        body="An independent supplier directory. Compare gear categories and location, then confirm suitability and availability directly with the supplier."
      />
      <div className="notice">{supplierNotice}</div>
      <div className="filters">
        <label className="resource-search">
          <Search size={18} />
          <input
            aria-label="Search suppliers"
            placeholder="Search suppliers"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label>
          Gear category
          <select
            aria-label="Gear category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {[...new Set(suppliers.flatMap((s) => s.categories))]
              .sort()
              .map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>
        </label>
        <label>
          Country
          <select
            aria-label="Supplier country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">All countries</option>
            {[...new Set(suppliers.map((s) => s.country))].sort().map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="results-line">
        <span>{result.length} suppliers</span>
        <button
          onClick={() => {
            setQ("");
            setCategory("");
            setCountry("");
          }}
        >
          Reset filters
        </button>
      </div>
      <div className="resource-grid">
        {result.map((s) => (
          <div className="source supplier" key={s.id}>
            <div className="source-head">
              <span className="badge">{s.kind}</span>
              <span>{s.country}</span>
            </div>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.name} <ExternalLink size={15} />
            </a>
            <p>{s.note}</p>
            <div className="gear-tags">
              {s.categories.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <dl>
              <dt>Canada shipping</dt>
              <dd>
                {s.canadaShipping || "Unknown — confirm with supplier"}
                <p className="shipping-evidence">{s.shippingEvidence}</p>
              </dd>
              <dt>Custom orders</dt>
              <dd>{s.customOrders || "Unknown"}</dd>
              <dt>Club orders</dt>
              <dd>{s.clubOrders || "Unknown"}</dd>
            </dl>
            <details className="supplier-evidence">
              <summary>Verification & source evidence</summary>
              <p>{s.verification}</p>
              {s.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
              {s.sourceIds.map((id) => {
                const source = supplierSources.find((item) => item.id === id);
                return source ? (
                  <div key={id}>
                    <a
                      href={source.publicCitationUrl || source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {source.title} <ExternalLink size={12} />
                    </a>
                    <p>{source.evidenceSummary}</p>
                    <small>
                      {source.access.replaceAll("_", " ")} · {source.checkedAt}
                    </small>
                    {source.accessNote && <p>{source.accessNote}</p>}
                  </div>
                ) : null;
              })}
            </details>
            <small>
              Checked {s.checked} ·{" "}
              <a href={s.sourceUrl} target="_blank" rel="noreferrer">
                Source record
              </a>
            </small>
          </div>
        ))}
      </div>
      {!result.length && (
        <div className="empty">
          <h2>
            {suppliers.length
              ? "No matching suppliers"
              : "Supplier verification in progress"}
          </h2>
          <p>
            {suppliers.length
              ? "Try another category or country."
              : "The directory will open with checked supplier records. Shipping, custom orders and club terms remain unknown unless a source states them."}
          </p>
        </div>
      )}
    </div>
  );
}
function SearchPage({ query }: { query: string }) {
  const needle = query.trim().toLowerCase();
  const found = needle ? articles.filter(article => articleSearchText(article).includes(needle)) : [];
  const drillMatches = needle ? drills.filter(drill => JSON.stringify(drill).toLowerCase().includes(needle)) : [];
  const scenarioMatches = needle ? scenarios.filter(scenario => JSON.stringify(scenario).toLowerCase().includes(needle)) : [];
  const refs = needle
    ? resources.filter((r) =>
        (r.title + " " + r.note).toLowerCase().includes(needle),
      )
    : [];
  const supplierMatches = needle
    ? suppliers.filter((s) =>
        (s.name + " " + s.country + " " + s.categories.join(" ") + " " + s.note)
          .toLowerCase()
          .includes(needle),
      )
    : [];
  return (
    <div className="page">
      <PageHeading
        tag="EXPLORE THE CONNECTIONS"
        title={needle ? `Results for “${query}”` : "Search the atlas"}
        body={
          needle
            ? `${found.length} articles, ${drillMatches.length} drills, ${scenarioMatches.length} scenarios, ${refs.length} resources and ${supplierMatches.length} suppliers`
            : "Enter a subject in the search field above."
        }
      />
      <div className="article-grid">
        {found.map((a) => (
          <ArticleCard key={a.id} a={a} />
        ))}
      </div>
      {drillMatches.length > 0 && <section><h2>Drill matches</h2><div className="article-grid">{drillMatches.map(drill => <a className="article-card" href={`#/drills/${drill.id}`} key={drill.id}><small>{drill.level} · Drill</small><h3>{drill.title}<ArrowUpRight size={17} /></h3><p>{drill.purpose}</p></a>)}</div></section>}
      {scenarioMatches.length > 0 && <section><h2>Tactical scenarios</h2><div className="article-grid">{scenarioMatches.map(scenario => <a className="article-card" href={`#/board/${scenario.id}`} key={scenario.id}><small>{scenario.level} · Board</small><h3>{scenario.title}<ArrowUpRight size={17} /></h3><p>{scenario.purpose}</p></a>)}</div></section>}
      {refs.length > 0 && (
        <>
          <h2>Resource matches</h2>
          <div className="resource-grid">
            {refs.map((r) => (
              <Source key={r.id} r={r} />
            ))}
          </div>
        </>
      )}
      {supplierMatches.length > 0 && (
        <>
          <h2>Supplier matches</h2>
          <div className="article-grid">
            {supplierMatches.map((s) => (
              <a className="article-card" href="#/suppliers" key={s.id}>
                <small>
                  {s.country} · {s.kind}
                </small>
                <h3>{s.name}</h3>
                <p>{s.note}</p>
                <span>Open supplier directory</span>
              </a>
            ))}
          </div>
        </>
      )}
      {needle && !found.length && !refs.length && !supplierMatches.length && !drillMatches.length && !scenarioMatches.length && (
        <div className="empty">
          <h2>No results yet</h2>
          <p>Try “equipment”, “rules”, “safety”, or “Timber Whales”.</p>
          <a href="#/wiki">Browse all articles</a>
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

registerOffline();
