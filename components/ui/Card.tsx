import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/**
 * A card is a solid surface with a hairline edge — deliberately not a
 * translucent material. Stacking translucency on translucency is where
 * legibility goes to die; the floating chrome gets the glass, content does not.
 */
export default function Card({
  title,
  subtitle,
  actions,
  children,
  className = "",
  bodyClassName = "",
}: CardProps) {
  return (
    <section
      className={`flex w-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6 ${className}`}
    >
      {title || actions ? (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title ? <h2 className="t-title-3 text-ink">{title}</h2> : null}
            {subtitle ? (
              <p className="t-footnote mt-0.5 text-ink-2">{subtitle}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
          ) : null}
        </header>
      ) : null}
      <div className={`min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
