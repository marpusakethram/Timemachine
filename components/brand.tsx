import Link from "next/link";

// Three futures leaving one point: the same idea as the product, drawn in the path colors.
export function BrandMark() {
  return <svg className="brand-mark" width="30" height="22" viewBox="0 0 30 22" aria-hidden="true">
    <path d="M4 11 L26 3.5" stroke="var(--mint)" strokeWidth="3" strokeLinecap="round" />
    <path d="M4 11 L26 11" stroke="var(--sky)" strokeWidth="3" strokeLinecap="round" />
    <path d="M4 11 L26 18.5" stroke="var(--marigold)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="4" cy="11" r="3.5" fill="var(--ink)" />
  </svg>;
}

export function Brand({ onClick }: { onClick?: React.MouseEventHandler<HTMLAnchorElement> }) {
  return <Link href="/" className="brand" aria-label="Time Machine home" onClick={onClick}><BrandMark /><span>Time Machine</span></Link>;
}
