# Cloud Board architecture

## What this project does

Cloud Board is an anonymous CAT/MBA preparation resource site. V1 has one long homepage and four resource pages. It uses Next.js App Router, React, TypeScript, and plain CSS. All pages render during the build; visitors do not need an account. No database, server functions, API keys, analytics, Instagram API, or submission delivery is configured.

## How the plumbing connects

`src/app/layout.tsx` loads locally bundled DM Sans and Instrument Serif fonts, shared CSS, page metadata, favicon, and the keyboard skip link. Nothing is downloaded from a font service at runtime.

`src/app/page.tsx` assembles the homepage: sky hero, photographic desktop windows, resources, pep talk, and Instagram previews. Shared header, footer, and cloud links live in `src/components`. Resource navigation uses ordinary anchors to avoid framework-prefetch requests for dynamic route payloads on a generic static file server. CSS in `src/app/globals.css` controls the layout, color palette, painted-cloud tinting, breakpoints, focus states, and motion. Cloud labels are real text; the paint is decorative. Photos in the hero are decorative too.

`src/content/resources.ts` is the source of truth for sections and resources. The resource route `src/app/resources/[section]/page.tsx` generates all four pages at build time using those section slugs. It filters resources by section, shows download cards for local files and open links for external files, and shows an honest empty state when there are no entries. The custom 404 handles unknown pages. Keep existing slugs stable when changing display names so shared links continue to work.

`src/content/posts.ts` configures the three curated homepage previews and their links. There is no automatic Instagram fetch: no cookies, embeds, credentials, or network calls are needed to show the cards. Until individual posts are supplied, every card links to the brand profile. The two SVG artworks and study photo are provisional design content, not claims that these are actual Instagram posts. Replace them before launch if desired.

`public/images` holds optimized WebP design assets and local SVG preview artwork. The sky and study photographs were generated using the built-in image tool. A generated transparent blue gouache cloud is reused with CSS color filters; text stays outside the bitmap. `design/asset-prompts.md` records generation prompts and provenance. `design/approved-homepage.png` preserves the selected visual reference. Font packages include their font licenses.

## Add a resource

1. Put an approved public file in `public/resources/`, optionally inside a section folder. Use a descriptive lowercase filename with hyphens, such as `mock-analysis-planner.xlsx`.
2. Add an entry to the `resources` array in `src/content/resources.ts`:

```ts
{
  id: "mock-analysis-planner",
  title: "Mock analysis planner",
  description: "A spreadsheet for reviewing your mock tests.",
  section: "section-1",
  format: "XLSX",
  href: "/resources/mock-analysis-planner.xlsx",
}
```

Supported format labels are PDF, XLSX, IMAGE, GOOGLE DOC, and GOOGLE SHEET. An optional `thumbnail` is an image URL under `public` or HTTPS. For Google documents, set `href` to the HTTPS sharing link and check public access plus ownership anonymity. Local files use the browser's download behavior. External documents open in a new tab. Avoid oversized files; if the library grows large or changes frequently, move file storage and content editing to a dedicated service.

3. Run `npm run check`, then `npm run build`. The content checker verifies unique resource IDs, section names, descriptions, URL shape, and existence of local files. It does not verify remote sharing permissions or remote availability.
4. Review locally before committing and deploying.

Everything in `public` is public after deployment. Do not place private material or credentials there. No real resource files have been supplied initially.

## Update posts

Place approved image files in `public/images` and update `posts` in `src/content/posts.ts`. Each entry has `id`, `title`, `category`, `image`, and `href`. Use individual Instagram URLs when available. Keep images approximately square and compressed. The title also supplies the accessible link description.

## Responsive design and accessibility

Desktop follows the approved cloud-background, editorial-type mockup. Small screens stack the hero copy above overlapping photos, use a two-column cloud grid, and stack post cards for legibility. Navigation stays visible without a hamburger. The page uses semantic headings and landmarks, keyboard focus outlines, an in-page skip link, new-tab announcements, and a reduced-motion rule that removes transitions and entrance effects. No autoplay or continuous animation.

## Build, review, and hosting

`next.config.ts` enables `output: "export"` and trailing slashes. `npm run build` produces the complete static website in `out/`. Images are optimized beforehand, so the site needs no runtime image server. `npm run preview` serves that output locally; `npm run dev` supports editing. Node.js is needed for building and previewing, not on the deployed host.

After local approval: connect the user's GitHub repository to Vercel, choose Next.js, use `npm run build`, and use the static `out` output if the hosting interface requests an output directory. No environment variables are required. Add the purchased domain in Vercel and apply its exact DNS instructions at the registrar. Add domain-specific canonical/social URL metadata after the final domain is known. Do not publish until approved. No Git remote or domain has been configured by this build.

## Verification

`npm run typecheck` checks TypeScript. `npm run check:content` checks the content library and design assets. Playwright tests in `tests` check desktop/mobile page rendering, resource routes, empty states, local asset responses, keyboard skip navigation, anchor navigation, external link configuration, reduced motion, and horizontal overflow. They save full-page screenshots in ignored `test-results/` for visual review. File downloads require actual resources and must be checked when supplied. `logs.md` records what was actually run and any limits.

## Focus timer

`/focus/` is the full Pomodoro page; `/focus/mini/` is the compact pop-out. Both render `src/components/focus-timer.tsx`, the only interactive application component. `src/lib/focus-timer.ts` defines the versioned state, validation, time formatting, and timestamp calculations. Focus, short break, and long break default to 25/5/15 minutes; each duration can be edited from 1 to 180 whole minutes. Saving settings resets the selected timer. Session types are manually selected; there is no automatic cycle.

The timer saves its mode, durations, sound preference, status, remaining milliseconds, and running end timestamp to `localStorage` under `cloud-board.focus.v1`. Display refreshes run every 250ms but remaining time is calculated from the actual end timestamp, avoiding accumulated interval drift. Reloading restores the timer; an elapsed deadline becomes complete. Browser storage is device/browser/origin-specific, not an account or cloud sync. Clearing site storage removes it. Main and pop-out windows synchronize actions through the `storage` event; either can continue if the other closes. If storage is blocked the page remains usable and displays a warning that persistence/sync are unavailable.

The pop-out is opened directly from a button click with a named, resizable window. Browsers may open it as a tab; if blocked, an ordinary new-tab link is shown. There is no always-on-top guarantee. A quiet Web Audio chime is opt-in and unlocked by a user gesture. Only a focused timer window plays it, avoiding duplicate alerts across the main and compact views; sleeping or backgrounded browsers can delay/suppress audio. Elapsed state remains accurate when a page resumes. The timer never claims notifications will fire after all its windows are closed.

Countdown changes are not announced every second by screen readers. Session controls have real button semantics, mode and sound buttons expose pressed state, settings are an inline labeled form with native validation, and session changes use a polite status message. Settings support Escape/cancel and return focus to their trigger. No third-party timer API, database, or new paid service is required.

## Later versions

Forms, newsletter, featured resources, trackers, business metrics, and an editing dashboard are intentionally deferred. A future dashboard can replace the content lists with a CMS and file storage while preserving page URLs and components. This is a future integration point, not an implemented backend.
