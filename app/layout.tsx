import type { Metadata } from "next";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "Time Machine | Move the assumptions",
  description: "A local-first decision lab for founders. Model runway, burn and dilution across three paths with transparent math.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
