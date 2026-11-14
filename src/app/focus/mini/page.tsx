import type { Metadata } from "next";
import { FocusTimer } from "@/components/focus-timer";

export const metadata: Metadata = { title: "Compact focus timer", robots: { index: false, follow: true } };

export default function CompactFocusPage() {
  return <main id="main" tabIndex={-1} className="mini-focus-page"><a className="mini-wordmark" href="/focus/" target="_blank" rel="noopener noreferrer">cloud board<span className="sr-only"> — full timer (opens in a new tab)</span></a><h1 className="sr-only">Compact focus timer</h1><FocusTimer compact/></main>;
}
