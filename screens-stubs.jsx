// screens-stubs.jsx — placeholder versions of vet / insurance / checkout / upload / profile.
// Designed to be visually consistent, but lower fidelity. Will be expanded in round 2.

function StubScreen({ title, subtitle, goto, tab, setTab, children, body }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title={title} large subtitle={subtitle}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 110px' }}>
        {children || (
          <div style={{ marginTop: 40, padding: 28, borderRadius: 28, background: PM.white, border: `1.5px dashed ${PM.line}`, textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: PM.violet, fontStyle: 'italic' }}>Coming up next</div>
            <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, lineHeight: 1.5 }}>
              {body}
            </div>
          </div>
        )}
      </div>
      <TabBar active={tab} onChange={setTab}/>
    </div>
  );
}

// ─── Find a Vet ────────────────────────────────────────────

function VetFindScreen({ goto, tab, setTab, embedded = false }) {
  const [fNet, setFNet] = React.useState(true);
  const [fNew, setFNew] = React.useState(false);
  const [fRating, setFRating] = React.useState(false);
  const allVets = [
    { name: 'Forest Park Veterinary',        rating: 4.9, dist: '1.2 mi', dr: 'Dr. Patel',   hrs: 'Mon–Sat 8a–7p', next: 'Tomorrow 9:30am', accent: PM.coral,  network: true,  accepting: true },
    { name: 'Pearl District Animal Hospital',rating: 4.7, dist: '2.8 mi', dr: 'Dr. Nguyen',  hrs: 'Mon–Fri 7a–6p', next: 'Fri 2:15pm',     accent: PM.violet, network: true,  accepting: false },
    { name: 'Rose City Pet Care',            rating: 4.8, dist: '3.5 mi', dr: 'Dr. Alvarez', hrs: 'Daily 9a–9p',   next: 'Today 6:00pm',   accent: PM.gold,   network: false, accepting: true },
    { name: 'Hawthorne Vet Clinic',          rating: 4.6, dist: '4.1 mi', dr: 'Dr. Chen',    hrs: 'Tue–Sun 10a–8p',next: 'Mon 11:00am',    accent: PM.violet, network: true,  accepting: true },
    { name: 'Sellwood Animal Care',          rating: 4.3, dist: '5.0 mi', dr: 'Dr. Brooks',  hrs: 'Mon–Fri 9a–5p', next: 'Wed 3:30pm',     accent: PM.gold,   network: false, accepting: false },
  ];
  const vets = allVets
    .filter(v => !fNet || v.network)
    .filter(v => !fNew || v.accepting)
    .filter(v => !fRating || v.rating >= 4.5)
    .map(v => ({ ...v, tags: [v.network ? 'In-network' : 'Out-of-net', v.accepting ? 'New pts' : 'Waitlist'] }));
  const Outer = embedded ? React.Fragment : 'div';
  const outerProps = embedded ? {} : { style: { position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' } };
  return (
    <Outer {...outerProps}>
      {!embedded && <TopBar title="Find a vet" large subtitle="In-network clinics unlock your Lemonade discount"/>}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <Chip selected>📍 Portland · 10 mi</Chip>
          <Chip selected={fNet} onClick={() => setFNet(v => !v)}>In-network</Chip>
          <Chip selected={fNew} onClick={() => setFNew(v => !v)}>Accepting new</Chip>
          <Chip selected={fRating} onClick={() => setFRating(v => !v)}>4★+</Chip>
        </div>
      </div>

      {/* Stylized SVG map — branded, no third-party iframe */}
      <div style={{ padding: '14px 20px 8px' }}>
        <VetMapCard vets={vets}/>
      </div>

      <div style={{ padding: '14px 20px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft }}>{vets.length} vet{vets.length === 1 ? '' : 's'} match</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 600 }}>Closest ⌄</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: embedded ? '0 20px 24px' : '0 20px 110px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {vets.map((v, i) => <VetRow key={i} {...v} onClick={() => goto('vetDetail', { vet: v })}/>)}
      </div>
      {!embedded && <TabBar active={tab} onChange={setTab}/>}
    </Outer>
  );
}

// P1 #9: stylized SVG map card — replaces the third-party iframe.
// Positions are approximate, branded, and stable across renders.
function VetMapCard({ vets }) {
  // user pin in the center
  const me = { x: 150, y: 130 };
  // fixed pin positions (one per vet, in canvas coords)
  const slots = [
    { x: 170, y: 95 },   // 1.2 mi
    { x: 120, y: 145 },  // 2.8 mi
    { x: 195, y: 162 },  // 3.5 mi
    { x: 95,  y: 80 },   // 4.1 mi
    { x: 230, y: 90 },   // 5.0 mi
  ];
  const districts = [
    { label: 'PEARL',       x: 70,  y: 56 },
    { label: 'FOREST PARK', x: 200, y: 50 },
    { label: 'HAWTHORNE',   x: 80,  y: 200 },
    { label: 'SELLWOOD',    x: 220, y: 215 },
  ];
  const initials = (name) => name
    .split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{
      height: 220, borderRadius: 22, position: 'relative', overflow: 'hidden',
      background: '#FCF6EC',
      boxShadow: '0 4px 14px rgba(20,20,40,0.08)',
    }}>
      <svg viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice"
           style={{ width: '100%', height: '100%', display: 'block' }}>
        {/* Willamette river — soft blue ribbon down the middle */}
        <path d="M155 -10 C 145 50, 165 110, 150 160 C 140 200, 160 240, 152 260"
              stroke="#B8C6FF" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.55"/>
        <path d="M155 -10 C 145 50, 165 110, 150 160 C 140 200, 160 240, 152 260"
              stroke="#7E94FF" strokeWidth="1.4" fill="none" strokeDasharray="3 4" opacity="0.55"/>

        {/* Major streets — faint grid */}
        <g stroke="#0000001A" strokeWidth="1" fill="none">
          <path d="M0 100 L 300 110"/>
          <path d="M0 180 L 300 175"/>
          <path d="M80 0 L 75 240"/>
          <path d="M225 0 L 230 240"/>
        </g>

        {/* Park blob — Forest Park */}
        <path d="M180 25 Q 220 30, 245 55 Q 260 80, 240 100 Q 215 110, 195 95 Q 175 75, 180 25 Z"
              fill="#5BCBA133"/>

        {/* District labels */}
        {districts.map(d => (
          <text key={d.label} x={d.x} y={d.y}
                style={{ fontFamily: 'Geist Mono, monospace' }}
                fontSize="8" fill={PM.inkSoft} letterSpacing="1.5" textAnchor="middle">
            {d.label}
          </text>
        ))}

        {/* Vet dots (small black) — capped to slots */}
        {vets.slice(0, slots.length).map((v, i) => {
          const s = slots[i];
          return (
            <g key={v.name}>
              <circle cx={s.x} cy={s.y} r="6" fill={PM.night}/>
              <text x={s.x} y={s.y + 2.6}
                    style={{ fontFamily: 'Geist Mono, monospace' }}
                    fontSize="7" fill="#FFF" textAnchor="middle" fontWeight="700">
                {initials(v.name)}
              </text>
            </g>
          );
        })}

        {/* You-are-here — hot pink pin with halo */}
        <circle cx={me.x} cy={me.y} r="16" fill="#FF008322"/>
        <circle cx={me.x} cy={me.y} r="9"  fill="#FF008344"/>
        <path d={`M${me.x} ${me.y - 13} C ${me.x - 7} ${me.y - 13}, ${me.x - 9} ${me.y - 5}, ${me.x} ${me.y + 6} C ${me.x + 9} ${me.y - 5}, ${me.x + 7} ${me.y - 13}, ${me.x} ${me.y - 13} Z`}
              fill="#FF0083" stroke="#FFF" strokeWidth="1.5"/>
        <circle cx={me.x} cy={me.y - 7} r="2" fill="#FFF"/>
      </svg>

      {/* you-are-here chip */}
      <div style={{
        position: 'absolute', top: 12, left: 12,
        padding: '6px 12px', borderRadius: 14,
        background: 'rgba(255,255,255,0.95)',
        fontFamily: FONT_BODY, fontSize: 12, color: PM.night, fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 6,
        boxShadow: '0 2px 8px rgba(20,20,40,0.12)',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: '#FF0083' }}/>
        Portland, OR
      </div>

      {/* nearest vet callout */}
      {vets[0] && (
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          padding: '6px 12px', borderRadius: 14,
          background: '#FF0083', color: '#FFF',
          fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
          boxShadow: '0 4px 12px rgba(255,0,131,0.4)',
        }}>★ {vets[0].name.split(/\s+/)[0]} · {vets[0].dist}</div>
      )}
    </div>
  );
}

function VetRow({ name, rating, dist, dr, hrs, tags, next, accent, network, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', gap: 14, padding: 16, borderRadius: 22,
      background: PM.white, border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 1px 2px rgba(20,20,40,0.03), 0 6px 18px rgba(20,20,40,0.04)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 18, background: accent + '22', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="3" y="3" width="22" height="22" rx="5" stroke={accent} strokeWidth="2" fill={accent + '33'}/>
          <path d="M14 9 L 14 19 M 9 14 L 19 14" stroke={accent} strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, color: PM.night, letterSpacing: -0.2, lineHeight: 1.1 }}>{name}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: '#E8A700', fontWeight: 700 }}>★ {rating}</div>
        </div>
        <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
          <strong style={{ color: PM.night }}>{dist}</strong> · {dr} · {hrs}
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {tags.map(t => (
            <span key={t} style={{
              padding: '3px 8px', borderRadius: 8,
              background: network ? PM.mint + '22' : PM.line,
              color: network ? PM.mint : PM.inkSoft,
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.3, fontWeight: 600, textTransform: 'uppercase',
            }}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
          Next: <strong style={{ color: PM.night }}>{next}</strong>
        </div>
      </div>
    </button>
  );
}

// ─── Vet Detail + booking (compact) ────────────────────────

function VetDetailScreen({ goto, onBack, params }) {
  const [time, setTime] = React.useState('9:30a');
  const [reason, setReason] = React.useState('Wellness');
  const times = ['8:30a', '9:30a', '11:00a', '1:15p', '3:00p', '4:45p'];
  const reasons = ['Wellness', 'Vaccines', 'Spay/neuter', 'Dental'];
  const days = ['12','13','14','15','16','17','18'];
  const sel = '16';

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: `linear-gradient(135deg, ${PM.night} 0%, #2B2E66 100%)`,
        paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20, position: 'relative', overflow: 'hidden',
      }}>
        <StarField count={30} color={PM.cream} opacity={0.4} seed={5}/>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13"><path d="M8 1 L 3 6.5 L 8 12" stroke={PM.cream} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coralSoft, letterSpacing: 1.5, textTransform: 'uppercase' }}>In-network · 1.2 mi</div>
        </div>
        <h1 style={{ margin: '14px 0 4px', fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 400, color: PM.cream, letterSpacing: -0.6, lineHeight: 1, position: 'relative' }}>
          Forest Park<br/><em style={{ color: PM.coral }}>Veterinary</em>
        </h1>
        <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontSize: 12, color: 'rgba(252,246,236,0.65)', position: 'relative' }}>
          ★ 4.9 (214) · Dr. Patel · Mon–Sat 8a–7p
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 24px' }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, fontWeight: 600, marginBottom: 10 }}>Visit reason</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {reasons.map(r => <Chip key={r} selected={reason===r} onClick={() => setReason(r)}>{r}</Chip>)}
        </div>

        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, fontWeight: 600, marginBottom: 10 }}>Select day · Apr 2026</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {days.map(d => (
            <button key={d} onClick={() => {}} style={{
              flex: 1, padding: '10px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: d===sel ? PM.night : PM.white, color: d===sel ? PM.cream : PM.ink,
              fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              boxShadow: d===sel ? `0 6px 18px ${PM.night}33` : '0 1px 2px rgba(20,20,40,0.03)',
            }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 9, opacity: 0.6, letterSpacing: 0.5 }}>{['S','M','T','W','T','F','S'][parseInt(d)%7]}</span>
              {d}
            </button>
          ))}
        </div>

        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, fontWeight: 600, marginBottom: 10 }}>Select time</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
          {times.map(t => (
            <button key={t} onClick={() => setTime(t)} style={{
              height: 44, borderRadius: 14, border: t===time ? 'none' : `1.5px solid ${PM.line}`, cursor: 'pointer',
              background: t===time ? PM.coral : PM.white, color: t===time ? PM.cream : PM.ink,
              fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
            }}>{t}</button>
          ))}
        </div>

        <div style={{
          padding: 14, borderRadius: 18, background: PM.night, color: PM.cream,
          marginBottom: 20,
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coralSoft, letterSpacing: 1, textTransform: 'uppercase' }}>Your appointment</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, marginTop: 4 }}>Wed Apr 16 · {time}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, opacity: 0.7, marginTop: 4 }}>With Dr. Patel · in-network copay <strong style={{ color: PM.coralSoft }}>$25</strong></div>
        </div>

        <PMButton onClick={() => goto('insurance')} variant="primary">Continue to insurance →</PMButton>
      </div>
    </div>
  );
}

// ─── Insurance plans (Lemonade-inspired but ORIGINAL design) ───

function InsuranceScreen({ goto, onBack, embedded = false }) {
  const [plan, setPlan] = React.useState(window.__pmPlan || 'plus');
  const plans = [
    { id: 'base', name: 'Base',     price: 44.27, tag: null, items: { 'Diagnostics': true, 'Procedures': true, 'Medication': true, 'Vet visit fees': false, 'Dental illness': false, 'Behavioral': false } },
    { id: 'plus', name: 'Plus',     price: 67.74, tag: 'Popular', items: { 'Diagnostics': true, 'Procedures': true, 'Medication': true, 'Vet visit fees': true, 'Dental illness': true, 'Behavioral': true, 'Physical therapy': false, 'End-of-life': false } },
    { id: 'comp', name: 'Complete', price: 74.24, tag: null, items: { 'Everything in Plus': true, 'Physical therapy': true, 'End-of-life': true } },
  ];
  const choose = (id) => { setPlan(id); window.__pmPlan = id; };
  const Outer = embedded ? React.Fragment : 'div';
  const outerProps = embedded ? {} : { style: { position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' } };
  return (
    <Outer {...outerProps}>
      {!embedded && <TopBar title="Insurance" onBack={onBack} right={<div style={{
        fontFamily: FONT_MONO, fontSize: 10, color: PM.coral, letterSpacing: 1, textTransform: 'uppercase',
      }}>Lemonade</div>}/>}
      <div style={{ flex: 1, overflow: 'auto', padding: embedded ? '0 20px 24px' : '4px 20px 24px' }}>
        <h1 style={{
          margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 400,
          color: PM.night, letterSpacing: -0.6, lineHeight: 1.05,
        }}>
          Pick a <em style={{ color: PM.coral }}>plan</em> that fits<br/>you and Poppy.
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginBottom: 20 }}>
          Prices for Poppy · Mixed · 2y · ZIP 97209
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {plans.map(p => (
            <PlanCard key={p.id} {...p} selected={plan===p.id} onClick={() => choose(p.id)}/>
          ))}
        </div>

        <div style={{
          marginTop: 18, padding: 14, borderRadius: 18, background: `${PM.gold}22`,
          fontFamily: FONT_BODY, fontSize: 12, color: PM.ink, lineHeight: 1.5,
          borderLeft: `3px solid ${PM.gold}`,
        }}>
          <strong>Good to know:</strong> Pre-existing conditions are excluded — enroll before the first visit. Enroll today and Poppy's first vet visit is covered.
        </div>

        <div style={{ marginTop: 18 }}>
          <PMButton variant="primary" onClick={() => { window.__pmPlan = plan; goto('checkout'); }}>Continue with {plans.find(x => x.id === plan).name} →</PMButton>
        </div>
      </div>
    </Outer>
  );
}

function PlanCard({ id, name, price, tag, items, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: 18, borderRadius: 24, textAlign: 'left', cursor: 'pointer',
      background: selected ? PM.night : PM.white, color: selected ? PM.cream : PM.ink,
      border: 'none', position: 'relative',
      boxShadow: selected ? `0 12px 30px ${PM.night}33` : '0 1px 3px rgba(20,20,40,0.04), 0 8px 24px rgba(20,20,40,0.04)',
      transition: 'all 0.2s',
    }}>
      {tag && <div style={{
        position: 'absolute', top: -10, left: 18,
        padding: '4px 10px', background: PM.coral, color: PM.cream,
        borderRadius: 10, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600,
      }}>{tag}</div>}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, letterSpacing: -0.4 }}>{name}</div>
        <div>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontStyle: 'italic', color: selected ? PM.coral : PM.coral }}>${price}</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 12, opacity: 0.6, marginLeft: 2 }}>/mo</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Object.entries(items).map(([label, ok]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT_BODY, fontSize: 13, opacity: ok ? 1 : 0.4 }}>
            <span style={{
              width: 16, height: 16, borderRadius: 8, flexShrink: 0,
              background: ok ? (selected ? PM.mint : PM.mint) : 'transparent',
              border: ok ? 'none' : `1.5px solid ${selected ? 'rgba(252,246,236,0.3)' : PM.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{ok && <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1 5 L 3.5 7 L 8 1.5" stroke={PM.cream} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span>
            {label}
          </div>
        ))}
      </div>
    </button>
  );
}

// ─── Pet care wrapper · 3 sub-tabs (Insurance / Find a vet / Claims) ─

// Mock claims copied from the vet side, filtered to Sarah Chen's view.
// Poppy's claim has been pushed straight to the Payout / Approved stage so
// the demo can highlight the "money landed" moment instead of the wait.
const ADOPTER_CLAIMS = [
  {
    id: 'LEM-2026-04-16-001', petName: 'Poppy',
    provider: 'Lemonade Pet · Plus', amount: 265.00, copay: 25.00, payout: 240.00,
    visit: 'Wed Apr 16, 2026 · Wellness · Forest Park Veterinary',
    submittedAge: 'Earlier today', status: 'Approved',
    items: [
      { label: 'Wellness exam · Dr. Patel',  charge: 95.00 },
      { label: 'New-patient intake',          charge: 35.00 },
      { label: 'DHPP booster · 1 ml SQ',      charge: 45.00 },
      { label: 'Bordetella intranasal',       charge: 30.00 },
      { label: 'Heartworm/parasite screen (4Dx)', charge: 60.00 },
    ],
    timeline: [
      { label: 'Submitted by Dr. Patel', when: '2h ago',          done: true },
      { label: 'Under review',           when: '1h ago',          done: true },
      { label: 'Payout',                 when: '$240.00 paid',    done: true },
    ],
  },
];

// Extra fee owed by the adopter for the most-recent vet visit. From the SOAP
// charges minus what the insurance plan covers — keeping it as window state
// so "Pay now" can clear it from anywhere.
function useExtraFee() {
  const [paid, setPaid] = React.useState(!!window.__pmExtraFeePaid);
  React.useEffect(() => {
    const h = () => setPaid(!!window.__pmExtraFeePaid);
    window.addEventListener('pm-extra-fee-changed', h);
    return () => window.removeEventListener('pm-extra-fee-changed', h);
  }, []);
  const amount = 25.00;
  const owed = paid ? 0 : amount;
  const markPaid = () => {
    window.__pmExtraFeePaid = true;
    window.dispatchEvent(new CustomEvent('pm-extra-fee-changed'));
  };
  return { amount, owed, markPaid, paid };
}

function PetCareScreen({ goto, tab, setTab }) {
  const [sub, setSub] = React.useState('findVet');   // 'insurance' | 'findVet' | 'claims'
  const [notifOpen, setNotifOpen] = React.useState(false);
  const fee = useExtraFee();

  const subTabs = [
    ['insurance', 'Insurance'],
    ['findVet',   'Find a vet'],
    ['claims',    'Claims'],
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ paddingTop: 58, paddingLeft: 20, paddingRight: 20, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 400, letterSpacing: -0.5, color: PM.night }}>
              Pet care
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginTop: 2 }}>
              Insurance, vets & claims — all in one tab
            </div>
          </div>
          {/* Notification bell */}
          <button onClick={() => setNotifOpen(true)} style={{
            position: 'relative',
            width: 42, height: 42, borderRadius: 21, background: PM.white,
            border: `1.5px solid ${PM.line}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 8 Q 4 3.5, 9 3.5 Q 14 3.5, 14 8 L 14 11 L 16 13 L 2 13 L 4 11 Z"
                    stroke={PM.night} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
              <path d="M7 15 Q 7 17, 9 17 Q 11 17, 11 15" stroke={PM.night} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            </svg>
            {fee.owed > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderRadius: 5,
                background: PM.coral, border: `2px solid ${PM.white}`,
              }}/>
            )}
          </button>
        </div>

        {/* Sub-tab segmented control */}
        <div style={{ display: 'flex', gap: 6, padding: 4, background: PM.white, borderRadius: 16, border: `1px solid ${PM.line}` }}>
          {subTabs.map(([k, l]) => (
            <button key={k} onClick={() => setSub(k)} style={{
              flex: 1, height: 34, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: sub === k ? PM.night : 'transparent',
              color:      sub === k ? PM.cream : PM.inkSoft,
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
        {sub === 'insurance' && <InsuranceScreen embedded goto={goto}/>}
        {sub === 'findVet'   && <VetFindScreen   embedded goto={goto}/>}
        {sub === 'claims'    && <AdopterClaimsList claims={ADOPTER_CLAIMS}/>}
      </div>

      <TabBar active={tab} onChange={setTab}/>

      {notifOpen && <ExtraFeeDrawer fee={fee} onClose={() => setNotifOpen(false)}/>}
    </div>
  );
}

function AdopterClaimsList({ claims }) {
  const fee = useExtraFee();
  const badgeStyle = (status) => ({
    Draft:    { bg: '#FFF1D6', fg: '#9A6A00' },
    Pending:  { bg: '#D6E8FF', fg: '#0034FF' },
    Approved: { bg: '#E6F8EF', fg: '#1E8A5A' },
    Denied:   { bg: '#FFE0E6', fg: '#B5103E' },
  }[status] || { bg: '#FFF1D6', fg: '#9A6A00' });
  if (!claims || claims.length === 0) {
    return (
      <EmptyState
        title="No claims yet"
        sub="Your vet will submit a claim to Lemonade after each in-network visit. They'll show up here."
      />
    );
  }
  return (
    <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase', margin: '4px 4px 2px' }}>
        Submitted by your vets
      </div>
      {claims.map(c => {
        const b = badgeStyle(c.status);
        const owedNow = fee.paid ? 0 : c.copay;
        return (
          <div key={c.id} style={{
            padding: 16, borderRadius: 20, background: PM.white,
            boxShadow: '0 1px 2px rgba(20,20,40,0.03), 0 6px 18px rgba(20,20,40,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: PM.night, letterSpacing: -0.3, lineHeight: 1.1 }}>
                {c.petName}
                <span style={{ marginLeft: 8, fontFamily: FONT_MONO, fontSize: 11, color: PM.inkFaint, fontStyle: 'normal', fontWeight: 400, letterSpacing: 0.4 }}>{c.id}</span>
              </div>
              <span style={{
                padding: '3px 8px', borderRadius: 8, background: b.bg, color: b.fg,
                fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700,
              }}>{c.status}</span>
            </div>
            <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>{c.visit}</div>
            <div style={{ marginTop: 2, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>{c.provider} · submitted {c.submittedAge}</div>

            {/* Itemized line items */}
            {c.items && c.items.length > 0 && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${PM.lineSoft}` }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
                  Itemized charges
                </div>
                {c.items.map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink }}>{it.label}</span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: PM.ink, fontWeight: 600 }}>${it.charge.toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px dashed ${PM.line}`, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, fontWeight: 600 }}>Subtotal</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: PM.ink, fontWeight: 700 }}>${c.amount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.coral, fontWeight: 600 }}>{c.provider.split('·')[0].trim()} coverage</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: PM.coral, fontWeight: 700 }}>−${c.payout.toFixed(2)}</span>
                </div>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1.5px solid ${PM.night}`,
                              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: PM.night }}>You owe</span>
                  {owedNow > 0 ? (
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.coral, fontStyle: 'italic' }}>${c.copay.toFixed(2)}</span>
                  ) : (
                    <span style={{
                      padding: '4px 10px', borderRadius: 12,
                      background: '#E6F8EF', color: '#1E8A5A',
                      fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
                    }}>Paid ✓</span>
                  )}
                </div>
              </div>
            )}

            {/* Pay-now lives directly on the card so users can act without
                opening the bell drawer. Hidden once the copay is settled. */}
            {owedNow > 0 && (
              <button onClick={fee.markPaid} style={{
                marginTop: 12, width: '100%', height: 44, borderRadius: 22,
                background: PM.coral, color: '#FFF', border: 'none', cursor: 'pointer',
                fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600,
                boxShadow: '0 4px 12px rgba(255,0,131,0.32)',
              }}>Pay ${c.copay.toFixed(2)} now</button>
            )}

            {/* Status timeline */}
            {c.timeline && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${PM.lineSoft}` }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                  Status
                </div>
                {c.timeline.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: 8,
                      background: s.done ? PM.mint : 'transparent',
                      border: s.done ? 'none' : `1.5px solid ${PM.line}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {s.done && <svg width="8" height="8" viewBox="0 0 9 9"><path d="M1 5 L 3.5 7 L 8 1.5" stroke="#FFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </span>
                    <span style={{ flex: 1, fontFamily: FONT_BODY, fontSize: 12, color: s.done ? PM.ink : PM.inkSoft }}>{s.label}</span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.3 }}>{s.when}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExtraFeeDrawer({ fee, onClose }) {
  const [confirming, setConfirming] = React.useState(false);
  const pay = () => {
    setConfirming(true);
    setTimeout(() => { fee.markPaid(); setTimeout(onClose, 700); }, 700);
  };
  if (fee.owed === 0 && !confirming) {
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(20,20,40,0.45)',
        display: 'flex', alignItems: 'flex-end',
      }}>
        <div style={{ width: '100%', background: PM.cream, borderRadius: '28px 28px 0 0', padding: '32px 22px 32px' }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: PM.night, letterSpacing: -0.4, marginBottom: 6 }}>
            All caught up.
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 18 }}>
            No outstanding fees from your recent vet visits.
          </div>
          <button onClick={onClose} style={{
            width: '100%', height: 50, borderRadius: 25, background: PM.night, color: '#FFF',
            border: 'none', cursor: 'pointer', fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
          }}>Close</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(20,20,40,0.45)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn 0.2s ease',
    }}>
      <style>{`
        @keyframes pm-pay-pop { 0% { transform: scale(0); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
      `}</style>
      <div style={{
        width: '100%', background: PM.cream, borderRadius: '28px 28px 0 0',
        padding: '22px 22px 32px', position: 'relative',
        animation: 'slideUp 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 40, height: 4, borderRadius: 2, background: PM.line,
        }}/>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 16,
          background: 'transparent', border: 'none', cursor: 'pointer', color: PM.inkSoft,
        }}>
          <svg width="14" height="14" viewBox="0 0 11 11"><path d="M2 2 L 9 9 M 9 2 L 2 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        <div style={{ marginTop: 14, fontFamily: FONT_MONO, fontSize: 10, color: PM.coral, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700 }}>
          Heads up — extra fee due
        </div>
        <h2 style={{
          margin: '6px 0 4px', fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 400,
          color: PM.night, letterSpacing: -0.6, lineHeight: 1.05,
        }}>
          You owe <em style={{ color: PM.coral }}>${fee.amount.toFixed(2)}</em>
        </h2>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 16 }}>
          From Poppy's wellness visit at Forest Park Veterinary, Wed Apr 16.
        </div>

        <div style={{ background: PM.white, borderRadius: 16, padding: 14, marginBottom: 14, boxShadow: '0 1px 3px rgba(20,20,40,0.04)' }}>
          {[
            ['Subtotal billed',              '$265.00'],
            ['Lemonade Plus coverage',       '−$240.00'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${PM.lineSoft}` }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink }}>{l}</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: PM.ink }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 10 }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: PM.night }}>You owe</span>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.coral, fontStyle: 'italic' }}>${fee.amount.toFixed(2)}</span>
          </div>
        </div>

        <button onClick={pay} disabled={confirming} style={{
          width: '100%', height: 54, borderRadius: 27, border: 'none', cursor: confirming ? 'default' : 'pointer',
          background: confirming ? PM.mint : PM.coral, color: '#FFF',
          fontFamily: FONT_BODY, fontSize: 16, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: confirming ? 'none' : '0 6px 18px rgba(255,0,131,0.4)',
          transition: 'background 0.25s',
        }}>
          {confirming ? (
            <span style={{
              width: 30, height: 30, borderRadius: 15, background: '#FFF', color: PM.mint,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pm-pay-pop 0.36s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}>
              <svg width="16" height="16" viewBox="0 0 18 18"><path d="M3 9 L 7.5 13 L 15 5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            </span>
          ) : `Pay $${fee.amount.toFixed(2)}`}
        </button>
        <button onClick={onClose} style={{
          width: '100%', marginTop: 10, height: 36, background: 'transparent', color: PM.inkSoft,
          border: 'none', fontFamily: FONT_BODY, fontSize: 13, cursor: 'pointer',
        }}>Not now</button>
      </div>
    </div>
  );
}

// ─── Insurance Welcome · post-checkout celebration ─────────

function InsuranceWelcomeScreen({ onContinue }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`
        @keyframes pm-welcome-confetti {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translateY(640px) rotate(540deg); opacity: 0; }
        }
        @keyframes pm-welcome-ribbon {
          0%, 100% { transform: rotate(-6deg); }
          50%      { transform: rotate(6deg); }
        }
        @keyframes pm-welcome-pop {
          0%   { transform: scale(0.6); opacity: 0; }
          60%  { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pm-wel-confetti { position: absolute; top: 0; font-size: 14px;
          animation: pm-welcome-confetti 3.2s ease-in infinite; }
      `}</style>

      {/* Confetti overlay covering the whole screen */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[
          { l: '8%',  d: '0s',   c: '#FF0083' },
          { l: '22%', d: '0.5s', c: '#FFD400' },
          { l: '34%', d: '1.1s', c: '#0034FF' },
          { l: '46%', d: '0.3s', c: '#00C46A' },
          { l: '58%', d: '0.9s', c: '#FF0083' },
          { l: '70%', d: '0.2s', c: '#FFD400' },
          { l: '82%', d: '1.4s', c: '#0034FF' },
          { l: '92%', d: '0.7s', c: '#00C46A' },
        ].map((p, i) => (
          <span key={i} className="pm-wel-confetti"
            style={{ left: p.l, color: p.c, animationDelay: p.d }}>
            {i % 3 === 0 ? '✦' : i % 3 === 1 ? '♥' : '◆'}
          </span>
        ))}
      </div>

      <div style={{ flex: 1, padding: '60px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
        {/* Hero illustration — same splash image, smaller */}
        <div style={{
          width: 200, height: 200, borderRadius: 100, overflow: 'hidden',
          background: '#FFF', boxShadow: '0 12px 36px rgba(255,0,131,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pm-welcome-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          marginBottom: 8,
        }}>
          <img src={window.__PAWMATCH_SPLASH_HERO__ || 'assets/splash-hero.jpg'}
            alt="" style={{ width: '105%', height: '105%', objectFit: 'cover', objectPosition: 'center 18%' }}/>
        </div>

        {/* Ribbon banner */}
        <div style={{
          position: 'relative', marginTop: -14, marginBottom: 14,
          padding: '8px 22px',
          background: PM.coral, color: '#FFF',
          borderRadius: 6,
          fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase',
          boxShadow: '0 6px 18px rgba(255,0,131,0.35)',
          animation: 'pm-welcome-ribbon 3.6s ease-in-out infinite',
          transformOrigin: 'center',
        }}>
          <span style={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%) rotate(45deg)', width: 12, height: 12, background: PM.coral }}/>
          <span style={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%) rotate(45deg)', width: 12, height: 12, background: PM.coral }}/>
          Welcome aboard
        </div>

        <h1 style={{
          margin: '6px 0 10px', fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400,
          color: PM.night, letterSpacing: -0.8, lineHeight: 1.02,
          animation: 'pm-welcome-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both',
        }}>
          Welcome to the<br/>
          <em style={{ color: PM.coral }}>Lemonade family</em>.
        </h1>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft, lineHeight: 1.5,
          maxWidth: 300, marginBottom: 22,
        }}>
          Poppy is now covered by Lemonade Plus. Your policy details and welcome packet are on the way to <strong style={{ color: PM.night }}>sarah@example.com</strong>.
        </div>

        <div style={{
          width: '100%', padding: 16, borderRadius: 20, background: PM.white,
          boxShadow: '0 4px 14px rgba(20,20,40,0.06)', marginBottom: 18,
          animation: 'pm-welcome-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both',
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.violet, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
            Your plan at a glance
          </div>
          {[
            ['Policy holder', 'Sarah Chen'],
            ['Pet covered',   'Poppy · Golden Retriever Mix'],
            ['Plan',          'Lemonade Plus · $67.74/mo'],
            ['Annual savings','≈ $420 vs. self-pay'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>{k}</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${PM.lineSoft}`, background: PM.cream }}>
        <PMButton variant="coral" onClick={onContinue}>Continue →</PMButton>
      </div>
    </div>
  );
}

// ─── Checkout ──────────────────────────────────────────────

function CheckoutScreen({ onBack, goto }) {
  const planId = window.__pmPlan || 'plus';
  const planMeta = {
    base: { name: 'Base',     coverage: 90,  monthly: 44.27 },
    plus: { name: 'Plus',     coverage: 150, monthly: 67.74 },
    comp: { name: 'Complete', coverage: 170, monthly: 74.24 },
  }[planId];
  // Adoption pet — defaults to Poppy (the demo pet) but pulls live data from FEED
  const feed = (typeof FEED !== 'undefined' && FEED) || [];
  const adoptionPet = feed.find(p => p.key === (window.__pmAdoptionPet || 'poppy')) ||
                      feed[0] || { name: 'Poppy', shelter: 'Willow Creek', fee: 250 };
  const items = [
    { label: 'Wellness exam',      amt: 95 },
    { label: 'New-patient intake', amt: 35 },
    { label: 'DHPP booster',       amt: 45 },
  ];
  const subtotal = items.reduce((a, b) => a + b.amt, 0);
  const copay = (subtotal - planMeta.coverage).toFixed(2);
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Checkout" onBack={onBack} right={<div style={{ fontFamily: FONT_MONO, fontSize: 11, color: PM.inkSoft, letterSpacing: 0.5 }}>3/3</div>}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 24px' }}>
        <h1 style={{ margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 34, fontWeight: 400, color: PM.night, letterSpacing: -0.7 }}>
          Confirm & <em style={{ color: PM.coral }}>pay</em>.
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 18 }}>
          Your card won't be charged until after the visit. <strong style={{ color: PM.coral }}>{planMeta.name} plan</strong> · ${planMeta.monthly}/mo
        </div>

        <div style={{ padding: 18, borderRadius: 22, background: PM.white, marginBottom: 12 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.violet, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Appointment</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.night, letterSpacing: -0.3 }}>Wed Apr 16 · 9:30 AM</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginTop: 2 }}>Forest Park Veterinary · Dr. Patel · for {adoptionPet.name} 🐕</div>
        </div>

        <div style={{ padding: 18, borderRadius: 22, background: PM.white, marginBottom: 12 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coral, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Adoption</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.night, letterSpacing: -0.3, lineHeight: 1 }}>{adoptionPet.name}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginTop: 4 }}>
                Adoption fee · {adoptionPet.shelter}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: PM.inkFaint, marginTop: 2 }}>
                Paid to shelter at pickup, not on this card.
              </div>
            </div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 30, fontStyle: 'italic', color: PM.coral,
              letterSpacing: -0.4, lineHeight: 1,
            }}>${adoptionPet.fee}</div>
          </div>
        </div>

        <div style={{ padding: 18, borderRadius: 22, background: PM.white, marginBottom: 12 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.violet, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Payment method</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Chip selected>💳 Card ····4242</Chip>
            <Chip> Apple Pay</Chip>
          </div>
          <div style={{ height: 1, background: PM.line, margin: '4px 0 12px' }}/>
          {items.map(it => (
            <div key={it.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink }}>{it.label}</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: PM.ink }}>${it.amt.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderTop: `1px dashed ${PM.line}`, marginTop: 6 }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.coral, fontWeight: 600 }}>Lemonade {planMeta.name} coverage</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: PM.coral, fontWeight: 600 }}>−${planMeta.coverage.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 4px', borderTop: `1.5px solid ${PM.night}`, marginTop: 10 }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.night }}>Copay at visit</span>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: PM.coral, fontStyle: 'italic' }}>${copay}</span>
          </div>
        </div>

        <PMButton variant="primary" onClick={() => goto('insuranceWelcome')}>Confirm · ${copay}</PMButton>
      </div>
    </div>
  );
}

// ─── Upload form ───────────────────────────────────────────

function UploadFormScreen({ goto, onBack }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Upload form" onBack={onBack}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 24px' }}>
        <h1 style={{ margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 400, color: PM.night, letterSpacing: -0.5, lineHeight: 1.1 }}>
          Upload your signed<br/><em style={{ color: PM.coral }}>adoption form</em>.
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 20 }}>
          Take a photo from Willow Creek. Lemonade AI verifies in seconds.
        </div>

        <div style={{
          padding: 28, borderRadius: 24, background: PM.white,
          border: `2px dashed ${PM.line}`, textAlign: 'center', marginBottom: 14,
        }}>
          <div style={{ width: 60, height: 60, margin: '0 auto', borderRadius: 30, background: PM.coral, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="22" viewBox="0 0 26 22" fill="none"><path d="M2 6 Q 2 4, 4 4 L 7 4 L 9 1 L 17 1 L 19 4 L 22 4 Q 24 4, 24 6 L 24 19 Q 24 21, 22 21 L 4 21 Q 2 21, 2 19 Z" stroke={PM.cream} strokeWidth="2" fill="none" strokeLinejoin="round"/><circle cx="13" cy="12" r="4.5" stroke={PM.cream} strokeWidth="2" fill="none"/></svg>
          </div>
          <div style={{ marginTop: 14, fontFamily: FONT_BODY, fontSize: 15, color: PM.night, fontWeight: 600 }}>Take a photo or choose from gallery</div>
          <div style={{ marginTop: 4, fontFamily: FONT_MONO, fontSize: 11, color: PM.inkFaint, letterSpacing: 0.4 }}>JPG · PNG · PDF · max 10 MB</div>
        </div>

        <div style={{ padding: 14, borderRadius: 18, background: PM.white, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 50, borderRadius: 6, background: PM.creamDark, border: `1px solid ${PM.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="22" viewBox="0 0 20 22"><path d="M2 1 L 12 1 L 18 7 L 18 21 L 2 21 Z" stroke={PM.night} strokeWidth="1.5" fill="none"/><path d="M12 1 L 12 7 L 18 7" stroke={PM.night} strokeWidth="1.5" fill="none"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 600 }}>adoption-form-poppy.jpg</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: PM.inkSoft, marginTop: 2 }}>2.4 MB</div>
          </div>
        </div>

        <div style={{ padding: 18, borderRadius: 22, background: PM.night, color: PM.cream, marginBottom: 18 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coralSoft, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Validating with AI</div>
          {[
            ['✓', 'Shelter registered on PawMatch', PM.mint],
            ['✓', "Form matches Willow Creek's template", PM.mint],
            ['⟳', 'Record found (Poppy → Sarah Chen)', PM.gold],
          ].map(([icon, label, color], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
              <span style={{
                width: 20, height: 20, borderRadius: 10, background: color, color: PM.cream,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700,
              }}>{icon}</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13 }}>{label}</span>
            </div>
          ))}
        </div>

        <PMButton variant="coral" onClick={() => goto('formVerified')}>Submit for verification →</PMButton>
      </div>
    </div>
  );
}

// ─── Form Verified ─────────────────────────────────────────

function FormVerifiedScreen({ goto, onBack }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.night, color: PM.cream, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <StarField count={50} color={PM.cream} opacity={0.5} seed={2}/>
      <TopBar title="Form verified" dark onBack={onBack}/>
      <div style={{ flex: 1, padding: '20px 20px 24px', display: 'flex', flexDirection: 'column' }}>
        {/* halo */}
        <div style={{ position: 'relative', textAlign: 'center', marginTop: 30, marginBottom: 28 }}>
          <div style={{
            width: 140, height: 140, borderRadius: 70, margin: '0 auto', position: 'relative',
            background: `radial-gradient(circle, ${PM.coral} 0%, #C04030 80%)`,
            boxShadow: `0 0 80px ${PM.coral}88`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="60" height="60" viewBox="0 0 60 60"><path d="M14 30 L 26 42 L 46 18" stroke={PM.cream} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <svg width="200" height="60" viewBox="0 0 200 60" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)' }}>
              <ellipse cx="100" cy="30" rx="95" ry="14" stroke={PM.gold} strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <StarBurst size={14} color={PM.gold} style={{ position: 'absolute', top: 0, left: '32%' }}/>
          <StarBurst size={10} color={PM.gold} style={{ position: 'absolute', top: 30, right: '28%' }}/>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: PM.coralSoft, letterSpacing: 1.5, textTransform: 'uppercase' }}>Lemonade AI confirmed</div>
          <h1 style={{ margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 400, color: PM.cream, letterSpacing: -0.8, lineHeight: 1 }}>
            <em>Form</em> verified!
          </h1>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: 'rgba(252,246,236,0.65)', maxWidth: 280, margin: '0 auto', lineHeight: 1.5 }}>
            Your adoption form from Willow Creek Rescue is on file.
          </div>
        </div>

        <div style={{ marginTop: 28, padding: 18, borderRadius: 22, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
          {['Shelter registered','Template match','Record found'].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
              <span style={{ width: 20, height: 20, borderRadius: 10, background: PM.mint, color: PM.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700 }}>✓</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 14 }}>{l}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, padding: 18, borderRadius: 22, background: PM.coral, color: PM.cream, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontStyle: 'italic', lineHeight: 0.9 }}>🎉</div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, letterSpacing: -0.2 }}>$420/year unlocked</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, opacity: 0.85, marginTop: 2 }}>Use any in-network vet to save on every visit.</div>
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PMButton variant="cream" onClick={() => goto('vetFind')}>Select an in-network vet →</PMButton>
          <PMButton variant="ghost" size="md" onClick={onBack} style={{ color: 'rgba(252,246,236,0.6)' }}>I'll do this later</PMButton>
        </div>
      </div>
    </div>
  );
}

// ─── Profile ─── constructivist redesign

function ProfileScreen({ goto, tab, setTab, matchCount }) {
  const HOT_PINK = '#FF0083';
  const SOFT_PINK = '#FFF1F7';
  const count = typeof matchCount === 'number' ? matchCount : 3;
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>

      {/* HEADER — clean */}
      <div style={{ paddingTop: 58, paddingLeft: 20, paddingRight: 20, paddingBottom: 8, background: PM.cream }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 400, letterSpacing: -0.5, color: PM.night }}>
              Profile
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginTop: 2 }}>
              Your info & saved data
            </div>
          </div>
          <button style={{
            width: 40, height: 40, borderRadius: 20, background: PM.white,
            border: `1.5px solid ${PM.line}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="3" r="1.4" fill={PM.night}/><circle cx="8" cy="8" r="1.4" fill={PM.night}/><circle cx="8" cy="13" r="1.4" fill={PM.night}/></svg>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 110px' }}>

        {/* HERO CARD — soft pink gradient with friendly illustration */}
        <div style={{
          background: `linear-gradient(160deg, ${SOFT_PINK} 0%, #FFE4F0 100%)`,
          borderRadius: 24,
          padding: 20, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: HOT_PINK, color: '#FFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400,
            flexShrink: 0,
            boxShadow: '0 6px 16px rgba(255,0,131,0.35)',
          }}>SC</div>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 400, letterSpacing: -0.4,
              lineHeight: 1.05, color: PM.night,
            }}>Sarah Chen</div>
            <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
              Member since March 2026
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 8, padding: '3px 10px', borderRadius: 11,
              background: '#FFF', color: HOT_PINK,
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
            }}>
              ♥ {count} {count === 1 ? 'match' : 'matches'}
            </div>
          </div>
        </div>

        <ProfileGroup title="Upcoming appointments" defaultOpen={true}>
          <AppointmentsList/>
        </ProfileGroup>

        <ProfileGroup title="Personal info">
          <ProfileRow label="Name" value="Sarah Chen"/>
          <ProfileRow label="Phone" value="(503) 555-0143"/>
          <ProfileRow label="Location" value="Portland, OR"/>
        </ProfileGroup>

        <ProfileGroup title="Household">
          <ProfileRow label="Type" value="Family w/ kids"/>
          <ProfileRow label="Adults / Kids" value="2 / 2 (7, 10)"/>
          <ProfileRow label="Housing" value="Own · fenced yard"/>
        </ProfileGroup>

        <ProfileGroup title="Reused form data" hint="reused across applications">
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Vet reference', 'Daily routine', 'Household details', 'Housing info', 'Pet history'].map(l => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONT_BODY, fontSize: 13, color: PM.ink }}>
                <span style={{ width: 18, height: 18, background: PM.night, color: PM.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: FONT_DISPLAY }}>✓</span>
                {l}
              </div>
            ))}
          </div>
        </ProfileGroup>

        <ProfileGroup title="Insurance">
          <ProfileRow label="Status" value={<span style={{ color: PM.mint, fontWeight: 700, fontFamily: FONT_DISPLAY, letterSpacing: 1, textTransform: 'uppercase', fontSize: 12 }}>● Active</span>}/>
          <ProfileRow label="Plan" value="Lemonade Plus · $67.74/mo"/>
          <ProfileRow label="Saved vet" value="Forest Park"/>
        </ProfileGroup>
      </div>
      <TabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function ProfileGroup({ title, hint, children, defaultOpen = false }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ marginBottom: 18 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 4px 8px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 600 }}>{title}</div>
          {hint && <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: PM.inkFaint }}>{hint}</div>}
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <path d="M3 5 L 7 9 L 11 5" stroke={PM.inkSoft} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{
          background: PM.white, borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(20,20,40,0.04)',
        }}>{children}</div>
      )}
    </div>
  );
}

function AppointmentsList() {
  const [appts, setAppts] = React.useState([
    { id: 1, kind: 'shelter', who: 'Willow Creek Rescue', sub: 'Meet Poppy 🐕', when: 'Sat Apr 12 · 2:00 PM', where: '1820 NW 23rd Ave' },
    { id: 2, kind: 'vet',     who: 'Forest Park Veterinary', sub: 'New-patient · Dr. Patel', when: 'Wed Apr 16 · 9:30 AM', where: '4380 SW Macadam Ave' },
    { id: 3, kind: 'shelter', who: 'Rose City Cat Rescue', sub: 'Meet Miso 🐈', when: 'Sun Apr 20 · 11:00 AM', where: '3200 SE Belmont' },
  ]);
  if (!appts.length) return (
    <div style={{ padding: 18, fontFamily: 'Geist', fontSize: 13, color: PM.inkSoft, textAlign: 'center' }}>No upcoming appointments.</div>
  );
  return (
    <div>
      {appts.map((a, i) => (
        <AppointmentRow key={a.id} appt={a} last={i === appts.length - 1}
          onCancel={() => setAppts(list => list.filter(x => x.id !== a.id))}
          onReschedule={(newWhen) => setAppts(list => list.map(x => x.id === a.id ? { ...x, when: newWhen } : x))}
        />
      ))}
    </div>
  );
}

function AppointmentRow({ appt, last, onCancel, onReschedule }) {
  const [mode, setMode] = React.useState('view'); // view | reschedule | cancelConfirm
  const slots = ['Sat Apr 19 · 2:00 PM', 'Sun Apr 20 · 11:00 AM', 'Wed Apr 23 · 5:30 PM'];
  const isVet = appt.kind === 'vet';
  const accent = isVet ? '#5B4FE5' : '#FF0083';
  return (
    <div style={{ padding: '14px 16px', borderBottom: last ? 'none' : `1px solid ${PM.lineSoft}` }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12, background: accent + '18', color: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          fontFamily: 'Geist Mono', fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
        }}>{isVet ? 'VET' : 'PET'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 17, color: PM.night, letterSpacing: -0.2, lineHeight: 1.15 }}>{appt.when}</div>
          <div style={{ marginTop: 2, fontFamily: 'Geist', fontSize: 12, color: PM.ink, fontWeight: 500 }}>{appt.who}</div>
          <div style={{ marginTop: 1, fontFamily: 'Geist', fontSize: 11, color: PM.inkSoft }}>{appt.sub} · {appt.where}</div>
        </div>
      </div>

      {mode === 'view' && (
        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <button onClick={() => setMode('reschedule')} style={btnLight()}>Reschedule</button>
          <button onClick={() => setMode('cancelConfirm')} style={btnLight({ color: PM.inkSoft })}>Cancel</button>
        </div>
      )}

      {mode === 'reschedule' && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontFamily: 'Geist Mono', fontSize: 10, color: PM.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Pick a new time</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {slots.map(s => (
              <button key={s} onClick={() => { onReschedule(s); setMode('view'); }} style={{
                padding: '8px 12px', borderRadius: 10, textAlign: 'left',
                background: PM.cream, border: `1px solid ${PM.line}`,
                fontFamily: 'Geist', fontSize: 12, color: PM.night, cursor: 'pointer', transition: 'all 0.12s',
              }}
                onMouseDown={e => { e.currentTarget.style.background = '#FF0083'; e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FF0083'; }}
              >{s}</button>
            ))}
          </div>
          <button onClick={() => setMode('view')} style={{ marginTop: 6, height: 28, padding: '0 10px', background: 'transparent', border: 'none', color: PM.inkSoft, fontFamily: 'Geist', fontSize: 11, cursor: 'pointer' }}>← back</button>
        </div>
      )}

      {mode === 'cancelConfirm' && (
        <div style={{ marginTop: 10, padding: 10, background: '#FFF1F7', borderRadius: 12 }}>
          <div style={{ fontFamily: 'Geist', fontSize: 12, color: PM.night, marginBottom: 8 }}>Cancel this appointment? You can rebook anytime.</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onCancel} style={{
              flex: 1, height: 32, borderRadius: 10, background: '#FF0083', color: '#FFF', border: 'none',
              fontFamily: 'Geist', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>Yes, cancel</button>
            <button onClick={() => setMode('view')} style={{
              flex: 1, height: 32, borderRadius: 10, background: 'transparent', color: PM.night, border: `1px solid ${PM.line}`,
              fontFamily: 'Geist', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>Keep it</button>
          </div>
        </div>
      )}
    </div>
  );
}

function btnLight(extra = {}) {
  return {
    flex: 1, height: 32, borderRadius: 10, background: 'transparent',
    border: `1px solid ${PM.line}`, color: extra.color || PM.night,
    fontFamily: 'Geist', fontSize: 12, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.12s',
    ...extra,
  };
}

function ProfileRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', borderBottom: `1px solid ${PM.lineSoft}`,
    }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft }}>{label}</span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.ink, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

Object.assign(window, {
  VetFindScreen, VetDetailScreen, InsuranceScreen, CheckoutScreen,
  UploadFormScreen, FormVerifiedScreen, ProfileScreen, StubScreen,
  PetCareScreen, AdopterClaimsList, ExtraFeeDrawer, InsuranceWelcomeScreen,
  ADOPTER_CLAIMS,
});
