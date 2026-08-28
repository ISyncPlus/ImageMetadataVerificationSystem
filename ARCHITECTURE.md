# Provenance — Architecture Decision Record

This document records the design review held before the fullstack build, the
objections raised against the initial plan, and the decisions that resulted.

The review was conducted as an adversarial dialogue: the **Architect** proposes,
the **Examiner** — a security-minded reviewer briefed to find the flaw that sinks
the project defense — attacks. Decisions below are the settlement, not the
opening position. Three of the Architect's original choices did not survive.

---

## The dialogue

### 1. Does a server destroy the thesis?

**Architect.** The brief is Express + Prisma + Better Auth + OAuth. I will add a
backend that stores submissions in Postgres.

**Examiner.** Then you have just falsified your own product document. `PRODUCT.md`
promises "100% Client-Side", "Zero Server Uploads", "no student photograph is
transmitted to an external server". Chapter One's Scope and Chapter Three's
architecture both say browser-native. An examiner who has read your chapters will
open your network tab, see a photograph in a POST body, and you will spend the
defense explaining why your dissertation contradicts your demo.

**Architect.** The counter is that the current build is already broken as a
product. History lives in `localStorage`. A lecturer sitting at their own machine
sees an empty ledger — every student submission is trapped in the browser that
made it. The lecturer dashboard, which is half the product, cannot function.
Duplicate detection is worse: it only ever compares a student against *their own*
prior uploads in *that one browser*. The single most valuable check — did two
different students submit the same photograph — is impossible by construction.

**Examiner.** Agreed on the diagnosis. That does not license uploading photographs.

**Architect.** Then I will not upload photographs. Extraction and hashing stay in
the browser exactly as they are. What crosses the wire is the *derived record*:
the SHA-256 digest, the parsed metadata values, the verdict, and a thumbnail. The
original file never leaves the device.

**Examiner.** The thumbnail is a photograph. Smaller, but a photograph. If you
POST it you may not print "zero uploads" anywhere.

**Architect.** The lecturer cannot audit submissions they cannot see; a ledger of
hashes with no images is not reviewable. I will keep the thumbnail, cap it at
96px, and stop making the absolute claim.

> **Decision 1.** Hybrid. EXIF parsing and SHA-256 hashing remain client-side; the
> original file is never transmitted. A ≤96px thumbnail and the derived record are
> persisted server-side. `PRODUCT.md` must be corrected: the guarantee becomes
> *"no full-resolution image or original file leaves the device"*, not *"zero
> uploads"*. Overclaiming in the product doc is itself a defect.

---

### 2. The verdict is forgeable

**Examiner.** Your client computes `status: "Verified"` and POSTs it. I can send
that with one `curl` command and no image at all. You have built an
academic-integrity system whose integrity check is optional and client-side. That
is not a bug, it is the whole product failing.

**Architect.** The server cannot re-extract EXIF — it does not have the file, by
Decision 1.

**Examiner.** It does not need the file to catch you. It has the metadata you
claim. Re-apply the rules to the claimed metadata server-side and the verdict
stops being an input.

**Architect.** Correct, and that closes rule-forgery entirely: a client that sends
`captureTime: null` alongside `status: "Verified"` gets overruled, because the
server derives the status itself and ignores whatever the client asserted.
Duplicate detection moves server-side as well — which it must anyway, since
cross-student duplicates are the check `localStorage` could never perform.

**Examiner.** A student can still lie about the metadata values themselves. Send a
plausible timestamp, plausible GPS, plausible device, and the server will bless it.

**Architect.** True, and unfixable without server-side extraction, which Decision 1
forbids. I will not pretend otherwise.

**Examiner.** Then write it down. An unstated limitation is a weakness; a stated
one is scope.

> **Decision 2.** The server is the sole authority on verdicts. It re-applies the
> verification rules to the submitted metadata and performs duplicate detection
> against every stored hash. `status` and `reason` from the client are discarded.
> The residual limitation — a client may fabricate metadata *values* — is
> documented here and belongs in Chapter One's Limitations, alongside the existing
> note about advanced spoofing.

---

### 3. Who says you are a lecturer?

**Examiner.** OAuth returns a Google account. Google does not know this person
teaches. If role is a field on your sign-up form, any student ticks "lecturer" and
reads the entire faculty ledger — including other students' names, registration
numbers, and submissions. That is a data breach in a project about integrity.

**Architect.** My initial plan was a role selector at sign-up. That is indefensible
as written.

**Examiner.** What replaces it?

**Architect.** Two layers. Self-service sign-up always yields `student`. Elevation
to `lecturer` requires a `LECTURER_INVITE_CODE` held by the department and
supplied at onboarding, and an allowlist (`LECTURER_EMAIL_ALLOWLIST`) can gate it
further. A real deployment would verify against the faculty staff registry; the
invite code is the prototype's stand-in and is labelled as such.

**Examiner.** Acceptable, provided the API enforces it rather than the UI. Hiding a
button is not authorization.

**Architect.** Role checks live in `requireRole` middleware on the routes. The UI
merely reflects them.

> **Decision 3.** Role is never self-asserted. OAuth and email sign-up create
> `student`. Lecturer elevation requires a server-verified invite code, optionally
> constrained by an email allowlist. Every privileged route is guarded by
> middleware; UI affordances are cosmetic.

---

### 4. Cross-origin sessions

**Examiner.** Frontend on `:3000`, API on `:4000`. Different origins. Your cookie
will not be sent, your preflight will fail, and you will spend an evening
convinced Better Auth is broken.

**Architect.** CORS with an explicit origin and `credentials: true`; Better Auth's
`trustedOrigins` set to the frontend; every browser call uses
`credentials: "include"`. In production, cookies are `Secure` and either
host-shared or `SameSite=None`.

**Examiner.** And `app.use(express.json())` mounted before the Better Auth handler
will silently break OAuth callbacks by consuming the body.

**Architect.** Noted — the auth handler mounts *before* the JSON parser.

> **Decision 4.** Explicit CORS origin with credentials, `trustedOrigins`
> configured, auth routes mounted ahead of body parsing, `SameSite`/`Secure`
> derived from environment.

---

### 5. Scope discipline

**Examiner.** You are rewriting a working app. What is your rollback if the
backend is unreachable during the defense?

**Architect.** A fair hit. The demo must not depend on a laptop's Wi-Fi.

> **Decision 5.** Verification itself never requires the network — parsing,
> hashing and the local verdict still run offline in the browser. The API call
> persists and confirms the record. If the API is unreachable the user is told
> plainly, and the local result is still shown.

---

## Settled architecture

| Concern | Resolution |
| --- | --- |
| Image data | Never transmitted at full resolution; ≤96px thumbnail only |
| EXIF + hashing | Client-side (`exifr`, `crypto.subtle`) — unchanged |
| Verdict authority | **Server** — re-derived from metadata, client value discarded |
| Duplicate detection | **Server** — global across all students |
| Identity | Better Auth: Google + GitHub OAuth, plus email/password |
| Role | `student` by default; `lecturer` via server-verified invite code |
| Authorization | `requireAuth` / `requireRole` middleware per route |
| Persistence | PostgreSQL via Prisma |
| Offline | Verification degrades gracefully; persistence is what needs the network |

## Documented limitations

1. A client may fabricate metadata *values*; the server validates rules and
   duplicates, not the authenticity of claimed EXIF. Server-side extraction would
   close this at the cost of the no-upload guarantee.
2. Lecturer elevation uses a shared invite code, not a faculty registry.
3. Thumbnails are persisted. The privacy guarantee is "no original file leaves the
   device", not "nothing leaves the device".
