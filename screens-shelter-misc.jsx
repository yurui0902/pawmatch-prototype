// screens-shelter-misc.jsx — Chat list + thread + Me/Account tab.

function ShelterChatScreen({ goto, tab, setTab }) {
  const rows = SHELTER_CHATS;
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Chat" large subtitle="Direct line to every applicant."/>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 0 110px' }}>
        {rows.length === 0 ? (
          <EmptyState
            title="No conversations yet"
            sub="When you message an applicant, your threads will live here."
            cta="See applications"
            onCta={() => setTab('forms')}
          />
        ) : (
          rows.map((c, i) => <ShelterChatRow key={i} {...c} onClick={() => goto('chatThread', { pet: c.petKey })}/>)
        )}
      </div>
      <ShelterTabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function ShelterChatRow({ who, sub, preview, age, unread, petKey, onClick }) {
  const pet = (window.PETS || {})[petKey];
  const Art = pet && pet.Art;
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', gap: 12, padding: '12px 20px', alignItems: 'center',
      background: 'transparent', border: 'none', borderBottom: `1px solid ${PM.lineSoft}`,
      cursor: 'pointer', textAlign: 'left',
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: 25, flexShrink: 0,
        background: PM.coral, color: '#FFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_DISPLAY, fontSize: 18,
      }}>{who.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: PM.night }}>{who}</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.3 }}>{age}</div>
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkFaint, marginTop: 2 }}>{sub}</div>
        <div style={{
          marginTop: 4, fontFamily: FONT_BODY, fontSize: 13, color: unread ? PM.night : PM.inkSoft,
          fontWeight: unread ? 600 : 400,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{preview}</div>
      </div>
      {unread > 0 && (
        <div style={{ width: 8, height: 8, borderRadius: 4, background: PM.coral, flexShrink: 0 }}/>
      )}
    </button>
  );
}

function ShelterChatThreadScreen({ conv, onBack }) {
  const pet = (window.PETS || {})[conv.petKey];
  const Art = pet && pet.Art;
  // Shelter-side mirror of the adopter chat — we're the shelter, applicant is "them".
  const messages = [
    { from: 'them', text: `Hi! I just submitted my application for ${pet ? pet.name : 'the pet'} — really excited.`, time: '09:48' },
    { from: 'me',   text: `Hi ${conv.who.split(' ')[0]}! Thanks so much. We loved your pre-app. Would you and the family be free to meet this weekend?`, time: '10:14' },
    { from: 'them', text: `Yes please! Saturday afternoon works for us.`, time: '10:32' },
    { from: 'me',   text: `Great — let's lock in Saturday 2pm at the shelter. Bring the kids! 🌿`, time: '11:02' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 56, paddingBottom: 12, paddingLeft: 16, paddingRight: 16,
        background: PM.cream, borderBottom: `1px solid ${PM.lineSoft}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: 'none', background: PM.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13"><path d="M8 1 L 3 6.5 L 8 12" stroke={PM.night} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{
          width: 38, height: 38, borderRadius: 19, overflow: 'hidden',
          background: PM.coral, color: '#FFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_DISPLAY, fontSize: 14,
        }}>{conv.who.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: PM.night }}>{conv.who}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: PM.mint, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: PM.mint, display: 'inline-block' }}/>
            {conv.sub}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ textAlign: 'center', fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 1, textTransform: 'uppercase' }}>Today</div>
        {messages.map((m, i) => (
          <ShelterBubble key={i} from={m.from} text={m.text} time={m.time}/>
        ))}
      </div>

      <div style={{ padding: '10px 16px 30px', background: PM.cream, borderTop: `1px solid ${PM.lineSoft}` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={{
            width: 40, height: 40, borderRadius: 20, background: PM.white, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1 L 7 13 M 1 7 L 13 7" stroke={PM.night} strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div style={{
            flex: 1, height: 40, borderRadius: 20, background: PM.white, border: `1px solid ${PM.line}`,
            display: 'flex', alignItems: 'center', padding: '0 14px',
            fontFamily: FONT_BODY, fontSize: 14, color: PM.inkFaint,
          }}>Message…</div>
          <button style={{
            width: 40, height: 40, borderRadius: 20, background: PM.coral, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 7 L 13 1 L 8 13 L 7 8 Z" fill={PM.cream}/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function ShelterBubble({ from, text, time }) {
  const me = from === 'me';
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: '78%',
        padding: '10px 14px',
        background: me ? PM.night : PM.white,
        color: me ? PM.cream : PM.ink,
        borderRadius: me ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
        fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.4,
        boxShadow: me ? 'none' : '0 1px 3px rgba(20,20,40,0.04)',
      }}>
        {text}
        <div style={{ marginTop: 4, fontFamily: FONT_MONO, fontSize: 9, opacity: 0.55, textAlign: 'right' }}>{time}</div>
      </div>
    </div>
  );
}

// ─── Me / Account ──────────────────────────────────────────

function ShelterMeScreen({ goto, tab, setTab }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 58, paddingLeft: 20, paddingRight: 20, paddingBottom: 8 }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 400, color: PM.night, letterSpacing: -0.5,
        }}>
          Account
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginTop: 2 }}>
          Organization profile, team & billing
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 110px' }}>
        {/* Org hero card */}
        <div style={{
          background: `linear-gradient(160deg, ${PM.coralSoft} 0%, #FFE4F0 100%)`,
          borderRadius: 24, padding: 20, marginBottom: 22,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: PM.coral, color: '#FFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT_DISPLAY, fontSize: 24,
            flexShrink: 0, boxShadow: '0 6px 16px rgba(255,0,131,0.35)',
          }}>
            {SHELTER.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, letterSpacing: -0.3, color: PM.night, lineHeight: 1.1 }}>
              {SHELTER.name}
            </div>
            <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
              Operator: {SHELTER.operator} · since {SHELTER.joinedYear}
            </div>
            {SHELTER.verified && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                marginTop: 8, padding: '3px 10px', borderRadius: 11,
                background: '#FFF', color: PM.mint,
                fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
              }}>
                ✓ Verified 501(c)(3)
              </div>
            )}
          </div>
        </div>

        <MeGroup title="Organization">
          <MeRow label="Address"    value={SHELTER.district}/>
          <MeRow label="Categories" value={SHELTER.categories.join(' · ')}/>
          <MeRow label="Active pets" value={`${SHELTER.totalActive}`}/>
          <MeRow label="Alumni"     value={`${SHELTER.totalAlumni} adopted`}/>
        </MeGroup>

        <MeGroup title="Team" hint="2 members">
          <MeRow label="Meadow Park" value="Operator · admin"/>
          <MeRow label="Riley Cho"   value="Volunteer · review only"/>
        </MeGroup>

        <MeGroup title="Billing">
          <MeRow label="Plan"  value="Shelter · Free"/>
          <MeRow label="Boosts active" value="0"/>
        </MeGroup>

        <button style={{
          width: '100%', height: 50, borderRadius: 25,
          background: 'transparent', color: PM.inkSoft, border: `1px solid ${PM.line}`,
          fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          marginTop: 18,
        }}>Sign out</button>
      </div>

      <ShelterTabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function MeGroup({ title, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '0 4px 8px' }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 600 }}>{title}</div>
        {hint && <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: PM.inkFaint }}>{hint}</div>}
      </div>
      <div style={{ background: PM.white, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(20,20,40,0.04)' }}>
        {children}
      </div>
    </div>
  );
}

function MeRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 16px', borderBottom: `1px solid ${PM.lineSoft}`,
    }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft }}>{label}</span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.ink, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

Object.assign(window, { ShelterChatScreen, ShelterChatThreadScreen, ShelterMeScreen });
