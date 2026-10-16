// Solutions library: a horizontal, scroll-snap rail of real, sourced initiatives.
// The library data (seeds-extra.js) is lazy-loaded: when the wall nears the screen,
// when someone follows a link to it, or when the quick map asks for matching stories.
import {pick} from './i18n.js';
const P=(en,es)=>({en,es});
let language='en',filter='all',query='',lib=null,loading=null,observer=null;const listeners=[];
const t=v=>pick(v,language),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Accent- and case-insensitive text for search: "jóvenes" matches "jovenes", "Panamá" matches "panama".
export const fold=s=>String(s??'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
export const tags={participation:P('People speak, nothing changes','La gente habla, nada cambia'),'public-space':P('Public space','Espacio público'),youth:P('Young people','Jóvenes'),'mutual-aid':P('Neighbors helping','Ayuda entre vecinos'),repair:P('Repair','Reparación'),ecology:P('Ecology','Ecología'),future:P('Future generations','Generaciones futuras'),safety:P('Safety','Seguridad'),economy:P('Livelihoods','Medios de vida'),memory:P('Memory','Memoria')};
const regions={'central-america':P('Central America','Centroamérica'),mexico:P('Mexico','México'),'south-america':P('South America','Sudamérica'),caribbean:P('Caribbean','Caribe'),'north-america':P('North America','Norteamérica'),europe:P('Europe','Europa'),africa:P('Africa','África'),asia:P('Asia','Asia'),oceania:P('Oceania','Oceanía'),'middle-east':P('Middle East','Medio Oriente')};
const LATAM=['central-america','mexico','south-america','caribbean'];
const L={kicker:P('Solutions from around the world','Soluciones de todo el mundo'),title:P('Others were stuck too. Here is what they tried.','Otros también estaban atascados. Esto es lo que probaron.'),intro:P('Real initiatives, each in a few honest lines with its limits and a source. Inspiration to adapt, not recipes to copy.','Iniciativas reales, cada una en pocas líneas honestas, con sus límites y una fuente. Inspiración para adaptar, no recetas para copiar.'),all:P('All','Todas'),stuck:P('Stuck','Atascados'),did:P('What they did','Qué hicieron'),idea:P('The idea to carry','La idea para llevar'),limits:P('Limits & source','Límites y fuente'),search:P('Search the library','Buscar en la biblioteca'),searchHint:P('Try: water, Guatemala, jóvenes','Prueba: agua, Guatemala, memoria'),filterLabel:P('Filter by theme','Filtrar por tema'),rail:P('Solutions. Scroll sideways for more.','Soluciones. Desplázate hacia el lado para ver más.'),prev:P('Previous solutions','Soluciones anteriores'),next:P('More solutions','Más soluciones'),hint:P('Swipe or use the arrows to keep exploring','Desliza o usa las flechas para seguir explorando'),loading:P('Loading the solutions library…','Cargando la biblioteca de soluciones…'),failed:P('The library could not load. Check your connection and reload the page.','No se pudo cargar la biblioteca. Revisa tu conexión y recarga la página.'),clear:P('Clear search and filters','Borrar búsqueda y filtros'),moreLatam:P('Latin America','América Latina')};
const countText=(n,total)=>filter==='all'&&!query?t(P(`${total} solutions`,`${total} soluciones`)):t(P(`${n} of ${total} solutions match`,`${n} de ${total} soluciones coinciden`));
const noneText=()=>t(P(`No solutions match${query?` “${query}”`:''} yet. Try another word, or clear the search and filters.`,`Ninguna solución coincide${query?` con «${query}»`:''} todavía. Prueba otra palabra o borra la búsqueda y los filtros.`));

export function libraryReady(){return !!lib;}
export function loadLibrary(){if(!loading)loading=import('./seeds-extra.js').then(m=>{lib=m.extraSeeds.map(s=>({...s,hay:haystack(s),ph:placeHay(s)}));listeners.splice(0).forEach(f=>f());if(document.getElementById('wall'))renderWall(language);return lib;}).catch(e=>{loading=null;const st=document.getElementById('wall-count');if(st)st.textContent=t(L.failed);throw e;});return loading;}
export function onLibrary(f){if(lib)f();else{listeners.push(f);loadLibrary().catch(()=>{});}}
const both=v=>typeof v==='string'?v:`${v.en} ${v.es}`;
function placeHay(s){const r=regions[s.region];return ' '+fold(`${both(s.place)} ${r?both(r):''}`).replace(/[^a-z0-9]+/g,' ');}
function haystack(s){const r=regions[s.region];return ' '+fold([both(s.name),both(s.place),r?both(r):'',LATAM.includes(s.region)?both(L.moreLatam):'',s.year||'',...['stuck','did','idea','limits'].map(k=>both(s[k])),...s.tags.map(g=>`${g} ${tags[g]?both(tags[g]):''}`)].join(' ')).replace(/[^a-z0-9]+/g,' ')+' ';}
function matches(s){if(filter!=='all'&&!s.tags.includes(filter))return false;const terms=fold(query).split(/[^a-z0-9]+/).filter(Boolean);return terms.every(q=>s.hay.includes(q));}

// Quick map: stories that best fit a situation. Tag weights come from the worked example;
// words from the situation and the place add to the score. Returns null until the library is loaded.
export const exampleTags={voice:{participation:3},square:{'public-space':3,safety:1},youth:{youth:3,economy:2,future:1},care:{'mutual-aid':3,economy:1}};
export const exampleTag={voice:'participation',square:'public-space',youth:'youth',care:'mutual-aid'};
const STOP=new Set(fold('city town village ciudad pueblo aldea the and that with this from they their there where what when have been were into about your our people some them than then also just very more most much many cannot could would should does want como para pero porque cuando donde esta estan este esto estos esas esos ellos ellas tienen tiene hay muy mas menos sobre entre desde hasta nuestro nuestra nuestros todos todas gente personas quiere queremos pueden puede sin con los las del una unos unas que').split(' '));
const words=s=>[...new Set(fold(s).split(/[^a-z0-9]+/).filter(w=>w.length>3&&!STOP.has(w)))];
export function matchStories({example,text,place},lang,max=2){if(lang)language=lang;if(!lib)return null;const weights=exampleTags[example]||{};const tw=words(text),pw=words(place);
 return lib.map((s,i)=>{const theme=s.tags.reduce((a,g)=>a+(weights[g]||0),0);const hits=tw.filter(w=>s.hay.includes(' '+w)).length;const near=pw.some(w=>s.ph.includes(' '+w));
  // A nearby place only lifts stories that already fit the situation; it never pulls in an unrelated one.
  const ok=example?theme>=3:hits>=2;const score=theme+Math.min(hits,3)+(near?2:0);return {s,i,score,ok};}).filter(x=>x.ok).sort((a,b)=>b.score-a.score||a.i-b.i).slice(0,max)
  .map(({s})=>({id:s.id,tags:s.tags,name:t(s.name),place:t(s.place),idea:t(s.idea)}));}
export function solutionName(id,lang){const s=lib&&lib.find(x=>x.id===id);return s?pick(s.name,lang||language):'';}
export function bestTag(example,stories){return exampleTag[example]||(stories&&stories[0]&&stories[0].tags[0])||'all';}

export function setWallFilter(tag,q){filter=tags[tag]?tag:'all';if(typeof q==='string')query=q;const inp=document.getElementById('wall-search');if(inp)inp.value=query;if(!lib){loadLibrary().catch(()=>{});return;}renderRail(true);}

function card(s,i,n){return `<li class="wall-slide"><article class="wall-card" aria-labelledby="wall-h-${esc(s.id)}"><p class="wall-place">${esc(t(s.place))}${s.year?` · ${s.year}`:''}<span class="wall-pos" aria-hidden="true">${i+1}/${n}</span></p><h3 id="wall-h-${esc(s.id)}">${esc(t(s.name))}</h3><dl><dt>${t(L.stuck)}</dt><dd>${esc(t(s.stuck))}</dd><dt>${t(L.did)}</dt><dd>${esc(t(s.did))}</dd><dt>${t(L.idea)}</dt><dd class="wall-idea">${esc(t(s.idea))}</dd></dl><div class="wall-tags">${s.tags.map(g=>`<button type="button" data-wall-tag="${g}" aria-pressed="${filter===g}">${esc(t(tags[g]||P(g,g)))}</button>`).join('')}</div><details><summary>${t(L.limits)}</summary><p>${esc(t(s.limits))}</p><a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(t(s.source))} ↗</a></details></article></li>`;}

// Re-render only the filters, count and rail, so typing in the search box keeps focus and caret.
function renderRail(resetScroll){const rail=document.getElementById('wall-grid');if(!rail||!lib)return;const list=lib.filter(matches);
 document.querySelectorAll('[data-wall-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.wallFilter===filter)));
 document.getElementById('wall-count').textContent=countText(list.length,lib.length);
 rail.innerHTML=list.length?list.map((s,i)=>card(s,i,list.length)).join(''):'';
 document.getElementById('wall-empty').hidden=!!list.length;
 document.getElementById('wall-clear').hidden=filter==='all'&&!query;
 if(resetScroll)rail.scrollLeft=0;updateEdges();}
function updateEdges(){const rail=document.getElementById('wall-grid');if(!rail)return;const max=rail.scrollWidth-rail.clientWidth-2;const atStart=rail.scrollLeft<=2,atEnd=rail.scrollLeft>=max;const wrap=rail.parentElement;wrap.classList.toggle('at-start',atStart);wrap.classList.toggle('at-end',atEnd||max<=0);
 const prev=document.getElementById('wall-prev'),next=document.getElementById('wall-next');prev.setAttribute('aria-disabled',String(atStart));next.setAttribute('aria-disabled',String(atEnd||max<=0));
 const hint=document.getElementById('wall-hint');if(hint)hint.hidden=max<=0;}
function page(dir){const rail=document.getElementById('wall-grid');const slide=rail.querySelector('.wall-slide');const step=slide?Math.max(slide.getBoundingClientRect().width,rail.clientWidth-(slide.getBoundingClientRect().width*.4)):rail.clientWidth*.85;rail.scrollBy({left:dir*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}

export function renderWall(lang){language=lang;const root=document.getElementById('wall');if(!root)return;
 const used=lib?Object.keys(tags).filter(g=>lib.some(s=>s.tags.includes(g))):Object.keys(tags);const had=document.activeElement&&root.contains(document.activeElement)?document.activeElement.id||'':null;
 root.innerHTML=`<div class="section-heading"><div><p class="eyebrow">${t(L.kicker)}</p><h2 id="wall-title">${t(L.title)}</h2></div><p>${t(L.intro)}</p></div>
<div class="wall-tools"><div class="wall-search"><label for="wall-search">${t(L.search)}</label><input id="wall-search" type="search" autocomplete="off" spellcheck="false" maxlength="80" placeholder="${esc(t(L.searchHint))}" aria-describedby="wall-count" value="${esc(query)}"></div>
<div class="wall-filters" role="group" aria-label="${t(L.filterLabel)}">${['all',...used].map(g=>`<button type="button" data-wall-filter="${g}" aria-pressed="${filter===g}">${esc(g==='all'?t(L.all):t(tags[g]))}</button>`).join('')}</div></div>
<div class="wall-status"><p class="wall-count" id="wall-count" role="status" aria-live="polite">${lib?'':t(L.loading)}</p><button type="button" class="link-btn" id="wall-clear" data-wall-clear hidden>${t(L.clear)}</button><div class="wall-arrows"><button type="button" class="wall-nav" id="wall-prev" data-wall-page="-1" aria-controls="wall-grid" aria-label="${t(L.prev)}" aria-disabled="true"><span aria-hidden="true">←</span></button><button type="button" class="wall-nav" id="wall-next" data-wall-page="1" aria-controls="wall-grid" aria-label="${t(L.next)}"><span aria-hidden="true">→</span></button></div></div>
<div class="wall-rail-wrap at-start"><ul class="wall-rail" id="wall-grid" tabindex="0" aria-label="${t(L.rail)}"></ul></div>
<p class="wall-empty mini" id="wall-empty" hidden>${esc(noneText())}</p><p class="wall-hint" id="wall-hint" aria-hidden="true">${t(L.hint)} <span>→</span></p>`;
 if(lib)renderRail(false);
 if(had!==null){const el=had&&document.getElementById(had);(el||document.getElementById('wall-search'))?.focus({preventScroll:true});}
 if(root.dataset.ready)return;root.dataset.ready='1';
 root.addEventListener('click',e=>{const pg=e.target.closest('[data-wall-page]');if(pg){if(pg.getAttribute('aria-disabled')!=='true')page(+pg.dataset.wallPage);return;}
  if(e.target.closest('[data-wall-clear]')){setWallFilter('all','');document.getElementById('wall-search').focus();return;}
  const f=e.target.closest('[data-wall-filter],[data-wall-tag]');if(f){const g=f.dataset.wallFilter||f.dataset.wallTag;setWallFilter(f.dataset.wallTag&&filter===g?'all':g);if(f.dataset.wallTag)document.querySelector(`[data-wall-filter="${filter}"]`)?.focus();}});
 root.addEventListener('input',e=>{if(e.target.id!=='wall-search')return;query=e.target.value.slice(0,80);if(lib)renderRail(true);else loadLibrary().catch(()=>{});document.getElementById('wall-empty').textContent=noneText();});
 root.addEventListener('scroll',e=>{if(e.target.id==='wall-grid')updateEdges();},true);
 root.addEventListener('keydown',e=>{if(e.target.id!=='wall-grid')return;if(e.key==='Home'){e.target.scrollTo({left:0});e.preventDefault();}else if(e.key==='End'){e.target.scrollTo({left:e.target.scrollWidth});e.preventDefault();}});
 addEventListener('resize',updateEdges);
 // Lazy-load the library shortly before the wall scrolls into view, or right away on a #wall link.
 if(location.hash==='#wall')loadLibrary().catch(()=>{});
 addEventListener('hashchange',()=>{if(location.hash==='#wall')loadLibrary().catch(()=>{});});
 // The observer starts on the first scroll, so an untouched first visit never downloads the library.
 const watch=()=>{if(loading)return;if(!('IntersectionObserver' in window)){loadLibrary().catch(()=>{});return;}observer=new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting)){observer.disconnect();loadLibrary().catch(()=>{});}},{rootMargin:'700px 0px'});observer.observe(root);};
 addEventListener('scroll',watch,{once:true,passive:true});
}
