import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";

export type QueryChanges = Record<string, string | null | undefined>;
export type QueryOptions = { replace?: boolean };
export type CatalogPageProps = {
  params: URLSearchParams;
  updateQuery: (changes: QueryChanges, options?: QueryOptions) => void;
};

const aliases: Record<string, string> = {
  "#/": "#/atlas",
  "#/wiki": "#/learn",
  "#/world": "#/clubs",
  "#/resources": "#/library",
  "#/suppliers": "#/equipment/suppliers",
  "#/club": "#/clubs/timber-whales",
  "#/wiki/timber-whales": "#/clubs/timber-whales",
};

export function canonicalHash(hash: string) {
  const [path, query] = (hash || "#/atlas").split("?");
  return `${aliases[path] || path}${query ? `?${query}` : ""}`;
}

export function parseHash(hash: string) {
  const href = canonicalHash(hash);
  const [path, query] = href.split("?");
  return { href, path, params: new URLSearchParams(query) };
}

let sequence = 0;
const newKey = () => `atlas-${Date.now()}-${++sequence}`;

/** Keep in-app navigation, browser history, and collection scroll in agreement. */
export function useAtlasRouter() {
  const [route, setRoute] = useState(() => parseHash(location.hash));
  const entry = useRef({ key: "", href: route.href });
  const positions = useRef(new Map<string, number>());
  const pending = useRef<{
    mode: "push" | "replace" | "pop";
    changedPage: boolean;
  } | null>(null);

  useLayoutEffect(() => {
    const originalRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const key = history.state?.atlasEntry || newKey();
    entry.current = { key, href: canonicalHash(location.hash) };
    history.replaceState(
      { ...history.state, atlasEntry: key },
      "",
      entry.current.href,
    );

    const remember = () =>
      positions.current.set(entry.current.key, window.scrollY);
    const receive = () => {
      const next = parseHash(location.hash);
      let nextKey = history.state?.atlasEntry as string | undefined;
      if (next.href === entry.current.href && nextKey === entry.current.key)
        return;
      const knownEntry = Boolean(nextKey && nextKey !== entry.current.key);
      if (!nextKey || nextKey === entry.current.key) nextKey = newKey();
      pending.current = {
        mode: knownEntry ? "pop" : "push",
        changedPage: parseHash(entry.current.href).path !== next.path,
      };
      entry.current = { key: nextKey, href: next.href };
      history.replaceState(
        { ...history.state, atlasEntry: nextKey },
        "",
        next.href,
      );
      setRoute(next);
    };
    window.addEventListener("scroll", remember, { passive: true });
    window.addEventListener("popstate", receive);
    window.addEventListener("hashchange", receive);
    return () => {
      window.removeEventListener("scroll", remember);
      window.removeEventListener("popstate", receive);
      window.removeEventListener("hashchange", receive);
      history.scrollRestoration = originalRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const action = pending.current;
    pending.current = null;
    if (!action) return;
    const y =
      action.mode === "pop" ? positions.current.get(entry.current.key) || 0 : 0;
    const opensSelection = route.params.has("selected");
    if (action.changedPage && !opensSelection)
      document
        .querySelector<HTMLElement>("main")
        ?.focus({ preventScroll: true });
    if (action.mode === "pop" || (action.changedPage && !opensSelection)) {
      const frame = requestAnimationFrame(() => window.scrollTo(0, y));
      return () => cancelAnimationFrame(frame);
    }
  }, [route]);

  const navigate = useCallback((href: string, options: QueryOptions = {}) => {
    const next = parseHash(href);
    if (next.href === entry.current.href) return;
    positions.current.set(entry.current.key, window.scrollY);
    const changedPage = parseHash(entry.current.href).path !== next.path;
    const key = options.replace ? entry.current.key : newKey();
    pending.current = {
      mode: options.replace ? "replace" : "push",
      changedPage,
    };
    const state = { ...history.state, atlasEntry: key };
    if (options.replace) history.replaceState(state, "", next.href);
    else history.pushState(state, "", next.href);
    entry.current = { key, href: next.href };
    setRoute(next);
  }, []);

  const updateQuery = useCallback(
    (changes: QueryChanges, options: QueryOptions = {}) => {
      const current = parseHash(entry.current.href);
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === undefined || value === "")
          current.params.delete(key);
        else current.params.set(key, value);
      }
      const query = current.params.toString();
      navigate(`${current.path}${query ? `?${query}` : ""}`, options);
    },
    [navigate],
  );

  const followLink = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>(
        "a[href]",
      );
      const href = anchor?.getAttribute("href");
      if (
        !href?.startsWith("#/") ||
        anchor?.target === "_blank" ||
        anchor?.hasAttribute("download")
      )
        return;
      event.preventDefault();
      navigate(href);
    },
    [navigate],
  );

  return { ...route, navigate, updateQuery, followLink };
}
