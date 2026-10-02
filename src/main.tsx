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
import "./style.css";
import { suppliers } from "./suppliers";
import { equipment } from "./equipment";
const link = (id: string) => `#/wiki/${id}`;
function Board({ compact = false }: { compact?: boolean }) {
  const [formation, setFormation] = useState("3–3");
  const pts =
    formation === "3–3"
      ? [
          [25, 34],
          [50, 34],
          [75, 34],
          [25, 69],
          [50, 69],
          [75, 69],
        ]
      : [
          [30, 29],
          [70, 29],
          [30, 53],
          [70, 53],
          [30, 77],
          [70, 77],
        ];
  return (
    <div className={`board-wrap ${compact ? "compact" : ""}`}>
      <div className="board-top">
        <span>TACTICAL FIELD NOTES</span>
        <span>01 / TEAM SHAPE</span>
      </div>
      <svg
        className="board"
        viewBox="0 0 600 370"
        role="img"
        aria-label={`Conceptual ${formation} six-player formation, not to scale`}
      >
        <defs>
          <pattern
            id="grid"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="currentColor"
              strokeWidth=".5"
            />
          </pattern>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10" fill="#8ee1d0" />
          </marker>
        </defs>
        <rect x="30" y="15" width="540" height="330" rx="5" fill="url(#grid)" />
        <rect
          x="80"
          y="30"
          width="440"
          height="310"
          rx="3"
          fill="none"
          stroke="#81c5be"
          strokeWidth="1.5"
        />
        <path
          d="M80 185H520"
          stroke="#81c5be"
          strokeDasharray="5 7"
          opacity=".4"
        />
        <path d="M240 32H360M240 338H360" stroke="#dfc785" strokeWidth="7" />
        <circle
          cx="300"
          cy="185"
          r="44"
          fill="none"
          stroke="#81c5be"
          opacity=".4"
        />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <path
              d={`M${80 + x * 4.4} ${30 + y * 3.1 - 22}v-26`}
              stroke="#8ee1d0"
              strokeWidth="2"
              markerEnd="url(#arrow)"
              opacity=".7"
            />
            <circle
              cx={80 + x * 4.4}
              cy={30 + y * 3.1}
              r="17"
              fill={i < 3 ? "#91e0cf" : "#174952"}
              stroke="#91e0cf"
            />
            <text
              x={80 + x * 4.4}
              y={35 + y * 3.1}
              textAnchor="middle"
              fill={i < 3 ? "#092f38" : "#c5f6e9"}
              fontSize="13"
            >
              {i + 1}
            </text>
          </g>
        ))}
        <circle cx="322" cy="103" r="6" fill="#e1c17b" />
        <text
          x="45"
          y="195"
          transform="rotate(-90 45 195)"
          fill="#85b0b1"
          fontSize="10"
          letterSpacing="3"
        >
          DIRECTION OF PLAY
        </text>
      </svg>
      <div className="board-bottom">
        <div className="segmented">
          {["3–3", "2–2–2"].map((f) => (
            <button
              key={f}
              aria-pressed={formation === f}
              onClick={() => setFormation(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <span>Conceptual · not to scale</span>
      </div>
    </div>
  );
}
function App() {
  const [hash, setHash] = useState(location.hash || "#/atlas");
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
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
    ["world", "World"],
    ["resources", "Resources"],
    ["suppliers", "Suppliers"],
    ["club", "Timber Whales"],
  ];
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <a className="brand" href="#/atlas">
          <Waves size={31} />
          <span>
            UNDERWATER HOCKEY<small>ATLAS + WIKI</small>
          </span>
        </a>
        <nav aria-label="Main navigation" className={menu ? "open" : ""}>
          {nav.map(([id, name]) => (
            <a
              key={id}
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
          <ArticlePage id={decodeURIComponent(path.slice(7))} />
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
          <a className="diagram-link" href={link("formations")}>
            Read the formation field notes <ArrowUpRight size={16} />
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
  return (
    <div className="page">
      <PageHeading
        tag="THE CONNECTED FIELD GUIDE"
        title="Knowledge worth diving into."
        body="Move from the visual atlas into the details. Official rules, coaching perspectives, and local knowledge keep their own context."
      />
      <div className="chips" aria-label="Article categories">
        {["All", ...new Set(articles.map((a) => a.category))].map((c) => (
          <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="article-grid">
        {articles
          .filter((a) => cat === "All" || a.category === cat)
          .map((a) => (
            <ArticleCard key={a.id} a={a} />
          ))}
      </div>
    </div>
  );
}
function EquipmentGuide() { return <section className="equipment-guide"><div className="section-heading"><h2>The kit, piece by piece.</h2><a className="text-link" href="#/suppliers">Find suppliers <ArrowUpRight size={16}/></a></div><div className="equipment-grid">{equipment.map((e,i)=><details key={e.item}><summary><span>0{i+1}</span><strong>{e.item}</strong><small>{e.function}</small></summary><ul>{e.compare.map(c=><li key={c}>{c}</li>)}</ul><a href="#/resources">Compare with original sources</a></details>)}</div><p className="equipment-note">Original research checklist. Fit and preference do not establish competition compliance; consult the applicable rules and your club.</p></section>}
function ArticlePage({ id }: { id: string }) {
  const a = articles.find((a) => a.id === id);
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
          {id === "formations" && <Board compact />}
          {id === "equipment" && (
            <div className="equipment-panel">
              <Equipment />
              <span>Mask · conceptual equipment illustration</span>
            </div>
          )}
          {id === "equipment" && <EquipmentGuide />}
              {a.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}
          <section>
            <h2>Sources & further reading</h2>
            <div className="source-list">
              {a.sourceIds.map((id) => {
                const s = resources.find((r) => r.id === id);
                return s ? <Source key={id} r={s} /> : null;
              })}
            </div>
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
      </small>
      <details className="source-context"><summary>Version, geography & reuse</summary><dl><dt>Version / edition</dt><dd>{r.version || 'See source; no single edition asserted'}</dd><dt>Jurisdiction / geography</dt><dd>{r.jurisdiction || 'See source context'}</dd><dt>Rights</dt><dd>{r.rights || 'Link only. No permission to redistribute third-party media is assumed.'}</dd></dl></details>
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
        A curated foundation, not an exhaustive encyclopedia. Checked, indexed, historical and restricted sources retain their original review notes. Inclusion does not imply every linked page was directly inspected.
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
        <div className="map-panel">
          <div className="map-caption">
            <Globe2 size={20} />
            <span>
              COMMUNITY COORDINATES
              <br />
              <small>Schematic geographic grid · equirectangular</small>
            </span>
          </div>
          <div className="world-map">
            {[-60, -30, 0, 30, 60].map((lat) => (
              <div
                className="latitude"
                style={{ top: `${((90 - lat) / 180) * 100}%` }}
                key={lat}
              >
                <span>{lat}°</span>
              </div>
            ))}
            {[-120, -60, 0, 60, 120].map((lon) => (
              <div
                className="longitude"
                style={{ left: `${((lon + 180) / 360) * 100}%` }}
                key={lon}
              />
            ))}
            {shown
              .filter((p) => p.lat !== null && p.lon !== null)
              .map((p) => (
                <button
                  key={p.id}
                  className={`map-pin ${/city|town|area/i.test(p.precision) ? "city" : "venue"} ${selected === p.id ? "selected" : ""}`}
                  style={{
                    left: `${((p.lon! + 180) / 360) * 100}%`,
                    top: `${((90 - p.lat!) / 180) * 100}%`,
                  }}
                  onClick={() => setSelected(p.id)}
                  aria-label={`${p.name}: ${p.precision}`}
                  title={p.name}
                >
                  <span />
                  <b>{p.name}</b>
                </button>
              ))}
          </div>
          <p>
            Only records with known coordinates appear. All directory records
            remain available below.
          </p>
        </div>
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
              {p.sourceIds && <details className="place-evidence"><summary>Source evidence</summary>{p.sourceIds.map(id=>{const source=resources.find(r=>r.id===id); return source?<a href={source.url} key={id} target="_blank" rel="noreferrer">{source.title} · {source.status} · {source.date}</a>:null})}</details>}
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
              <dd>{s.canadaShipping || "Unknown — confirm with supplier"}</dd>
              <dt>Custom orders</dt>
              <dd>{s.customOrders || "Unknown"}</dd>
              <dt>Club orders</dt>
              <dd>{s.clubOrders || "Unknown"}</dd>
            </dl>
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
function Club() {
  const club = articles.find((a) => a.id === "timber-whales");
  return (
    <>
      <section className="club-hero">
        <div>
          <div className="eyebrow">CLUB FIELD NOTES / CANADA</div>
          <h1>
            From the north.
            <br />
            Below the surface.
          </h1>
          <p>UNBC Timber Whales · Prince George, British Columbia</p>
        </div>
        <div className="club-mark large">
          <Waves size={85} />
          <span>TW</span>
        </div>
      </section>
      <div className="page club-body">
        <div className="schedule">
          <div>
            <small>FALL 2026 · CHECKED OCTOBER 2</small>
            <h2>Meet at Canfor Leisure Pool.</h2>
            <p>
              Schedule from the <a href="https://www.instagram.com/p/DdNdRpuRzGU/" target="_blank" rel="noreferrer">September 12, 2026 club announcement</a>. Prince George local time. Confirm with the club before attending.
            </p>
          </div>
          <div>
            <strong>Sunday</strong>
            <span>17:45–18:45</span>
          </div>
          <div>
            <strong>Wednesday</strong>
            <span>21:00–22:00</span>
          </div>
        </div>
        <div className="notice">
          Older CUGA listings at Prince George Aquatic Centre describe an
          outdated schedule. Public roster entries are undated; 2026 leadership
          is unconfirmed.
        </div>
        {club ? (
          <div className="article-layout">
            <article>
              {club.sections.map((s) => (
                <section key={s.heading}>
                  <h2>{s.heading}</h2>
                  <p>{s.body}</p>
                </section>
              ))}
              <h2>Club sources</h2>
              {club.sourceIds.map((id) => {
                const r = resources.find((r) => r.id === id);
                return r ? <Source key={id} r={r} /> : null;
              })}
            </article>
            <aside>
              <div className="eyebrow">BEFORE YOU GO</div>
              <a href={link("first-session")}>
                Your first club session <ArrowUpRight size={16} />
              </a>
              <a href={link("equipment")}>
                Equipment essentials <ArrowUpRight size={16} />
              </a>
              <a href={link("safety")}>
                Safe participation <ArrowUpRight size={16} />
              </a>
              <a href="#/world">
                More communities <ArrowUpRight size={16} />
              </a>
            </aside>
          </div>
        ) : (
          <p>Detailed source notes are being prepared.</p>
        )}
      </div>
    </>
  );
}
function SearchPage({ query }: { query: string }) {
  const needle = query.trim().toLowerCase();
  const found = needle
    ? articles.filter((a) =>
        (
          a.title +
          " " +
          a.summary +
          " " +
          a.sections.map((s) => s.body).join(" ")
        )
          .toLowerCase()
          .includes(needle),
      )
    : [];
  const refs = needle
    ? resources.filter((r) =>
        (r.title + " " + r.note).toLowerCase().includes(needle),
      )
    : [];
  return (
    <div className="page">
      <PageHeading
        tag="EXPLORE THE CONNECTIONS"
        title={needle ? `Results for “${query}”` : "Search the atlas"}
        body={
          needle
            ? `${found.length} articles and ${refs.length} resources`
            : "Enter a subject in the search field above."
        }
      />
      <div className="article-grid">
        {found.map((a) => (
          <ArticleCard key={a.id} a={a} />
        ))}
      </div>
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
      {needle && !found.length && !refs.length && (
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
