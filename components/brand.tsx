import Link from "next/link";

export function BrandMark() {
  return <svg className="brand-mark" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
    <rect width="28" height="28" rx="7" fill="var(--brand)" />
    <path d="M7 19.5 11.5 14l3.5 3 6-8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="21" cy="9" r="1.8" fill="#fff" />
  </svg>;
}

export function Brand({ onClick }: { onClick?: React.MouseEventHandler<HTMLAnchorElement> }) {
  return <Link href="/" className="brand" aria-label="Time Machine home" onClick={onClick}><BrandMark /><span>Time Machine</span></Link>;
}
