"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { signOut } from "../lib/auth-client";
import type { Profile } from "../lib/api";
import { ButtonLink } from "./ui/Button";
import ThemeToggle from "./ui/ThemeToggle";
import { Close, Menu, SignOut } from "./ui/icons";
import { BrandMark } from "./ui/BrandLogo";
import { fade, springMove } from "../lib/motion";

type AppNavbarProps = {
  session?: Profile | null;
};

const CONDENSE_ABOVE = 36;
const RELEASE_BELOW = 12;
let isCondensed = false;

const subscribeToScroll = (callback: () => void): (() => void) => {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
};

const getCondensedSnapshot = (): boolean => {
  if (typeof window === "undefined") return false;
  const y = window.scrollY;
  isCondensed = isCondensed ? y > RELEASE_BELOW : y > CONDENSE_ABOVE;
  return isCondensed;
};

const getServerCondensed = (): boolean => false;

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const NAV_LINKS = [
  { label: "Demo", href: "/#interactive-demo", targetId: "interactive-demo" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "FAQ", href: "/#faq", targetId: "faq" },
  { label: "Team", href: "/#team", targetId: "team" },
  { label: "Location", href: "/#location", targetId: "location" },
  { label: "Privacy", href: "/privacy" },
];

export default function AppNavbar({ session }: AppNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const condensed = useSyncExternalStore(
    subscribeToScroll,
    getCondensedSnapshot,
    getServerCondensed
  );

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    targetId?: string
  ) => {
    if (targetId && pathname === "/") {
      e.preventDefault();
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${targetId}`);
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex justify-center px-3 sm:px-4">
      <motion.nav
        animate={{
          maxWidth: condensed ? 1040 : 1152,
          marginTop: condensed ? 12 : 0,
          borderRadius: condensed ? 999 : 16,
          paddingLeft: condensed ? 14 : 16,
          paddingRight: condensed ? 14 : 16,
        }}
        initial={false}
        transition={reduced ? { duration: 0 } : springMove}
        className="relative mx-auto flex w-full items-center justify-between gap-2 py-2 sm:gap-3"
      >
        {/* The glass material background */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ opacity: condensed ? 1 : 0.6 }}
          transition={reduced ? { duration: 0 } : fade}
          className="material material-pill absolute inset-0 rounded-[inherit] border border-material-edge backdrop-blur-[16px] backdrop-saturate-[190%]"
        />

        {/* Brand Logo & Title */}
        <Link
          href="/"
          className="relative z-10 flex min-w-0 items-center gap-2.5 rounded-full py-1 pr-2 transition-transform duration-150 active:scale-[0.98]"
        >
          <BrandMark size={30} />
          <span className="min-w-0">
            <span className="t-callout on-material block font-bold tracking-tight text-ink">
              Provenance
            </span>
            <AnimatePresence initial={false}>
              {!condensed ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                  className="t-caption hidden truncate text-ink-2 xl:block"
                >
                  Image Metadata &amp; Verification
                </motion.span>
              ) : null}
            </AnimatePresence>
          </span>
        </Link>

        {/* Desktop Navigation Links — always present and styled */}
        <div className="relative z-10 hidden items-center gap-1 md:flex lg:gap-1.5">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === pathname ||
              (link.targetId && typeof window !== "undefined" && window.location.hash === `#${link.targetId}`);

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.targetId)}
                className={`t-caption rounded-full px-2.5 py-1 text-xs font-semibold transition-all lg:px-3 lg:text-sm ${
                  isActive
                    ? "bg-accent text-accent-ink shadow-sm"
                    : "text-ink-2 hover:bg-surface/80 hover:text-ink active:scale-95"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side User / CTA Actions */}
        <div className="relative z-10 flex items-center gap-2">
          {session ? (
            <>
              <AnimatePresence initial={false}>
                {!condensed ? (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={reduced ? { duration: 0 } : springMove}
                    className="hidden overflow-hidden whitespace-nowrap text-right lg:block"
                  >
                    <span className="t-footnote on-material block truncate font-semibold text-ink">
                      {session.name}
                    </span>
                    <span className="t-caption block truncate capitalize text-ink-2">
                      {session.role}
                      {session.identifier ? ` · ${session.identifier}` : ""}
                    </span>
                  </motion.span>
                ) : null}
              </AnimatePresence>

              <span
                title={`${session.name}${session.identifier ? ` · ${session.identifier}` : ""}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-wash sm:h-9 sm:w-9"
              >
                <span className="t-caption font-semibold text-accent">
                  {initials(session.name)}
                </span>
              </span>

              <ThemeToggle />

              <motion.button
                type="button"
                onClick={() => void handleSignOut()}
                aria-label="Sign out"
                whileTap={reduced ? { opacity: 0.7 } : { scale: 0.92 }}
                transition={springMove}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 transition-colors duration-150 hover:border-bad hover:text-bad sm:h-9 sm:w-9"
              >
                <SignOut size={16} />
              </motion.button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <ButtonLink href="/login" variant="primary" size="sm" className="hidden xs:inline-flex">
                Sign in
              </ButtonLink>
            </>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-surface-2 md:hidden sm:h-9 sm:w-9"
          >
            {mobileMenuOpen ? <Close size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-4 right-4 top-16 z-50 overflow-hidden rounded-2xl border border-material-edge bg-surface/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.targetId)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2 active:bg-accent active:text-accent-ink"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-ink-3">&rarr;</span>
                </Link>
              ))}

              <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
                {session ? (
                  <Link
                    href={session.role === "lecturer" ? "/lecturer" : "/student"}
                    className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink"
                  >
                    Open {session.role === "lecturer" ? "Lecturer Ledger" : "Inspector"}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink"
                  >
                    Sign in to Provenance
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
