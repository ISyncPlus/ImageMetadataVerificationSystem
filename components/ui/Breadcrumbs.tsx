import Link from "next/link";
import { ChevronRight } from "./icons";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href.startsWith("http") ? item.href : `https://provenance-unizik.edu.ng${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumbs" className={`flex items-center gap-1.5 ${className}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight size={11} className="shrink-0 text-ink-3" />}
              {isLast || !item.href ? (
                <span className="t-mark -my-3 inline-flex min-h-11 max-w-[200px] items-center truncate py-3 text-ink" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="t-mark -my-3 inline-flex min-h-11 items-center py-3 text-ink-3 transition-colors hover:text-accent-deep"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
