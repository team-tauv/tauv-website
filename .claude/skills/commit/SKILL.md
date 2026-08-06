---
name: commit
description: Create a git commit using whatever git identity the repository is configured with. Use whenever the user asks to commit changes. Commit messages are short, English, and clear. NEVER add Claude as author or co-author, and never include Co-Authored-By lines.
---

# Commit

Create a git commit for the current changes using the repository's configured git identity.

## Identity rules (strict)

- Commit as whoever `git config user.name` / `git config user.email` is set to. That configured identity is the author — whatever account it happens to be.
- Do NOT override it with `--author`, `-c user.*`, env vars, or anything else. Do not ask the user to confirm the identity or flag it as unexpected; if it is set, use it.
- NEVER attribute the commit to Claude / Anthropic in any way. If the configured identity is itself Claude/Anthropic, stop and tell the user instead of committing.
- NEVER add a `Co-Authored-By:` line (no Claude, no anyone). The commit message body and trailers must contain no co-author or "Generated with" lines.

## Message rules

- Short, English, and clear. Prefer a single concise subject line (≈50 chars, max ~72).
- Imperative mood, lowercase after an optional `type:` prefix (e.g. `fix: hide teil-training banner`).
- Add a brief body only if the change genuinely needs explanation; keep it to 1–3 short lines. No co-author/footer trailers.

## What to stage

- Commit only the files relevant to the work just done. Do NOT blindly `git add -A` / `git add .`.
- Leave unrelated working-tree changes (e.g. `.env`, unrelated edits) untouched unless the user asked to include them.
- If it is unclear which files belong to this change, ask the user before staging.

## How to commit

- Stage the intended files explicitly: `git add <path> [<path> ...]`.
- Commit with a one-line message:
  - `git commit -m "fix: short clear message"`
- If a multi-line message is needed, write it to a temp file and use `git commit -F <file>` (PowerShell here-strings parse unreliably).
- After committing, report the short commit hash and branch.

## Branch safety

- If on the default branch (`main`/`master`) and the user has not said to commit there, create/switch to a working branch first, then commit.
