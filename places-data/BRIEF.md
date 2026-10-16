# Brief for place-research agents (read fully)
Site: The Living Atlas (Sharon Gal-Or). Visitors pick a scale + place and get a QUICK MAP:
where life may be stuck (bottleneck hypothesis), what to nurture (existing strength), one small step, how to learn, + real solutions from elsewhere.
Tone: humble, evidence-careful, dignified. Hypotheses, never verdicts. Local people decide. Book lens: Attention ↔ Infrastructure ↔ System ↔ Capacity;
movements Belonging/Becoming/Stewarding/Release/Exploration/Renewal. Care with rights, participation with authority, no displacement, no surveillance fixes.

Write ONLY files under /Users/magic/sharoni-lab/projects/living-gardens/atlas/places-data/ following SCHEMA.md exactly. Do NOT git commit, do NOT edit any other file.
Library ids for "solutions": grep -oE 'id: ?"[a-z0-9-]+"' ../seeds-extra.js (pick 1-3 that genuinely fit; prefer same region).

Per place:
- Research current public data (World Bank, UNDP HDR, UN agencies, OECD, ECLAC/CEPAL, national statistics, reputable NGOs/academia). Use WebSearch/WebFetch/curl.
  Confirm every source URL loads (HTTP 200) and supports the context line. >= 2 sources. Date them.
- Pick ONE bottleneck that sources make plausible and that a community/city/nation could act on; phrase as hypothesis ("Possible bottleneck: ...").
- Strength to nurture must be real and sourced or widely documented.
- Step: small, reversible, locally led, with who decides; never "the government should simply...".
- Politics: strictly neutral. Name no leaders unless essential; no praise/blame. Sensitive contexts (security, migration, conflict): describe conditions, centre rights and dignity.
- Natural Spanish and Brazilian Portuguese. Every line <= 160 chars.
- Quality > quantity, but aim to complete your whole list. If a place can't be sourced well, skip it and say why.
Validate each file: python3 -c "import json,sys;[json.load(open(f)) for f in sys.argv[1:]]" <files>
Final reply: list of files written, places skipped + why, any source concerns.
