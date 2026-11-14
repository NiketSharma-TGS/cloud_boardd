export const sections = [
  { slug: "section-1", title: "Section 1", color: "blue" },
  { slug: "section-2", title: "Section 2", color: "pink" },
  { slug: "section-3", title: "Section 3", color: "yellow" },
  { slug: "section-4", title: "Section 4", color: "purple" },
] as const;

export type SectionSlug = (typeof sections)[number]["slug"];

/** Local files live under public/resources; external documents must use HTTPS. */
export type Resource = {
  id: string;
  title: string;
  description: string;
  section: SectionSlug;
  format: "PDF" | "XLSX" | "IMAGE" | "GOOGLE DOC" | "GOOGLE SHEET";
  href: string;
  thumbnail?: string;
};

// Add approved resources here. No sample downloads are presented as real files.
export const resources: Resource[] = [];
