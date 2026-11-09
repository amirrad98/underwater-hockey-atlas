import { useId, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import { type Resource, type Article } from "../data";
import { articleHref, resourceFacets } from "../catalog";

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}

export function SearchField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="search-field">
      <Search size={18} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder || label}
      />
    </label>
  );
}

export function Pagination({
  page,
  pageCount,
  total,
  start,
  end,
  onChange,
}: {
  page: number;
  pageCount: number;
  total: number;
  start: number;
  end: number;
  onChange: (page: number) => void;
}) {
  const change = (next: number) => {
    onChange(next);
    requestAnimationFrame(() => {
      const results = document.querySelector<HTMLElement>(
        "[data-results-start]",
      );
      results?.scrollIntoView({ block: "start" });
      results?.focus({ preventScroll: true });
    });
  };
  if (total === 0) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination-count">
        {start}–{end} of {total}
      </span>
      {pageCount > 1 && (
        <div className="pagination-actions">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => change(page - 1)}
          >
            <ArrowLeft size={16} /> <span>Previous</span>
          </button>
          <span aria-live="polite">
            {page} / {pageCount}
          </span>
          <button
            type="button"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => change(page + 1)}
          >
            <span>Next</span> <ArrowRight size={16} />
          </button>
        </div>
      )}
    </nav>
  );
}

export function EmptyState({
  title,
  children,
  onReset,
}: {
  title: string;
  children?: ReactNode;
  onReset?: () => void;
}) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      {children && <div>{children}</div>}
      {onReset && (
        <button type="button" className="button secondary" onClick={onReset}>
          Clear filters
        </button>
      )}
    </div>
  );
}

export function FilterChips({
  items,
  onReset,
}: {
  items: { label: string; onRemove: () => void }[];
  onReset: () => void;
}) {
  if (!items.length) return null;
  return (
    <div className="active-filters" aria-label="Active filters">
      {items.map((item, i) => (
        <button
          className="filter-chip"
          type="button"
          key={`${item.label}-${i}`}
          onClick={item.onRemove}
          aria-label={`Remove ${item.label} filter`}
        >
          {item.label}
          <X size={13} aria-hidden="true" />
        </button>
      ))}
      <button type="button" className="clear-filters" onClick={onReset}>
        Clear all
      </button>
    </div>
  );
}

export function EquipmentTabs({ active }: { active: "guide" | "suppliers" }) {
  return (
    <nav className="section-tabs" aria-label="Equipment navigation">
      <a
        href="#/equipment"
        aria-current={active === "guide" ? "page" : undefined}
      >
        Equipment guide
      </a>
      <a
        href="#/equipment/suppliers"
        aria-current={active === "suppliers" ? "page" : undefined}
      >
        Suppliers
      </a>
    </nav>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <a className="article-card" href={articleHref(article.id)}>
      <small>{article.category}</small>
      <h3>
        {article.title}
        <ArrowUpRight size={18} aria-hidden="true" />
      </h3>
      <p>{article.summary}</p>
      <span className="card-meta">
        {article.sourceIds.length} source references
      </span>
    </a>
  );
}

export function SourceCard({
  resource: r,
  compact = true,
}: {
  resource: Resource;
  compact?: boolean;
}) {
  const id = useId();
  const facets = resourceFacets(r);
  const external = !r.url.startsWith("#/");
  return (
    <article
      className={`source-card ${compact ? "source-compact" : "source-expanded"}`}
    >
      <div className="source-summary">
        <div className="source-title-block">
          <div className="source-kicker">{r.publisher}</div>
          <h3>
            <a
              href={r.url}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {r.title}
              <ExternalLink size={15} aria-hidden="true" />
              <span className="sr-only">
                {external ? " (opens in a new tab)" : ""}
              </span>
            </a>
          </h3>
          <div className="source-labels">
            <span>{facets.topics.join(" · ")}</span>
            <span>{facets.languages.join(" · ")}</span>
            <span>{facets.access.join(" · ")}</span>
          </div>
        </div>
        <div className="source-review">
          <span>{r.status.replaceAll("_", " ")}</span>
          <span>{r.checkedAt ? `Catalog review ${r.checkedAt}` : r.date}</span>
        </div>
      </div>
      <details className="source-details" open={!compact || undefined}>
        <summary aria-controls={id}>Source context &amp; evidence</summary>
        <div id={id}>
          <p>{r.note}</p>
          <dl className="evidence-grid">
            <dt>Publisher</dt>
            <dd>{r.publisher}</dd>
            <dt>Source classification</dt>
            <dd>{r.authority.replaceAll("_", " ")}</dd>
            <dt>Review status</dt>
            <dd>{r.status.replaceAll("_", " ")}</dd>
            <dt>Access conditions</dt>
            <dd>{r.access.replaceAll("_", " ")}</dd>
            <dt>Publication / record date</dt>
            <dd>{r.date}</dd>
            {r.checkedAt && (
              <>
                <dt>Catalog review</dt>
                <dd>{r.checkedAt}</dd>
              </>
            )}
            <dt>Version / edition</dt>
            <dd>{r.version || "See source; no single edition asserted"}</dd>
            <dt>Geography</dt>
            <dd>{r.jurisdiction || "See source context"}</dd>
            <dt>Reuse</dt>
            <dd>
              {r.rights ||
                "Link only. No permission to redistribute third-party media is assumed."}
            </dd>
          </dl>
        </div>
      </details>
    </article>
  );
}
