// screens-shelter-home.jsx — Dashboard (Home tab).

function ShelterHomeScreen({ goto, tab, setTab }) {
  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };
  const topPets = [...SHELTER_PETS].sort((a, b) => b.swipes - a.swipes).slice(0, 3);
  const pending = APPLICATIONS.filter(a => a.stage === 'pre-app').length;
  const unreadChats = (SHELTER_CHATS || []).filter(c => c.unread > 0).length;

  // count-up animation for the headline adoption number
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const target = SHELTER_STATS.adoptedThisMonth;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 900);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ paddingTop: 58, paddingLeft: 20, paddingRight: 20, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coral, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600 }}>
              {SHELTER.name}
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 400, color: PM.night,
              letterSpacing: -0.5, marginTop: 4,
            }}>
              {greet()},<br/>
              <em style={{ color: PM.coral }}>{SHELTER.operator.split(' ')[0]}</em>.
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginTop: 8, lineHeight: 1.45 }}>
              Manage applications, pet listings, and conversations from this dashboard.
            </div>
            <div style={{ marginTop: 6, fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.6, textTransform: 'uppercase' }}>
              {APPLICATIONS.length} active applications · {unreadChats} unread chat{unreadChats === 1 ? '' : 's'} · {SHELTER_PETS.length} listings
            </div>
          </div>
          <button style={{
            width: 44, height: 44, borderRadius: 22,
            background: PM.white, border: `1.5px solid ${PM.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 7 Q 4 3, 9 3 Q 14 3, 14 7 L 14 11 L 16 13 L 2 13 L 4 11 Z" stroke={PM.night} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
              <path d="M7 15 Q 7 17, 9 17 Q 11 17, 11 15" stroke={PM.night} strokeWidth="1.6" fill="none"/>
            </svg>
            {pending > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: 7,
                background: PM.coral, color: '#FFF',
                fontFamily: FONT_BODY, fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{pending}</span>
            )}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 110px' }}>
        {/* Hero stat tile — same dark style as the vet Home, balanced number + label */}
        <div style={{
          padding: 20, borderRadius: 24, background: PM.night, color: PM.cream, marginBottom: 12,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coralSoft, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Adoptions this month
          </div>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 52, letterSpacing: -1.6, lineHeight: 0.95,
              fontVariantNumeric: 'tabular-nums',
            }}>{count}</div>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 16, fontWeight: 600, lineHeight: 1 }}>pets placed</div>
              <div style={{ marginTop: 4, fontFamily: FONT_MONO, fontSize: 11, color: PM.mint, fontWeight: 600 }}>
                ↑ +{Math.round(SHELTER_STATS.adoptedDelta * 100)}% vs last month
              </div>
            </div>
          </div>
        </div>

        {/* Stat tile pair */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <StatTile label="Swipes this week" value={SHELTER_STATS.totalSwipesWeek.toLocaleString()} accent={PM.night}/>
          <StatTile label="Likes this week"  value={SHELTER_STATS.totalLikesWeek.toLocaleString()} accent={PM.coral}/>
        </div>

        {/* Applications waiting — calmer card matching the vet "In-network" tile feel */}
        <button onClick={() => setTab('forms')} style={{
          width: '100%', padding: 16, borderRadius: 22, marginBottom: 18,
          background: PM.white, color: PM.night, border: 'none', cursor: 'pointer',
          textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 1px 3px rgba(20,20,40,0.04), 0 6px 18px rgba(20,20,40,0.04)',
          borderLeft: `3px solid ${PM.coral}`,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 24, background: `${PM.coral}18`, color: PM.coral,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: -0.4,
          }}>{APPLICATIONS.length}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coral, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>Applications waiting</div>
            <div style={{ marginTop: 2, fontFamily: FONT_BODY, fontSize: 14, color: PM.night, fontWeight: 600 }}>
              {pending} new pre-apps · {APPLICATIONS.length - pending} in progress
            </div>
          </div>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.inkSoft }}>→</span>
        </button>

        {/* Top performing pets */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 700 }}>Most viewed</div>
            <button onClick={() => setTab('pets')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: FONT_BODY, fontSize: 12, color: PM.coral, fontWeight: 600,
            }}>See all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topPets.map((p, i) => <TopPetRow key={p.key} pet={p} rank={i + 1} onClick={() => goto('petDetail', { pet: p.key })}/>)}
          </div>
        </div>

        {/* Adopter demographics — simple bars */}
        <div style={{ padding: 18, borderRadius: 22, background: PM.white, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,20,40,0.04)' }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 700, marginBottom: 14 }}>
            Who's swiping right
          </div>
          <DemoBar label="Family w/ kids" pct={0.42} color={PM.coral}/>
          <DemoBar label="Couples"         pct={0.31} color={PM.violet}/>
          <DemoBar label="Single"          pct={0.18} color={PM.gold}/>
          <DemoBar label="Roommates"       pct={0.09} color={PM.mint} last/>
        </div>

        {/* Boost CTA — single accent color to match the calmer palette */}
        <div style={{
          padding: 18, borderRadius: 22, marginBottom: 14,
          background: `${PM.coral}10`,
          border: `1.5px dashed ${PM.coral}`,
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coral, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700 }}>
            Reach more adopters
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.night, marginTop: 4, letterSpacing: -0.3, lineHeight: 1.15 }}>
            Boost a pet to the top of the feed.
          </div>
          <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, lineHeight: 1.45 }}>
            From $9/wk — average +3.2× swipes for boosted pets in your area.
          </div>
          <button style={{
            marginTop: 12, padding: '10px 18px', borderRadius: 20,
            background: PM.night, color: PM.cream, border: 'none', cursor: 'pointer',
            fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600,
          }}>See boost options →</button>
        </div>
      </div>

      <ShelterTabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function StatTile({ label, value, accent }) {
  return (
    <div style={{
      padding: 14, borderRadius: 18, background: PM.white,
      boxShadow: '0 1px 3px rgba(20,20,40,0.04)',
    }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 30, color: accent, letterSpacing: -0.6, lineHeight: 1, marginTop: 6,
      }}>{value}</div>
    </div>
  );
}

function TopPetRow({ pet, rank, onClick }) {
  const Art = (window.PETS && window.PETS[pet.key]) ? window.PETS[pet.key].Art : null;
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 18,
      background: PM.white, border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 1px 3px rgba(20,20,40,0.04)',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 15,
        background: rank === 1 ? PM.coral : PM.night,
        color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_DISPLAY, fontSize: 14, flexShrink: 0,
        opacity: rank === 1 ? 1 : 0.85 - (rank - 1) * 0.15,
      }}>{rank}</div>
      <PetAvatar petKey={pet.key} size={40} rounded={12}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.night, fontWeight: 600 }}>
          {pet.name} <span style={{ color: PM.inkFaint, fontWeight: 400 }}>· {pet.breed}</span>
        </div>
        <div style={{ marginTop: 2, fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.4 }}>
          {pet.swipes} swipes · {pet.likes} likes · {Math.round(pet.likeRate * 100)}%
        </div>
      </div>
    </button>
  );
}

function DemoBar({ label, pct, color, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.ink }}>{label}</span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: PM.inkSoft, fontWeight: 600 }}>{Math.round(pct * 100)}%</span>
      </div>
      <div style={{ height: 6, background: PM.lineSoft, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: color, transition: 'width 0.4s' }}/>
      </div>
    </div>
  );
}

Object.assign(window, { ShelterHomeScreen });
