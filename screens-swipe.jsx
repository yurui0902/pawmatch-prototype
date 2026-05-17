// screens-swipe.jsx — Tinder-style swipe, cute hand-drawn Lemonade style
// Soft white background, rounded cards, friendly pink, hand-drawn pet illustrations.

const FEED = [
  {
    key: 'poppy', name: 'Poppy', age: '2 yr', breed: 'Golden Retriever Mix',
    shelter: 'Willow Creek', dist: '1.2 mi', fee: 250,
    traits: ['Kid-friendly', 'House-trained', 'Energetic'], kind: 'dog',
    bio: "Poppy treats every walk like a discovery mission. She's house-trained, gentle with kids, and a champion napper after dinner. Best home: somewhere with a yard and a couch she can share with you.",
    reqs: [
      { label: 'Age 21+',              met: true },
      { label: 'Fenced yard',          met: true },
      { label: 'Kids-safe home',       met: true },
      { label: 'No landlord limit',    met: true },
      { label: 'Dog-experienced',      met: true },
      { label: 'Daily routine note',   met: false, action: 'Answer' },
    ],
  },
  {
    key: 'miso', name: 'Miso', age: '1 yr', breed: 'Domestic Shorthair',
    shelter: 'Pearl Cats', dist: '2.8 mi', fee: 95,
    traits: ['Lap cat', 'Quiet', 'Indoor'], kind: 'cat',
    bio: "Miso would like to interview you from your lap, thanks. She prefers quiet evenings, sunny windowsills, and being told she's pretty. A single-pet home with adults or older kids is her ideal landing spot.",
    reqs: [
      { label: 'Age 21+',                met: true },
      { label: 'Indoor-only commitment', met: true },
      { label: 'Cat-experienced',        met: true },
      { label: 'No large dogs at home',  met: true },
      { label: 'Litter box plan',        met: true },
      { label: 'Daily care routine',     met: false, action: 'Answer' },
    ],
  },
  {
    key: 'clover', name: 'Clover', age: '4 yr', breed: 'Beagle Mix',
    shelter: 'Rose Rescue', dist: '3.5 mi', fee: 185,
    traits: ['Calm', 'Senior-friendly', 'Loves walks'], kind: 'dog',
    bio: "Clover has been around long enough to know the good life is a slow walk and a warm bed. She's calm, easygoing, and the perfect copilot for a low-key household. She'd love patient humans and a senior-friendly home.",
    reqs: [
      { label: 'Age 21+',                    met: true },
      { label: 'Calm home environment',      met: true },
      { label: 'Patient with medical needs', met: true },
      { label: 'Senior-pet experience',      met: false, action: 'Add' },
      { label: 'Single-level home',          met: false, action: 'Confirm' },
    ],
  },
  {
    key: 'olive', name: 'Olive', age: '3 yr', breed: 'Tortoiseshell',
    shelter: 'Pearl Cats', dist: '2.8 mi', fee: 110,
    traits: ['Playful', 'Vocal', 'Indoor'], kind: 'cat',
    bio: "Olive contains multitudes — she'll chirp at birds, headbutt your phone, and curl up on your keyboard mid-Zoom. She's playful, vocal, and needs people who think her commentary is the best part of the day.",
    reqs: [
      { label: 'Age 21+',                met: true },
      { label: 'Indoor-only commitment', met: true },
      { label: 'Cat-experienced',        met: true },
      { label: 'Tolerant of vocal cat',  met: true },
      { label: 'Patience for playtime',  met: true },
      { label: 'Litter box plan',        met: false, action: 'Answer' },
    ],
  },
  {
    key: 'max', name: 'Max', age: '5 yr', breed: 'Labrador Retriever',
    shelter: 'Willow Creek', dist: '1.2 mi', fee: 220,
    traits: ['Trained', 'Fetch pro', 'Loyal'], kind: 'dog',
    bio: "Max is a charming five-year-old lab who has aced his manners class and still wants to retake it for fun. He's loyal, eager, and would love a household that throws a tennis ball at least twice a day. Fenced yard recommended.",
    reqs: [
      { label: 'Age 21+',                   met: true },
      { label: 'Fenced yard',               met: true },
      { label: 'Large-dog space',           met: true },
      { label: 'Daily exercise commitment', met: false, action: 'Answer' },
      { label: 'Training reinforcement',    met: false, action: 'Answer' },
    ],
  },
  {
    key: 'pepper', name: 'Pepper', age: '2 yr', breed: 'Holland Lop',
    shelter: 'Tiny Tails', dist: '4.1 mi', fee: 45,
    traits: ['Litter-trained', 'Curious', 'Bonded'], kind: 'rabbit',
    bio: "Pepper is a Holland Lop with strong opinions and softer ears. She's litter-trained, ridiculously curious, and bonded with her sister Sage — they're hoping to be adopted as a pair. Bunny-experienced homes preferred.",
    reqs: [
      { label: 'Age 21+',                met: true },
      { label: 'Indoor enclosure',       met: true },
      { label: 'Rabbit-proofed space',   met: false, action: 'Confirm' },
      { label: 'Vegetable diet plan',    met: false, action: 'Plan' },
      { label: 'Bonded-pair commitment', met: false, action: 'Decide' },
    ],
  },
];

// Map onboarding pet-type values → FEED `kind` values
const PET_TYPE_TO_KIND = { dogs: 'dog', cats: 'cat', small: 'rabbit', rabbits: 'rabbit' };

// Map pet key → illustration component name from pet-art.jsx
const PET_ART = {
  poppy: 'Pet_Poppy', miso: 'Pet_Miso', clover: 'Pet_Olive',
  olive: 'Pet_Miso', max: 'Pet_Max', pepper: 'Pet_Clover',
};

const HOT_PINK = '#FF0083';
const SOFT_PINK = '#FFF1F7';

function SwipeScreen({ goto, tab, setTab, petTypes }) {
  const rawTypes = (petTypes && petTypes.length) ? petTypes : ['both'];
  // 'both' expands to dogs + cats so the rest of the filter logic stays simple
  const types = rawTypes.includes('both')
    ? Array.from(new Set([...rawTypes.filter(t => t !== 'both'), 'dogs', 'cats']))
    : rawTypes;
  const wantsAny = types.includes('any');
  const allowedKinds = wantsAny ? null : new Set(types.map(t => PET_TYPE_TO_KIND[t]).filter(Boolean));

  // Initialize filter chip from onboarding selection
  const initialFilter = (() => {
    if (wantsAny) return 'any';
    if (types.includes('dogs') && types.includes('cats')) return 'any';
    if (types.includes('dogs')) return 'dogs';
    if (types.includes('cats')) return 'cats';
    if (types.includes('rabbits')) return 'rabbits';
    return 'dogs';
  })();

  const [idx, setIdx] = React.useState(0);
  const [drag, setDrag] = React.useState({ x: 0, y: 0, active: false });
  const [exitDir, setExitDir] = React.useState(null);
  const [filter, setFilter] = React.useState(initialFilter);
  const [attrs, setAttrs] = React.useState(new Set());
  const [searchMode, setSearchMode] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [matchCheck, setMatchCheck] = React.useState(null);

  const startRef = React.useRef(null);
  const cardRef = React.useRef(null);

  const toggleAttr = (a) => setAttrs(prev => {
    const n = new Set(prev);
    n.has(a) ? n.delete(a) : n.add(a);
    setIdx(0);
    return n;
  });

  const setFilterAndReset = (k) => { setFilter(k); setIdx(0); };

  // Source feed filtered by row-1 (single pet-type chip) and row-2 (attributes)
  const sourceFeed = React.useMemo(() => {
    return FEED.filter(p => {
      // Row 1: single-select pet type chip — overrides onboarding for live browsing
      if (filter === 'dogs'    && p.kind !== 'dog')    return false;
      if (filter === 'cats'    && p.kind !== 'cat')    return false;
      if (filter === 'rabbits' && p.kind !== 'rabbit') return false;
      // 'any' falls back to onboarding choice
      if (filter === 'any' && allowedKinds && !allowedKinds.has(p.kind)) return false;

      // Row 2: attribute multi-select
      if (attrs.has('kids-ok')      && !p.traits.some(t => /kid|calm|family/i.test(t))) return false;
      if (attrs.has('apartment-ok') && p.kind === 'dog' && !p.traits.some(t => /indoor|small|calm/i.test(t))) return false;
      if (attrs.has('senior')       && !p.traits.some(t => /senior|calm/i.test(t))) return false;
      // 'any-age' is the default — selected means no age filter, deselect is a no-op
      return true;
    });
  }, [filter, attrs, allowedKinds]);

  // Map common search words to a canonical pet kind so "dog" finds all dogs etc.
  const KIND_ALIASES = {
    dog: 'dog', dogs: 'dog', puppy: 'dog', puppies: 'dog', doggo: 'dog',
    cat: 'cat', cats: 'cat', kitten: 'cat', kittens: 'cat', kitty: 'cat', feline: 'cat',
    rabbit: 'rabbit', rabbits: 'rabbit', bunny: 'rabbit', bunnies: 'rabbit',
  };

  const visible = React.useMemo(() => {
    if (!searchMode || !query.trim()) return sourceFeed;
    const q = query.toLowerCase().trim();
    const kindMatch = KIND_ALIASES[q];
    return sourceFeed.filter(p =>
      (kindMatch && p.kind === kindMatch) ||
      p.name.toLowerCase().includes(q) ||
      p.breed.toLowerCase().includes(q) ||
      p.shelter.toLowerCase().includes(q) ||
      p.kind.toLowerCase().includes(q) ||
      p.traits.some(t => t.toLowerCase().includes(q))
    );
  }, [searchMode, query, sourceFeed]);

  // P1 #7: end-of-deck card instead of looping
  const endOfDeck = idx >= visible.length;
  const current = endOfDeck ? null : visible[idx];
  const next    = endOfDeck ? null : visible[idx + 1];
  const broadenFilters = () => {
    setFilter('any'); setAttrs(new Set()); setIdx(0);
  };

  const onPointerDown = (e) => {
    if (exitDir) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, active: true });
    cardRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!startRef.current || !drag.active) return;
    setDrag({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y, active: true });
  };
  const onPointerUp = () => {
    if (!drag.active) return;
    const T = 90;
    if (drag.x > T) doExit('right');
    else if (drag.x < -T) doExit('left');
    else if (drag.y < -T * 1.3) doExit('up');
    else setDrag({ x: 0, y: 0, active: false });
    startRef.current = null;
  };
  const doExit = (dir) => {
    if (!current || exitDir) return;
    setExitDir(dir);
    setDrag(prev => ({ ...prev, active: false }));
    setTimeout(() => {
      if (dir === 'right') setMatchCheck(current);
      else if (dir === 'up') goto('detail', { pet: current.key });
      setIdx(i => i + 1);
      setExitDir(null);
      setDrag({ x: 0, y: 0, active: false });
    }, 320);
  };

  // P1 #12: keyboard shortcuts on swipe
  React.useEffect(() => {
    const onKey = (e) => {
      if (searchMode || matchCheck) return;          // don't hijack typing or modal
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); doExit('left');  }
      if (e.key === 'ArrowRight') { e.preventDefault(); doExit('right'); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); doExit('up');    }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, exitDir, searchMode, matchCheck]);

  const rotation = drag.x * 0.06;
  const opLike = Math.min(1, Math.max(0, drag.x / 100));
  const opNope = Math.min(1, Math.max(0, -drag.x / 100));
  const opUp   = Math.min(1, Math.max(0, -drag.y / 100));

  let tForm = `translate(${drag.x}px, ${drag.y}px) rotate(${rotation}deg)`;
  let tTr = drag.active ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  if (exitDir === 'right') tForm = `translate(800px, ${drag.y}px) rotate(40deg)`;
  if (exitDir === 'left')  tForm = `translate(-800px, ${drag.y}px) rotate(-40deg)`;
  if (exitDir === 'up')    tForm = `translate(${drag.x}px, -900px) rotate(${rotation}deg)`;
  if (exitDir) tTr = 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, overflow: 'hidden' }}>

      {/* HEADER — soft, no harsh black bars */}
      <div style={{ paddingTop: 58, paddingLeft: 20, paddingRight: 20, paddingBottom: 8, background: PM.cream }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 400, letterSpacing: -0.5, color: PM.night }}>
              Discover
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginTop: 2 }}>
              {searchMode && query
                ? `${visible.length} result${visible.length === 1 ? '' : 's'}`
                : `${visible.length} pets near Portland`}
            </div>
          </div>
          <button onClick={() => setSearchMode(true)} style={{
            width: 40, height: 40, borderRadius: 20, background: PM.white,
            border: `1.5px solid ${PM.line}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke={PM.night} strokeWidth="1.8" fill="none"/>
              <path d="M11 11 L 14 14" stroke={PM.night} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {searchMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <div style={{
                flex: 1, height: 42, borderRadius: 21,
                background: PM.white, border: `1.5px solid ${PM.line}`,
                display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5" stroke={PM.inkSoft} strokeWidth="1.8" fill="none"/>
                  <path d="M11 11 L 14 14" stroke={PM.inkSoft} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <input
                  autoFocus value={query}
                  onChange={e => { setQuery(e.target.value); setIdx(0); }}
                  placeholder="Try ‘dog’, ‘cat’, ‘Calm’, ‘Indoor’…"
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontFamily: FONT_BODY, fontSize: 14, color: PM.ink,
                  }}
                />
                {query && (
                  <button onClick={() => { setQuery(''); setIdx(0); }} style={{
                    width: 20, height: 20, borderRadius: 10, background: PM.creamDark,
                    color: PM.inkSoft, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1 L 7 7 M 7 1 L 1 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </button>
                )}
              </div>
              <button onClick={() => { setSearchMode(false); setQuery(''); setIdx(0); }} style={{
                padding: '0 16px', height: 42, borderRadius: 21, background: HOT_PINK, color: '#FFF',
                border: 'none', cursor: 'pointer', fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600,
              }}>Done</button>
            </div>
            {/* Suggestion chips — quick filters that just prefill the query */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {[
                ['Dogs', 'dog'], ['Cats', 'cat'], ['Rabbits', 'rabbit'],
                ['Kid-friendly', 'kid'], ['Calm', 'calm'], ['Indoor', 'indoor'],
                ['Senior-friendly', 'senior'], ['Quiet', 'quiet'],
              ].map(([label, q]) => {
                const on = query.toLowerCase() === q;
                return (
                  <button key={q} onClick={() => { setQuery(q); setIdx(0); }} style={{
                    height: 30, padding: '0 12px', borderRadius: 15, flexShrink: 0,
                    background: on ? HOT_PINK : PM.white,
                    color: on ? '#FFF' : PM.inkSoft,
                    border: on ? 'none' : `1px solid ${PM.line}`,
                    fontFamily: FONT_BODY, fontSize: 12, fontWeight: 500,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.15s, color 0.15s',
                  }}>{label}</button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Row 1 — single-select pet type */}
            <div style={{ display: 'flex', gap: 8, overflow: 'auto', paddingBottom: 2 }}>
              {[['dogs','Dogs'],['cats','Cats'],['rabbits','Rabbits'],['any','Any']].map(([k,l]) => (
                <button key={k} onClick={() => setFilterAndReset(k)} style={{
                  height: 34, padding: '0 14px', borderRadius: 17,
                  background: filter===k ? PM.night : PM.white,
                  color: filter===k ? PM.cream : PM.ink,
                  border: filter===k ? 'none' : `1.5px solid ${PM.line}`,
                  fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}>{l}</button>
              ))}
            </div>
            {/* Row 2 — multi-select attribute filters */}
            <div style={{ display: 'flex', gap: 8, overflow: 'auto', paddingBottom: 4 }}>
              {[['any-age','Any age'],['kids-ok','Kids OK'],['apartment-ok','Apartment-OK'],['senior','Senior']].map(([k,l]) => {
                const on = attrs.has(k);
                return (
                  <button key={k} onClick={() => toggleAttr(k)} style={{
                    height: 30, padding: '0 12px', borderRadius: 15,
                    background: on ? HOT_PINK : 'transparent',
                    color: on ? '#FFF' : PM.inkSoft,
                    border: on ? 'none' : `1px dashed ${PM.line}`,
                    fontFamily: FONT_BODY, fontSize: 12, fontWeight: 500,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    boxShadow: on ? '0 4px 10px rgba(255,0,131,0.22)' : 'none',
                    transition: 'background 0.15s, color 0.15s',
                  }}>{l}</button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {searchMode ? (
        /* SEARCH MODE — traditional vertical list, no swipe cards or action buttons */
        <div style={{
          position: 'absolute', top: 196, left: 0, right: 0, bottom: 64,
          overflow: 'auto', padding: '4px 20px 24px',
        }}>
          {visible.length === 0 ? (
            <div style={{ height: 360, display: 'flex' }}>
              <NoResults
                query={query || '—'}
                onClear={() => { setQuery(''); setIdx(0); }}
              />
            </div>
          ) : (
            <>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft,
                letterSpacing: 0.8, textTransform: 'uppercase', margin: '6px 4px 10px',
              }}>
                {visible.length} result{visible.length === 1 ? '' : 's'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {visible.map(pet => (
                  <SearchResultRow
                    key={pet.key} pet={pet}
                    onTap={() => goto('detail', { pet: pet.key })}
                    onLike={() => { setMatchCheck(pet); }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* CARD STACK */}
          <div style={{ position: 'absolute', top: 196, left: 20, right: 20, bottom: 156 }}>
            {!current ? (
              visible.length === 0
                ? <NoMatchesForFilter onBroaden={broadenFilters}/>
                : <EndOfDeck onBroaden={broadenFilters}/>
            ) : (
              <>
                {next && next.key !== current.key && (
                  <SwipeCard pet={next} style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    transform: `scale(${0.94 + Math.min(0.06, Math.abs(drag.x) / 1200 + (exitDir ? 0.06 : 0))})`,
                    opacity: 0.65, transition: 'transform 0.3s',
                  }}/>
                )}
                <div
                  ref={cardRef}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    transform: tForm, transition: tTr,
                    touchAction: 'none', cursor: drag.active ? 'grabbing' : 'grab',
                  }}
                >
                  <SwipeCard pet={current} overlayLike={opLike} overlayNope={opNope} overlayUp={opUp}/>
                </div>
              </>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 92,
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, zIndex: 5,
          }}>
            <ActionButton kind="nope" big onClick={() => current && doExit('left')}/>
            <ActionButton kind="like" big onClick={() => current && doExit('right')}/>
          </div>
        </>
      )}

      <TabBar active={tab} onChange={setTab}/>

      {matchCheck && <MatchCheckOverlay key={matchCheck.key} pet={matchCheck} onClose={() => setMatchCheck(null)} onContinue={() => { setMatchCheck(null); goto('matches'); }}/>}
    </div>
  );
}

// ─── Traditional list row used in search mode ──────────────

function SearchResultRow({ pet, onTap, onLike }) {
  const ArtComp = window[PET_ART[pet.key]] || window.Pet_Poppy;
  return (
    <div style={{
      display: 'flex', gap: 12, padding: 12, borderRadius: 18,
      background: PM.white, position: 'relative',
      boxShadow: '0 1px 2px rgba(20,20,40,0.03), 0 6px 18px rgba(20,20,40,0.04)',
    }}>
      <button onClick={onTap} style={{
        flex: 1, minWidth: 0, display: 'flex', gap: 12, padding: 0,
        background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, flexShrink: 0,
          background: `linear-gradient(160deg, ${SOFT_PINK} 0%, #FFE4F0 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          {ArtComp ? <ArtComp size={66}/> : null}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: PM.night, letterSpacing: -0.3, lineHeight: 1 }}>{pet.name}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkFaint }}>· {pet.age}</div>
          </div>
          <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>{pet.breed}</div>
          <div style={{ marginTop: 3, fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.4 }}>
            {pet.shelter} · {pet.dist}
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {pet.traits.slice(0, 2).map(t => (
              <span key={t} style={{
                padding: '3px 8px', background: SOFT_PINK, color: HOT_PINK,
                borderRadius: 8, fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600,
              }}>{t}</span>
            ))}
            {pet.traits.length > 2 && (
              <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: PM.inkSoft }}>
                +{pet.traits.length - 2}
              </span>
            )}
          </div>
        </div>
      </button>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        gap: 6, flexShrink: 0, justifyContent: 'space-between',
      }}>
        <div style={{
          padding: '4px 10px', borderRadius: 12, background: HOT_PINK, color: '#FFF',
          fontFamily: FONT_DISPLAY, fontSize: 15, letterSpacing: -0.2, lineHeight: 1,
        }}>${pet.fee}</div>
        <button onClick={(e) => { e.stopPropagation(); onLike(); }} style={{
          width: 36, height: 36, borderRadius: 18,
          background: 'transparent', color: HOT_PINK,
          border: `1.5px solid ${HOT_PINK}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 26 26"><path d="M13 22 C 13 22, 2 14, 2 8 C 2 5, 5 2, 8 2 C 10.5 2, 12 4, 13 5 C 14 4, 15.5 2, 18 2 C 21 2, 24 5, 24 8 C 24 14, 13 22, 13 22 Z" fill="currentColor"/></svg>
        </button>
      </div>
    </div>
  );
}

function EndOfDeck({ onBroaden }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: PM.white,
      borderRadius: 28,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center',
      boxShadow: '0 4px 18px rgba(20,20,40,0.06)',
    }}>
      <div style={{
        width: 76, height: 76, borderRadius: 38,
        background: SOFT_PINK, color: HOT_PINK,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
          <circle cx="9" cy="11" r="2.4" fill="currentColor"/>
          <circle cx="16" cy="8" r="2.7" fill="currentColor"/>
          <circle cx="23" cy="11" r="2.4" fill="currentColor"/>
          <circle cx="24.5" cy="17" r="2" fill="currentColor"/>
          <circle cx="7.5" cy="17" r="2" fill="currentColor"/>
          <path d="M16 14 C 11 14, 9 18.5, 10.5 22 C 12 25.5, 14 27, 16 27 C 18 27, 20 25.5, 21.5 22 C 23 18.5, 21 14, 16 14 Z" fill="currentColor"/>
        </svg>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: PM.night, letterSpacing: -0.4, lineHeight: 1.05, marginBottom: 6 }}>
        That's everyone<br/>within 10 mi.
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginTop: 4, lineHeight: 1.5, maxWidth: 260 }}>
        You've seen every pet matching your filters. Try widening the search to find more.
      </div>
      <button onClick={onBroaden} style={{
        marginTop: 22, padding: '12px 22px', background: HOT_PINK, color: '#FFF',
        border: 'none', borderRadius: 22, cursor: 'pointer',
        fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
        boxShadow: '0 6px 16px rgba(255,0,131,0.32)',
      }}>Broaden filters →</button>
    </div>
  );
}

function NoMatchesForFilter({ onBroaden }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: PM.white,
      borderRadius: 28,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center',
      boxShadow: '0 4px 18px rgba(20,20,40,0.06)',
    }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 52, color: PM.night }}>
        <em style={{ color: HOT_PINK }}>hmm</em>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.night, marginTop: 4 }}>
        Nothing matches this filter.
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginTop: 8, lineHeight: 1.5, maxWidth: 260 }}>
        Try a different pet type or remove the attribute chips.
      </div>
      <button onClick={onBroaden} style={{
        marginTop: 18, padding: '12px 22px', background: HOT_PINK, color: '#FFF',
        border: 'none', borderRadius: 22, cursor: 'pointer',
        fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
      }}>Reset filters</button>
    </div>
  );
}

function NoResults({ query, onClear }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: PM.white,
      borderRadius: 28,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center',
      boxShadow: '0 4px 18px rgba(20,20,40,0.06)',
    }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, color: PM.night, marginBottom: 6 }}>
        <em style={{ color: HOT_PINK }}>oh!</em>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.night }}>No matches</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginTop: 8 }}>
        Nothing matches "{query}".
      </div>
      <button onClick={onClear} style={{
        marginTop: 18, padding: '12px 22px', background: HOT_PINK, color: '#FFF',
        border: 'none', borderRadius: 22, cursor: 'pointer',
        fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
      }}>Clear search</button>
    </div>
  );
}

function SwipeCard({ pet, overlayLike = 0, overlayNope = 0, overlayUp = 0, style }) {
  const ArtComp = window[PET_ART[pet.key]] || window.Pet_Poppy;
  return (
    <div style={{
      width: '100%', height: '100%',
      background: PM.white, position: 'relative', overflow: 'hidden',
      borderRadius: 28,
      boxShadow: '0 10px 30px rgba(20,20,40,0.12), 0 2px 6px rgba(20,20,40,0.05)',
      ...style,
    }}>
      {/* PHOTO AREA — soft pink with hand-drawn pet illustration */}
      <div style={{
        height: '60%', position: 'relative', overflow: 'hidden',
        background: `linear-gradient(160deg, ${SOFT_PINK} 0%, #FFE4F0 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {ArtComp ? <ArtComp size={220}/> : null}

        {/* distance chip — soft white pill */}
        <div style={{
          position: 'absolute', top: 16, left: 16,
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
          color: PM.night, padding: '6px 12px', borderRadius: 14,
          fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1 C 3.5 1, 1.5 3, 1.5 5.5 C 1.5 8.5, 6 11, 6 11 C 6 11, 10.5 8.5, 10.5 5.5 C 10.5 3, 8.5 1, 6 1 Z" stroke={HOT_PINK} strokeWidth="1.4" fill="none"/>
            <circle cx="6" cy="5.5" r="1.4" fill={HOT_PINK}/>
          </svg>
          {pet.dist}
        </div>

        {/* shelter chip — top right */}
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
          color: PM.inkSoft, padding: '6px 12px', borderRadius: 14,
          fontFamily: FONT_BODY, fontSize: 11, fontWeight: 500,
        }}>
          {pet.shelter}
        </div>

        {/* fee — bottom right floating circle */}
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          width: 60, height: 60, borderRadius: '50%',
          background: HOT_PINK, color: '#FFF',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_DISPLAY, lineHeight: 1,
          boxShadow: '0 6px 18px rgba(255,0,131,0.42)',
        }}>
          <span style={{ fontSize: 19, letterSpacing: -0.4 }}>${pet.fee}</span>
          <span style={{ fontSize: 8, marginTop: 3, opacity: 0.85, fontFamily: FONT_BODY, fontWeight: 600, letterSpacing: 0.6 }}>FEE</span>
        </div>
      </div>

      {/* BOTTOM INFO BLOCK */}
      <div style={{ padding: '24px 22px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 400, letterSpacing: -0.6,
            color: PM.night, lineHeight: 1,
          }}>
            {pet.name}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft, fontWeight: 500 }}>
            · {pet.age}
          </div>
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 12 }}>
          {pet.breed}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {pet.traits.map(t => (
            <span key={t} style={{
              padding: '5px 10px', background: SOFT_PINK, color: HOT_PINK,
              borderRadius: 11, fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* LIKE / NOPE / INFO stamps — softer rounded versions */}
      <Stamp x={24}  y={80}  rotate={-18} color={PM.night}  opacity={overlayNope} label="nope"/>
      <Stamp x="right" y={80} rotate={18} color={HOT_PINK}  opacity={overlayLike} label="match"/>
      <Stamp x="center" y="40%" rotate={0} color={PM.violet} opacity={overlayUp}   label="more"/>
    </div>
  );
}

function Sparkles() {
  return (
    <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="100%" height="100%" viewBox="0 0 360 320" preserveAspectRatio="none">
      <g fill={HOT_PINK} opacity="0.35">
        <path d="M40 50 L 42 55 L 47 57 L 42 59 L 40 64 L 38 59 L 33 57 L 38 55 Z"/>
        <path d="M320 90 L 322 95 L 327 97 L 322 99 L 320 104 L 318 99 L 313 97 L 318 95 Z" transform="scale(0.7) translate(120,30)"/>
        <circle cx="60" cy="240" r="2.5"/>
        <circle cx="310" cy="230" r="2"/>
        <circle cx="180" cy="40" r="2"/>
      </g>
    </svg>
  );
}

function Stamp({ x, y, rotate, color, opacity, label }) {
  const pos = {};
  if (x === 'right') pos.right = 24;
  else if (x === 'center') { pos.left = '50%'; pos.transform = 'translateX(-50%)'; }
  else pos.left = x;
  pos.top = y;
  return (
    <div style={{
      position: 'absolute', ...pos,
      opacity, transform: `${pos.transform || ''} rotate(${rotate}deg)`, zIndex: 4,
      padding: '10px 20px', border: `3px solid ${color}`, borderRadius: 26,
      fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 400,
      color: color, background: 'rgba(255,255,255,0.9)',
      fontStyle: 'italic',
    }}>{label}</div>
  );
}

function ActionButton({ kind, onClick, big = false }) {
  const size = big ? 64 : 50;
  const map = {
    undo:  { bg: PM.white, fg: PM.gold, icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 7 Q 4 4, 7 4 L 14 4 Q 17 4, 17 7 L 17 13 Q 17 16, 14 16 M 7 4 L 4 1 M 7 4 L 4 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
    nope:  { bg: PM.white, fg: '#FF5677', icon: (
      <svg width="22" height="22" viewBox="0 0 20 20"><path d="M4 4 L 16 16 M 16 4 L 4 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
    )},
    like:  { bg: HOT_PINK, fg: '#FFF', icon: (
      <svg width="28" height="28" viewBox="0 0 26 26"><path d="M13 22 C 13 22, 2 14, 2 8 C 2 5, 5 2, 8 2 C 10.5 2, 12 4, 13 5 C 14 4, 15.5 2, 18 2 C 21 2, 24 5, 24 8 C 24 14, 13 22, 13 22 Z" fill="currentColor"/></svg>
    )},
    info:  { bg: PM.white, fg: PM.violet, icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="10" cy="6.5" r="1.1" fill="currentColor"/><path d="M10 9.5 L 10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    )},
    boost: { bg: PM.white, fg: PM.gold, icon: (
      <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 1 L11.5 7.5 L18 9 L11.5 10.5 L10 17 L8.5 10.5 L2 9 L8.5 7.5 Z" fill="currentColor"/></svg>
    )},
  };
  const m = map[kind];
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: '50%',
      background: m.bg, color: m.fg, border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: kind === 'like'
        ? '0 8px 20px rgba(255,0,131,0.4)'
        : '0 4px 12px rgba(20,20,40,0.1)',
      transition: 'transform 0.15s',
    }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >{m.icon}</button>
  );
}

// ─── Match check overlay — soft sheet ─────────────────────

function MatchCheckOverlay({ pet, onClose, onContinue }) {
  const ArtComp = window[PET_ART[pet.key]] || window.Pet_Poppy;
  const [reqs, setReqs] = React.useState(pet.reqs || []);
  const [expandedIdx, setExpandedIdx] = React.useState(null);
  const metCount = reqs.filter(r => r.met).length;
  const pct = reqs.length ? metCount / reqs.length : 0;
  const unmet = reqs.length - metCount;
  const allMet = reqs.length > 0 && unmet === 0;

  const completeReq = (idx) => {
    setReqs(rs => rs.map((r, i) => i === idx ? { ...r, met: true } : r));
    setExpandedIdx(null);
  };
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(20,20,40,0.45)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn 0.2s ease',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
      <div style={{
        width: '100%', background: PM.cream,
        borderRadius: '28px 28px 0 0',
        padding: '20px 22px 32px', animation: 'slideUp 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative', maxHeight: '88%', overflow: 'auto',
      }}>
        {/* grab handle */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 40, height: 4, borderRadius: 2, background: PM.line,
        }}/>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 16,
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: PM.inkSoft,
        }}>
          <svg width="14" height="14" viewBox="0 0 11 11"><path d="M2 2 L 9 9 M 9 2 L 2 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        {/* header — avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, marginBottom: 18 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: `linear-gradient(160deg, ${SOFT_PINK}, #FFE4F0)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, overflow: 'hidden',
          }}>
            {ArtComp ? <ArtComp size={84}/> : null}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: SOFT_PINK, color: HOT_PINK, padding: '3px 10px', borderRadius: 11,
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
            }}>
              ♥ You liked
            </div>
            <div style={{
              marginTop: 6, fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400,
              color: PM.night, letterSpacing: -0.4, lineHeight: 1,
            }}>{pet.name}</div>
            <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
              {pet.shelter} · {pet.age} · {pet.breed}
            </div>
            <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 12, color: PM.ink }}>
              <strong style={{ color: HOT_PINK }}>Adoption fee · ${pet.fee}</strong>
              <span style={{ color: PM.inkSoft }}> (paid to shelter at pickup)</span>
            </div>
          </div>
        </div>

        <h2 style={{
          margin: '6px 0 4px', fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400,
          color: PM.night, letterSpacing: -0.8, lineHeight: 1.02,
        }}>
          {allMet
            ? (<>You're <em style={{ color: HOT_PINK }}>fully</em><br/>ready!</>)
            : (<>You're <em style={{ color: HOT_PINK }}>{metCount}</em> of {reqs.length}<br/>ready.</>)
          }
        </h2>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 18 }}>
          We checked {pet.shelter}'s requirements for {pet.name}.
        </div>

        {/* progress card — soft */}
        <div style={{
          padding: 18, background: PM.white, borderRadius: 20,
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16,
          boxShadow: '0 4px 14px rgba(20,20,40,0.06)',
        }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, color: HOT_PINK, letterSpacing: -2, lineHeight: 0.9, fontWeight: 400 }}>
            {metCount}<span style={{ color: PM.inkFaint, fontSize: 24 }}>/{reqs.length}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: PM.inkSoft, fontWeight: 500 }}>Requirements met</div>
            <div style={{ marginTop: 8, height: 7, background: SOFT_PINK, borderRadius: 4 }}>
              <div style={{ width: `${pct * 100}%`, height: '100%', background: HOT_PINK, borderRadius: 4, transition: 'width 0.4s' }}/>
            </div>
            <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 600 }}>
              {Math.round(pct * 100)}% ready
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {reqs.map((r, i) => {
            const isOpen = expandedIdx === i;
            return (
              <div key={i} style={{
                background: PM.white, borderRadius: 14,
                border: r.met ? '1px solid transparent' : `1.5px solid ${HOT_PINK}33`,
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: isOpen ? '0 6px 18px rgba(255,0,131,0.18)' : 'none',
                overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: r.met ? '#5BCBA1' : HOT_PINK, color: '#FFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700,
                    transition: 'background 0.25s',
                  }}>
                    {r.met ? '✓' : '!'}
                  </div>
                  <div style={{ flex: 1, fontFamily: FONT_BODY, fontSize: 14, color: PM.ink, fontWeight: r.met ? 500 : 600 }}>{r.label}</div>
                  {!r.met && !isOpen && (
                    <button onClick={() => setExpandedIdx(i)} style={{
                      padding: '6px 12px', borderRadius: 13, background: HOT_PINK, color: '#FFF',
                      border: 'none', fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>{r.action} →</button>
                  )}
                  {!r.met && isOpen && (
                    <button onClick={() => setExpandedIdx(null)} style={{
                      padding: '6px 10px', borderRadius: 13, background: 'transparent', color: PM.inkSoft,
                      border: `1px solid ${PM.line}`, fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>Cancel</button>
                  )}
                  {r.met && (
                    <span style={{
                      fontFamily: FONT_MONO, fontSize: 10, color: '#3DAE89',
                      letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700,
                    }}>Saved</span>
                  )}
                </div>
                {isOpen && (
                  <ReqFormPanel req={r} onSubmit={() => completeReq(i)}/>
                )}
              </div>
            );
          })}
        </div>

        <div style={{
          padding: '12px 14px',
          background: allMet ? '#E6F8EF' : '#FFF8E6', borderRadius: 14,
          fontFamily: FONT_BODY, fontSize: 13,
          color: allMet ? '#1E6B4D' : PM.ink, marginBottom: 16,
          borderLeft: allMet ? '3px solid #3DAE89' : 'none',
          transition: 'background 0.25s, color 0.25s',
        }}>
          {allMet
            ? (<><strong>All set!</strong> Every requirement is in. Submit your application below.</>)
            : (<><strong>Good news:</strong> previously answered fields are reused. Only {unmet} new to fill.</>)
          }
        </div>

        <button onClick={onContinue} style={{
          width: '100%', height: 54, borderRadius: 27, background: HOT_PINK, color: '#FFF',
          border: 'none', cursor: 'pointer',
          fontFamily: FONT_BODY, fontSize: 16, fontWeight: 600,
          boxShadow: '0 6px 18px rgba(255,0,131,0.4)',
        }}>Complete & Start Application →</button>
        <button onClick={onClose} style={{
          width: '100%', marginTop: 10, height: 36, background: 'transparent', color: PM.inkSoft,
          border: 'none', fontFamily: FONT_BODY, fontSize: 13, cursor: 'pointer',
        }}>Save to matches · finish later</button>
      </div>
    </div>
  );
}

// ─── Inline form for completing one unmet requirement ──────

function ReqFormPanel({ req, onSubmit }) {
  const mode =
    req.action === 'Add'                                       ? 'upload'  :
    req.action === 'Confirm' || req.action === 'Decide'        ? 'confirm' :
                                                                 'text';

  if (mode === 'upload') return <UploadReqForm req={req} onSubmit={onSubmit}/>;
  if (mode === 'confirm') return <ConfirmReqForm req={req} onSubmit={onSubmit}/>;
  return <TextReqForm req={req} onSubmit={onSubmit}/>;
}

const REQ_PROMPTS = {
  'Daily routine note':       "A few sentences on a typical weekday — when does the pet get walked, fed, left alone, etc.",
  'Daily care routine':       "Tell us how a typical day looks: feeding times, play, alone time, and who's home.",
  'Daily exercise commitment':"How will you make sure Max gets his daily exercise? Walks, fetch, dog park…",
  'Training reinforcement':   "How will you continue Max's training at home? Cue refreshers, professional classes…",
  'Litter box plan':          "Where will the litter box live and who will clean it?",
  'Vegetable diet plan':      "What greens will you keep on hand for Pepper, and how often will you restock?",
  'Senior-pet experience':    "Have you cared for an older pet before? A short note helps the shelter understand fit.",
  'Single-level home':        "Confirm your home has no stairs Clover would need to climb daily.",
  'Rabbit-proofed space':     "Confirm cables are protected, base boards safe, and supervised free-roam time only.",
  'Bonded-pair commitment':   "Pepper comes with her sister Sage — confirm you have space and budget for both.",
};

function FormShell({ children, onSubmit, submitLabel = 'Save & mark complete', disabled = false }) {
  return (
    <div style={{
      borderTop: `1px solid ${PM.line}`, padding: 14,
      background: 'linear-gradient(180deg, #FFF7FB 0%, #FFFFFF 100%)',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {children}
      <button onClick={onSubmit} disabled={disabled} style={{
        marginTop: 4, height: 42, borderRadius: 21, border: 'none',
        background: disabled ? '#FFB8DA' : HOT_PINK, color: '#FFF',
        fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 4px 12px rgba(255,0,131,0.32)',
        transition: 'background 0.15s, box-shadow 0.15s',
      }}>{submitLabel}</button>
    </div>
  );
}

function ReqLabel({ children }) {
  return (
    <div style={{
      fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft,
      letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
    }}>{children}</div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', boxSizing: 'border-box',
  background: PM.white, border: `1.5px solid ${PM.line}`,
  borderRadius: 12, fontFamily: FONT_BODY, fontSize: 13, color: PM.ink,
  outline: 'none', transition: 'border-color 0.15s',
};

function TextReqForm({ req, onSubmit }) {
  const [txt, setTxt] = React.useState('');
  const ready = txt.trim().length >= 8;
  return (
    <FormShell onSubmit={() => ready && onSubmit()} disabled={!ready}
               submitLabel={ready ? 'Save answer' : 'Type a few words first…'}>
      <ReqLabel>Your answer</ReqLabel>
      <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, lineHeight: 1.45 }}>
        {REQ_PROMPTS[req.label] || 'A short, honest answer is fine — the shelter just wants to picture the routine.'}
      </div>
      <textarea
        value={txt} onChange={e => setTxt(e.target.value)}
        placeholder="A couple of sentences…"
        rows={4}
        style={{ ...inputStyle, resize: 'vertical', minHeight: 88, lineHeight: 1.45 }}
      />
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.5, textAlign: 'right' }}>
        {txt.length} / 500
      </div>
    </FormShell>
  );
}

function ConfirmReqForm({ req, onSubmit }) {
  const [agreed, setAgreed] = React.useState(false);
  const [note, setNote] = React.useState('');
  return (
    <FormShell onSubmit={() => agreed && onSubmit()} disabled={!agreed}
               submitLabel={agreed ? 'Confirm' : 'Check the box to confirm'}>
      <ReqLabel>Confirm</ReqLabel>
      <label style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: 12, background: PM.white, borderRadius: 12,
        border: `1.5px solid ${agreed ? HOT_PINK : PM.line}`,
        cursor: 'pointer', transition: 'border-color 0.15s',
      }}>
        <input
          type="checkbox" checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          style={{
            width: 18, height: 18, accentColor: HOT_PINK, flexShrink: 0,
            marginTop: 2, cursor: 'pointer',
          }}
        />
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.45 }}>
          {REQ_PROMPTS[req.label] || `I confirm: ${req.label.toLowerCase()}.`}
        </span>
      </label>
      <ReqLabel>Optional note</ReqLabel>
      <input
        value={note} onChange={e => setNote(e.target.value)}
        placeholder="Anything the shelter should know"
        style={inputStyle}
      />
    </FormShell>
  );
}

function UploadReqForm({ req, onSubmit }) {
  const [vetName, setVetName] = React.useState('');
  const [vetPhone, setVetPhone] = React.useState('');
  const [fileChosen, setFileChosen] = React.useState(false);
  const ready = (vetName.trim().length >= 2 && vetPhone.trim().length >= 7) || fileChosen;
  return (
    <FormShell onSubmit={() => ready && onSubmit()} disabled={!ready}
               submitLabel={ready ? 'Save reference' : 'Add a contact or upload to continue'}>
      <ReqLabel>Upload reference letter</ReqLabel>
      <button
        type="button"
        onClick={() => setFileChosen(true)}
        style={{
          width: '100%', padding: '14px 14px', borderRadius: 14,
          background: fileChosen ? '#FFF1F7' : PM.white,
          border: fileChosen ? `1.5px solid ${HOT_PINK}` : `1.5px dashed ${PM.line}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: FONT_BODY, fontSize: 13, color: fileChosen ? HOT_PINK : PM.ink, fontWeight: 600,
        }}>
        <div style={{
          width: 30, height: 30, borderRadius: 15,
          background: fileChosen ? HOT_PINK : PM.creamDark, color: fileChosen ? '#FFF' : PM.inkSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {fileChosen ? (
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7 L 5.5 10.5 L 12 3.5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1 L 7 11 M 3 5 L 7 1 L 11 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12 L 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          )}
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          {fileChosen ? 'reference-letter.pdf · 312 KB' : 'Take a photo or choose a file'}
        </div>
        {fileChosen && (
          <span onClick={e => { e.stopPropagation(); setFileChosen(false); }} style={{
            fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.4,
            textTransform: 'uppercase', padding: '2px 6px', cursor: 'pointer',
          }}>remove</span>
        )}
      </button>

      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.8, textAlign: 'center' }}>
        — OR —
      </div>

      <ReqLabel>Vet contact</ReqLabel>
      <input
        value={vetName} onChange={e => setVetName(e.target.value)}
        placeholder="Vet or clinic name"
        style={inputStyle}
      />
      <input
        value={vetPhone} onChange={e => setVetPhone(e.target.value)}
        placeholder="Phone (e.g. 503-555-0143)"
        style={inputStyle}
      />
    </FormShell>
  );
}

// ─── Pet Detail (up-swipe destination) ───────────────────────

function PetDetailScreen({ pet, onBack, onApply }) {
  const ArtComp = window[PET_ART[pet.key]] || window.Pet_Poppy;
  const reqs = pet.reqs || [];
  const previewReqs = reqs.slice(0, 3);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* HERO */}
      <div style={{
        position: 'relative',
        height: 360,
        background: `linear-gradient(160deg, ${SOFT_PINK} 0%, #FFE4F0 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {ArtComp ? <ArtComp size={260}/> : null}

        {/* back button */}
        <button onClick={onBack} style={{
          position: 'absolute', top: 56, left: 16,
          width: 40, height: 40, borderRadius: 20,
          background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(20,20,40,0.12)',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2 L 3 7 L 9 12" stroke={PM.night} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* distance chip */}
        <div style={{
          position: 'absolute', top: 60, right: 16,
          background: 'rgba(255,255,255,0.95)',
          color: PM.night, padding: '6px 12px', borderRadius: 14,
          fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 8px rgba(20,20,40,0.12)',
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1 C 3.5 1, 1.5 3, 1.5 5.5 C 1.5 8.5, 6 11, 6 11 C 6 11, 10.5 8.5, 10.5 5.5 C 10.5 3, 8.5 1, 6 1 Z" stroke={HOT_PINK} strokeWidth="1.4" fill="none"/>
            <circle cx="6" cy="5.5" r="1.4" fill={HOT_PINK}/>
          </svg>
          {pet.dist}
        </div>

        {/* fee circle */}
        <div style={{
          position: 'absolute', bottom: -28, right: 24,
          width: 72, height: 72, borderRadius: '50%',
          background: HOT_PINK, color: '#FFF',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_DISPLAY, lineHeight: 1,
          boxShadow: '0 10px 24px rgba(255,0,131,0.45)',
        }}>
          <span style={{ fontSize: 22, letterSpacing: -0.4 }}>${pet.fee}</span>
          <span style={{ fontSize: 9, marginTop: 4, opacity: 0.9, fontFamily: FONT_BODY, fontWeight: 600, letterSpacing: 0.6 }}>FEE</span>
        </div>
      </div>

      {/* SCROLLABLE BODY */}
      <div style={{ flex: 1, overflow: 'auto', padding: '36px 22px 120px' }}>
        {/* name + breed */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <h1 style={{
            margin: 0, fontFamily: FONT_DISPLAY, fontSize: 42, fontWeight: 400,
            color: PM.night, letterSpacing: -0.8, lineHeight: 1,
          }}>{pet.name}</h1>
          <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: PM.inkSoft, fontWeight: 500 }}>· {pet.age}</div>
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft, marginBottom: 12 }}>
          {pet.breed}
        </div>

        {/* shelter chip + distance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <span style={{
            padding: '5px 11px', background: PM.white, color: PM.night,
            borderRadius: 12, fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
            border: `1px solid ${PM.line}`,
          }}>{pet.shelter}</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: PM.inkSoft, letterSpacing: 0.4 }}>
            {pet.dist} away
          </span>
        </div>

        {/* traits */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 22 }}>
          {pet.traits.map(t => (
            <span key={t} style={{
              padding: '6px 12px', background: SOFT_PINK, color: HOT_PINK,
              borderRadius: 12, fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
            }}>{t}</span>
          ))}
        </div>

        {/* bio */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.violet, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
            About {pet.name}
          </div>
          <p style={{
            margin: 0, fontFamily: FONT_BODY, fontSize: 14, color: PM.ink,
            lineHeight: 1.55,
          }}>
            {pet.bio}
          </p>
        </div>

        {/* requirements preview */}
        <div style={{
          padding: 18, background: PM.white, borderRadius: 20,
          boxShadow: '0 4px 14px rgba(20,20,40,0.06)', marginBottom: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 700 }}>
              Requirements preview
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              {reqs.filter(r => r.met).length}/{reqs.length} ready
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {previewReqs.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: r.met ? '#5BCBA1' : HOT_PINK, color: '#FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
                }}>{r.met ? '✓' : '!'}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, fontWeight: r.met ? 500 : 600 }}>
                  {r.label}
                </div>
              </div>
            ))}
          </div>
          {reqs.length > previewReqs.length && (
            <div style={{ marginTop: 10, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
              + {reqs.length - previewReqs.length} more — full check after you apply.
            </div>
          )}
        </div>
      </div>

      {/* sticky apply CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 20px 28px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 30%, #FFFFFF 100%)',
      }}>
        <button onClick={() => onApply(pet)} style={{
          width: '100%', height: 56, borderRadius: 28,
          background: HOT_PINK, color: '#FFF', border: 'none', cursor: 'pointer',
          fontFamily: FONT_BODY, fontSize: 16, fontWeight: 600,
          boxShadow: '0 8px 22px rgba(255,0,131,0.42)',
        }}>Apply for {pet.name} →</button>
      </div>
    </div>
  );
}

Object.assign(window, { SwipeScreen, MatchCheckOverlay, PetDetailScreen, FEED, PET_ART });
