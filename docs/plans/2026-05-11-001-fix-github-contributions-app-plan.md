# Technical Plan: Debug and Fix GitHub Contributions App

**Date:** 2026-05-11
**Type:** fix
**Status:** active
**Sequence:** 001

## Problem Frame
The user is unable to open the GitHub Contributions app in the MaromOS/Cambridge environment. Initial research shows that the app relies on an API route (`api/github-contributions.ts`) which requires `GITHUB_TOKEN` and `GITHUB_USERNAME` environment variables. If these are missing, the API returns a 503 error.

## Scope Boundary
- **Goals:**
    - Reproduce the error using Playwright.
    - Diagnose the root cause (missing credentials, API failure, or frontend crash).
    - Implement a fix (configure credentials, fix API logic, or fix frontend rendering).
    - Verify the fix with Playwright.
- **Non-Goals:**
    - Adding new features to the GitHub contributions app.
    - Refactoring the entire app architecture unless necessary for the fix.

## Requirements Traceability
- **Request:** "i can't open the github contribution app, Still error. Can you please open with playwright then try debug until i can open the app"
- **Technical Requirement:** The app must load and display contribution data correctly.

## Implementation Units

### U1. Reproduction with Playwright
- **Goal:** Create a Playwright test to capture the error state.
- **Files:** `tests/repro-github-app.test.ts`
- **Approach:**
    - Navigate to `http://localhost:3000`.
    - Find and click the GitHub contributions app icon or entry.
    - Monitor `console.error` and network requests to `/api/github-contributions`.
    - Screenshot the resulting state.
- **Test Scenarios:**
    - **Scenario 1:** App fails to open or displays an error message immediately.
    - **Scenario 2:** API request to `/api/github-contributions` returns a non-200 status code.

### U2. Diagnosis and Credential Setup
- **Goal:** Ensure the environment is correctly configured for the app.
- **Files:** `.env.local` (local only, not committed), `api/github-contributions.ts`
- **Approach:**
    - Check if `GITHUB_TOKEN` and `GITHUB_USERNAME` are set in the environment.
    - If missing, ask the user or use a mock response for testing purposes if possible.
    - Verify if the API route handles the 503 error gracefully.

### U3. Fix Implementation
- **Goal:** Fix the identified error.
- **Files:** 
    - `api/github-contributions.ts` (if API logic is broken)
    - `src/apps/github-contributions/GitHubContributionsAppComponent.tsx` (if frontend crash)
    - `src/apps/github-contributions/useGitHubContributionsLogic.ts` (if logic error)
- **Approach:** 
    - Apply the fix based on the diagnosis from U1 and U2.
    - If it's a 503 error, ensure the UI communicates the need for configuration.
    - If it's a rendering error, add null/undefined checks for the calendar data.

### U4. Final Verification
- **Goal:** Run the reproduction test and confirm success.
- **Files:** `tests/repro-github-app.test.ts`
- **Approach:**
    - Run the test and verify that the heatmap and stats are displayed.
    - Ensure no console errors or failed API requests remain.

## Verification Strategy
- **Automated:** Run `npx playwright test tests/repro-github-app.test.ts`.
- **Manual:** Visually inspect the app in the browser if possible.

## Risks & Mitigations
- **Risk:** GitHub API rate limiting or token expiration.
- **Mitigation:** Use a fresh token or implement a mock mode for the API in the test environment.
