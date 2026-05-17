// screens-shelter-pets.jsx — Pet inventory list + detail / edit.

const STATUS_COLORS = {
  Live:   { bg: '#E6F8EF', fg: '#1E8A5A' },
  Draft:  { bg: '#FFF1D6', fg: '#9A6A00' },
  Paused: { bg: '#F0F0F0', fg: '#666666' },
};

function ShelterPetsScreen({ goto, tab, setTab }) {
  const [seg, setSeg] = React.useState('all');
  const counts = {
    all:    SHELTER_PETS.length,
    Live:   SHELTER_PETS.filter(p => p.status === 'Live').length,
    Draft:  SHELTER_PETS.filter(p => p.status === 'Draft').length,
    Paused: SHELTER_PETS.filter(p => p.status === 'Paused').length,
  };
  const list = seg === 'all' ? SHELTER_PETS : SHELTER_PETS.filter(p => p.status === seg);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Pets" large subtitle={`${counts.Live} live · ${counts.Draft} drafts · ${counts.Paused} paused`}/>

      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: PM.white, borderRadius: 16, border: `1px solid ${PM.line}` }}>
          {[['all', `All ${counts.all}`], ['Live', `Live · ${counts.Live}`], ['Draft', `Draft · ${counts.Draft}`], ['Paused', `Paused · ${counts.Paused}`]].map(([k, l]) => (
            <button key={k} onClick={() => setSeg(k)} style={{
              flex: 1, height: 34, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: seg===k ? PM.night : 'transparent',
              color:      seg===k ? PM.cream : PM.inkSoft,
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 110px' }}>
        {/* Add / import action row */}
        <div style={{
          padding: 14, borderRadius: 18, marginBottom: 10,
          background: PM.white, border: `1.5px dashed ${PM.line}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 19, background: PM.coral, color: '#FFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 14 14"><path d="M7 1 L 7 13 M 1 7 L 13 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, color: PM.night }}>Add a pet</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: PM.inkSoft, marginTop: 2 }}>
              Manual · CSV import · Petfinder sync · QR/microchip scan
            </div>
          </div>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: PM.inkSoft }}>→</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map(p => <ShelterPetRow key={p.key} pet={p} onClick={() => goto('petDetail', { pet: p.key })}/>)}
        </div>
      </div>

      <ShelterTabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function ShelterPetRow({ pet, onClick }) {
  const sc = STATUS_COLORS[pet.status] || STATUS_COLORS.Live;
  const Art = (window.PETS && window.PETS[pet.key]) ? window.PETS[pet.key].Art : null;
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 22,
      background: PM.white, border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 1px 2px rgba(20,20,40,0.03), 0 6px 18px rgba(20,20,40,0.04)',
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 16, flexShrink: 0,
        background: `${PM.coralSoft}80`,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden',
      }}>{Art ? <Art size={60}/> : null}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.night, letterSpacing: -0.3, lineHeight: 1 }}>{pet.name}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkFaint }}>· {pet.age}</div>
        </div>
        <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>{pet.breed}</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            padding: '3px 8px', borderRadius: 8,
            background: sc.bg, color: sc.fg,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700,
          }}>{pet.status}</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: PM.inkSoft }}>
            {pet.appCount} application{pet.appCount === 1 ? '' : 's'} · {pet.swipes} swipes
          </span>
        </div>
      </div>
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.inkSoft }}>›</span>
    </button>
  );
}

function ShelterPetDetailScreen({ pet, onBack }) {
  if (!pet) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: PM.cream, padding: 40, fontFamily: FONT_BODY }}>
        Pet not found. <button onClick={onBack}>Back</button>
      </div>
    );
  }
  const sc = STATUS_COLORS[pet.status] || STATUS_COLORS.Live;
  const Art = (window.PETS && window.PETS[pet.key]) ? window.PETS[pet.key].Art : null;

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        position: 'relative', height: 280,
        background: `linear-gradient(160deg, ${PM.coralSoft} 0%, #FFE4F0 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {Art ? <Art size={220}/> : null}
        <button onClick={onBack} style={{
          position: 'absolute', top: 56, left: 16,
          width: 40, height: 40, borderRadius: 20,
          background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(20,20,40,0.12)',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2 L 3 7 L 9 12" stroke={PM.night} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{
          position: 'absolute', top: 60, right: 16,
          padding: '6px 12px', borderRadius: 14,
          background: sc.bg, color: sc.fg,
          fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700,
        }}>{pet.status}</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 120px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 400, color: PM.night, letterSpacing: -0.8, lineHeight: 1 }}>{pet.name}</h1>
          <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: PM.inkSoft, fontWeight: 500 }}>· {pet.age}</div>
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft, marginBottom: 18 }}>{pet.breed}</div>

        {/* Performance stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
          <PerfTile label="Swipes" value={pet.swipes}/>
          <PerfTile label="Likes"  value={pet.likes}/>
          <PerfTile label="Apps"   value={pet.appCount}/>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 18 }}>
          <FieldLabel>Description</FieldLabel>
          <div style={{
            padding: 14, borderRadius: 14, background: PM.white,
            fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.5,
            border: `1px solid ${PM.line}`,
          }}>{pet.description}</div>
        </div>

        {/* Requirements */}
        <div style={{ marginBottom: 18 }}>
          <FieldLabel>Adopter requirements</FieldLabel>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {pet.requirements.map(r => (
              <span key={r} style={{
                padding: '7px 12px', borderRadius: 13, background: PM.white, border: `1px solid ${PM.line}`,
                fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, color: PM.night,
              }}>{r}</span>
            ))}
            <button style={{
              padding: '7px 12px', borderRadius: 13, background: 'transparent', border: `1px dashed ${PM.line}`,
              fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, cursor: 'pointer',
            }}>+ add</button>
          </div>
        </div>

        {/* Medical + fee */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Medical</FieldLabel>
            <div style={{
              padding: 12, borderRadius: 14, background: PM.white,
              fontFamily: FONT_BODY, fontSize: 12, color: PM.ink, border: `1px solid ${PM.line}`,
            }}>{pet.medical}</div>
          </div>
          <div style={{ width: 110 }}>
            <FieldLabel>Adoption fee</FieldLabel>
            <div style={{
              padding: 12, borderRadius: 14, background: PM.coral, color: '#FFF',
              fontFamily: FONT_DISPLAY, fontSize: 24, textAlign: 'center', letterSpacing: -0.4, lineHeight: 1,
            }}>${pet.fee}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <PMButton variant="primary">Edit pet</PMButton>
          <PMButton variant="light">{pet.status === 'Paused' ? 'Resume' : 'Pause'}</PMButton>
        </div>
      </div>
    </div>
  );
}

function PerfTile({ label, value }) {
  return (
    <div style={{ padding: 12, borderRadius: 14, background: PM.white, textAlign: 'center', border: `1px solid ${PM.line}` }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: PM.night, letterSpacing: -0.4, lineHeight: 1 }}>{value}</div>
      <div style={{ marginTop: 4, fontFamily: FONT_MONO, fontSize: 9, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginBottom: 8, fontWeight: 600, letterSpacing: 0.2 }}>{children}</div>
  );
}

Object.assign(window, { ShelterPetsScreen, ShelterPetDetailScreen });
