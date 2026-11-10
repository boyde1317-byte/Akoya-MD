# FINDINGS — Yorumi-MD v2.00 Cleanup Report

Source: MediaFire download `YorumiMD-v2.00.zip` (6.3 MB, 45 entries).
Deliverable: fully readable, English-localized codebase.

## 1. Unpacking the obfuscated `index.js`

The original `index.js` (120 KB, single line) was **not real code** — it
was an obfuscator pack:

1. A base64 string-array (`_0x2eb3`) with a rotation shuffle.
2. A decoder (`_0x52ab` / `_0x119034`) that decodes array entries.
3. A chunked payload assembled into a Buffer and decoded by a custom
   byte-loop decoder (`_vm3158d57677`, literal error string `VM rusak`
   — "VM broken").
4. The resulting real source handed to `module._compile()` at runtime,
   guarded by an anti-tamper check on `module`.

**Method:** the pack was executed in a sandboxed Node `vm` context with a
capturing `module._compile` stub and stubbed `require`. The 27.7 KB real
source was captured unchanged and verified as clean, readable JavaScript,
then written back as the new `index.js` (873 lines). The pack, its
backup, and the captured intermediate are excluded from the deliverable.

## 2. Translation

- `index.js`, `case.js` (18.7k lines), `settings.js`, `source/*`
  (including the 4.4k-line feature list), and `library/*` were fully
  translated from Indonesian to English across 7 dictionary passes
  (~1,600 string rewrites).
- Translation was applied via AST (Babel) to string literals and template
  elements only — identifiers, file paths (`library/database/sampah/`,
  `contacts.json`), URLs, and API query parameters were left untouched.
- Template elements were re-escaped (`\``, `\${`) so generated code stays
  valid; every file passes `node --check`.
- The README was rewritten in English; original links and credits kept.

## 3. Security review

Reviewed: `eval`/`Function` usage, `exec`/`spawn`, `ssh2`, outbound
URLs, remote config, credential handling.

Findings:

| # | Severity | Finding |
|---|----------|---------|
| 1 | ✅ Resolved | **Remote-controlled channel follow — removed.** `index.js` used to fetch a JSON list of `@newsletter` ids from a remote gist and auto-follow/unfollow to match it, retrying up to 5 times. The original build pointed at a *third party's* repo (`dapzy23/Newsletter3`); this build briefly pointed at the owner's own gist, which was still a live control surface. 2.6.2 deleted the whole block along with the two invite-code group joins, so no deployment follows or joins anything now. The gist URL is no longer read by the code (`AUDIT-2026-11-09.md` §24). |
| 2 | ℹ️ Info | Owner-only `>eval` / `>exec` commands exist in `case.js` — standard for this bot family, gated on the configured owner number. |
| 3 | ℹ️ Info | Dozens of third-party scraper APIs (diioffc.web.id, apizell, nanzz.my.id, bmkg.go.id, etc.) are called for features. They receive message content (e.g., search queries) — normal for these bots, but not private. |
| 4 | ✅ Clean | No credential exfiltration, no hidden kill switches, no session theft found in the unpacked code. |

## 4. Package layout

Identical to the original zip (all 45 entries preserved), with:
- `index.js` — replaced with the unpacked, translated real source
- `README.md` — English rewrite
- `FINDINGS.md` — this report
- `AUDIT-2026-11-09.md` — later health check (jadibot fix, translation finish, manifest cleanup, Akoya-MD rebrand)
