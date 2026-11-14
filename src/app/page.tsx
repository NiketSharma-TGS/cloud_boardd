import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CloudLink } from "@/components/cloud-link";
import { sections } from "@/content/resources";
import { instagramUrl, posts } from "@/content/posts";

function PhotoWindow({ image, filename, className }: { image: string; filename: string; className: string }) {
  return <div className={`photo-window ${className}`}>
    <div className="window-bar" aria-hidden="true"><span className="window-dots"><i/><i/><i/></span><span>{filename}</span></div>
    <Image src={image} alt="" width={720} height={540} priority sizes="(max-width: 640px) 60vw, 34vw" />
  </div>;
}

export default function Home() {
  return <>
    <SiteHeader home />
    <main id="main" tabIndex={-1}>
    <div className="sky-shell">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Big MBA<br/>dreams.<em>Less CAT chaos.</em></h1>
            <p>Guides, resources &amp; a little perspective.</p>
            <a className="button button-yellow" href="#resources">Explore resources <span aria-hidden="true">⟶</span></a>
            <a className="hero-focus-link" href="/focus/">Start a focus session <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-photos" aria-hidden="true">
            <PhotoWindow className="window-one" image="/images/desk.webp" filename="desk_01.jpg" />
            <PhotoWindow className="window-two" image="/images/book.webp" filename="desk_02.jpg" />
          </div>
        </section>
    </div>
    <section className="resources-section" id="resources" aria-labelledby="resources-title">
      <div className="wrap">
        <div className="section-heading"><h2 id="resources-title">Resources</h2><p>PDFs, images &amp; spreadsheets.</p></div>
        <div className="cloud-grid">{sections.map(section => <CloudLink key={section.slug} section={section}/>)}</div>
      </div>
    </section>
    <aside className="pep-talk" aria-label="A little pep talk"><div className="wrap"><p>Your last mock score isn’t your personality.</p></div></aside>
    <section className="posts-section" id="posts" aria-labelledby="posts-title">
      <div className="wrap">
        <div className="posts-heading"><h2 id="posts-title">Off the feed.</h2><a className="text-link" href={instagramUrl} target="_blank" rel="noopener noreferrer">@cloud_boardd <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></div>
        <div className="posts-grid">{posts.map(post => <a className="post-card" key={post.id} href={post.href} target="_blank" rel="noopener noreferrer" aria-label={`${post.title} — visit Cloud Board on Instagram (opens in a new tab)`}>
          <div className="post-image"><Image src={post.image} alt={post.title} width={600} height={600} sizes="(max-width: 640px) 90vw, 30vw" /></div>
          <div className="post-caption"><span>{post.category}</span><span aria-hidden="true">↗</span></div>
        </a>)}</div>
      </div>
    </section>
    </main>
    <SiteFooter />
  </>;
}
