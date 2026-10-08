# Domain docs

Single-context by default. Read `GLOSSARY.md` for domain vocabulary and relevant ADRs
under `docs/architecture/ADR/` when present, matching the framework artifact contract.
If `GLOSSARY-MAP.md` exists, follow its pointers to
the glossaries for the contexts being changed.

Create a glossary only when a domain term is resolved, and an ADR only for a real
architectural decision. Missing files are not an error or a reason to scaffold them.
Use established terms in issues, reviews, and tests; surface contradictory decisions
instead of silently overriding them.

Session handoffs and implementation context are separate artifacts. Do not treat a
`CONTEXT.md` handoff as a domain glossary or rename it automatically.
