# Executive Leadership Coaching Portal

Client and administrator portal for the six-week **Executive Leadership Readiness Programme** delivered by Foundations Counselling Academy (FCA).

**Live production site:** https://coaching.workreadyvault.com  
**Deployment:** Vercel  
**Default branch:** `main`

---

## Current status

The portal is live and actively under development.

### Available now

- Secure client and administrator sign-in
- Executive coaching dashboard
- Programme overview
- Week 1 — Leadership Identity & Confidence
- Week 2 — Executive Presence & Personal Authority
- Week 3 — Assertiveness & Difficult Conversations
- Embedded Week 1–3 explainer videos
- Guided reflection cards with autosave
- Leadership Compass activity
- Executive Presence practice activity
- CLEAR difficult-conversation planner
- Daily leadership practice / habit tracking
- End-of-week completion tracking
- Mandatory Mid-Course Leadership Assessment
- Week 4 gating based on assessment completion
- Administrator dashboard for reviewing client responses
- Responsive desktop, tablet and mobile layouts
- Local browser persistence with optional Vercel Blob cloud sync

Weeks 4–6 are currently staged for continued programme development.

---

## Programme structure

### Week 1
**Leadership Identity & Confidence**  
*Think Like a Leader Before You Have the Title*

Focus areas include leadership identity, confidence, self-trust and how the client wants others to experience their leadership.

### Week 2
**Executive Presence & Personal Authority**  
*Your Presence Speaks Before You Do*

Focus areas include calm authority, communication under pressure, concise speaking and personal presence.

### Week 3
**Assertiveness & Difficult Conversations**  
*Speak Clearly When the Conversation Is Difficult*

Focus areas include assertiveness, boundaries, disagreement, difficult conversations and the CLEAR planning framework.

### Mid-Course Assessment
The client completes a scored leadership assessment after Week 3. Submission unlocks Week 4.

### Weeks 4–6
The current programme roadmap continues into:

- Week 4 — Leading People with Confidence
- Week 5 — Workplace Dynamics, Influence & Executive Communication
- Week 6 — Leadership Integration & Personal Action Plan

---

## UI architecture

The portal previously accumulated several competing visual override files. The current implementation deliberately uses a simpler visual hierarchy.

### Primary UI files

- `styles.css` — base application styles
- `reflection-cards.css` — reflection component foundations
- `daily-habits.css` — daily practice components
- `priority-focus.css` — priority / focus components
- `enhancements.css` — interactive activity styling
- `auth.css` — sign-in and authentication views
- `mockup-exact.css` — **final FCA visual authority and blueprint layer**

Do not add another broad “final override” stylesheet unless absolutely necessary. New visual work should normally be made in the component owner stylesheet or in `mockup-exact.css`.

The approved FCA desktop blueprint is the visual reference for the Week 1–3 learning workspace.

---

## Week workspace

Weeks 1–3 use a structured executive-learning layout consisting of:

1. Week hero
2. Watch / Reflect / Prepare ribbon
3. Guided reflection workspace
4. Reflection progress
5. “What I’m noticing” summary panel
6. Interactive leadership activity
7. Daily practice
8. Workplace challenge
9. Video learning
10. Live coaching and end-of-week check-in

The workspace has been rebuilt to use normal layout flow rather than negative-margin overlap tricks.

---

## Video player

Finished explainer videos are configured in:

`video-config.js`

Current videos:

- Week 1 — Leadership Identity
- Week 2 — Executive Presence
- Week 3 — Speak Clearly

The video player is rendered by:

`video-player.js`

The learning window uses a responsive **16:9 aspect ratio**, with a controlled desktop maximum width so videos remain proportional across desktop, tablet and mobile.

Only final client-facing videos should be added to the portal. NotebookLM scripts and production notes remain facilitator-side assets.

---

## Client data and persistence

The client application stores working state in browser `localStorage`:

- `elrpState`
- `elrpDailyHabits`

When cloud storage is available, `auth-gate.js` synchronises this state through:

`/api/data`

### Cloud storage

Cloud persistence uses **Vercel Blob** via `@vercel/blob`.

Client coaching data is encrypted at the application layer using AES-256-GCM before being written to Blob. The encryption key is derived from `SESSION_SECRET`.

Current storage path:

`private/client-data-current.enc`

### Local-only fallback

If `BLOB_READ_WRITE_TOKEN` is not configured, the portal intentionally continues in **Local only** mode.

In this mode:

- client work still saves in the current browser
- the UI remains usable
- cloud sync is disabled
- administrator data will not update across devices

The API returns a successful local-only status rather than repeatedly throwing server errors.

---

## Authentication

Authentication is handled through serverless API routes and an HTTP-only session cookie.

Client access uses Supabase passwordless email signup/sign-in while the administrator route preserves the existing access-code flow. The portal continues to issue its existing HTTP-only signed session cookie after Supabase verifies the client identity.

Required production environment variables:

```text
SESSION_SECRET=
CLIENT_ACCESS_CODE=
ADMIN_ACCESS_CODE=
BLOB_READ_WRITE_TOKEN=

SUPABASE_URL=https://kretjuxsrviqrmnthfwe.supabase.co
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_EMAIL_REDIRECT=https://coaching.workreadyvault.com/

TOKEN_HASH_SECRET=
MILESTONE_TOKEN_TTL_DAYS=90

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
SMTP_FROM_NAME=FCA Executive Leadership Coaching
```

### Important

Never commit real access codes, session secrets or Blob tokens to GitHub.

The session lifetime is currently 12 hours.

---

## Administrator portal

The administrator interface is available at:

`/admin.html`

It is read-only and currently provides visibility into:

- reflection responses
- daily leadership practice notes
- completed weeks
- mid-course assessment scores
- assessment narrative responses
- last successful client sync

The current architecture is designed around one active coaching client record. A multi-client commercial version will require a client/account data model rather than the single `client-data-current.enc` record.

---

## API routes

The Vercel serverless API includes authentication, session and data functions under:

`/api`

Key routes include:

- `POST /api/login`
- `POST /api/logout`
- `GET /api/session`
- `GET /api/data`
- `POST /api/data`

Only the client role can update coaching responses through `POST /api/data`.

---

## Technology

- HTML
- CSS
- Vanilla JavaScript
- Vercel Serverless Functions
- Vercel Blob
- Node.js
- `@vercel/blob`
- Browser `localStorage`

There is currently no frontend framework or build framework.

---

## Repository structure

```text
/
├── api/                    # Authentication, sessions and cloud persistence
├── index.html              # Client portal
├── admin.html              # Administrator portal
├── app.js                  # Programme state, navigation and core interactions
├── auth-gate.js            # Client authentication and cloud/local sync
├── admin.js                # Read-only admin dashboard logic
├── mockup-layout.js        # FCA week workspace enhancement
├── mockup-exact.css        # Final FCA visual blueprint layer
├── reflection-cards.js     # Guided reflection experience
├── reflection-cards.css
├── daily-habits.js
├── daily-habits.css
├── priority-focus.js
├── priority-focus.css
├── enhancements.css
├── video-config.js         # Week video URLs
├── video-player.js         # Responsive embedded video renderer
├── styles.css              # Base styles
├── auth.css
└── package.json
```

---

## Deployment workflow

Changes are committed directly to GitHub `main`.

Vercel is connected to this repository and automatically creates a production deployment from `main`.

After UI or JavaScript changes, update the relevant asset query version in `index.html` when cache busting is required.

Production domain:

https://coaching.workreadyvault.com

Before considering a change complete, confirm:

- the latest GitHub commit is on `main`
- the matching Vercel deployment is `READY`
- `coaching.workreadyvault.com` resolves to that deployment
- there are no new runtime errors
- desktop and mobile interaction still work

---

## Development principles

1. Preserve programme data and client responses when making UI changes.
2. Avoid overlapping CSS ownership.
3. Avoid negative-margin positioning for primary layout geometry.
4. Keep decorative layers from intercepting clicks.
5. Keep the video window proportional and responsive.
6. Preserve local fallback when cloud storage is unavailable.
7. Do not expose secrets in frontend code.
8. Keep the administrator portal read-only unless the product scope changes.
9. Test navigation, Previous/Next, reflection fields and assessment submission after significant UI changes.
10. Treat the approved FCA visual blueprint as the source of truth for the client learning experience.

---

## Contributor setup

This project is intentionally lightweight: there is no frontend framework and no compile step for the client UI. Contributors should keep changes small, readable and easy to verify.

### 1. Clone the repository

```bash
git clone https://github.com/carolinesedurica-ux/executive-leadership-portal.git
cd executive-leadership-portal
```

### 2. Install dependencies

The serverless API uses `@vercel/blob`.

```bash
npm install
```

### 3. Configure local environment variables

Create a local environment file for development and provide values for:

```text
SESSION_SECRET=
CLIENT_ACCESS_CODE=
ADMIN_ACCESS_CODE=
BLOB_READ_WRITE_TOKEN=
```

Do not commit real secret values to the repository.

For UI-only work, the portal can still operate in local browser storage mode if Blob storage is unavailable.

### 4. Run locally

For the most accurate local behaviour, use the Vercel development runtime so the `/api` serverless routes are available.

```bash
vercel dev
```

If working only on static UI, any local static server can be used for visual checks, but authentication and API sync will not behave exactly like production without the Vercel runtime.

### 5. Test before committing

At minimum, verify:

- Dashboard loads without layout overlap
- Sidebar navigation works
- Week 1, Week 2 and Week 3 open correctly
- Watch / Reflect / Prepare controls work
- Video player remains proportional at 16:9
- Reflection textarea accepts input
- Previous / Next navigation works
- Autosave status does not overlap buttons
- Leadership activities remain interactive
- Mid-Course Assessment submits correctly
- Week 4 unlock logic still works
- Mobile navigation opens and closes correctly
- No new browser console errors appear
- Local-only mode still works when Blob storage is unavailable

### 6. UI contribution rules

The current UI has already been through several conflict and overlap fixes. Please follow these rules:

- Treat `mockup-exact.css` as the final FCA visual authority.
- Do not reintroduce broad competing theme stylesheets.
- Avoid negative margins for primary page geometry.
- Avoid absolute positioning for major content blocks.
- Decorative pseudo-elements must use `pointer-events: none`.
- Keep navigation and form controls above decorative layers.
- Preserve responsive behaviour at desktop, tablet and mobile widths.
- Keep the video player proportional rather than assigning arbitrary fixed heights.
- Prefer editing the stylesheet that owns a component instead of adding a new override layer.
- Preserve existing programme state keys and localStorage behaviour.

### 7. JavaScript contribution rules

When editing programme logic:

- Preserve `elrpState` and `elrpDailyHabits`.
- Do not rename existing reflection keys without a migration plan.
- Keep administrator views read-only.
- Do not expose access codes or secrets in frontend JavaScript.
- Avoid replacing existing event delegation with duplicate listeners.
- Test any DOM reconstruction against `reflection-cards.js` and `mockup-layout.js`.
- Keep cloud sync optional so the client portal remains usable in local-only mode.

### 8. Git workflow

The current project deploys directly from `main`.

Recommended workflow:

```bash
git pull origin main
git checkout -b feature/short-description

# make and test changes

git add .
git commit -m "Describe the change clearly"
git push origin feature/short-description
```

For small owner-approved fixes, changes may be committed directly to `main`. For larger or riskier changes, use a feature branch and pull request.

### 9. Cache busting

The portal uses version query strings in `index.html` for CSS and JavaScript assets.

After significant UI or JavaScript updates, increment the relevant asset version so browsers do not continue serving stale files.

Example:

```html
<link rel="stylesheet" href="mockup-exact.css?v=20260905-ui3">
<script src="mockup-layout.js?v=20260905-ui3"></script>
```

Do not change version strings unnecessarily for unrelated files.

### 10. Vercel deployment verification

After a production change:

1. Confirm the commit is present on GitHub `main`.
2. Confirm Vercel created a deployment from that commit.
3. Wait for deployment status `READY`.
4. Confirm `coaching.workreadyvault.com` points to the latest deployment.
5. Check runtime errors.
6. Hard-refresh the browser and test the affected feature.

### 11. Definition of done

A contribution is complete only when:

- the intended feature works
- no existing interaction is broken
- desktop and mobile layouts remain usable
- there are no new console/runtime errors
- state persistence still works
- the production deployment is verified
- relevant README documentation is updated when architecture or setup changes

---

## Supabase milestone backend

The repository now includes an additive Supabase backend migration at `supabase/migrations/20260905_backend_upgrade.sql`. It creates persistent profiles, programme enrollment, milestones, milestone progress, assessment results, hashed access-token records and audit logs. Row Level Security is enabled, and progression writes are performed by the Vercel server API with the Supabase service role; the service-role key is never exposed to browser code.

When `SUPABASE_SERVICE_ROLE_KEY` is configured and the migration has been applied, Supabase becomes authoritative for milestone completion, unlock state, assessment completion and scores, current entitlement and access-credential validity. Browser `localStorage` remains for harmless working UI state and existing reflections, while the current encrypted Vercel Blob storage is preserved. `/api/data` overlays authoritative Supabase progression before storing or returning client state.

Milestone credentials use cryptographically random `ELR-...` values. Supabase stores only a keyed SHA-256 hash plus an opaque credential reference. The raw credential is encrypted with AES-256-GCM and escrowed in the existing Vercel Blob store so an email failure can be securely resent without generating a duplicate credential.

### Titan Email SMTP over SSL

Use `SMTP_HOST=smtp.titan.email`, `SMTP_PORT=465`, and `SMTP_SECURE=true`. Set `SMTP_USER=info@academyfoundations.com`, `SMTP_FROM=info@academyfoundations.com`, and `SMTP_FROM_NAME=Foundations Counselling Academy`. Use the Titan mailbox password, or a Titan application password if 2FA is enabled. Supabase Auth magic-link delivery must also have Custom SMTP configured with the same Titan credentials. Never commit SMTP passwords, database passwords or the Supabase service-role key.

### Backend API additions

- `GET /api/progress`
- `POST /api/progress/import`
- `POST /api/milestones/complete`
- `POST /api/assessment/submit`
- `POST /api/credentials/resend`
- `POST /api/credentials/validate`

New participants can create an account with any valid email address through the same passwordless email field used by returning participants. After verified login, the backend creates or updates the participant profile and enrols the participant into the Executive Leadership Readiness Programme. The first authenticated backend sync can import existing browser progression only where the old completion declaration is supported by the existing reflection and end-of-week evidence; it does not blindly trust the old `completed` array.

---

## Immediate roadmap

- Complete and polish Week 4
- Build Week 5
- Build Week 6
- Reconnect/verify Vercel Blob production storage
- Complete desktop visual QA against the FCA blueprint
- Complete mobile/tablet QA
- Add a true multi-client data model before broader commercial rollout
- Consider client profiles, programme assignment and CRM integration for future corporate deployments

---

## Brand

**Foundations Counselling Academy**  
People | Potential | Purpose

Executive Leadership Coaching Portal
