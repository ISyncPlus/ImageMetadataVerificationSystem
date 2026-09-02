"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, Close, ArrowRight, Doc, ShieldCheck, MapPin, Camera } from "./icons";
import { fade, springMove } from "../../lib/motion";

type SearchItem = {
  id: string;
  title: string;
  category: "Navigation" | "Pillars" | "Case Studies" | "Academic";
  description: string;
  href: string;
  icon: typeof Search;
};

const SEARCH_ITEMS: readonly SearchItem[] = [
  {
    id: "demo",
    title: "Interactive Verification Demo",
    category: "Navigation",
    description: "Live browser-based image analysis showcase with specimen photos",
    href: "/#interactive-demo",
    icon: Camera,
  },
  {
    id: "student-inspector",
    title: "Student Inspector Dashboard",
    category: "Navigation",
    description: "Submit and inspect course practical photographs for tamper checks",
    href: "/student",
    icon: ShieldCheck,
  },
  {
    id: "lecturer-ledger",
    title: "Lecturer Audit Ledger",
    category: "Navigation",
    description: "Coursework moderation, duplicate detection, and batch audit records",
    href: "/lecturer",
    icon: Doc,
  },
  {
    id: "case-studies",
    title: "Physical Sciences Case Studies",
    category: "Case Studies",
    description: "UNIZIK Geology, Chemistry, and Physics practical verification field trials",
    href: "/case-studies",
    icon: Doc,
  },
  {
    id: "temporal-pillar",
    title: "Temporal Integrity Pillar",
    category: "Pillars",
    description: "Inspects original hardware chronometer timestamps to match lab hours",
    href: "/#method",
    icon: Doc,
  },
  {
    id: "geospatial-pillar",
    title: "Geospatial Proximity Telemetry",
    category: "Pillars",
    description: "Decodes and reverse geocodes GPS coordinates for fieldwork geofencing",
    href: "/#method",
    icon: MapPin,
  },
  {
    id: "hardware-fingerprint",
    title: "Hardware Camera Fingerprinting",
    category: "Pillars",
    description: "Extracts sensor make, lens profile, focal length, ISO, and detects WhatsApp compression",
    href: "/#method",
    icon: Camera,
  },
  {
    id: "privacy-policy",
    title: "Data Protection & Privacy Policy",
    category: "Academic",
    description: "Client-side computing guarantees and zero raw file storage policy",
    href: "/privacy",
    icon: ShieldCheck,
  },
  {
    id: "faq-section",
    title: "Frequently Asked Questions",
    category: "Navigation",
    description: "Common questions regarding browser security, hashing, and duplicate detection",
    href: "/#faq",
    icon: Search,
  },
];

export default function SiteSearch() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  // Global hotkey (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, toggle]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return SEARCH_ITEMS;
    return SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    setOpen(false);
    router.push(item.href);
  };

  // Keyboard navigation inside modal
  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <>
      {/* Trigger Button that can be placed or invoked via Cmd+K */}
      <button
        type="button"
        onClick={toggle}
        aria-label="Search site (Cmd+K)"
        title="Search site (Cmd+K)"
        className="flex h-8 items-center gap-2 rounded-full border border-line bg-well/70 px-2.5 text-ink-3 transition-colors hover:border-accent-edge hover:text-ink hover:bg-surface"
      >
        <Search size={14} className="text-ink-3" />
        <span className="hidden sm:inline text-xs font-mono">Search</span>
        <kbd className="hidden sm:inline-flex items-center rounded border border-rule bg-canvas px-1.5 py-0.5 text-[0.625rem] font-mono text-ink-3">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:p-6 sm:pt-28">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-canvas/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site search"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -8 }}
              transition={springMove}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-material-edge bg-surface shadow-2xl"
            >
              {/* Search Input Bar */}
              <div className="flex items-center gap-3 border-b border-rule px-4 py-3.5 bg-surface-2/50">
                <Search size={18} className="text-accent shrink-0" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyNav}
                  autoFocus
                  placeholder="Search pages, verification pillars, case studies..."
                  className="t-callout w-full bg-transparent text-ink placeholder:text-ink-3 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded p-1 text-ink-3 hover:text-ink transition-colors"
                >
                  <Close size={16} />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-ink-3">
                    <p className="t-footnote">No matches found for &ldquo;{query}&rdquo;</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filtered.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                            isSelected
                              ? "bg-accent text-accent-ink shadow-sm"
                              : "text-ink hover:bg-well"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                isSelected
                                  ? "bg-white/20 text-accent-ink"
                                  : "bg-well text-accent"
                              }`}
                            >
                              <IconComponent size={16} />
                            </span>
                            <div className="min-w-0">
                              <p className="t-footnote truncate font-semibold">
                                {item.title}
                              </p>
                              <p
                                className={`t-caption truncate text-[0.75rem] ${
                                  isSelected ? "text-accent-ink/80" : "text-ink-3"
                                }`}
                              >
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`t-mark ml-3 shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] ${
                              isSelected
                                ? "bg-white/20 text-accent-ink"
                                : "bg-surface-2 text-ink-3"
                            }`}
                          >
                            {item.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer Key Hints */}
              <div className="flex items-center justify-between border-t border-rule bg-surface-2/40 px-4 py-2 text-[0.6875rem] font-mono text-ink-3">
                <div className="flex items-center gap-3">
                  <span><kbd className="rounded border border-rule px-1">↑</kbd> <kbd className="rounded border border-rule px-1">↓</kbd> Navigate</span>
                  <span><kbd className="rounded border border-rule px-1">↵</kbd> Select</span>
                </div>
                <span><kbd className="rounded border border-rule px-1">ESC</kbd> Close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
