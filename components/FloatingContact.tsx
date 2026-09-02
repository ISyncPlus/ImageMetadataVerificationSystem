"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MessageSquare, Close, Mail, Phone, MapPin } from "./ui/icons";
import { Button } from "./ui/Button";
import { fade, springMove, springSnappy } from "../lib/motion";

export default function FloatingContact() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
      setName("");
      setEmail("");
      setMessage("");
    }, 2200);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close contact desk" : "Open academic contact desk"}
        aria-expanded={open}
        whileHover={reduced ? {} : { scale: 1.06 }}
        whileTap={reduced ? { opacity: 0.7 } : { scale: 0.94 }}
        transition={springSnappy}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-ink shadow-lift border border-accent-edge transition-colors"
      >
        {open ? <Close size={20} strokeWidth={2.2} /> : <MessageSquare size={20} strokeWidth={2} />}
      </motion.button>

      {/* Floating Dialog Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Department inquiry and feedback"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
            transition={springMove}
            className="absolute bottom-16 left-0 w-[calc(100vw-3rem)] max-w-sm overflow-hidden rounded-2xl border border-material-edge bg-surface p-5 shadow-2xl backdrop-blur-2xl sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <div>
                <span className="t-mark text-accent-deep text-[0.625rem] uppercase tracking-wider font-bold">
                  UNIZIK Physical Sciences
                </span>
                <h3 className="t-title-2 font-bold text-ink mt-0.5">
                  Academic Help &amp; Inquiry
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-ink-3 hover:text-ink transition-colors"
              >
                <Close size={15} />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-good-wash text-good border border-good">
                  <Mail size={22} />
                </div>
                <h4 className="t-title-2 mt-3 font-semibold text-ink">
                  Inquiry Dispatched
                </h4>
                <p className="t-caption mt-1 text-ink-2">
                  The departmental coordination office will review your message.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
                <div>
                  <label className="t-mark text-[0.6875rem] text-ink-3 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Emeka Okoye"
                    className="t-footnote w-full rounded-md border border-line bg-well px-3 py-2 text-ink placeholder:text-ink-3 outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="t-mark text-[0.6875rem] text-ink-3 block mb-1">
                    Email / Reg Number <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@unizik.edu.ng"
                    className="t-footnote w-full rounded-md border border-line bg-well px-3 py-2 text-ink placeholder:text-ink-3 outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="t-mark text-[0.6875rem] text-ink-3 block mb-1">
                    Message / Field Inquiry <span className="text-accent">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Inquire about fieldwork coordinate tolerances or course practical schedules..."
                    className="t-footnote w-full rounded-md border border-line bg-well px-3 py-2 text-ink placeholder:text-ink-3 outline-none focus:border-accent resize-none"
                  />
                </div>

                <div className="mt-1 flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-ink-3">
                    <MapPin size={13} />
                    <span className="text-[0.6875rem] font-mono">FPS Awka</span>
                  </div>
                  <Button type="submit" size="sm" variant="primary">
                    Send Inquiry
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
