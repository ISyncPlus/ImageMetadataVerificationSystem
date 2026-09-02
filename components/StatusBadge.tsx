import type { VerificationStatus } from "../lib/types";
import { Alert, Check, Copies } from "./ui/icons";

const STYLES: Record<VerificationStatus, string> = {
  Verified: "bg-good-wash text-good ring-good/25",
  Suspicious: "bg-warn-wash text-warn ring-warn/25",
  Reused: "bg-bad-wash text-bad ring-bad/25",
};

const MARKS: Record<VerificationStatus, string> = {
  Verified: "bg-good-mark",
  Suspicious: "bg-warn-mark",
  Reused: "bg-bad-mark",
};

const ICONS: Record<VerificationStatus, typeof Check> = {
  Verified: Check,
  Suspicious: Alert,
  Reused: Copies,
};

type StatusBadgeProps = {
  status: VerificationStatus;
  size?: "sm" | "md";
  /** Adds a leading indicator dot. Useful in dense rows where the icon reads
   *  as decoration rather than state. */
  dot?: boolean;
};

/**
 * Status reads as a word, not a shouted label — colour and glyph carry the
 * urgency so the type doesn't have to. Squared off, because in this design a
 * pill means "action" and a rectangle means "reading".
 */
export default function StatusBadge({
  status,
  size = "sm",
  dot = false,
}: StatusBadgeProps) {
  const Glyph = ICONS[status];
  const compact = size === "sm";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm font-semibold uppercase ring-1 ring-inset ${
        STYLES[status]
      } ${
        compact
          ? "t-mark px-2 py-1 text-[0.625rem]"
          : "t-mark px-2.5 py-1.5 text-[0.6875rem]"
      }`}
    >
      {dot ? (
        <span className={`h-1.5 w-1.5 rounded-full ${MARKS[status]}`} />
      ) : (
        <Glyph size={compact ? 12 : 13} strokeWidth={2.4} />
      )}
      {status}
    </span>
  );
}
