import type { ReactNode } from "react";

type GlassCardProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function GlassCard({
  title,
  subtitle,
  actions,
  children,
  className,
}: GlassCardProps) {
  return (
    <section
      className={`rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_35px_rgba(79,70,229,0.15)] backdrop-blur-xl transition hover:border-cyan-400/50 ${
        className ?? ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
            {title}
          </p>
          {subtitle ? (
            <h3 className="mt-2 text-lg font-semibold text-white">{subtitle}</h3>
          ) : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
