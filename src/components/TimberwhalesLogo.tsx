import logo from "../assets/timberwhales-logo.jpg";

/** The club's supplied artwork, displayed without recoloring or redrawing it. */
export function TimberwhalesLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`timberwhales-logo ${className}`}>
      <img
        src={logo}
        width={1080}
        height={1080}
        alt="UNBC Timberwhales: an orca wearing a green toque, mask, and snorkel"
        decoding="async"
      />
    </div>
  );
}
