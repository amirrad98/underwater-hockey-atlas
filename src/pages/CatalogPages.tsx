import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ExternalLink,
  Globe2,
  MapPin,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { resources, places, type Place } from "../data";
import {
  suppliers,
  supplierSources,
  supplierNotice,
  type Supplier,
} from "../suppliers";
import {
  filterResources,
  filterPlaces,
  filterSuppliers,
  facetOptions,
  resourceFacets,
  getPage,
} from "../catalog";
import { canonicalHash } from "../navigation";
import { TimberwhalesLogo } from "../components/TimberwhalesLogo";
import {
  PageHeading,
  SearchField,
  Pagination,
  SourceCard,
  EmptyState,
  FilterChips,
  EquipmentTabs,
} from "../components/ui";
import "./catalog.css";

export interface CatalogPageProps {
  params: URLSearchParams;
  updateQuery: (
    values: Record<string, string | null | undefined>,
    options?: { replace?: boolean },
  ) => void;
}

type FilterChip = { label: string; onRemove: () => void };

function SelectFilter({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  allLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="catalog-filter">
      <span>{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{allLabel}</option>
        {value && !options.includes(value) && (
          <option value={value}>{value}</option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CloseSelection({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const close = () => {
    onClick();
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>("[data-results-start]")?.focus(),
    );
  };
  return (
    <button type="button" className="catalog-close" onClick={close}>
      <X size={16} aria-hidden="true" />
      {label}
    </button>
  );
}

function useSelectedRecord(selected: string | null) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (selected && ref.current) {
      ref.current.focus({ preventScroll: true });
      ref.current.scrollIntoView({ block: "nearest", behavior: "auto" });
    }
  }, [selected]);
  return ref;
}

export function LibraryPage({ params, updateQuery }: CatalogPageProps) {
  const q = params.get("q") || "";
  const topic = params.get("topic") || "";
  const language = params.get("language") || "";
  const sourceType = params.get("sourceType") || "";
  const access = params.get("access") || "";
  const audience = params.get("audience") || "";
  const result = filterResources(resources, {
    q,
    topic,
    language,
    sourceType,
    access,
    audience,
  });
  const paged = getPage(result, Number(params.get("page") || 1), 20);
  const selectedId = params.get("selected");
  const selected = resources.find((resource) => resource.id === selectedId);
  const selectedRef = useSelectedRecord(selected?.id || null);
  const selectedFacets = selected ? resourceFacets(selected) : null;
  const setFilter = (key: string, value: string, replace = false) =>
    updateQuery(
      { [key]: value || null, page: null, selected: null },
      { replace },
    );
  const reset = () =>
    updateQuery({
      q: null,
      topic: null,
      language: null,
      sourceType: null,
      access: null,
      audience: null,
      page: null,
      selected: null,
    });
  const chips: FilterChip[] = [
    ["q", q, "Search"],
    ["topic", topic, "Topic"],
    ["language", language, "Language"],
    ["sourceType", sourceType, "Source type"],
    ["access", access, "Access"],
    ["audience", audience, "Audience"],
  ]
    .filter(([, value]) => value)
    .map(([key, value, label]) => ({
      label: `${label}: ${value}`,
      onRemove: () => setFilter(key, ""),
    }));
  const moreFilterCount = [sourceType, access, audience].filter(Boolean).length;

  return (
    <div className="page catalog-page library-page">
      <PageHeading
        eyebrow="Original sources"
        title="Source library"
        description="Rulebooks, coaching material, research and club information, with the original sources close at hand."
      />
      <details className="catalog-directory-note catalog-library-help">
        <summary>About these sources</summary>
        <p>
          Each source keeps its dates, access conditions and review notes.
          Checked, indexed and historical records are labelled individually.{" "}
          <a href="#/wiki/library-navigation">
            Understand the source labels
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </p>
      </details>

      {selected && (
        <section
          className="catalog-selection"
          data-testid="selected-record"
          aria-label="Selected source"
          ref={selectedRef}
          tabIndex={-1}
        >
          <div className="catalog-selection-heading">
            <div>
              <span className="eyebrow">Selected source</span>
              <h2>{selected.title}</h2>
            </div>
            <CloseSelection
              label="Close source"
              onClick={() => updateQuery({ selected: null })}
            />
          </div>
          {selectedFacets && (
            <p className="catalog-selection-context">
              {[
                selectedFacets.topics.join(", "),
                selectedFacets.languages.join(", "),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          <SourceCard resource={selected} compact={false} />
        </section>
      )}
      {selectedId && !selected && (
        <p className="notice" role="status">
          That source is not in this catalog. You can search the library below.
        </p>
      )}

      <form
        className="catalog-controls"
        aria-label="Filter resources"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="catalog-primary-filters">
          <div className="catalog-search-filter">
            <span aria-hidden="true">Search the library</span>
            <SearchField
              label="Search resources"
              placeholder="Title, topic or publisher"
              value={q}
              onChange={(value) => setFilter("q", value, true)}
            />
          </div>
          <SelectFilter
            label="Topic"
            value={topic}
            options={facetOptions(resources, "topics")}
            allLabel="All topics"
            onChange={(value) => setFilter("topic", value)}
          />
          <SelectFilter
            label="Language"
            value={language}
            options={facetOptions(resources, "languages")}
            allLabel="All languages"
            onChange={(value) => setFilter("language", value)}
          />
        </div>
        <details
          className="catalog-more-filters"
          open={moreFilterCount > 0 || undefined}
        >
          <summary>
            <SlidersHorizontal size={16} aria-hidden="true" />
            More filters
            {moreFilterCount > 0 && (
              <span className="catalog-count">{moreFilterCount} active</span>
            )}
          </summary>
          <div className="catalog-secondary-filters">
            <SelectFilter
              label="Source type"
              value={sourceType}
              options={facetOptions(resources, "sourceTypes")}
              allLabel="All source types"
              onChange={(value) => setFilter("sourceType", value)}
            />
            <SelectFilter
              label="Access"
              value={access}
              options={facetOptions(resources, "access")}
              allLabel="All access types"
              onChange={(value) => setFilter("access", value)}
            />
            <SelectFilter
              label="Audience"
              value={audience}
              options={facetOptions(resources, "audiences")}
              allLabel="All audiences"
              onChange={(value) => setFilter("audience", value)}
            />
          </div>
          <p className="catalog-filter-help">
            Access labels describe the catalog evidence. A public index may link
            to restricted material.
          </p>
        </details>
      </form>

      {chips.length > 0 && <FilterChips items={chips} onReset={reset} />}
      <section className="catalog-results" aria-label="Resource results">
        <div className="catalog-results-bar" data-results-start tabIndex={-1}>
          <p role="status" aria-live="polite" aria-atomic="true">
            <strong>{result.length}</strong>{" "}
            {result.length === 1 ? "resource" : "resources"}
            {chips.length > 0 ? " match your filters" : " in the library"}
          </p>
          <span>20 per page</span>
        </div>
        {result.length > 0 ? (
          <>
            <ul className="catalog-resource-list">
              {paged.items.map((resource) => (
                <li
                  key={resource.id}
                  data-testid="resource-result"
                  data-resource-id={resource.id}
                >
                  <SourceCard resource={resource} compact />
                </li>
              ))}
            </ul>
            <Pagination
              {...paged}
              onChange={(page) =>
                updateQuery({
                  page: page === 1 ? null : String(page),
                  selected: null,
                })
              }
            />
          </>
        ) : (
          <EmptyState title="No matching resources" onReset={reset}>
            Try a broader term or remove a filter.
          </EmptyState>
        )}
      </section>
    </div>
  );
}

function metadataText(place: Place, key: string): string {
  const value = place.metadata?.[key];
  return typeof value === "string" ? value : "";
}

function placeSummary(place: Place): string {
  return [metadataText(place, "city"), metadataText(place, "venue_or_area")]
    .filter(Boolean)
    .join(" · ");
}

function PlaceCard({
  place,
  expanded = false,
  onSelect,
}: {
  place: Place;
  expanded?: boolean;
  onSelect?: () => void;
}) {
  const checked =
    metadataText(place, "last_checked") || metadataText(place, "checked_on");
  const status = metadataText(place, "status");
  const summary = placeSummary(place);
  const notes = metadataText(place, "notes") || metadataText(place, "note");
  const evidence = (place.sourceIds || [])
    .map((id) => resources.find((resource) => resource.id === id))
    .filter((source) => source !== undefined);
  return (
    <article
      className={`catalog-place place-card${expanded ? " is-expanded" : ""}`}
    >
      <div className="catalog-record-identity">
        <div className="catalog-record-meta">
          <span>{place.country}</span>
          <span>{place.region}</span>
        </div>
        <h3>
          {onSelect ? (
            <button
              type="button"
              className="catalog-title-button"
              onClick={onSelect}
            >
              {place.name}
              <ArrowUpRight size={17} aria-hidden="true" />
            </button>
          ) : (
            place.name
          )}
        </h3>
        {summary && <p className="catalog-place-summary">{summary}</p>}
        {status && <p className="catalog-status">{status}</p>}
        {!summary && !status && (
          <p className="catalog-place-summary">{place.description}</p>
        )}
      </div>
      <div className="catalog-record-context">
        <p className="catalog-precision">
          <MapPin size={14} aria-hidden="true" />
          <span>{place.precision}</span>
        </p>
        {checked && <p className="catalog-checked">Catalog checked {checked}</p>}
        <div className="catalog-record-actions">
          {place.url.startsWith("#/") ? (
            <a className="text-link" href={canonicalHash(place.url)}>
              View club profile <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ) : (
            <a
              className="text-link"
              href={place.url}
              target="_blank"
              rel="noreferrer"
            >
              Visit organization <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <details className="catalog-evidence" open={expanded || undefined}>
        <summary>Details &amp; source evidence</summary>
        <p>{place.description}</p>
        {notes && !place.description.includes(notes) && <p>{notes}</p>}
        {evidence.length > 0 ? (
          <ul className="catalog-evidence-list">
            {evidence.map((source) => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
                <p>
                  {source.status} · {source.date}
                  {source.checkedAt
                    ? ` · Catalog review ${source.checkedAt}`
                    : ""}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Consult the linked organization for the available record.</p>
        )}
      </details>
    </article>
  );
}

function SchematicMap({
  shown,
  selectedId,
  onSelect,
}: {
  shown: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const pinned = shown.filter(
    (place) => place.lat !== null && place.lon !== null,
  );
  return (
    <section
      className="catalog-map-panel map-panel"
      aria-label="Schematic community map"
    >
      <div className="catalog-map-heading">
        <Globe2 size={20} aria-hidden="true" />
        <div>
          <h2>Community map</h2>
          <p>
            Schematic geographic grid. Coordinate precision varies by record.
          </p>
        </div>
      </div>
      <div className="catalog-world-map">
        {[-60, -30, 0, 30, 60].map((lat) => (
          <div
            className="catalog-latitude"
            style={{ top: `${((90 - lat) / 180) * 100}%` }}
            key={lat}
          >
            <span>{lat}°</span>
          </div>
        ))}
        {[-120, -60, 0, 60, 120].map((lon) => (
          <div
            className="catalog-longitude"
            style={{ left: `${((lon + 180) / 360) * 100}%` }}
            key={lon}
          />
        ))}
        {pinned.map((place) => (
          <button
            key={place.id}
            type="button"
            className={`catalog-map-pin map-pin${selectedId === place.id ? " is-selected" : ""}${place.lon! > 90 ? " is-near-east" : place.lon! < -90 ? " is-near-west" : ""}`}
            style={{
              left: `${((place.lon! + 180) / 360) * 100}%`,
              top: `${((90 - place.lat!) / 180) * 100}%`,
            }}
            aria-label={`${place.name}: ${place.precision}`}
            aria-pressed={selectedId === place.id}
            title={place.name}
            onClick={() => onSelect(place.id)}
          >
            <span
              className={`catalog-map-dot${/city|town|area|suburb|island/i.test(place.precision) ? " is-approximate" : ""}`}
            />
            <span className="catalog-map-tooltip">{place.name}</span>
          </button>
        ))}
      </div>
      <p className="catalog-map-note">
        {pinned.length} {pinned.length === 1 ? "record has" : "records have"}{" "}
        coordinates. All {shown.length} matching entries, including unpinned
        records, remain in the directory.
      </p>
    </section>
  );
}

export function ClubsPage({ params, updateQuery }: CatalogPageProps) {
  const view = params.get("view") === "map" ? "map" : "list";
  const q = params.get("q") || "";
  const shown = filterPlaces(places, q);
  const paged = getPage(shown, Number(params.get("page") || 1), 20);
  const selectedId = params.get("selected");
  const selected = places.find((place) => place.id === selectedId);
  const selectedRef = useSelectedRecord(selected?.id || null);
  const reset = () => updateQuery({ q: null, page: null, selected: null });
  const selectPlace = (id: string) => updateQuery({ selected: id });
  const selectedPanel = selected ? (
    <section
      className="catalog-selection catalog-place-selection"
      data-testid="selected-record"
      aria-label="Selected place"
      ref={selectedRef}
      tabIndex={-1}
    >
      <div className="catalog-selection-heading">
        <span className="eyebrow">Selected place</span>
        <CloseSelection
          label="Close place"
          onClick={() => updateQuery({ selected: null })}
        />
      </div>
      <PlaceCard key={selected.id} place={selected} expanded />
    </section>
  ) : null;

  return (
    <div className="page catalog-page clubs-page">
      <PageHeading
        eyebrow="The worldwide directory"
        title="Clubs & places"
        description="Find clubs, national organizations and known venues. Confirm current sessions with the organization before you go."
      />
      <div className="catalog-feature-link">
        <a className="catalog-club-spotlight" href="#/clubs/timber-whales">
          <TimberwhalesLogo className="catalog-club-logo" />
          <span className="catalog-club-copy">
            <small>Club spotlight</small>
            <strong>UNBC Timberwhales</strong>
            <span>Prince George, British Columbia</span>
          </span>
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
        <a className="text-link" href="#/wiki/world-guide">
          About this directory <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
      <form
        className="catalog-directory-controls"
        aria-label="Search directory"
        onSubmit={(event) => event.preventDefault()}
      >
        <SearchField
          label="Search places"
          placeholder="Club or location"
          value={q}
          onChange={(value) =>
            updateQuery(
              { q: value || null, page: null, selected: null },
              { replace: true },
            )
          }
        />
        <div className="catalog-view-switch" aria-label="Directory view">
          <button
            type="button"
            aria-pressed={view === "map"}
            onClick={() => updateQuery({ view: "map" })}
          >
            Map
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => updateQuery({ view: "list" })}
          >
            List
          </button>
        </div>
      </form>
      {q && (
        <FilterChips
          items={[{ label: `Search: ${q}`, onRemove: reset }]}
          onReset={reset}
        />
      )}
      {selectedId && !selected && (
        <p className="notice" role="status">
          That place is not in the directory. Search for a club or country
          below.
        </p>
      )}
      {view === "map" ? (
        <div
          className={`catalog-map-layout${selected ? " has-selection" : ""}`}
        >
          <SchematicMap
            shown={shown}
            selectedId={selectedId}
            onSelect={selectPlace}
          />
          {selectedPanel}
        </div>
      ) : (
        selectedPanel
      )}

      <section className="catalog-results" aria-label="Directory results">
        <div className="catalog-results-bar" data-results-start tabIndex={-1}>
          <p role="status" aria-live="polite" aria-atomic="true">
            <strong>{shown.length}</strong> directory{" "}
            {shown.length === 1 ? "entry" : "entries"}
            {q ? " match your search" : ""}
          </p>
          <span>20 per page</span>
        </div>
        {shown.length > 0 ? (
          <>
            <ul className="catalog-place-list">
              {paged.items.map((place) => (
                <li
                  key={place.id}
                  data-testid="place-result"
                  data-place-id={place.id}
                  className={
                    selectedId === place.id ? "is-selected" : undefined
                  }
                >
                  <PlaceCard
                    place={place}
                    onSelect={() => selectPlace(place.id)}
                  />
                </li>
              ))}
            </ul>
            <Pagination
              {...paged}
              onChange={(page) =>
                updateQuery({ page: page === 1 ? null : String(page) })
              }
            />
          </>
        ) : (
          <EmptyState title="No matching places" onReset={reset}>
            Try a country or community name, or clear your search.
          </EmptyState>
        )}
      </section>
    </div>
  );
}

function SupplierCard({
  supplier,
  expanded = false,
}: {
  supplier: Supplier;
  expanded?: boolean;
}) {
  return (
    <article
      className={`catalog-supplier supplier${expanded ? " is-expanded" : ""}`}
    >
      <div className="catalog-record-identity">
        <div className="catalog-record-meta">
          <span>{supplier.country}</span>
          <span>{supplier.kind}</span>
        </div>
        <h3>
          <a href={supplier.url} target="_blank" rel="noreferrer">
            {supplier.name}
            <ExternalLink size={17} aria-hidden="true" />
          </a>
        </h3>
      </div>
      <div className="catalog-supplier-description">
        <p className="catalog-supplier-summary">{supplier.note}</p>
        <ul className="catalog-gear-tags" aria-label="Gear categories">
          {supplier.categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>
      <div className="catalog-record-context">
        <div className="catalog-shipping">
          <strong>Canada shipping</strong>
          <p>{supplier.canadaShipping || "Unknown; confirm with supplier"}</p>
        </div>
        <p className="catalog-checked">Catalog checked {supplier.checked}</p>
      </div>
      <details
        className="catalog-evidence supplier-evidence"
        open={expanded || undefined}
      >
        <summary>Shipping, orders &amp; source evidence</summary>
        <dl className="catalog-order-details">
          <dt>Shipping evidence</dt>
          <dd className="shipping-evidence">{supplier.shippingEvidence}</dd>
          <dt>Custom orders</dt>
          <dd>{supplier.customOrders || "Unknown"}</dd>
          <dt>Club orders</dt>
          <dd>{supplier.clubOrders || "Unknown"}</dd>
        </dl>
        <p>{supplier.verification}</p>
        {supplier.notes.length > 0 && (
          <ul className="catalog-editorial-notes">
            {supplier.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        )}
        <ul className="catalog-evidence-list">
          {supplier.sourceIds.map((id) => {
            const source = supplierSources.find((item) => item.id === id);
            return source ? (
              <li key={source.id}>
                <a
                  href={source.publicCitationUrl || source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.title}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
                <p>{source.evidenceSummary}</p>
                <p className="catalog-checked">
                  {source.access.replaceAll("_", " ")} · {source.checkedAt}
                </p>
                {source.accessNote && <p>{source.accessNote}</p>}
              </li>
            ) : null;
          })}
        </ul>
        <a
          className="text-link"
          href={supplier.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Source record <ExternalLink size={13} aria-hidden="true" />
        </a>
      </details>
    </article>
  );
}

export function SuppliersPage({ params, updateQuery }: CatalogPageProps) {
  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const country = params.get("country") || "";
  const categories = [
    ...new Set(suppliers.flatMap((supplier) => supplier.categories)),
  ].sort();
  const countries = [
    ...new Set(suppliers.map((supplier) => supplier.country)),
  ].sort();
  const result = filterSuppliers(suppliers, { q, category, country });
  const selectedId = params.get("selected");
  const selected = suppliers.find((supplier) => supplier.id === selectedId);
  const selectedRef = useSelectedRecord(selected?.id || null);
  const setFilter = (key: string, value: string, replace = false) =>
    updateQuery({ [key]: value || null, selected: null }, { replace });
  const reset = () =>
    updateQuery({ q: null, category: null, country: null, selected: null });
  const chips: FilterChip[] = [
    ["q", q, "Search"],
    ["category", category, "Gear"],
    ["country", country, "Country"],
  ]
    .filter(([, value]) => value)
    .map(([key, value, label]) => ({
      label: `${label}: ${value}`,
      onRemove: () => setFilter(key, ""),
    }));

  return (
    <div className="page catalog-page suppliers-page">
      <PageHeading
        eyebrow="Equipment"
        title="Suppliers"
        description="Browse equipment suppliers by gear and country. Confirm fit, availability and delivered cost directly with each supplier."
      />
      <EquipmentTabs active="suppliers" />
      <details className="catalog-directory-note">
        <summary>Before you order</summary>
        <p>{supplierNotice}</p>
      </details>
      {selected && (
        <section
          className="catalog-selection"
          data-testid="selected-record"
          aria-label="Selected supplier"
          ref={selectedRef}
          tabIndex={-1}
        >
          <div className="catalog-selection-heading">
            <span className="eyebrow">Selected supplier</span>
            <CloseSelection
              label="Close supplier"
              onClick={() => updateQuery({ selected: null })}
            />
          </div>
          <SupplierCard key={selected.id} supplier={selected} expanded />
        </section>
      )}
      {selectedId && !selected && (
        <p className="notice" role="status">
          That supplier is not in this catalog. Browse the directory below.
        </p>
      )}
      <form
        className="catalog-controls"
        aria-label="Filter suppliers"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="catalog-primary-filters">
          <div className="catalog-search-filter">
            <span aria-hidden="true">Find a supplier</span>
            <SearchField
              label="Search suppliers"
              placeholder="Supplier name or equipment"
              value={q}
              onChange={(value) => setFilter("q", value, true)}
            />
          </div>
          <SelectFilter
            label="Gear category"
            value={category}
            options={categories}
            allLabel="All categories"
            onChange={(value) => setFilter("category", value)}
          />
          <SelectFilter
            label="Supplier country"
            value={country}
            options={countries}
            allLabel="All countries"
            onChange={(value) => setFilter("country", value)}
          />
        </div>
      </form>
      {chips.length > 0 && <FilterChips items={chips} onReset={reset} />}
      <section className="catalog-results" aria-label="Supplier results">
        <div className="catalog-results-bar" data-results-start tabIndex={-1}>
          <p role="status" aria-live="polite" aria-atomic="true">
            <strong>{result.length}</strong>{" "}
            {result.length === 1 ? "supplier" : "suppliers"}
            {chips.length > 0 ? " match your filters" : " in the directory"}
          </p>
          <span>Independent listings</span>
        </div>
        {result.length > 0 ? (
          <ul className="catalog-supplier-list">
            {result.map((supplier) => (
              <li
                key={supplier.id}
                data-testid="supplier-result"
                data-supplier-id={supplier.id}
                className={
                  selectedId === supplier.id ? "is-selected" : undefined
                }
              >
                <SupplierCard supplier={supplier} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No matching suppliers" onReset={reset}>
            Try another equipment category or country, or clear your search.
          </EmptyState>
        )}
      </section>
    </div>
  );
}
