import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  MapPin,
  MoveUpRight,
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
import { TimberwhalesLogo } from "../components/TimberwhalesLogo";
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
      <section className="field-hero" aria-labelledby="home-heading">
        <div className="field-hero-copy">
          <div className="eyebrow field-kicker"><span /> THE UNDERWATER HOCKEY ATLAS</div>
          <h1 id="home-heading">Hockey, below <span>the surface.</span></h1>
          <p>A field guide to a different kind of game. Learn the basics, find your people, and get ready for the pool.</p>
          <div className="field-hero-actions">
            <a className="button" href={articleHref("first-session")}>Your first session <ArrowRight size={18} aria-hidden="true" /></a>
            <a className="text-link" href="#/clubs">Find a club <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <a className="field-equipment-link" href="#/equipment"><Equipment /> <span>New to the kit? <strong>Start with the essentials.</strong></span> <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
        <section className="featured-club" aria-labelledby="featured-club-heading">
          <div className="featured-club-top"><span className="eyebrow">CLUB SPOTLIGHT</span><span>01 / CANADA</span></div>
          <a className="featured-club-art" href="#/clubs/timber-whales" aria-label="Meet the UNBC Timber Whales"><TimberwhalesLogo /></a>
          <div className="featured-club-caption">
            <div><span className="featured-location"><MapPin size={13} aria-hidden="true" /> Prince George, British Columbia</span><h2 id="featured-club-heading">Meet the Timberwhales.</h2></div>
            <a href="#/clubs/timber-whales" className="round-link" aria-label="View the Timber Whales club profile"><MoveUpRight size={23} aria-hidden="true" /></a>
          </div>
        </section>
      </section>

      <section className="field-routes" aria-label="Explore the atlas">
        <div className="field-routes-inner">
          {[
            ["01", "Learn the game", "Guides for your next session", "#/learn"],
            ["02", "Find your people", "Clubs and places to play", "#/clubs"],
            ["03", "Know your kit", "Equipment and suppliers", "#/equipment"],
          ].map(([number, title, description, href]) => (
            <a key={number} href={href}><span className="route-number">{number}</span><span><strong>{title}</strong><small>{description}</small></span><ArrowUpRight size={21} aria-hidden="true" /></a>
          ))}
        </div>
      </section>

      <div className="page field-home-content">
        <section className="field-start" aria-labelledby="beginner-heading">
          <div className="field-section-intro">
            <div className="eyebrow">A GOOD PLACE TO START</div>
            <h2 id="beginner-heading">You don’t need to <br />know it all to jump in.</h2>
            <p>Get a feel for the game, learn what to bring, and arrive with a few good questions.</p>
            <a className="text-link" href="#/learn?group=getting-started">All beginner guides <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="field-reading-list">
            {[
              ["start-here", "How the game works", "The puck, the pool, and the people on your team."],
              ["equipment", "What you’ll need", "A simple introduction to masks, fins, sticks, and the rest."],
              ["safety", "Before you get in", "Supervision, preparation, and looking after each other."],
            ].map(([id, title, body], i) => (
              <a href={articleHref(id)} key={id}><span className="reading-number">0{i + 1}</span><div><h3>{title}</h3><p>{body}</p></div><ArrowUpRight size={20} aria-hidden="true" /></a>
            ))}
          </div>
        </section>
        <section className="field-next" aria-labelledby="next-heading">
          <div><div className="eyebrow">ALREADY PLAYING?</div><h2 id="next-heading">Bring something new<br />to your next session.</h2><p>Puck control, passing, positioning, and the thinking behind a good team.</p><a className="button" href="#/learn?group=skills-tactics">Explore skills &amp; tactics <ArrowRight size={17} aria-hidden="true" /></a></div>
          <div className="field-tactics"><Board compact /><a href={articleHref("formations")}>Read the formation guide <ArrowUpRight size={16} aria-hidden="true" /></a></div>
        </section>
        <aside className="field-library"><BookOpen size={25} aria-hidden="true" /><div><strong>Go straight to the source.</strong><span>Rulebooks, coaching resources, and research, with context for each reference.</span></div><a className="text-link" href="#/library">Browse the library <ArrowRight size={17} aria-hidden="true" /></a></aside>
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
  // Keep the complete index in learning order while preserving search ranking.
  if (!q.trim()) {
    const beginnerOrder = ["start-here", "first-session", "learning-path"];
    guides.sort((a, b) => {
      const topicDifference = learnGroups.findIndex((item) => item.id === getArticleGroup(a)) -
        learnGroups.findIndex((item) => item.id === getArticleGroup(b));
      if (topicDifference) return topicDifference;
      if (getArticleGroup(a) !== "getting-started") return 0;
      const priority = (id: string) => beginnerOrder.includes(id) ? beginnerOrder.indexOf(id) : beginnerOrder.length;
      return priority(a.id) - priority(b.id);
    });
  }
  const activeGroup = learnGroups.find((item) => item.id === group);
  return (
    <div className="page learn-page">
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
          {!group && !q.trim() && (
            <a className="learn-start" href={articleHref("first-session")}>
              <span className="learn-start-icon"><BookOpen size={25} aria-hidden="true" /></span>
              <span><small>NEW TO UNDERWATER HOCKEY?</small><strong>Start with your first session.</strong><span>A short guide to arriving, joining in, and what to ask.</span></span>
              <ArrowRight size={22} aria-hidden="true" />
            </a>
          )}
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
          <div className="article-grid guide-index">
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
          description="Underwater hockey in Prince George, British Columbia. Find the published session details, prepare for a first visit, and get to know the club."
        />
        <TimberwhalesLogo className="club-profile-logo" />
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
      <div className="club-visit-actions"><a className="button" href="https://www.instagram.com/p/DdNdRpuRzGU/" target="_blank" rel="noreferrer">Check the club announcement <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a><a className="text-link" href={articleHref("first-session")}>Planning your first visit? <ArrowRight size={17} aria-hidden="true" /></a></div>
      <details className="club-record-note"><summary>About these club details</summary><p>Older CUGA listings at Prince George Aquatic Centre describe an outdated schedule. Public roster entries are undated; 2026 leadership is unconfirmed. The schedule above is the published fall 2026 schedule, not a live availability feed. Confirm with the club before attending.</p></details>
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
