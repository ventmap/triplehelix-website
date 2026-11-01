# TripleHelix website

Static site (no build step). Pages: `index.html`, `challenges.html`. English/Azerbaijani switch via `assets/i18n-az.js`.

## Deploy (Vercel, repo ventmap/triplehelix-website, branch main)
1. Delete the old files in the repo root (old `index.html`, `triplehelix-site.html`).
2. Copy the contents of this folder into the repo root (keep `assets/`, `vercel.json`).
3. Commit and push to `main`; Vercel deploys automatically.
4. Check https://triplehelix.az/ and https://triplehelix.az/challenges.

## Before launch
- Open the mailbox info@triplehelix.az (forms and footer use it).
- Have a native speaker confirm the Azerbaijani text (edit `assets/i18n-az.js`).
- Challenge dates are planned, not fixed; fees are "being finalised".
