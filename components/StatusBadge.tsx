import type { VerificationStatus } from "../lib/types";
import { Alert, Check, Copies } from "./ui/icons";

const STYLES: Record<VerificationStatus, string> = {
  Verified: "bg-good-wash text-good",
  Suspicious: "bg-warn-wash text-warn",
  Reused: "bg-bad-wash text-bad",
};

const ICONS: Record<VerificationStatus, typeof Check> = {
  Verified: Check,
  Suspicious: Alert,
  Reused: Copies,
};

type StatusBadgeProps = {
  status: VerificationStatus;
  size?: "sm" | "md";
};

/** Status reads as a word, not as a shouted label — colour and icon carry the
 *  urgency so the type doesn't have to. */
export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const Glyph = ICONS[status];
  const compact = size === "sm";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-semibold ${
        STYLES[status]
      } ${compact ? "t-caption px-2.5 py-1" : "t-footnote px-3 py-1.5"}`}
    >
      <Glyph size={compact ? 13 : 15} strokeWidth={2} />
      {status}
    </span>
  );
}
