# Grilling prompt-conflict validation

Diagnosis and primary evidence: `docs/work/INCIDENT-GRILLING-FORMAT.md`.

The broad validation instruction “Do not answer for me” competed with the loaded
skill's recommendation requirement. In fresh native sessions, removing only that
clause changed red to green, adding it back changed green to red, and narrowing it
to prohibit product decisions while permitting provisional recommendations produced
green output in both the minimal and original full scenarios.

Actual outputs: minimal 2 questions / 2 missing lines; clause removed 2 / 0;
clause restored 3 / 3; clarified 3 / 0; original full scenario clarified 4 / 0.
Every run loaded the real `grilling` skill. Corrected outputs still waited for human
decisions. No upstream content, pins, model configuration, or plugin configuration changed.

MIG-07 probe wording is corrected. Replay with:
`node tests/skills/check-grilling-output.mjs <opencode-jsonl>`.
Old failures are not relabeled passes. The corrected scenario meets the recommendation
shape and human-decision boundary in this observed sample; repeatability and overall
release readiness require their own assessment.
