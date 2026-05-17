// screens-vet-home.jsx — Dashboard.

function VetHomeScreen({ goto, tab, setTab }) {
  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };
  const todayApts = APPOINTMENTS.slice(0, 4);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 58, paddingLeft: 20, paddingRight: 20, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.violet, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600 }}>
              {CLINIC.name}
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 400, color: PM.night, letterSpacing: -0.5, marginTop: 4 }}>
              {greet()},<br/><em style={{ color: PM.coral }}>{CLINIC.lead.split(' ').slice(-1)[0]}</em>.
            </div>
          </div>
          <button onClick={() => goto('appointmentNew')} style={{
            width: 44, height: 44, borderRadius: 22, background: PM.night,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1 L 7 13 M 1 7 L 13 7" stroke={PM.cream} strokeWidth="2.4" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 110px' }}>
        {/* Hero stat tile — number sized to balance with the label */}
        <div style={{
          padding: 20, borderRadius: 24, background: PM.night, color: PM.cream, marginBottom: 12,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coralSoft, letterSpacing: 1.5, textTransform: 'uppercase' }}>Today</div>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 44, letterSpacing: -1.4, lineHeight: 0.95 }}>
              {VET_STATS.todayAppointments}
            </div>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 18, fontWeight: 600, lineHeight: 1 }}>appointments</div>
              <div style={{ marginTop: 4, fontFamily: FONT_MONO, fontSize: 11, color: PM.mint, fontWeight: 600 }}>
                ↑ {VET_STATS.delta} · 3 new
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          <VetStatTile label="Draft notes"    value={VET_STATS.draftNotes}    accent={PM.gold}   onClick={() => setTab('record')}/>
          <VetStatTile label="Pending claims" value={VET_STATS.pendingClaims} accent={PM.coral}  onClick={() => setTab('claims')}/>
        </div>

        {/* Active patients tile */}
        <div style={{
          padding: 18, borderRadius: 22, background: PM.white, marginBottom: 14,
          boxShadow: '0 1px 3px rgba(20,20,40,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase' }}>Active patients</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: PM.night, letterSpacing: -0.6, lineHeight: 1, marginTop: 6 }}>
                {VET_STATS.activePatients}
              </div>
              <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>across dogs, cats & exotics</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <SpeciesBar label="Dogs"  pct={0.58} color={PM.coral}/>
              <SpeciesBar label="Cats"  pct={0.34} color={PM.violet}/>
              <SpeciesBar label="Other" pct={0.08} color={PM.mint}/>
            </div>
          </div>
        </div>

        {/* Insurance partners chip row */}
        <div style={{
          padding: 16, borderRadius: 22,
          background: `${PM.mint}12`, borderLeft: `3px solid ${PM.mint}`, marginBottom: 18,
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.mint, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>
            In-network partners
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CLINIC.inNetwork.map(p => (
              <span key={p} style={{
                padding: '5px 10px', borderRadius: 11, background: PM.white,
                fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600, color: PM.night,
              }}>{p}</span>
            ))}
          </div>
        </div>

        {/* Today's schedule — moved below Active patients + In-network partners */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 700 }}>Today's schedule</div>
            <button onClick={() => setTab('calendar')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: FONT_BODY, fontSize: 12, color: PM.coral, fontWeight: 600,
            }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayApts.map(a => <MiniAptRow key={a.id} apt={a} onClick={() => goto('appointmentDetail', { id: a.id })}/>)}
          </div>
        </div>
      </div>

      <VetTabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function VetStatTile({ label, value, accent, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: 14, borderRadius: 18, background: PM.white, border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 1px 3px rgba(20,20,40,0.04)',
    }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, color: accent, letterSpacing: -0.6, lineHeight: 1, marginTop: 6 }}>{value}</div>
      <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 11, color: PM.inkFaint }}>tap to review →</div>
    </button>
  );
}

function MiniAptRow({ apt, onClick }) {
  const isNew = apt.status === 'NEW';
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', gap: 12, padding: 12, borderRadius: 18,
      background: PM.white, border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 1px 3px rgba(20,20,40,0.04)',
    }}>
      <div style={{
        width: 56, flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '8px 0', borderRight: `1px dashed ${PM.line}`,
      }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: PM.night, letterSpacing: -0.3, lineHeight: 1 }}>{apt.time}</div>
        <div style={{ marginTop: 2, fontFamily: FONT_MONO, fontSize: 9, color: PM.inkFaint }}>{apt.duration}m</div>
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingLeft: 4 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 700, color: PM.night }}>{apt.patient}</div>
          <span style={{
            padding: '1px 6px', borderRadius: 6,
            background: isNew ? PM.coral : `${PM.violet}22`,
            color: isNew ? '#FFF' : PM.violet,
            fontFamily: FONT_MONO, fontSize: 9, fontWeight: 700, letterSpacing: 0.4,
          }}>{apt.status}</span>
        </div>
        <div style={{ marginTop: 2, fontFamily: FONT_BODY, fontSize: 11, color: PM.inkSoft }}>
          {apt.breed} · {apt.owner}
        </div>
        <div style={{ marginTop: 4, fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.4 }}>
          {apt.visitType.toUpperCase()}
        </div>
      </div>
    </button>
  );
}

function SpeciesBar({ label, pct, color }) {
  return (
    <div style={{ width: 90 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: 10, color: PM.inkSoft }}>{label}</span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, fontWeight: 600 }}>{Math.round(pct * 100)}%</span>
      </div>
      <div style={{ height: 5, background: PM.lineSoft, borderRadius: 2.5, overflow: 'hidden' }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: color }}/>
      </div>
    </div>
  );
}

Object.assign(window, { VetHomeScreen });
