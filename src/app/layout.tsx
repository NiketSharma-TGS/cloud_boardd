import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-sans/800.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import "./focus/focus.css";

export const metadata: Metadata = {
  title: { default: "Cloud Board — Big MBA dreams. Less CAT chaos.", template: "%s | Cloud Board" },
  description: "CAT and MBA preparation guides, resources, planners, and a little perspective. Find your next step with Cloud Board.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
