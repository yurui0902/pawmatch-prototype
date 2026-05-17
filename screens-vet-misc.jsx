// screens-vet-misc.jsx — Documents + Me/Account.

const KIND_ICONS = {
  'X-ray':   { bg: `${PM.violet}15`, fg: PM.violet },
  'Lab':     { bg: `${PM.mint}15`,   fg: PM.mint   },
  'Image':   { bg: `${PM.coral}15`,  fg: PM.coral  },
  'PDF':     { bg: `${PM.gold}22`,   fg: '#9A6A00' },
  'Consent': { bg: `${PM.violet}10`, fg: PM.violet },
};

function VetDocumentsScreen({ onBack }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Documents" onBack={onBack}
        right={<div style={{
          padding: '4px 10px', borderRadius: 11, background: PM.creamDark, color: PM.ink,
          fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.4, fontWeight: 700,
        }}>48 files</div>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 24px' }}>
        {/* Upload card */}
        <div style={{
          padding: 18, borderRadius: 22, marginBottom: 14,
          background: PM.white, border: `2px dashed ${PM.line}`, textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, margin: '0 auto', borderRadius: 28,
            background: PM.coral, color: '#FFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 3 L 11 14 M 5 9 L 11 3 L 17 9" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 16 Q 3 19, 6 19 L 16 19 Q 19 19, 19 16" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: PM.night, fontWeight: 600 }}>
            Upload a file
          </div>
          <div style={{ marginTop: 4, fontFamily: FONT_MONO, fontSize: 11, color: PM.inkFaint, letterSpacing: 0.4 }}>
            JPG · PNG · PDF · DCM · max 25 MB
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DOCUMENTS.map(d => <DocRow key={d.id} doc={d}/>)}
        </div>
      </div>
    </div>
  );
}

function DocRow({ doc }) {
  const k = KIND_ICONS[doc.kind] || KIND_ICONS.PDF;
  return (
    <div style={{
      display: 'flex', gap: 12, padding: 12, borderRadius: 14,
      background: PM.white, alignItems: 'center',
      boxShadow: '0 1px 2px rgba(20,20,40,0.03)',
    }}>
      <div style={{
        width: 40, height: 50, borderRadius: 8,
        background: k.bg, color: k.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_MONO, fontSize: 9, fontWeight: 700, letterSpacing: 0.4,
        flexShrink: 0,
      }}>{doc.kind.toUpperCase().slice(0, 5)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{doc.name}</div>
        <div style={{ marginTop: 3, fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.3 }}>
          {doc.size} · {doc.age}
        </div>
      </div>
      <button style={{
        width: 32, height: 32, borderRadius: 16, border: 'none', background: 'transparent', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: PM.inkSoft,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1 L 7 9 M 3 6 L 7 9 L 11 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12 L 12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

// ─── Me / Account ──────────────────────────────────────────

function VetMeScreen({ goto, tab, setTab }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 58, paddingLeft: 20, paddingRight: 20, paddingBottom: 8 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 400, color: PM.night, letterSpacing: -0.5 }}>
          Account
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginTop: 2 }}>
          Clinic, team, licenses, insurance partners
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 110px' }}>
        {/* Hero card */}
        <div style={{
          background: `linear-gradient(160deg, ${PM.coralSoft} 0%, #FFE4F0 100%)`,
          borderRadius: 24, padding: 20, marginBottom: 22,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: PM.coral, color: '#FFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT_DISPLAY, fontSize: 22,
            flexShrink: 0, boxShadow: '0 6px 16px rgba(255,0,131,0.35)',
          }}>
            {CLINIC.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, letterSpacing: -0.3, color: PM.night, lineHeight: 1.1 }}>
              {CLINIC.name}
            </div>
            <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
              ★ {CLINIC.rating} ({CLINIC.reviews}) · {CLINIC.hours}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 8, padding: '3px 10px', borderRadius: 11,
              background: '#FFF', color: PM.mint,
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
            }}>✓ Licensed · {CLINIC.license}</div>
          </div>
        </div>

        <Group title="Clinic">
          <MeRow label="Address" value={CLINIC.district}/>
          <MeRow label="Hours"   value={CLINIC.hours}/>
          <MeRow label="Lead vet" value={CLINIC.lead}/>
        </Group>

        <Group title="Team" hint={`${CLINIC.team.length} members`}>
          {CLINIC.team.map(m => <MeRow key={m.name} label={m.name} value={m.role}/>)}
        </Group>

        <Group title="Insurance partners" hint="in-network">
          <div style={{ padding: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CLINIC.inNetwork.map(p => (
              <span key={p} style={{
                padding: '6px 12px', borderRadius: 12, background: PM.creamDark,
                fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, color: PM.night,
              }}>{p}</span>
            ))}
          </div>
        </Group>

        <Group title="Storage">
          <button onClick={() => goto('documents')} style={{
            width: '100%', padding: '14px 16px', background: 'transparent', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
            borderBottom: `1px solid ${PM.lineSoft}`,
          }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft }}>Documents</span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.ink, fontWeight: 500 }}>48 files · 312 MB →</span>
          </button>
          <MeRow label="Billing" value="$0 / month · pilot"/>
          <MeRow label="Security" value="2FA enabled" last/>
        </Group>

        <button style={{
          width: '100%', height: 50, borderRadius: 25,
          background: 'transparent', color: PM.inkSoft, border: `1px solid ${PM.line}`,
          fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          marginTop: 18,
        }}>Sign out</button>
      </div>

      <VetTabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function Group({ title, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '0 4px 8px' }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 600 }}>{title}</div>
        {hint && <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: PM.inkFaint }}>{hint}</div>}
      </div>
      <div style={{ background: PM.white, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(20,20,40,0.04)' }}>{children}</div>
    </div>
  );
}

function MeRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 16px', borderBottom: last ? 'none' : `1px solid ${PM.lineSoft}`,
    }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft }}>{label}</span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.ink, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

Object.assign(window, { VetDocumentsScreen, VetMeScreen });
