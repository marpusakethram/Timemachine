import type { Metadata } from "next";
import "@fontsource-variable/mona-sans/wdth.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "Time Machine | See your next 24 months before you commit",
  description: "Hire, raise or stay lean. Time Machine models cash, runway and ownership for each path, right in your browser.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
