// Languages. English is the default for everyone; other languages are opt-in (toggle or ?lang=xx).
// To add a language (e.g. Portuguese): add its code to LANGS, a SWITCH_LABEL, and a `pt` key next to `en`/`es`
// in the string tables. Any string without a translation falls back to English, so a partial translation is safe.
export const LANGS=['en','es'];
export const DEFAULT_LANG='en';
// aria-label of the toggle, written in the language it switches TO.
export const SWITCH_LABEL={en:'Switch to English',es:'Cambiar a español'};
export function pick(v,lang){if(v==null)return '';if(typeof v==='string')return v;return v[lang]??v[DEFAULT_LANG];}
export function langFromURL(search){const q=(new URLSearchParams(search).get('lang')||'').toLowerCase();return LANGS.includes(q)?q:DEFAULT_LANG;}
export function nextLang(lang){return LANGS[(LANGS.indexOf(lang)+1)%LANGS.length];}
export function toggleHTML(lang){return LANGS.map(l=>l===lang?`<strong>${l.toUpperCase()}</strong>`:l.toUpperCase()).join(' <span aria-hidden="true">/</span> ');}
