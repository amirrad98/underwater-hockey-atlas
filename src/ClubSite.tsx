import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ClubHome, ClubJoin, ClubTeam, ClubGalleryPage, ClubAbout } from "./ClubPage";
import { localClubAsset } from "./ClubMedia";
import type { useAtlasRouter } from "./navigation";
import "./club.css";

const clubNav = [
  ["", "Home"],
  ["join", "Join"],
  ["team", "Team"],
  ["gallery", "Gallery"],
  ["about", "About"],
];

const pages: Record<string, typeof ClubHome> = {
  "#/": ClubHome,
  "#/join": ClubJoin,
  "#/team": ClubTeam,
  "#/gallery": ClubGalleryPage,
  "#/about": ClubAbout,
};

export function ClubSite({ router }: { router: ReturnType<typeof useAtlasRouter> }) {
  const [menu, setMenu] = useState(false);
  const { path } = router;
  const Page = pages[path];
  useEffect(() => {
    document.title = "UNBC TimberWhales · Underwater Hockey";
    setMenu(false);
  }, [path]);
  useEffect(() => {
    if (!menu) return;
    document.querySelector<HTMLElement>("#main-navigation a")?.focus();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        document.querySelector<HTMLElement>(".menu")?.focus();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [menu]);
  const focusMain = () => {
    setMenu(false);
    document.getElementById("main")?.focus();
  };
  return (
    <div className="club-shell" onClick={router.followLink}>
      <a className="skip" href="#main" onClick={event => { event.preventDefault(); document.querySelector<HTMLElement>("main")?.focus(); }}>
        Skip to content
      </a>
      <header>
        <a className="brand" href="#/">
          <img src={localClubAsset("brand/horizontal-light.svg")} width={251} height={68} alt="UNBC TimberWhales" />
        </a>
        <nav id="main-navigation" aria-label="Main navigation" className={menu ? "open" : ""}>
          {clubNav.map(([id, name]) => (
            <a key={id} onClick={focusMain} href={`#/${id}`} aria-current={path === `#/${id}` ? "page" : undefined}>{name}</a>
          ))}
          <a onClick={focusMain} href="#/atlas">UWH Atlas</a>
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
      </header>
      <main id="main" tabIndex={-1}>
        {Page ? <Page /> : <div className="page"><h1>Page not found</h1><a href="#/">Return to the club homepage</a></div>}
      </main>
      <footer>
        <a className="brand" href="#/">
          <img src={localClubAsset("brand/horizontal-dark.svg")} width={251} height={68} alt="UNBC TimberWhales" />
        </a>
        <div className="footer-tagline">
          <small>UNDERWATER HOCKEY / PRINCE GEORGE</small>
          <strong>Swim as one</strong>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          <a href="#/join">Join a practice</a>
          <a href="#/team">Team</a>
          <a href="#/gallery">Gallery</a>
          <a href="#/about">About</a>
          <a href="#/atlas">UWH Atlas</a>
          <a href="mailto:timberwhales@unbc.ca">timberwhales@unbc.ca</a>
        </nav>
        <p className="footer-note">
          UNBC TimberWhales, Prince George, British Columbia. Atlas diagrams are original; sources stay in view.
        </p>
      </footer>
    </div>
  );
}
