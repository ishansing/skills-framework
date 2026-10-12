# Curl distribution and installation menu

Scope: `agent-work/plans/INSTALL-PLAN.md`; branch feature/curl-install-menu.
Architecture: release bundle includes approved upstream skill bytes, the existing installer,
and its standalone verifier/helpers. Bootstrap verifies/extracts then calls that installer.
The menu selects the same flags used by scripted installs; framework adapters remain
per-project, with upstream dependencies global or repo-local.

AC-1: latest/pinned curl bootstrap resolves matching release assets, checks SHA-256 before
extraction, rejects unsafe tar entries, and cleans temporary files even on failure.
AC-2: shipped bundle installs without cloning/Git/network; Node 20+ is required, Git only
for explicit new-project initialization. Bundle build verifies all pinned directories.
AC-3: menu works from a terminal and curl pipe via /dev/tty; explicit --menu accepts
scripted answers; noninteractive flags never prompt. Cancellation/invalid input is safe.
AC-4: global/repo scope uses matching target registry statuses; large/quoted upstream
frontmatter passes target checking; tampered staging fails before activation.
AC-5: checkpoint defaults use false/phase/slice; existing ledgers, unrelated skills and
AGENTS content are preserved. Project creation/upgrade is idempotent and dry runs leave
target/global content unchanged. Managed files are guarded against unexpected edits.
AC-6: release workflow uploads bootstrap/archive/checksums and runs packaging smoke;
tests, contract checks, shell/workflow lint, independent review and fresh verification pass.

Approved seams: artifact builder, real installer in isolated homes/projects, scripted/PTY
menu input, controlled HTTPS release fixture for real curl latest/pinned/corrupt downloads.
No real release, remote mutation or user-global install is authorized in this implementation.
Documentation impact: README installation guide, plan refinements and verification evidence.
Plan refinements: include standalone verifier (not behavioral suites); no exec that would
bypass cleanup; /dev/tty for piped menu; bundle upstream data instead of client-side clones.
