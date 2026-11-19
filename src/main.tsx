import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, ArrowUpRight, Menu, Search, Waves, X } from "lucide-react";
import { articles } from "./data";
import { articleHref, articleOwner, searchCatalog } from "./catalog";
import { useAtlasRouter, type CatalogPageProps } from "./navigation";
import {
  ArticleCard,
  EmptyState,
  PageHeading,
  SearchField,
  SourceCard,
} from "./components/ui";
import {
  ArticlePage,
  ClubPage,
  EquipmentPage,
  HomePage,
  LearnPage,
} from "./pages/LearningPages";
import { ClubsPage, LibraryPage, SuppliersPage } from "./pages/CatalogPages";
import { ClubSite } from "./ClubSite";
import { BoardPage } from "./playbook/Board";
import { DrillsPage } from "./playbook/Drills";
import { Glossary } from "./wiki/ArticleContent";
import { resolveArticleId } from "./wiki/catalog";
import { registerOffline } from "./offline";
import "./style.css";
import "./editorial.css";

const navigation = [
  { id: "learn", label: "Learn", href: "#/atlas/learn" },
  { id: "clubs", label: "Clubs & places", href: "#/atlas/clubs" },
  { id: "equipment", label: "Equipment", href: "#/atlas/equipment" },
  { id: "library", label: "Library", href: "#/atlas/library" },
];

function App() {
  const router = useAtlasRouter();
  if (router.path === "#/atlas" || router.path.startsWith("#/atlas/"))
    return <AtlasSite router={router} />;
  return <ClubSite router={router} />;
}

function AtlasSite({ router }: { router: ReturnType<typeof useAtlasRouter> }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchQuery =
    router.path === "#/atlas/search" ? router.params.get("q") || "" : "";
  const articleId = router.path.startsWith("#/atlas/wiki/")
    ? resolveArticleId(safeDecode(router.path.slice("#/atlas/wiki/".length)))
    : "";
  const article = articles.find((item) => item.id === articleId);
  const [, , section = "atlas", ...detail] = router.path.split("/");
  const id = detail.length ? safeDecode(detail.join("/")) : undefined;
  const active = article ? articleOwner(article)
    : ["board", "drills", "glossary"].includes(section) ? "learn" : section;

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setQuery(searchQuery);
    const pageTitle =
      article?.title ||
      ({ board: "Tactical board", drills: "Drill library", glossary: "Glossary" } as Record<string, string>)[section] ||
      (
        {
          atlas: "Underwater Hockey Atlas",
          learn: "Learn",
          clubs: "Clubs & places",
          equipment: "Equipment",
          library: "Source library",
          search: "Search",
        } as Record<string, string>
      )[active] ||
      "Underwater Hockey Atlas";
    document.title =
      pageTitle === "Underwater Hockey Atlas"
        ? pageTitle
        : `${pageTitle} | Underwater Hockey Atlas`;
  }, [router.href, searchQuery, article?.title, active, section]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.ctrlKey || event.metaKey) || event.altKey) return;
      event.preventDefault();
      setSearchOpen(true);
      setMenuOpen(false);
      requestAnimationFrame(() => searchInput.current?.focus());
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  useEffect(() => {
    if (menuOpen) document.querySelector<HTMLElement>("#main-navigation a")?.focus();
  }, [menuOpen]);

  const props = { params: router.params, updateQuery: router.updateQuery };
  return (
    <div
      className="app-shell"
      onClick={router.followLink}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          menuButton.current?.focus();
        } else if (event.key === "Escape" && searchOpen) {
          setSearchOpen(false);
          if (searchButton.current?.getBoundingClientRect().width) searchButton.current.focus();
          else searchInput.current?.blur();
        }
      }}
    >
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main");
          main?.focus();
          main?.scrollIntoView({ block: "start" });
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#/atlas"
          aria-label="Underwater Hockey Atlas home"
        >
          <span className="brand-symbol"><Waves size={25} aria-hidden="true" /></span>
          <span>
            UNDERWATER HOCKEY<small>ATLAS &amp; FIELD GUIDE</small>
          </span>
        </a>
        <button
          ref={searchButton}
          className="mobile-search-toggle"
          type="button"
          aria-label="Open site search"
          aria-expanded={searchOpen}
          aria-controls="site-search"
          onClick={() => {
            setSearchOpen((open) => !open);
            setMenuOpen(false);
            if (!searchOpen) requestAnimationFrame(() => searchInput.current?.focus());
          }}
        >
          {searchOpen ? <X size={21} aria-hidden="true" /> : <Search size={21} aria-hidden="true" />}
        </button>
        <button
          ref={menuButton}
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => {
            setMenuOpen((open) => !open);
            setSearchOpen(false);
          }}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        <nav
          id="main-navigation"
          className={`primary-navigation ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          <a
            className="mobile-home"
            href="#/atlas"
            aria-current={active === "atlas" ? "page" : undefined}
          >
            Home
          </a>
          {navigation.map((item) => (
            <a
              href={item.href}
              key={item.id}
              aria-current={active === item.id ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <form
          id="site-search"
          className={`header-search ${searchOpen ? "is-open" : ""}`}
          role="search"
          aria-label="Site search"
          onSubmit={(event) => {
            event.preventDefault();
            setSearchOpen(false);
            router.navigate(
              `#/atlas/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`,
            );
            // Query changes stay on the same route, so also move focus to the
            // results when the submitted mobile search field is collapsed.
            requestAnimationFrame(() => {
              document.getElementById("main")?.focus({ preventScroll: true });
              window.scrollTo(0, 0);
            });
          }}
        >
          <label>
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search the atlas</span>
            <input
              ref={searchInput}
              type="search"
              placeholder="Search the atlas"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button type="submit" aria-label="Submit search">
            <ArrowRight size={16} />
          </button>
        </form>
      </header>
      <main id="main" tabIndex={-1}>
        {router.path === "#/atlas" ? (
          <HomePage />
        ) : router.path === "#/atlas/learn" ? (
          <LearnPage {...props} />
        ) : router.path === "#/atlas/clubs" ? (
          <ClubsPage {...props} />
        ) : router.path === "#/atlas/clubs/timber-whales" ? (
          <ClubPage />
        ) : router.path === "#/atlas/equipment" ? (
          <EquipmentPage />
        ) : router.path === "#/atlas/equipment/suppliers" ? (
          <SuppliersPage {...props} />
        ) : router.path === "#/atlas/library" ? (
          <LibraryPage {...props} />
        ) : router.path === "#/atlas/search" ? (
          <SearchPage {...props} />
        ) : section === "board" ? (
          <BoardPage id={id} />
        ) : section === "drills" ? (
          <DrillsPage key={router.path} id={id} />
        ) : section === "glossary" ? (
          <Glossary id={id} />
        ) : articleId ? (
          <ArticlePage key={articleId} id={articleId} />
        ) : (
          <div className="page">
            <EmptyState title="Page not found">
              <p>
                That page could not be found.{" "}
                <a href="#/atlas">Return to the atlas.</a>
              </p>
            </EmptyState>
          </div>
        )}
      </main>
      <footer className="site-footer">
        <div>
          <a className="brand" href="#/atlas">
            <span className="brand-symbol"><Waves size={25} aria-hidden="true" /></span>
            <span>
              UNDERWATER HOCKEY<small>ATLAS &amp; FIELD GUIDE</small>
            </span>
          </a>
          <p>
            An independent guide to the sport.
            <br />
            Original diagrams, connected sources.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#/atlas/learn">Learn the game</a>
          <a href="#/atlas/clubs">Clubs &amp; places</a>
          <a href="#/atlas/equipment">Equipment</a>
          <a href="#/atlas/library">Source library</a>
        </nav>
        <a className="footer-club" href="#/">
          TimberWhales club homepage <ArrowUpRight size={15} />
        </a>
      </footer>
    </div>
  );
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function SearchPage({ params, updateQuery }: CatalogPageProps) {
  const query = params.get("q") || "";
  const found = searchCatalog(query);
  const total =
    found.articles.length +
    found.places.length +
    found.suppliers.length +
    found.resources.length + found.drills.length + found.scenarios.length;
  const sourceQuery = encodeURIComponent(query.trim());
  return (
    <div className="page search-page">
      <PageHeading
        eyebrow="SEARCH"
        title={
          query.trim() ? `Results for “${query.trim()}”` : "Search the atlas"
        }
        description="Find learning guides, clubs and places, equipment suppliers, and original sources."
      />
      <SearchField
        label="Search all content"
        placeholder="Try a skill, club, country, or supplier"
        value={query}
        onChange={(value) => updateQuery({ q: value }, { replace: true })}
      />
      {query.trim() && (
        <div className="results-heading" role="status">
          {total} {total === 1 ? "match" : "matches"} across the atlas
        </div>
      )}
      {total > 0 && (
        <nav className="search-jumps" aria-label="Search result types">
          {[
            ["guides", "Guides", found.articles.length],
            ["drills", "Drills", found.drills.length],
            ["scenarios", "Tactical scenarios", found.scenarios.length],
            ["places", "Clubs & places", found.places.length],
            ["suppliers", "Suppliers", found.suppliers.length],
            ["sources", "Sources", found.resources.length],
          ]
            .filter(([, , count]) => Number(count) > 0)
            .map(([id, label, count]) => (
              <button
                type="button"
                key={id}
                onClick={() => {
                  const section = document.getElementById(`search-${id}`);
                  section?.scrollIntoView({ block: "start" });
                  section?.focus({ preventScroll: true });
                }}
              >
                {label}
                <span>{count}</span>
              </button>
            ))}
        </nav>
      )}
      {found.articles.length > 0 && (
        <section className="search-section" id="search-guides" tabIndex={-1}>
          <div className="section-heading">
            <h2>
              Guides{" "}
              <span className="heading-count">{found.articles.length}</span>
            </h2>
          </div>
          <div className="article-grid three-columns">
            {found.articles.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      )}
      {[
        { id: "drills", title: "Drills", route: "drills", results: found.drills },
        { id: "scenarios", title: "Tactical scenarios", route: "board", results: found.scenarios },
      ].map(({ id, title, route, results }) => results.length > 0 && (
        <section key={id} className="search-section" id={`search-${id}`} tabIndex={-1}>
          <div className="section-heading"><h2>{title} <span className="heading-count">{results.length}</span></h2></div>
          <div className="search-result-list">
            {results.map((item) => (
              <a className="search-result" key={item.id} href={`#/atlas/${route}/${item.id}`}>
                <div><h3>{item.title}</h3><p>{item.purpose}</p></div>
                <ArrowUpRight size={19} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      ))}
      {found.places.length > 0 && (
        <section className="search-section" id="search-places" tabIndex={-1}>
          <div className="section-heading">
            <h2>
              Clubs &amp; places{" "}
              <span className="heading-count">{found.places.length}</span>
            </h2>
            <a
              className="text-link"
              href={`#/atlas/clubs?q=${sourceQuery}&view=list`}
            >
              All matching places <ArrowRight size={16} />
            </a>
          </div>
          <div className="search-result-list">
            {found.places.slice(0, 6).map((item) => (
              <a
                className="search-result"
                href={`#/atlas/clubs?selected=${encodeURIComponent(item.id)}&view=list`}
                key={item.id}
              >
                <div>
                  <small>
                    {item.country} · {item.region}
                  </small>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                <ArrowUpRight size={19} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      )}
      {found.suppliers.length > 0 && (
        <section className="search-section" id="search-suppliers" tabIndex={-1}>
          <div className="section-heading">
            <h2>
              Suppliers{" "}
              <span className="heading-count">{found.suppliers.length}</span>
            </h2>
            <a
              className="text-link"
              href={`#/atlas/equipment/suppliers?q=${sourceQuery}`}
            >
              All matching suppliers <ArrowRight size={16} />
            </a>
          </div>
          <div className="search-result-list">
            {found.suppliers.slice(0, 6).map((item) => (
              <a
                className="search-result"
                href={`#/atlas/equipment/suppliers?selected=${encodeURIComponent(item.id)}`}
                key={item.id}
              >
                <div>
                  <small>
                    {item.country} · {item.categories.join(", ")}
                  </small>
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                </div>
                <ArrowUpRight size={19} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      )}
      {found.resources.length > 0 && (
        <section className="search-section" id="search-sources" tabIndex={-1}>
          <div className="section-heading">
            <h2>
              Sources{" "}
              <span className="heading-count">{found.resources.length}</span>
            </h2>
            <a className="text-link" href={`#/atlas/library?q=${sourceQuery}`}>
              All matching sources <ArrowRight size={16} />
            </a>
          </div>
          <div className="source-list">
            {found.resources.slice(0, 6).map((item) => (
              <div key={item.id}>
                <SourceCard resource={item} compact />
                <a
                  className="source-library-link"
                  href={`#/atlas/library?selected=${encodeURIComponent(item.id)}`}
                >
                  Open this source in the library <ArrowUpRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
      {!query.trim() && (
        <div className="search-suggestions">
          <h2>A few places to start</h2>
          <div>
            <a href={articleHref("first-session")}>
              Your first session <ArrowRight size={16} />
            </a>
            <a href="#/atlas/equipment">
              Equipment guide <ArrowRight size={16} />
            </a>
            <a href="#/atlas/clubs">
              Clubs &amp; places <ArrowRight size={16} />
            </a>
          </div>
        </div>
      )}
      {query.trim() && total === 0 && (
        <EmptyState title="No matches yet">
          <p>
            Try a shorter term, a country, or a topic such as “equipment” or
            “passing”.
          </p>
          <a className="text-link" href="#/atlas/learn">
            Browse learning guides <ArrowRight size={16} />
          </a>
        </EmptyState>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

registerOffline();
