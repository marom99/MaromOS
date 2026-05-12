---
title: "feat: Replace ryOS frontend branding with MaromOS"
type: feat
status: active
date: 2026-05-12
origin: .context/attachments/[LINEAR]-PRSNL-149.md
---

# feat: Replace ryOS frontend branding with MaromOS

## Summary

Update visible frontend branding so visitors see `MaromOS` instead of `ryOS`/`Ryos` across the UI. Keep the change scoped to user-facing copy and accessible labels; do not rename internal identifiers, storage keys, log prefixes, hosts, or release artifact filenames in this ticket.

---

## Problem Frame

PRSNL-149 asks for the frontend branding to read `MaromOS` so visitors immediately recognize the platform by its current name. The repo still contains legacy `ryOS` branding in translated UI copy, dialogs, labels, and a few inline component strings.

---

## Requirements

- R1. Replace visible `ryOS`/`Ryos` frontend branding with `MaromOS`.
- R2. Update user-facing strings in components, dialogs, toasts, and accessibility labels where the old brand is shown directly.
- R3. Update localized frontend copy so the visible brand is consistent across supported languages.
- R4. Do not rename non-UI technical identifiers, runtime keys, storage/database names, log prefixes, domains, or download filenames in this ticket.

---

## Scope Boundaries

- In scope: rendered UI copy, translated strings, alt text, and titles that a visitor can see.
- Out of scope: internal variable names such as `ryOSVersion`, telemetry/log prefixes like `[ryOS]`, IndexedDB names, runtime globals, comments, and hard-coded GitHub release asset paths.
- Out of scope: broader product copy cleanup such as changing references to `Ryo` the person unless they are part of the `ryOS`/`Ryos` product brand.

---

## Context & Research

### Relevant Code and Patterns

- `src/lib/locales/*/translation.json` contains the majority of visible brand copy and is the primary source for dialogs, menus, and app help text.
- `src/App.tsx`, `src/components/dialogs/AboutFinderDialog.tsx`, `src/components/errors/ErrorBoundaries.tsx`, `src/components/layout/StartMenu.tsx`, `src/components/dialogs/BootScreen.tsx`, `src/components/screensavers/BouncingLogo.tsx`, and `src/components/dialogs/TelegramLinkDialog.tsx` contain direct UI strings or labels outside the locale bundle.
- `src/utils/i18n.ts` and `src/hooks/useTranslatedHelpItems.ts` reference translation keys and should only change if a rendered label key name itself must stay wired.

### Institutional Learnings

- No directly matching memory entry or `docs/solutions/` note was needed beyond the general rule to verify visible labels rather than only updating the data source.

### External References

- Not needed. This is an internal copy/branding change.

---

## Key Technical Decisions

- Translation-first update: change visible branding in locale files so the UI stays consistent across languages without renaming translation keys.
- Preserve internal contracts: keep technical identifiers and asset names as-is to avoid unnecessary churn and accidental regressions from a branding-only ticket.
- Direct-string cleanup second: update the smaller set of hard-coded UI labels outside the locale system to match the new brand.

---

## Open Questions

### Resolved During Planning

- Should this ticket rename all `ryOS` code symbols? No. The request is frontend UI branding only.
- Should translation keys like `createWithRyosChat` be renamed? No. Keep keys stable; update rendered values only.

### Deferred to Follow-Up Work

- A separate technical cleanup can rename internal `ryOS` symbols, DB keys, and release infrastructure if the product owner wants a full codebase rebrand later.

---

## Implementation Units

### U1. Update localized frontend copy

- Files: `src/lib/locales/en/translation.json`, `src/lib/locales/de/translation.json`, `src/lib/locales/es/translation.json`, `src/lib/locales/fr/translation.json`, `src/lib/locales/it/translation.json`, `src/lib/locales/ja/translation.json`, `src/lib/locales/ko/translation.json`, `src/lib/locales/pt/translation.json`, `src/lib/locales/ru/translation.json`, `src/lib/locales/zh-TW/translation.json`
- Change only rendered brand text from `ryOS`/`Ryos` to `MaromOS`.
- Preserve translation key names and non-brand references.

Test scenarios
- Grep locale files after editing to confirm no visible `ryOS` branding remains in translated strings intended for the frontend.
- Build succeeds with locale JSON still valid.

### U2. Update hard-coded UI branding outside locales

- Files: `src/App.tsx`, `src/components/dialogs/AboutFinderDialog.tsx`, `src/components/dialogs/BootScreen.tsx`, `src/components/dialogs/TelegramLinkDialog.tsx`, `src/components/errors/ErrorBoundaries.tsx`, `src/components/layout/StartMenu.tsx`, `src/components/screensavers/BouncingLogo.tsx`
- Replace direct rendered labels/toasts/alt text from the old brand to `MaromOS`.
- Do not change technical URLs or release artifact filenames unless the visible user copy itself needs updating.

Test scenarios
- Grep targeted component files after editing to confirm user-facing brand strings now read `MaromOS`.
- `bun run build` passes.

---

## Verification Plan

- Run targeted grep for visible `ryOS`/`Ryos` strings in `src/components`, `src/App.tsx`, and `src/lib/locales/*/translation.json` to confirm the UI-facing replacements landed.
- Run `bun run build`.
- Review the final diff to ensure internal identifiers and unrelated `bun.lock` changes were not included accidentally.

---

## Risks

- Some `ryOS` strings are technical rather than visual; broad search-and-replace would create unnecessary churn. Mitigate by keeping edits to locale values and clearly rendered UI strings.
- Localization files are large; malformed JSON would break the build. Mitigate with build verification.
