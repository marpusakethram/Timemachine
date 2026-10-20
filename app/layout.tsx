import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
export const metadata: Metadata = {
  title: "Time Machine | Decision modeling for startup teams",
  description: "Compare hiring, fundraising and growth bets side by side. A local-first model for runway, cash and ownership.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
