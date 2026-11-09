import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Globe2,
  Waves,
} from "lucide-react";
import { articles, resources } from "../data";
import { equipment } from "../equipment";
import {
  articleHref,
  articleOwner,
  getArticleGroup,
  learnGroups,
  searchCatalog,
} from "../catalog";
import type { CatalogPageProps } from "../navigation";
import { Board, Equipment } from "../components/Diagrams";
import {
  ArticleCard,
  EmptyState,
  EquipmentTabs,
  PageHeading,
  SearchField,
  SourceCard,
} from "../components/ui";

export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-intro">
          <div className="eyebrow">
            <span className="status-dot" /> THE UNDERWATER HOCKEY ATLAS
          </div>
          <h1>
            Learn the game.
            <br />
            <span>Find your community.</span>
          </h1>
          <p>
            A practical guide to underwater hockey, from your first club session
            to the skills, equipment, and people behind the sport.
          </p>
        </div>
        <div className="home-portals">
          <a href={articleHref("first-session")}>
            <span className="portal-icon">
              <BookOpen size={24} />
            </span>
            <div>
              <small>01 / START HERE</small>
              <h2>Learn the basics</h2>
              <p>What to expect at your first session.</p>
            </div>
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
          <a href="#/clubs">
            <span className="portal-icon">
              <Globe2 size={24} />
            </span>
            <div>
              <small>02 / FIND YOUR PEOPLE</small>
              <h2>Find a club</h2>
              <p>Explore clubs, places, and organizations.</p>
            </div>
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
          <a href="#/equipment">
            <span className="portal-icon">
              <Equipment />
            </span>
            <div>
              <small>03 / GET EQUIPPED</small>
              <h2>Explore equipment</h2>
              <p>Understand the kit and find suppliers.</p>
            </div>
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
        </div>
        <div className="home-hero-foot">
          <span>INDEPENDENT. CONNECTED. SOURCED.</span>
          <a href="#/library">
            Explore the source library <ArrowRight size={15} />
          </a>
        </div>
      </section>
      <div className="page home-content">
        <section className="beginner-path" aria-labelledby="beginner-heading">
          <div className="section-heading">
            <div>
              <div className="eyebrow">BEFORE YOUR FIRST SESSION</div>
              <h2 id="beginner-heading">Three useful reads.</h2>
            </div>
            <a className="text-link" href="#/learn">
              All learning guides <ArrowRight size={16} />
            </a>
          </div>
          <div className="reading-path">
            {[
              [
                "first-session",
                "Your first session",
                "Arriving, joining in, and asking the right questions.",
              ],
              [
                "equipment",
                "Equipment essentials",
                "What the kit does and what to ask your club about.",
              ],
              [
                "safety",
                "Safe participation",
                "Supervision, preparation, and looking after each other.",
              ],
            ].map(([id, title, body], i) => (
              <a href={articleHref(id)} key={id}>
                <span className="step-number">0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
        <section className="home-club" aria-labelledby="home-club-heading">
          <div className="club-mark" aria-hidden="true">
            <Waves size={50} />
            <span>TW</span>
          </div>
          <div>
            <div className="eyebrow">FEATURED CLUB / PRINCE GEORGE, CANADA</div>
            <h2 id="home-club-heading">UNBC Timber Whales</h2>
            <p>
              A local starting point in northern British Columbia. Meet the club
              and explore its story.
            </p>
          </div>
          <a className="button secondary" href="#/clubs/timber-whales">
            Meet the club <ArrowRight size={16} />
          </a>
        </section>
      </div>
    </>
  );
}

export function LearnPage({ params, updateQuery }: CatalogPageProps) {
  const requested = params.get("group") || "";
  const group = learnGroups.some((item) => item.id === requested)
    ? requested
    : "";
  const q = params.get("q") || "";
  const guides = (q.trim() ? searchCatalog(q).articles : articles).filter(
    (article) =>
      articleOwner(article) === "learn" &&
      (!group || getArticleGroup(article) === group),
  );
  const activeGroup = learnGroups.find((item) => item.id === group);
  return (
    <div className="page">
      <PageHeading
        eyebrow="LEARN"
        title="Understand the game."
        description="Start with the basics, work on your skills, or find a clear route through the rules."
      />
      <div className="learn-layout">
        <aside className="learning-sidebar" aria-label="Learning topics">
          <div className="eyebrow">BROWSE BY TOPIC</div>
          <button
            type="button"
            aria-pressed={!group}
            onClick={() => updateQuery({ group: null })}
          >
            All guides <ArrowRight size={15} />
          </button>
          {learnGroups.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={group === item.id}
              onClick={() => updateQuery({ group: item.id })}
            >
              {item.label}
              <ArrowRight size={15} />
            </button>
          ))}
          <div className="sidebar-note">
            <Compass size={21} />
            <p>Choosing your kit?</p>
            <a className="text-link" href="#/equipment">
              Open the equipment guide <ArrowUpRight size={14} />
            </a>
          </div>
        </aside>
        <section className="learn-results" aria-label="Learning guides">
          <SearchField
            label="Search learning guides"
            placeholder="Search a skill, rule, or question"
            value={q}
            onChange={(value) => updateQuery({ q: value }, { replace: true })}
          />
          {activeGroup && (
            <div className="topic-intro">
              <h2>{activeGroup.label}</h2>
              <p>{activeGroup.description}</p>
            </div>
          )}
          {group === "skills-tactics" && (
            <div className="tactics-intro">
              <Board compact />
              <div>
                <h3>A shape is a starting point.</h3>
                <p>
                  Explore the original formation diagram, then read how
                  positioning supports the team.
                </p>
                <a className="text-link" href={articleHref("formations")}>
                  Formation field notes <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          )}
          <div
            className="results-heading"
            data-results-start
            tabIndex={-1}
            aria-live="polite"
          >
            {guides.length} {guides.length === 1 ? "guide" : "guides"}
            {q && <> matching “{q}”</>}
          </div>
          <div className="article-grid">
            {guides.map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
          </div>
          {!guides.length && (
            <EmptyState
              title="No matching guides"
              onReset={() => updateQuery({ q: null, group: null })}
            >
              <p>Try another term or choose a different topic.</p>
            </EmptyState>
          )}
        </section>
      </div>
    </div>
  );
}

export function EquipmentPage() {
  return (
    <div className="page">
      <PageHeading
        eyebrow="EQUIPMENT"
        title="Know your kit."
        description="Understand what each piece does, look after it, and find the people who supply it."
      />
      <EquipmentTabs active="guide" />
      <section className="equipment-intro">
        <div>
          <h2>Start with fit and function.</h2>
          <p>
            Your club can help you understand suitable equipment and any loan
            gear available before you buy.
          </p>
          <a className="button" href={articleHref("equipment")}>
            Read the equipment guide <ArrowRight size={16} />
          </a>
        </div>
        <div className="equipment-illustration">
          <Equipment />
          <small>Original, conceptual illustration</small>
        </div>
      </section>
      <EquipmentChecklist />
      <section aria-labelledby="equipment-reading" className="section-gap">
        <div className="section-heading">
          <h2 id="equipment-reading">Choosing and caring for gear.</h2>
          <a className="text-link" href="#/equipment/suppliers">
            Browse suppliers <ArrowRight size={16} />
          </a>
        </div>
        <div className="article-grid three-columns">
          {articles
            .filter((article) => articleOwner(article) === "equipment")
            .map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
        </div>
      </section>
      <p className="inline-note">
        Competition requirements vary by the applicable rules.{" "}
        <a href={articleHref("equipment-and-pool-compliance")}>
          Read the equipment and playing-area standards guide.
        </a>
      </p>
    </div>
  );
}

export function EquipmentChecklist() {
  return (
    <section className="equipment-checklist" aria-labelledby="kit-heading">
      <div className="section-heading">
        <h2 id="kit-heading">The kit, piece by piece.</h2>
        <span className="muted">Select an item to explore</span>
      </div>
      <div className="equipment-grid">
        {equipment.map((item, i) => (
          <details key={item.item}>
            <summary>
              <span className="equipment-number">0{i + 1}</span>
              <span>
                <strong>{item.item}</strong>
                <small>{item.function}</small>
              </span>
            </summary>
            <div className="equipment-details">
              <ul>
                {item.compare.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <a className="text-link" href="#/library?topic=Equipment">
                Equipment sources <ArrowUpRight size={14} />
              </a>
            </div>
          </details>
        ))}
      </div>
      <p className="inline-note">
        This checklist supports a conversation with your club. Fit and
        preference do not establish competition compliance.
      </p>
    </section>
  );
}

const ownerLabels = {
  learn: "Learn",
  clubs: "Clubs & places",
  equipment: "Equipment",
  library: "Library",
};
const ownerPaths = {
  learn: "#/learn",
  clubs: "#/clubs",
  equipment: "#/equipment",
  library: "#/library",
};

function ArticleContents({
  sections,
  onJump,
  mobile = false,
}: {
  sections: { heading: string }[];
  onJump: (index: number | "sources") => void;
  mobile?: boolean;
}) {
  return (
    <details
      className={`article-contents ${mobile ? "mobile-contents" : "desktop-contents"}`}
      open={!mobile || undefined}
    >
      <summary>On this page</summary>
      <nav aria-label="Article contents">
        {sections.map((section, i) => (
          <button type="button" key={section.heading} onClick={() => onJump(i)}>
            {section.heading}
          </button>
        ))}
        <button type="button" onClick={() => onJump("sources")}>
          Sources &amp; further reading
        </button>
      </nav>
    </details>
  );
}

export function ArticlePage({ id }: { id: string }) {
  const article = articles.find((item) => item.id === id);
  if (!article)
    return (
      <div className="page">
        <EmptyState title="Article not found">
          <p>
            That article link could not be found.{" "}
            <a href="#/learn">Browse the learning guides.</a>
          </p>
        </EmptyState>
      </div>
    );
  const owner = articleOwner(article);
  const group = getArticleGroup(article);
  const groupLabel = learnGroups.find((item) => item.id === group)?.label;
  const related = article.related
    .map((item) => articles.find((a) => a.id === item))
    .filter((item) => item !== undefined);
  const sources = article.sourceIds
    .map((sourceId) => resources.find((resource) => resource.id === sourceId))
    .filter((item) => item !== undefined);
  const jumpTo = (index: number | "sources") => {
    const target = document.getElementById(`article-section-${index}`);
    target?.scrollIntoView({ block: "start", behavior: "auto" });
    target?.focus({ preventScroll: true });
  };
  return (
    <div className="page article-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href={ownerPaths[owner]}>{ownerLabels[owner]}</a>
        {owner === "learn" && groupLabel && (
          <>
            <span aria-hidden="true">/</span>
            <a href={`#/learn?group=${group}`}>{groupLabel}</a>
          </>
        )}
      </nav>
      <PageHeading
        eyebrow={article.category}
        title={article.title}
        description={article.summary}
      />
      <div className="article-layout">
        <article className="article-body">
          {article.sections.length >= 3 && (
            <ArticleContents
              sections={article.sections}
              onJump={jumpTo}
              mobile
            />
          )}
          {id === "formations" && <Board />}
          {id === "equipment" && (
            <div className="article-callout">
              <Equipment />
              <p>
                Explore the equipment checklist and supplier directory together.
              </p>
              <a className="text-link" href="#/equipment">
                Equipment overview <ArrowRight size={16} />
              </a>
            </div>
          )}
          {article.sections.map((section, i) => (
            <section
              className="article-section"
              key={section.heading}
              id={`article-section-${i}`}
              tabIndex={-1}
            >
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <section
            className="article-sources"
            id="article-section-sources"
            tabIndex={-1}
          >
            <div className="section-heading">
              <h2>Sources &amp; further reading</h2>
              <span className="muted">{sources.length} references</span>
            </div>
            <p className="inline-note">
              Each source retains its own date, access conditions, and review
              status.
            </p>
            <div className="source-list">
              {sources.map((resource) => (
                <SourceCard key={resource.id} resource={resource} compact />
              ))}
            </div>
          </section>
        </article>
        <aside className="article-sidebar">
          {article.sections.length >= 3 && (
            <ArticleContents sections={article.sections} onJump={jumpTo} />
          )}
          <div className="related-guides">
            <div className="eyebrow">RELATED GUIDES</div>
            {related.map((item) => (
              <a href={articleHref(item.id)} key={item.id}>
                {item.title}
                <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
          <a className="text-link" href={ownerPaths[owner]}>
            <ArrowLeft size={15} /> Browse {ownerLabels[owner].toLowerCase()}
          </a>
        </aside>
      </div>
    </div>
  );
}

export function ClubPage() {
  const club = articles.find((article) => article.id === "timber-whales");
  return (
    <div className="page club-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="#/clubs">Clubs &amp; places</a>
        <span aria-hidden="true">/</span>
        <span>Timber Whales</span>
      </nav>
      <div className="club-heading">
        <PageHeading
          eyebrow="PRINCE GEORGE, BRITISH COLUMBIA"
          title="UNBC Timber Whales"
          description="A northern community with a story beneath the surface."
        />
        <div className="club-mark" aria-hidden="true">
          <Waves size={52} />
          <span>TW</span>
        </div>
      </div>
      <section
        className="club-schedule"
        aria-labelledby="club-schedule-heading"
      >
        <div>
          <div className="eyebrow">FALL 2026 / CHECKED OCTOBER 2</div>
          <h2 id="club-schedule-heading">Canfor Leisure Pool</h2>
          <p>
            From the{" "}
            <a
              href="https://www.instagram.com/p/DdNdRpuRzGU/"
              target="_blank"
              rel="noreferrer"
            >
              September 12, 2026 club announcement
            </a>
            . Prince George local time. Confirm with the club before attending.
          </p>
        </div>
        <div className="schedule-time">
          <span>Sunday</span>
          <strong>17:45–18:45</strong>
        </div>
        <div className="schedule-time">
          <span>Wednesday</span>
          <strong>21:00–22:00</strong>
        </div>
      </section>
      <p className="notice">
        Older CUGA listings at Prince George Aquatic Centre describe an outdated
        schedule. Public roster entries are undated; 2026 leadership is
        unconfirmed.
      </p>
      <div className="article-layout">
        <article className="article-body">
          {club?.sections.map((section) => (
            <section className="article-section" key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <section className="article-sources">
            <h2>Club sources</h2>
            <div className="source-list">
              {club?.sourceIds
                .map((id) => resources.find((resource) => resource.id === id))
                .filter((item) => item !== undefined)
                .map((resource) => (
                  <SourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </section>
        </article>
        <aside className="article-sidebar">
          <div className="related-guides">
            <div className="eyebrow">BEFORE YOU GO</div>
            <a href={articleHref("first-session")}>
              Your first session <ArrowUpRight size={15} />
            </a>
            <a href="#/equipment">
              Equipment essentials <ArrowUpRight size={15} />
            </a>
            <a href={articleHref("safety")}>
              Safe participation <ArrowUpRight size={15} />
            </a>
          </div>
          <a className="text-link" href="#/clubs">
            <ArrowLeft size={15} /> All clubs &amp; places
          </a>
        </aside>
      </div>
    </div>
  );
}
