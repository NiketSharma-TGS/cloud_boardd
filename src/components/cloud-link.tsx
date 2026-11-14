import { sections } from "@/content/resources";

export function CloudLink({ section }: { section: (typeof sections)[number] }) {
  return (
    <a href={`/resources/${section.slug}/`} className={`cloud-link cloud-${section.color}`}>
      <span className="cloud-paint" aria-hidden="true" />
      <span className="cloud-label">{section.title}<span className="cloud-arrow" aria-hidden="true">↗</span></span>
    </a>
  );
}
