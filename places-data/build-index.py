#!/usr/bin/env python3
"""Write places-data/index.json: {id: {path, scale, iso2, region, status}} for every places-data/<scale>/*.json.
Run from anywhere after adding or renaming a place file: python3 places-data/build-index.py"""
import json, pathlib
root = pathlib.Path(__file__).resolve().parent
index = {}
for f in sorted(root.glob('*/*.json')):
    d = json.loads(f.read_text(encoding='utf-8'))
    index[d['id']] = {'path': f.relative_to(root).as_posix(), 'scale': d['scale'], 'iso2': d.get('iso2'),
                      'region': d.get('region'), 'status': d.get('status')}
(root / 'index.json').write_text(json.dumps(index, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(index)} places -> {root / "index.json"}')
