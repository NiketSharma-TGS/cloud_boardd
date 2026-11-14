import Link from "next/link";
import { instagramUrl } from "@/content/posts";

export function SiteHeader({ home = false }: { home?: boolean }) {
  return (
    <header className={`site-header wrap${home ? " home-header" : ""}`}>
      <Link href="/" className="wordmark" aria-label="Cloud Board home">cloud board</Link>
      <nav aria-label="Main navigation">
        <a className="nav-pill" href={home ? "#resources" : "/#resources"}>Resources</a>
        <a className="nav-pill" href="/focus/">Focus timer</a>
        <a className="nav-pill" href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram<span className="sr-only"> (opens in a new tab)</span></a>
        <a className="nav-pill" href={home ? "#about" : "/#about"}>About</a>
      </nav>
    </header>
  );
}
