import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return <><SiteHeader/><main id="main" tabIndex={-1} className="wrap not-found"><p className="eyebrow">404 / A little off course</p><h1>Head in the clouds?</h1><p>That page isn’t here. Let’s get you back to your prep.</p><Link className="button button-yellow" href="/">Back to Cloud Board <span aria-hidden="true">↗</span></Link></main><SiteFooter/></>;
}
