// screens-shelter-forms.jsx — Application queue + multi-stage review.

function stageMeta(key) {
  return APP_STAGES.find(s => s.key === key) || APP_STAGES[0];
}

function ShelterFormsScreen({ goto, tab, setTab, initialSeg, hideTabBar, apps, highlightApplicant }) {
  const data = apps || APPLICATIONS;
  const [seg, setSeg] = React.useState(initialSeg || 'all');
  const segments = [['all', `All ${data.length}`], ...APP_STAGES.map(s => {
    const n = data.filter(a => a.stage === s.key).length;
    return [s.key, `${s.label} · ${n}`];
  })];
  const list = seg === 'all' ? data : data.filter(a => a.stage === seg);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Applications" large subtitle="Review, message, decide — all in one queue."/>

      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: 4,
                      background: PM.white, borderRadius: 16, border: `1px solid ${PM.line}` }}>
          {segments.map(([k, l]) => (
            <button key={k} onClick={() => setSeg(k)} style={{
              flexShrink: 0, height: 34, padding: '0 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: seg===k ? PM.night : 'transparent',
              color:      seg===k ? PM.cream : PM.inkSoft,
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 110px' }}>
        {list.length === 0 ? (
          <EmptyState
            title="Nothing in this stage"
            sub="When applicants reach this stage, they'll show up here."
            cta="See all applications"
            onCta={() => setSeg('all')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map(a => (
              <ApplicantRow
                key={a.id} app={a}
                highlight={highlightApplicant === a.applicant}
                onClick={() => goto('appReview', { id: a.id })}
              />
            ))}
          </div>
        )}
      </div>

      {!hideTabBar && <ShelterTabBar active={tab} onChange={setTab}/>}
    </div>
  );
}

function ApplicantRow({ app, onClick, highlight }) {
  const sm = stageMeta(app.stage);
  const pet = SHELTER_PETS.find(p => p.key === app.petKey);
  return (
    <button onClick={onClick} className={highlight ? 'pm-applicant-new' : ''} style={{
      position: 'relative',
      display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 22,
      background: PM.white, border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: highlight
        ? `0 0 0 2px ${PM.coral}, 0 1px 2px rgba(20,20,40,0.03), 0 12px 30px rgba(255,0,131,0.22)`
        : '0 1px 2px rgba(20,20,40,0.03), 0 6px 18px rgba(20,20,40,0.04)',
      transition: 'box-shadow 0.3s ease',
    }}>
      {highlight && (
        <>
          <style>{`
            @keyframes pm-applicant-slide-in {
              0%   { transform: translateY(-22px); opacity: 0; }
              60%  { transform: translateY(2px);   opacity: 1; }
              100% { transform: translateY(0);     opacity: 1; }
            }
            @keyframes pm-new-pulse {
              0%, 100% { transform: scale(1);    box-shadow: 0 4px 10px rgba(255,0,131,0.3); }
              50%      { transform: scale(1.06); box-shadow: 0 6px 14px rgba(255,0,131,0.45); }
            }
            .pm-applicant-new { animation: pm-applicant-slide-in 0.55s cubic-bezier(0.32, 1.4, 0.64, 1) both; }
          `}</style>
          <span style={{
            position: 'absolute', top: -8, right: 12,
            padding: '3px 9px', borderRadius: 9,
            background: PM.coral, color: '#FFF',
            fontFamily: FONT_MONO, fontSize: 9, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
            animation: 'pm-new-pulse 1.4s ease-in-out infinite',
          }}>● New</span>
        </>
      )}
      <div style={{
        width: 52, height: 52, borderRadius: 26,
        background: sm.color, color: '#FFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        fontFamily: FONT_DISPLAY, fontSize: 18, letterSpacing: -0.3,
      }}>{app.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, color: PM.night, letterSpacing: -0.2, lineHeight: 1.1 }}>{app.applicant}</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.4 }}>{highlight ? 'just now' : app.age}</div>
        </div>
        <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
          for <strong style={{ color: PM.night }}>{pet ? pet.name : app.petKey}</strong> · {app.household} · {app.location}
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '3px 8px', borderRadius: 8,
            background: sm.color + '22', color: sm.color,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700,
          }}>{sm.label}</span>
        </div>
      </div>
    </button>
  );
}

// ─── Multi-stage application review ─────────────────────────

function ShelterAppReviewScreen({ app, onBack, goto, setTab }) {
  // local state — start at the application's current stage; let user walk through.
  const stageIdx = APP_STAGES.findIndex(s => s.key === (app && app.stage)) || 0;
  const [activeStage, setActiveStage] = React.useState(Math.max(0, stageIdx));
  const [decision, setDecision] = React.useState(null); // null | 'approved' | 'declined'

  if (!app) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: PM.cream, padding: 40, fontFamily: FONT_BODY }}>
        Application not found. <button onClick={onBack}>Back</button>
      </div>
    );
  }
  const sm = APP_STAGES[activeStage];
  const pet = SHELTER_PETS.find(p => p.key === app.petKey);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{
        background: `linear-gradient(135deg, ${PM.night} 0%, #2B2E66 100%)`, color: PM.cream,
        paddingTop: 56, paddingBottom: 22, paddingLeft: 20, paddingRight: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: 18, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13"><path d="M8 1 L 3 6.5 L 8 12" stroke={PM.cream} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coralSoft, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Application · {app.age}
          </div>
          <div style={{ width: 36 }}/>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, background: sm.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT_DISPLAY, fontSize: 20, color: '#FFF', letterSpacing: -0.3,
          }}>{app.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400, letterSpacing: -0.4, lineHeight: 1.1 }}>
              {app.applicant}
            </h1>
            <div style={{ marginTop: 2, fontFamily: FONT_BODY, fontSize: 12, color: 'rgba(252,246,236,0.7)' }}>
              for <strong style={{ color: PM.coral }}>{pet ? pet.name : app.petKey}</strong> · {app.household}
            </div>
          </div>
        </div>
      </div>

      {/* stage stepper */}
      <div style={{ padding: '14px 20px 4px' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {APP_STAGES.map((s, i) => (
            <button key={s.key} onClick={() => setActiveStage(i)} style={{
              flex: 1, padding: '8px 6px', borderRadius: 12,
              background: i === activeStage ? PM.night : PM.white,
              color:      i === activeStage ? PM.cream : PM.inkSoft,
              border: i === activeStage ? 'none' : `1px solid ${PM.line}`,
              cursor: 'pointer',
              fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600, letterSpacing: 0.2,
            }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9, opacity: 0.65, marginBottom: 1 }}>0{i + 1}</div>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontSize: 11, color: PM.inkSoft }}>
          Stages are optional — skip ahead if you've already met in person.
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 120px' }}>
        {sm.key === 'pre-app'   && <PreAppPanel app={app}/>}
        {sm.key === 'scheduled' && <ScheduledPanel app={app}/>}
        {sm.key === 'meeting'   && <MeetingPanel  app={app}/>}
        {sm.key === 'approved'  && <ApprovedPanel app={app}/>}

        {decision && (
          <div style={{
            marginTop: 16, padding: 14, borderRadius: 18,
            background: decision === 'approved' ? '#E6F8EF' : '#FFE9EE',
            borderLeft: `3px solid ${decision === 'approved' ? PM.mint : PM.coral}`,
            fontFamily: FONT_BODY, fontSize: 13, color: PM.ink,
          }}>
            <strong>
              {decision === 'approved' ? 'Adoption approved.' : 'Application declined.'}
            </strong>
            {decision === 'approved'
              ? " We've sent next-step instructions to the applicant."
              : ' The applicant has been notified with a gentle note.'}
          </div>
        )}
      </div>

      {/* sticky decision bar */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 20px 28px', background: '#FFFFFFF2',
        borderTop: `1px solid ${PM.line}`,
        display: 'flex', gap: 8,
      }}>
        <button onClick={() => { setTab('chat'); goto('chatThread', { pet: app.petKey }); }} style={{
          flex: 1, height: 50, borderRadius: 25,
          background: 'transparent', color: PM.night, border: `1.5px solid ${PM.ink}`,
          fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
            <path d="M4 6 Q 4 4, 6 4 L 16 4 Q 18 4, 18 6 L 18 13 Q 18 15, 16 15 L 9 15 L 5 18 L 5 15 Q 4 15, 4 13 Z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
          </svg>
          Message
        </button>
        <button onClick={() => setDecision('declined')} style={{
          flex: 1, height: 50, borderRadius: 25,
          background: 'transparent', color: PM.inkSoft, border: `1.5px solid ${PM.line}`,
          fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>Decline</button>
        <button onClick={() => setDecision('approved')} style={{
          flex: 1.6, height: 50, borderRadius: 25,
          background: PM.coral, color: '#FFF', border: 'none',
          fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(255,0,131,0.34)',
        }}>Approve →</button>
      </div>
    </div>
  );
}

function ReviewSection({ title, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 700 }}>{title}</div>
        {hint && <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.4, textTransform: 'uppercase' }}>{hint}</div>}
      </div>
      <div style={{ background: PM.white, borderRadius: 16, padding: 14, boxShadow: '0 1px 3px rgba(20,20,40,0.04)' }}>{children}</div>
    </div>
  );
}

function FactRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', gap: 14,
      padding: '8px 0', borderBottom: last ? 'none' : `1px solid ${PM.lineSoft}`,
    }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, fontWeight: 500, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function QABlock({ q, a }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coral, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>{q}</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.5 }}>{a}</div>
    </div>
  );
}

function PreAppPanel({ app }) {
  const p = app.preApp || {};
  return (
    <>
      <ReviewSection title="Pre-screening answers">
        <QABlock q="Why adopt now?"        a={p.whyAdopt || '—'}/>
        <QABlock q="Favorite thing about this pet" a={p.favorite || '—'}/>
        <QABlock q="Why you're a fit"       a={p.fit || '—'}/>
      </ReviewSection>
      <ReviewSection title="Quick facts">
        <FactRow label="Household" value={app.household}/>
        <FactRow label="Location"  value={app.location}/>
        <FactRow label="Submitted" value={`${app.age} ago`} last/>
      </ReviewSection>
    </>
  );
}

function ScheduledPanel({ app }) {
  return (
    <>
      <ReviewSection title="Schedule a meet & greet" hint="In-person">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Sat Apr 12 · 2:00 PM','Sun Apr 13 · 11:00 AM','Wed Apr 16 · 5:30 PM','Sat Apr 19 · 2:00 PM'].map(s => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
        <div style={{ marginTop: 12, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, lineHeight: 1.5 }}>
          Pick a slot or message the applicant directly. We'll send confirmation + directions automatically.
        </div>
      </ReviewSection>
      <ReviewSection title="Pre-screening summary">
        <FactRow label="Household" value={app.household}/>
        <FactRow label="Location"  value={app.location}/>
        <FactRow label="Lives with kids" value={(app.fullForm && app.fullForm.children) || '—'} last/>
      </ReviewSection>
    </>
  );
}

function MeetingPanel({ app }) {
  const f = app.fullForm || {};
  return (
    <>
      <ReviewSection title="Household & home">
        <FactRow label="Adults"   value={f.adults || '—'}/>
        <FactRow label="Children" value={f.children || '—'}/>
        <FactRow label="Home"     value={f.home || '—'}/>
        <FactRow label="Yard"     value={f.yard || '—'}/>
        <FactRow label="Other pets" value={f.otherPets || '—'} last/>
      </ReviewSection>
      <ReviewSection title="Daily routine">
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.5 }}>
          {f.routine || '—'}
        </div>
      </ReviewSection>
      <ReviewSection title="Vet contact" hint={f.vet && f.vet.inNetwork ? 'In-network' : 'Out-of-net'}>
        <FactRow label="Clinic" value={f.vet ? f.vet.name : '—'}/>
        <FactRow label="Doctor" value={f.vet ? f.vet.dr : '—'} last/>
      </ReviewSection>
      <ReviewSection title="Experience">
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.5 }}>
          {f.experience || '—'}
        </div>
      </ReviewSection>
    </>
  );
}

function ApprovedPanel({ app }) {
  const checks = app.aiChecks || [];
  return (
    <>
      <ReviewSection title="AI verification" hint="Lemonade powered">
        {checks.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
            borderBottom: i === checks.length - 1 ? 'none' : `1px solid ${PM.lineSoft}` }}>
            <span style={{
              width: 22, height: 22, borderRadius: 11,
              background: c.ok ? PM.mint : PM.coral, color: '#FFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700,
            }}>{c.ok ? '✓' : '!'}</span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink }}>{c.label}</span>
          </div>
        ))}
      </ReviewSection>
      {app.insurance && (
        <ReviewSection title="Insurance" hint={app.insurance.active ? 'Active' : 'Pending'}>
          <FactRow label="Plan" value={`${app.insurance.provider} · $${app.insurance.monthly}/mo`} last/>
        </ReviewSection>
      )}
      {app.vetVisit && (
        <ReviewSection title="First vet visit" hint={app.vetVisit.confirmed ? 'Confirmed' : 'Pending'}>
          <FactRow label="Clinic" value={app.vetVisit.clinic}/>
          <FactRow label="When"   value={app.vetVisit.when} last/>
        </ReviewSection>
      )}
      {app.homeVisit && (
        <ReviewSection title="Home visit" hint={app.homeVisit.completed ? 'Complete' : 'Scheduled'}>
          <FactRow label="When"  value={app.homeVisit.scheduled || '—'}/>
          {app.homeVisit.notes && <FactRow label="Notes" value={app.homeVisit.notes} last/>}
        </ReviewSection>
      )}
    </>
  );
}

Object.assign(window, { ShelterFormsScreen, ShelterAppReviewScreen });
