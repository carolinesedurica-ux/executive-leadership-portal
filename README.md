# Executive Leadership Readiness Portal

Client-facing interactive portal for the six-week Executive Leadership Readiness Programme.

## Current launch scope

- Home dashboard and programme journey
- Start Here orientation
- Week 1: Leadership Identity & Confidence
- Week 2: Executive Presence & Personal Authority
- Week 3: Assertiveness & Difficult Conversations
- Mandatory scored Mid-Course Leadership Assessment
- Week 4 gated until the assessment is submitted
- Weeks 5–6 visible as upcoming
- Local browser progress tracking
- Responsive layout for desktop and mobile
- Placeholder areas for NotebookLM explainer video embeds

## Important implementation note

The current MVP stores client progress and assessment responses in browser `localStorage`. This is appropriate for a fast single-client launch but is not a secure multi-user persistence layer. Before commercial rollout, add authentication and database-backed storage.

## Video workflow

NotebookLM scripts are facilitator-only production assets. Only the finished explainer videos should be embedded in the client portal. Replace each video placeholder in `app.js` with the relevant video embed when ready.

## Next steps

1. Deploy the static site for review.
2. Add Week 1–3 explainer video embeds.
3. Proofread client-facing wording.
4. Build Weeks 4–6.
5. Add secure persistence/authentication for multi-client use.
6. Integrate/deploy beneath the Work Ready Vault domain.
