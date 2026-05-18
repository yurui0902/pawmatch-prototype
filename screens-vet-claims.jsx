// screens-vet-claims.jsx — Claims index + Preview + Pending Timeline.

const CLAIM_BADGE = {
  Draft:          { bg: '#FFF1D6', fg: '#9A6A00' },
  'Vet-approved': { bg: '#FFE7CF', fg: '#8A4F00' },
  Pending:        { bg: '#D6E8FF', fg: '#0034FF' },
  Approved:       { bg: '#E6F8EF', fg: '#1E8A5A' },
  Denied:         { bg: '#FFE0E6', fg: '#B5103E' },
};

function VetClaimsScreen({ goto, tab, setTab }) {
  const filters = ['All', 'Vet-approved', 'Pending', 'Approved', 'Denied'];
  const [seg, setSeg] = React.useState('All');
  const counts = filters.reduce((a, f) => {
    a[f] = f === 'All' ? CLAIMS.length : CLAIMS.filter(c => c.status === f).length;
    return a;
  }, {});
  const list = seg === 'All' ? CLAIMS : CLAIMS.filter(c => c.status === seg);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Claims" large subtitle={`Front-desk queue · ${(CLAIMS).filter(c => c.status === 'Vet-approved').length} awaiting submission · $${CLAIMS.reduce((a, c) => a + c.payout, 0).toLocaleString()} paid YTD`}/>

      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: PM.white, borderRadius: 16, border: `1px solid ${PM.line}`, overflowX: 'auto' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setSeg(f)} style={{
              flexShrink: 0, height: 34, padding: '0 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: seg === f ? PM.night : 'transparent',
              color:      seg === f ? PM.cream : PM.inkSoft,
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
            }}>{f} · {counts[f]}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 110px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map(c => (
          <ClaimRow key={c.id} claim={c}
            onClick={() => goto(c.status === 'Pending' ? 'claimTimeline' : 'claimPreview', { id: c.id })}/>
        ))}
      </div>

      <VetTabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function ClaimRow({ claim, onClick }) {
  const b = CLAIM_BADGE[claim.status] || CLAIM_BADGE.Draft;
  return (
    <button onClick={onClick} style={{
      display: 'flex', gap: 14, padding: 14, borderRadius: 18,
      background: PM.white, border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 1px 2px rgba(20,20,40,0.03), 0 6px 18px rgba(20,20,40,0.04)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 700, color: PM.night }}>
            {claim.petName}
            <span style={{ color: PM.inkFaint, fontWeight: 500 }}> · {claim.owner}</span>
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.4 }}>{claim.submittedAge}</div>
        </div>
        <div style={{ marginTop: 3, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>{claim.visit}</div>
        <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '3px 8px', borderRadius: 8,
            background: b.bg, color: b.fg,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700,
          }}>{claim.status}</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: PM.inkSoft }}>{claim.provider}</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: PM.night, fontWeight: 600, marginLeft: 'auto' }}>
            ${claim.amount.toFixed(2)}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Claim preview (draft) ─────────────────────────────────

function VetClaimPreviewScreen({ claim, onBack, goto }) {
  // Two-stage front-desk workflow.  Vet has already signed; the front desk
  // chats with the customer then submits to Lemonade.
  const [contacted, setContacted] = React.useState(!!(claim && claim.customerContacted));
  const [submitted, setSubmitted] = React.useState(false);
  if (!claim) return <div style={{ position: 'absolute', inset: 0, background: PM.cream, padding: 40 }}>Not found. <button onClick={onBack}>Back</button></div>;
  // While we're still in the front-desk hand-off, the badge reflects local
  // state instead of the seed data.
  const liveStatus = submitted ? 'Pending' : claim.status;
  const b = CLAIM_BADGE[liveStatus] || CLAIM_BADGE.Draft;
  const isVetApproved = !submitted && (claim.status === 'Vet-approved' || claim.status === 'Draft');

  // For Poppy (the demo claim) — itemized from SOAP plan
  const items = claim.petName === 'Poppy' ? (SOAP_DRAFT.plan || []) : [
    { line: claim.visit.split('·')[1] ? claim.visit.split('·')[1].trim() : 'Service', charge: claim.amount },
  ];
  const total = items.reduce((a, i) => a + i.charge, 0);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title={claim.id} onBack={onBack}
        right={<div style={{
          padding: '4px 10px', borderRadius: 11, background: b.bg, color: b.fg,
          fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700,
        }}>{liveStatus}</div>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 120px' }}>
        <h1 style={{ margin: '6px 0 4px', fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 400, color: PM.night, letterSpacing: -0.6, lineHeight: 1.05 }}>
          Claim for <em style={{ color: PM.coral }}>{claim.petName}</em>
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 14 }}>
          {claim.visit} · {claim.provider}
        </div>

        {/* Vet-signed handoff banner — front desk needs to act */}
        {isVetApproved && (
          <div style={{
            padding: 14, borderRadius: 16, marginBottom: 14,
            background: '#FFE7CF', borderLeft: `3px solid #FF9F00`,
          }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: '#8A4F00', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700 }}>
              ✓ Signed by {claim.vetSigner || CLINIC.lead} · Awaiting front desk
            </div>
            <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.5 }}>
              <strong style={{ color: PM.night }}>Front desk:</strong> confirm the visit summary with {claim.owner},
              then submit to {claim.provider.split('·')[0].trim()}.
            </div>
          </div>
        )}

        {submitted && (
          <div style={{
            padding: 14, borderRadius: 16, marginBottom: 14,
            background: '#E6F8EF', borderLeft: `3px solid ${PM.mint}`,
          }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: '#1E6B4D', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>
              ● Submitted to Lemonade
            </div>
            <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 13, color: PM.ink }}>
              Wellness claims typically pay out in 24–48 hours. Track status in <span style={{ color: PM.coral, fontWeight: 600, cursor: 'pointer' }} onClick={() => goto('claimTimeline', { id: claim.id })}>Claims</span>.
            </div>
          </div>
        )}

        {!claim.preExisting && (
          <div style={{
            padding: '10px 12px', borderRadius: 14, background: `${PM.mint}12`, borderLeft: `3px solid ${PM.mint}`,
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
            fontFamily: FONT_BODY, fontSize: 12, color: PM.ink,
          }}>
            <span style={{ width: 18, height: 18, borderRadius: 9, background: PM.mint, color: '#FFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>✓</span>
            No pre-existing condition flags on this claim.
          </div>
        )}

        <Section title="Policyholder & pet">
          <Fact label="Policyholder" value={claim.owner}/>
          <Fact label="Pet"          value={claim.petName}/>
          <Fact label="Provider"     value={claim.provider} last/>
        </Section>

        <Section title="Itemized charges">
          {items.map((it, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', padding: '8px 0',
              borderBottom: i === items.length - 1 ? 'none' : `1px solid ${PM.lineSoft}`,
            }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink }}>{it.line}</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: PM.ink, fontWeight: 600 }}>${it.charge.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1.5px solid ${PM.night}`,
            display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: PM.night }}>Total billed</span>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.night, letterSpacing: -0.3 }}>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft }}>Owner copay</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: PM.ink }}>${claim.copay.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.coral, fontWeight: 600 }}>Expected insurance payout</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: PM.coral, fontWeight: 700 }}>${claim.payout.toFixed(2)}</span>
          </div>
        </Section>

        <Section title="Signatures">
          <SigRow label="Policyholder" name={claim.owner}/>
          <SigRow label="Vet"          name={`${claim.vetSigner || CLINIC.lead} · ✓ signed`} last vetSigned/>
        </Section>

        {/* Front desk workflow checklist — only visible during the hand-off */}
        {isVetApproved && (
          <Section title="Front desk checklist">
            <FrontDeskStep
              n="1" label="Confirm visit summary with customer"
              hint={`Send ${claim.owner} the itemized charges via chat, get a thumbs-up.`}
              done={contacted}
              cta={contacted ? null : 'Chat with customer'}
              onClick={() => setContacted(true)}
            />
            <FrontDeskStep
              n="2" label={`Submit to ${claim.provider.split('·')[0].trim()}`}
              hint="Verifies in-network, pre-existing flags, and itemized codes."
              done={false}
              disabled={!contacted}
              cta={contacted ? 'Ready · use button below' : 'Confirm with customer first'}
              last
            />
          </Section>
        )}
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 20px 28px', background: '#FFFFFFF2',
        borderTop: `1px solid ${PM.line}`,
        display: 'flex', gap: 8,
      }}>
        {isVetApproved ? (
          <>
            <button onClick={() => setContacted(true)} disabled={contacted} style={{
              flex: 1, height: 54, borderRadius: 27,
              background: contacted ? '#E6F8EF' : 'transparent',
              color: contacted ? '#1E6B4D' : PM.night,
              border: contacted ? 'none' : `1.5px solid ${PM.ink}`,
              fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: contacted ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {contacted ? '✓ Customer confirmed' : 'Chat with customer'}
            </button>
            <button
              onClick={() => setSubmitted(true)}
              disabled={!contacted || submitted}
              style={{
                flex: 1.4, height: 54, borderRadius: 27,
                background: (!contacted || submitted) ? '#FFB8DA' : PM.coral,
                color: '#FFF', border: 'none',
                fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
                cursor: (!contacted || submitted) ? 'not-allowed' : 'pointer',
                boxShadow: (!contacted || submitted) ? 'none' : '0 6px 18px rgba(255,0,131,0.4)',
              }}>
              {submitted ? 'Submitted ✓' : `Submit to ${claim.provider.split('·')[0].trim()} →`}
            </button>
          </>
        ) : (
          <button onClick={() => goto('claimTimeline', { id: claim.id })} style={{
            width: '100%', height: 54, borderRadius: 27,
            background: PM.night, color: PM.cream, border: 'none',
            fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>View status →</button>
        )}
      </div>
    </div>
  );
}

function SigRow({ label, name, last, vetSigned }) {
  return (
    <div style={{ padding: '8px 0', borderBottom: last ? 'none' : `1px solid ${PM.lineSoft}` }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: PM.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 600 }}>{name}</span>
        {vetSigned ? (
          <div style={{
            minWidth: 96, height: 28, padding: '0 10px', borderRadius: 6,
            background: '#E6F8EF', color: '#1E6B4D',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
          }}>signed</div>
        ) : (
          <div style={{
            minWidth: 96, height: 28, borderRadius: 6,
            border: `1px dashed ${PM.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.4,
          }}>tap to sign</div>
        )}
      </div>
    </div>
  );
}

function FrontDeskStep({ n, label, hint, done, disabled, cta, onClick, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '10px 0', borderBottom: last ? 'none' : `1px solid ${PM.lineSoft}`,
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 13, flexShrink: 0,
        background: done ? PM.mint : disabled ? PM.creamDark : PM.night,
        color: '#FFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_DISPLAY, fontSize: 12,
      }}>{done ? '✓' : n}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: done ? PM.inkSoft : PM.night, fontWeight: 600, textDecoration: done ? 'line-through' : 'none' }}>
          {label}
        </div>
        <div style={{ marginTop: 2, fontFamily: FONT_BODY, fontSize: 11, color: PM.inkSoft, lineHeight: 1.45 }}>{hint}</div>
        {cta && !done && (
          <div style={{ marginTop: 6 }}>
            {onClick ? (
              <button onClick={onClick} disabled={disabled} style={{
                padding: '6px 12px', borderRadius: 13,
                background: disabled ? PM.creamDark : PM.night, color: disabled ? PM.inkFaint : '#FFF',
                border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
                fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
              }}>{cta}</button>
            ) : (
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.4 }}>{cta}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pending claim timeline ────────────────────────────────

function VetClaimTimelineScreen({ claim, onBack }) {
  if (!claim) return <div style={{ position: 'absolute', inset: 0, background: PM.cream, padding: 40 }}>Not found. <button onClick={onBack}>Back</button></div>;
  const tl = claim.timeline || [
    { label: 'Submitted',    when: claim.submittedAge, done: claim.status !== 'Draft' },
    { label: 'Under review', when: '—', done: claim.status === 'Approved' },
    { label: 'Decision',     when: claim.status,        done: claim.status === 'Approved' || claim.status === 'Denied' },
    { label: 'Payout',       when: claim.status === 'Approved' ? `$${claim.payout.toFixed(2)}` : '—', done: claim.status === 'Approved' },
  ];
  const b = CLAIM_BADGE[claim.status] || CLAIM_BADGE.Pending;

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title={claim.id} onBack={onBack}
        right={<div style={{
          padding: '4px 10px', borderRadius: 11, background: b.bg, color: b.fg,
          fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700,
        }}>{claim.status}</div>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 24px' }}>
        <h1 style={{ margin: '6px 0 4px', fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 400, color: PM.night, letterSpacing: -0.6, lineHeight: 1.05 }}>
          {claim.petName}'s claim
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 18 }}>
          {claim.visit} · {claim.provider}
        </div>

        <div style={{ position: 'relative', paddingLeft: 28, marginBottom: 22 }}>
          <div style={{
            position: 'absolute', top: 14, bottom: 14, left: 12, width: 2, background: PM.line,
          }}/>
          {tl.map((step, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 18 }}>
              <div style={{
                position: 'absolute', left: -22, top: 4,
                width: 24, height: 24, borderRadius: 12,
                background: step.done ? PM.mint : PM.white,
                border: step.done ? 'none' : `2px solid ${PM.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFF',
              }}>
                {step.done ? (
                  <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 6 L 4.5 8.5 L 9 3" stroke="#FFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: PM.line }}/>
                )}
              </div>
              <div style={{ paddingLeft: 14 }}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.night, fontWeight: 600 }}>{step.label}</div>
                <div style={{ marginTop: 2, fontFamily: FONT_MONO, fontSize: 11, color: PM.inkSoft, letterSpacing: 0.3 }}>{step.when}</div>
              </div>
            </div>
          ))}
        </div>

        <Section title="Snapshot">
          <Fact label="Total billed" value={`$${claim.amount.toFixed(2)}`}/>
          <Fact label="Owner copay"  value={`$${claim.copay.toFixed(2)}`}/>
          <Fact label="Expected payout" value={`$${claim.payout.toFixed(2)}`} last/>
        </Section>

        {claim.denialReason && (
          <Section title="Denial reason">
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.5 }}>
              {claim.denialReason}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { VetClaimsScreen, VetClaimPreviewScreen, VetClaimTimelineScreen });
