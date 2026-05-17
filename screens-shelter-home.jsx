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
        {/* Big-ticket stat hero — pink, count-up, hero-sized number */}
        <div style={{
          padding: '22px 22px 24px', borderRadius: 28,
          background: `linear-gradient(160deg, ${PM.coral} 0%, #E8388F 100%)`,
          color: '#FFF', marginBottom: 14,
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 12px 36px rgba(255,0,131,0.32)',
        }}>
          <style>{`
            @keyframes pm-spark-orbit {
              0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
              50%      { transform: translate(-4px, -4px) rotate(180deg); opacity: 1; }
            }
          `}</style>
          {/* sparkle accents */}
          <span style={{
            position: 'absolute', top: 18, right: 100,
            fontSize: 14, color: '#FFFFFF', opacity: 0.75,
            animation: 'pm-spark-orbit 3.6s ease-in-out infinite',
          }}>✦</span>
          <span style={{
            position: 'absolute', top: 64, right: 160,
            fontSize: 10, color: '#FFFFFF', opacity: 0.55,
            animation: 'pm-spark-orbit 3.6s ease-in-out 1.2s infinite',
          }}>✦</span>
          {/* +18% green pill, top-right */}
          <div style={{
            position: 'absolute', top: 18, right: 18,
            padding: '5px 11px', borderRadius: 14,
            background: '#FFFFFF', color: PM.mint,
            fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
            boxShadow: '0 4px 10px rgba(20,20,40,0.18)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 13 }}>↑</span>
            +{Math.round(SHELTER_STATS.adoptedDelta * 100)}%
          </div>

          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>
            Adoptions this month
          </div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 88, letterSpacing: -3.2, lineHeight: 0.95,
            marginTop: 8, fontVariantNumeric: 'tabular-nums',
          }}>{count}</div>
          <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 13, opacity: 0.95, fontWeight: 500 }}>
            pets placed in forever homes · vs last month
          </div>
        </div>

        {/* Stat tile pair */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <StatTile label="Swipes this week" value={SHELTER_STATS.totalSwipesWeek.toLocaleString()} accent={PM.violet}/>
          <StatTile label="Likes this week"  value={SHELTER_STATS.totalLikesWeek.toLocaleString()} accent={PM.coral}/>
        </div>

        {/* Pending applications callout */}
        <button onClick={() => setTab('forms')} style={{
          width: '100%', padding: 18, borderRadius: 22, marginBottom: 18,
          background: PM.coral, color: '#FFF', border: 'none', cursor: 'pointer',
          textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 8px 22px rgba(255,0,131,0.32)',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 26, background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 400,
          }}>{APPLICATIONS.length}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, opacity: 0.85, fontWeight: 600 }}>Applications waiting</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, marginTop: 2, letterSpacing: -0.2 }}>
              {pending} new pre-apps · {APPLICATIONS.length - pending} in progress
            </div>
          </div>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 24 }}>→</span>
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

        {/* Boost CTA */}
        <div style={{
          padding: 18, borderRadius: 22, marginBottom: 14,
          background: `linear-gradient(135deg, ${PM.violet}15 0%, ${PM.coral}15 100%)`,
          border: `1.5px dashed ${PM.violet}`,
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.violet, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700 }}>
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
        background: rank === 1 ? PM.coral : rank === 2 ? PM.violet : PM.gold,
        color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_DISPLAY, fontSize: 14, flexShrink: 0,
      }}>{rank}</div>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: `${PM.coralSoft}80`,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
      }}>
        {Art ? <Art size={42}/> : null}
      </div>
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
