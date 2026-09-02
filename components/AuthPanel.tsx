import { BrandMark } from "./ui/BrandLogo";

export type AuthPoint = { mark: string; text: string };

type AuthPanelProps = {
  title: string;
  lede: string;
  points: readonly AuthPoint[];
  footer?: string;
};

/**
 * The left half of an authentication screen.
 *
 * A sign-in form on its own is a small object floating in a large empty page.
 * Pairing it with an inverted panel gives the screen a spine, states what the
 * system is before asking for credentials, and turns the whole viewport into
 * the composition — which is why the panel carries the argument and the form
 * carries only the fields.
 */
export default function AuthPanel({
  title,
  lede,
  points,
  footer,
}: AuthPanelProps) {
  return (
    <div
      data-field="ink"
      className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14"
    >
      <div className="grid-paper pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative flex items-center gap-3">
        <span className="text-ink">
          <BrandMark size={26} />
        </span>
        <span className="t-mark text-ink">Provenance · IMVS</span>
      </div>

      <div className="relative">
        <h2 className="t-headline max-w-md text-balance text-ink">{title}</h2>
        <p className="t-body mt-6 max-w-sm text-pretty text-ink-2">{lede}</p>

        <dl className="ruled mt-10 max-w-sm border-y border-rule">
          {points.map((point) => (
            <div key={point.mark} className="flex items-baseline gap-5 py-3.5">
              <dt className="t-mark w-24 shrink-0 text-accent">{point.mark}</dt>
              <dd className="t-footnote text-ink-2">{point.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="relative t-mark text-ink-3">
        {footer ?? "Faculty of Physical Sciences · Nnamdi Azikiwe University"}
      </p>
    </div>
  );
}
