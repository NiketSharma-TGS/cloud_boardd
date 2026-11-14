import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { resources, sections } from "../src/content/resources";
import { posts } from "../src/content/posts";

const errors: string[] = [];
const ids = new Set<string>();
function checkLink(href: string, label: string) {
  if (href.startsWith("https://")) {
    try { new URL(href); } catch { errors.push(`${label}: invalid URL`); }
  } else if (href.startsWith("/") && !href.startsWith("//")) {
    const root = resolve("public");
    const path = resolve(root, `.${href}`);
    if (!path.startsWith(root + "/") && !path.startsWith(root + "\\")) errors.push(`${label}: file must stay inside public`);
    else if (!existsSync(path)) errors.push(`${label}: missing file ${href}`);
  } else errors.push(`${label}: use a local /path or HTTPS URL`);
}
for (const resource of resources) {
  if (ids.has(resource.id)) errors.push(`Duplicate resource ID: ${resource.id}`);
  ids.add(resource.id);
  if (!sections.some(section => section.slug === resource.section)) errors.push(`${resource.id}: unknown section`);
  if (!resource.title.trim() || !resource.description.trim()) errors.push(`${resource.id}: title and description required`);
  checkLink(resource.href, resource.id);
  if (resource.thumbnail) checkLink(resource.thumbnail, `${resource.id} thumbnail`);
}
for (const post of posts) { checkLink(post.image, post.id); checkLink(post.href, post.id); }
for (const image of ["sky.webp", "desk.webp", "book.webp", "cloud.webp"]) checkLink(`/images/${image}`, "Design asset");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`Content checks passed: ${sections.length} sections, ${resources.length} resources, ${posts.length} posts. Local assets exist; external URLs have valid syntax (network availability not checked).`);
