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
        <button onClick={() => goto('addPet')} style={{
          width: '100%', padding: 14, borderRadius: 18, marginBottom: 10,
          background: PM.white, border: `1.5px dashed ${PM.line}`,
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
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
        </button>

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
      <PetAvatar petKey={pet.key} size={60} rounded={16}/>
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
        background: (window.__pmPetPhotos && window.__pmPetPhotos[pet.key])
          ? `url("${window.__pmPetPhotos[pet.key]}") center / cover no-repeat`
          : `linear-gradient(160deg, ${PM.coralSoft} 0%, #FFE4F0 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {!(window.__pmPetPhotos && window.__pmPetPhotos[pet.key]) && Art ? <Art size={220}/> : null}
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

// ─── Add a pet · multi-method intake ───────────────────────

function ShelterAddPetScreen({ onBack, onDone }) {
  const [method, setMethod] = React.useState('manual');
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Add a pet" onBack={onBack}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 120px' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.4, color: PM.coral, textTransform: 'uppercase', fontWeight: 700 }}>
          Intake method
        </div>
        <h1 style={{ margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 400, color: PM.night, letterSpacing: -0.6, lineHeight: 1.05 }}>
          How are we adding<br/><em style={{ color: PM.coral }}>this pet</em>?
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 16 }}>
          Pick the fastest path. You can edit details after the pet lands in your inventory.
        </div>

        {/* Method picker — 2×2 grid of cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <MethodCard id="manual"    title="Manual entry"    sub="Fill out a short form"        method={method} setMethod={setMethod} icon="pencil"/>
          <MethodCard id="csv"       title="CSV import"      sub="Upload your existing roster"  method={method} setMethod={setMethod} icon="csv"/>
          <MethodCard id="petfinder" title="Petfinder sync"  sub="Pull live listings in"        method={method} setMethod={setMethod} icon="link"/>
          <MethodCard id="qr"        title="QR / microchip"  sub="Scan a chip or tag"           method={method} setMethod={setMethod} icon="qr"/>
        </div>

        {method === 'manual'    && <ManualIntakeForm    onDone={onDone}/>}
        {method === 'csv'       && <CsvIntakePanel      onDone={onDone}/>}
        {method === 'petfinder' && <PetfinderSyncPanel  onDone={onDone}/>}
        {method === 'qr'        && <QrIntakePanel       onDone={onDone}/>}
      </div>
    </div>
  );
}

function MethodCard({ id, title, sub, method, setMethod, icon }) {
  const on = method === id;
  const ic = (() => {
    const c = on ? '#FFF' : PM.night;
    switch (icon) {
      case 'pencil': return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 17 L 3 14 L 13 4 L 16 7 L 6 17 Z" stroke={c} strokeWidth="1.6" fill="none" strokeLinejoin="round"/><path d="M11 6 L 14 9" stroke={c} strokeWidth="1.6"/></svg>;
      case 'csv':    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke={c} strokeWidth="1.6" fill="none"/><path d="M3 8 L 17 8 M 3 13 L 17 13 M 8 3 L 8 17 M 13 3 L 13 17" stroke={c} strokeWidth="0.8" opacity="0.6"/></svg>;
      case 'link':   return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 12 L 12 8 M 6 10 Q 3 13, 6 16 Q 9 19, 12 16 L 13 15 M 14 10 Q 17 7, 14 4 Q 11 1, 8 4 L 7 5" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
      case 'qr':     return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" stroke={c} strokeWidth="1.6" fill="none"/><rect x="11" y="3" width="6" height="6" stroke={c} strokeWidth="1.6" fill="none"/><rect x="3" y="11" width="6" height="6" stroke={c} strokeWidth="1.6" fill="none"/><rect x="13" y="13" width="4" height="4" fill={c}/></svg>;
      default: return null;
    }
  })();
  return (
    <button onClick={() => setMethod(id)} style={{
      padding: 14, borderRadius: 18, textAlign: 'left',
      background: on ? PM.night : PM.white, color: on ? PM.cream : PM.ink,
      border: on ? 'none' : `1.5px solid ${PM.line}`, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 8, minHeight: 96,
      boxShadow: on ? '0 8px 22px rgba(0,0,0,0.18)' : 'none',
    }}>
      {ic}
      <div style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700 }}>{title}</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 11, opacity: 0.75 }}>{sub}</div>
    </button>
  );
}

// ─── Manual entry form ─────────────────────────────────────

const PET_REQUIREMENTS_LIBRARY = [
  'Kids OK', 'No kids', 'Dogs OK', 'Cats OK', 'Fenced yard', 'Apartment OK',
  'Senior-friendly', 'Calm home', 'Active home', 'Indoor only', 'Bonded pair',
];

function ManualIntakeForm({ onDone }) {
  const [name, setName]       = React.useState('');
  const [breed, setBreed]     = React.useState('');
  const [age, setAge]         = React.useState('1 yr');
  const [sex, setSex]         = React.useState('F');
  const [kind, setKind]       = React.useState('dog');
  const [fee, setFee]         = React.useState(150);
  const [status, setStatus]   = React.useState('Draft');
  const [reqs, setReqs]       = React.useState(new Set(['Kids OK']));
  const [desc, setDesc]       = React.useState('');
  const [photoChosen, setPhotoChosen] = React.useState(false);
  const [confirming, setConfirming]   = React.useState(false);

  const toggle = (r) => setReqs(prev => {
    const n = new Set(prev); n.has(r) ? n.delete(r) : n.add(r); return n;
  });
  const canSave = name.trim().length >= 2 && breed.trim().length >= 2;

  const save = () => {
    if (!canSave) return;
    setConfirming(true);
    setTimeout(() => onDone && onDone({ name, breed, age, kind, sex, fee, status, reqs: [...reqs] }), 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Photo */}
      <FormCard label="Photo">
        <button onClick={() => setPhotoChosen(true)} style={{
          width: '100%', padding: 16, borderRadius: 14,
          background: photoChosen ? `${PM.coral}10` : PM.creamDark,
          border: photoChosen ? `1.5px solid ${PM.coral}` : `1.5px dashed ${PM.line}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: FONT_BODY, fontSize: 13, color: photoChosen ? PM.coral : PM.inkSoft, fontWeight: 600,
        }}>
          {photoChosen ? (
            <>
              <svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 11 L 9 17 L 19 5" stroke={PM.coral} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              cover-photo.jpg · 1.2 MB
            </>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 7 Q 3 5, 5 5 L 7 5 L 9 3 L 13 3 L 15 5 L 17 5 Q 19 5, 19 7 L 19 16 Q 19 18, 17 18 L 5 18 Q 3 18, 3 16 Z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/><circle cx="11" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
              Tap to upload · 1 photo recommended
            </>
          )}
        </button>
      </FormCard>

      {/* Basics */}
      <FormCard label="Basics">
        <Input label="Name"  value={name}  onChange={setName}  placeholder="Pepper"/>
        <Input label="Breed" value={breed} onChange={setBreed} placeholder="Holland Lop"/>
        <Row>
          <Input label="Age"    value={age} onChange={setAge} placeholder="1 yr" half/>
          <Picker label="Sex"   value={sex} onChange={setSex} options={[['F','F'],['M','M']]} half/>
        </Row>
        <Picker label="Species" value={kind} onChange={setKind} options={[['dog','Dog'],['cat','Cat'],['rabbit','Rabbit'],['other','Other']]}/>
      </FormCard>

      {/* Requirements */}
      <FormCard label="Adopter requirements" hint="pick any that apply">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PET_REQUIREMENTS_LIBRARY.map(r => (
            <Chip key={r} selected={reqs.has(r)} onClick={() => toggle(r)}>{r}</Chip>
          ))}
        </div>
      </FormCard>

      {/* Description */}
      <FormCard label="Description" hint="optional · sells the pet">
        <textarea value={desc} onChange={e => setDesc(e.target.value)}
          placeholder="A few sentences on personality, history, and quirks…"
          rows={3}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 12, boxSizing: 'border-box',
            background: PM.white, border: `1.5px solid ${PM.line}`,
            fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, resize: 'vertical', outline: 'none',
          }}/>
      </FormCard>

      {/* Fee + status */}
      <FormCard label="Fee & visibility">
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Adoption fee</FieldLabel>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft,
              }}>$</span>
              <input type="number" value={fee} onChange={e => setFee(+e.target.value)}
                style={{
                  width: '100%', height: 42, padding: '0 12px 0 24px', boxSizing: 'border-box',
                  background: PM.white, border: `1.5px solid ${PM.line}`,
                  borderRadius: 12, fontFamily: FONT_BODY, fontSize: 14, color: PM.night,
                  outline: 'none',
                }}/>
            </div>
          </div>
          <div style={{ flex: 1.2 }}>
            <FieldLabel>Visibility</FieldLabel>
            <div style={{ display: 'flex', gap: 4, padding: 3, background: PM.creamDark, borderRadius: 12 }}>
              {['Live','Draft','Paused'].map(s => (
                <button key={s} onClick={() => setStatus(s)} style={{
                  flex: 1, height: 36, borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: status === s ? PM.night : 'transparent',
                  color:      status === s ? PM.cream : PM.inkSoft,
                  fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
                }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </FormCard>

      <button onClick={save} disabled={!canSave} style={{
        width: '100%', height: 54, borderRadius: 27, border: 'none', cursor: canSave ? 'pointer' : 'not-allowed',
        background: canSave ? PM.coral : '#FFB8DA', color: '#FFF',
        fontFamily: FONT_BODY, fontSize: 15, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: canSave ? '0 6px 18px rgba(255,0,131,0.36)' : 'none',
      }}>
        {confirming ? (
          <span style={{ fontFamily: FONT_BODY }}>Saving…</span>
        ) : canSave ? `Add ${name} →` : 'Fill in name + breed to save'}
      </button>
    </div>
  );
}

// ─── Other intake methods — credible stubs ─────────────────

function CsvIntakePanel({ onDone }) {
  const [hasFile, setHasFile] = React.useState(false);
  return (
    <FormCard label="Upload CSV">
      <button onClick={() => setHasFile(true)} style={{
        width: '100%', padding: 28, borderRadius: 16,
        background: PM.creamDark, border: `1.5px dashed ${PM.line}`,
        cursor: 'pointer', textAlign: 'center', fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft,
      }}>
        {hasFile ? <strong style={{ color: PM.night }}>roster-spring-2026.csv · 4 pets</strong> : 'Drop a .csv here or tap to choose'}
      </button>
      {hasFile && (
        <>
          <div style={{ marginTop: 12, fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600 }}>
            Preview
          </div>
          {['Biscuit · Border Collie Mix · 3 yr · $195','Tofu · Domestic Shorthair · 5 yr · $85','Juno · Pit Mix · 4 yr · $200','Wally · Cockapoo · 2 yr · $250'].map((s, i) => (
            <div key={i} style={{ padding: '8px 10px', background: PM.white, borderRadius: 10, marginTop: 6,
              fontFamily: FONT_MONO, fontSize: 11, color: PM.ink, border: `1px solid ${PM.lineSoft}` }}>
              {s}
            </div>
          ))}
          <button onClick={() => onDone && onDone({ method: 'csv', count: 4 })} style={{
            marginTop: 14, width: '100%', height: 50, borderRadius: 25,
            background: PM.coral, color: '#FFF', border: 'none', cursor: 'pointer',
            fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
            boxShadow: '0 6px 16px rgba(255,0,131,0.32)',
          }}>Import 4 pets as drafts →</button>
        </>
      )}
    </FormCard>
  );
}

function PetfinderSyncPanel({ onDone }) {
  const [linked, setLinked] = React.useState(false);
  return (
    <FormCard label="Petfinder">
      {!linked ? (
        <div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.5, marginBottom: 14 }}>
            Connect your Petfinder org account and we'll mirror your listings into
            PawMatch in the background. New pets show up as drafts you can publish.
          </div>
          <button onClick={() => setLinked(true)} style={{
            width: '100%', height: 50, borderRadius: 25,
            background: PM.night, color: PM.cream, border: 'none', cursor: 'pointer',
            fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none"><path d="M9 13 L 13 9 M 7 11 Q 4 14, 7 17 Q 10 20, 13 17 L 14 16 M 15 11 Q 18 8, 15 5 Q 12 2, 9 5 L 8 6" stroke={PM.cream} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Connect Petfinder
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            padding: 14, borderRadius: 14, background: `${PM.mint}12`, borderLeft: `3px solid ${PM.mint}`,
            marginBottom: 12,
          }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: '#1E6B4D', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>
              ● Connected
            </div>
            <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 600 }}>
              Willow Creek Rescue · 12 listings found
            </div>
            <div style={{ marginTop: 2, fontFamily: FONT_BODY, fontSize: 11, color: PM.inkSoft }}>
              Auto-sync every 15 min. New pets land as drafts.
            </div>
          </div>
          <button onClick={() => onDone && onDone({ method: 'petfinder', count: 12 })} style={{
            width: '100%', height: 50, borderRadius: 25,
            background: PM.coral, color: '#FFF', border: 'none', cursor: 'pointer',
            fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
            boxShadow: '0 6px 16px rgba(255,0,131,0.32)',
          }}>Run first sync →</button>
        </div>
      )}
    </FormCard>
  );
}

function QrIntakePanel({ onDone }) {
  const [scanned, setScanned] = React.useState(false);
  return (
    <FormCard label="Scan microchip or tag QR">
      <button onClick={() => setScanned(true)} style={{
        width: '100%', aspectRatio: '1 / 1', maxHeight: 240, borderRadius: 16,
        background: PM.night, color: PM.cream, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Viewfinder frame */}
        <div style={{
          position: 'absolute', inset: 30, border: `2px solid ${PM.cream}`, borderRadius: 12, opacity: 0.55,
        }}/>
        <svg width="40" height="40" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="3" width="6" height="6" stroke={PM.cream} strokeWidth="1.6" fill="none"/>
          <rect x="13" y="3" width="6" height="6" stroke={PM.cream} strokeWidth="1.6" fill="none"/>
          <rect x="3" y="13" width="6" height="6" stroke={PM.cream} strokeWidth="1.6" fill="none"/>
          <rect x="13" y="13" width="6" height="6" fill={PM.cream}/>
        </svg>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: PM.coralSoft }}>
          {scanned ? '● scanned' : 'tap to simulate scan'}
        </div>
      </button>
      {scanned && (
        <div style={{ marginTop: 12 }}>
          <div style={{ padding: 14, borderRadius: 14, background: PM.white, border: `1px solid ${PM.line}` }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase' }}>Detected</div>
            <div style={{ marginTop: 4, fontFamily: FONT_DISPLAY, fontSize: 20, color: PM.night }}>Chip 985 1120 0078 9012</div>
            <div style={{ marginTop: 2, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
              Maple · Beagle Mix · 3 yr · F · prior owner registered
            </div>
          </div>
          <button onClick={() => onDone && onDone({ method: 'qr', chip: '985112000789012' })} style={{
            marginTop: 12, width: '100%', height: 50, borderRadius: 25,
            background: PM.coral, color: '#FFF', border: 'none', cursor: 'pointer',
            fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
            boxShadow: '0 6px 16px rgba(255,0,131,0.32)',
          }}>Pull in Maple's record →</button>
        </div>
      )}
    </FormCard>
  );
}

// ─── Small form primitives reused above ───────────────────

function FormCard({ label, hint, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.night, fontWeight: 700 }}>{label}</div>
        {hint && <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.4, textTransform: 'uppercase' }}>{hint}</div>}
      </div>
      <div style={{ background: PM.white, borderRadius: 16, padding: 14, boxShadow: '0 1px 3px rgba(20,20,40,0.04)' }}>{children}</div>
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>{children}</div>;
}

function Input({ label, value, onChange, placeholder, half }) {
  return (
    <div style={{ flex: 1, marginTop: 10 }}>
      <FieldLabel>{label}</FieldLabel>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: '100%', height: 42, padding: '0 12px', boxSizing: 'border-box',
          background: PM.white, border: `1.5px solid ${PM.line}`, borderRadius: 12,
          fontFamily: FONT_BODY, fontSize: 14, color: PM.night, outline: 'none',
        }}/>
    </div>
  );
}

function Picker({ label, value, onChange, options, half }) {
  return (
    <div style={{ flex: 1, marginTop: 10 }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ display: 'flex', gap: 4, padding: 3, background: PM.creamDark, borderRadius: 12 }}>
        {options.map(([v, l]) => (
          <button key={v} onClick={() => onChange(v)} style={{
            flex: 1, height: 36, borderRadius: 9, border: 'none', cursor: 'pointer',
            background: value === v ? PM.night : 'transparent',
            color:      value === v ? PM.cream : PM.inkSoft,
            fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
          }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ShelterPetsScreen, ShelterPetDetailScreen, ShelterAddPetScreen });
