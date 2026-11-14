import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CloudLink } from "@/components/cloud-link";
import { resources, sections } from "@/content/resources";

export const dynamicParams = false;
export function generateStaticParams() { return sections.map(section => ({ section: section.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const item = sections.find(item => item.slug === section);
  return { title: item ? `${item.title} resources` : "Resources" };
}

export default async function ResourcePage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const current = sections.find(item => item.slug === section);
  if (!current) notFound();
  const items = resources.filter(item => item.section === current.slug);
  return <>
    <div className="resource-sky"><SiteHeader /><div className="wrap resource-intro"><Link href="/#resources" className="text-link">← All resources</Link><p className="eyebrow">A little less CAT chaos</p><h1>{current.title}<em>Your prep shelf.</em></h1><p>Guides, planners, and useful things for the journey.</p></div></div>
    <main id="main" tabIndex={-1} className="resource-main wrap">
      {items.length ? <div className="resource-list">{items.map(item => {
        const external = item.href.startsWith("https://");
        return <article className="resource-card" key={item.id}>
          {item.thumbnail && <Image src={item.thumbnail} alt="" width={480} height={300} className="resource-thumbnail"/>}
          <span className="format-tag">{item.format}</span><h2>{item.title}</h2><p>{item.description}</p>
          <a className="button" href={item.href} download={!external} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{external ? "Open resource" : "Download"}<span aria-hidden="true">{external ? "↗" : "↓"}</span>{external && <span className="sr-only"> (opens in a new tab)</span>}</a>
        </article>;
      })}</div> : <div className="empty-shelf"><span className={`empty-cloud cloud-${current.color}`} aria-hidden="true"><span className="cloud-paint"/></span><p className="eyebrow">Good things take a little prep</p><h2>This shelf is getting ready.</h2><p>Resources for {current.title} are on their way.<br/>Check back soon for something useful.</p><Link className="button" href="/#resources">Browse the other sections <span aria-hidden="true">↗</span></Link></div>}
      <section className="other-sections" aria-labelledby="other-title"><h2 id="other-title">Keep exploring.</h2><div className="cloud-grid">{sections.filter(item => item.slug !== current.slug).map(item => <CloudLink key={item.slug} section={item}/>)}</div></section>
    </main>
    <SiteFooter />
  </>;
}
