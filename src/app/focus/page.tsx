import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FocusTimer } from "@/components/focus-timer";

export const metadata: Metadata = { title: "Focus timer", description: "A little focus. A little closer. A free Pomodoro timer for your CAT prep, with breaks, adjustable durations, and a pop-out window." };

export default function FocusPage() {
  return <div className="focus-page"><SiteHeader/><main id="main" tabIndex={-1} className="focus-main wrap"><a className="text-link focus-back" href="/#resources">← Back to resources</a><div className="focus-heading"><h1>A little focus.<em>A little closer.</em></h1></div><FocusTimer/></main><SiteFooter/></div>;
}
