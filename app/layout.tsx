import type { Metadata } from "next";
import "./globals.css";
import "./refinements.css";
export const metadata: Metadata = {
  title: "Time Machine — Move the assumptions",
  description: "A local-first decision lab for founders. Explore startup runway, funding and ownership with transparent hypothetical models.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
