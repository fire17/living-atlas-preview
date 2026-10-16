# places-data schema (v1, 2026-10-16)
One JSON file per place. Path: places-data/<scale>/<iso2-lower>[--<city-slug>].json
  e.g. places-data/nation/sv.json · places-data/city/sv--san-salvador.json · places-data/region/central-america.json · places-data/humanity/world.json
UTF-8, LF, 2-space indent. Index: places-data/index.json is generated (do not hand-edit).

{
  "id": "city/sv--san-salvador",
  "scale": "nation" | "city" | "region" | "humanity",
  "country": "El Salvador", "iso2": "SV", "city": "San Salvador",   // city null for nation; iso2 null for region/humanity
  "region": "Central America",
  "text": {
    "en": { "context": "...", "stuck": "...", "nurture": "...", "step": "...", "learn": "...", "strengths": ["...", "..."] },
    "es": { ...same keys... },
    "pt": { ...same keys... }
  },
  "sources": [ { "title": "...", "publisher": "...", "url": "https://...", "published": "YYYY or YYYY-MM", "checked": "2026-10-16" } ],
  "solutions": ["library-id", "..."],           // ids from seeds-extra.js, 1-3, most relevant
  "status": "draft-research",                  // becomes "reviewed" only when Sharoni approves
  "reviewed_by": null,
  "updated": "2026-10-16"
}
Rules: every line <= 160 chars. context = 1-2 lines of what public sources show (dated). stuck = ONE bottleneck hypothesis, phrased as a hypothesis.
nurture = an existing strength to build on. step = one small, reversible, locally-led step. learn = how to know if it helps.
>= 2 sources per place, each opened and confirmed (HTTP 200) and actually supporting the context line. No invented numbers. Neutral on politics.
