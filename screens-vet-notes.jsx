// screens-vet-notes.jsx — AI notes index + New Recording + Active Recording + SOAP review.

const NOTE_STATUS = {
  Draft:  { bg: '#FFF1D6', fg: '#9A6A00' },
  Ready:  { bg: '#D6E8FF', fg: '#0034FF' },
  Signed: { bg: '#E6F8EF', fg: '#1E8A5A' },
};

function VetNotesScreen({ goto, tab, setTab }) {
  const [seg, setSeg] = React.useState('All');
  const filters = ['All','Draft','Ready','Signed'];
  const counts = filters.reduce((a, f) => {
    a[f] = f === 'All' ? AI_NOTES.length : AI_NOTES.filter(n => n.status === f).length;
    return a;
  }, {});
  const list = seg === 'All' ? AI_NOTES : AI_NOTES.filter(n => n.status === seg);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="AI Notes" large subtitle={`${AI_NOTES.length} records · powered by Lemonade transcription`}
        right={
          <button onClick={() => goto('noteNew')} style={{
            width: 36, height: 36, borderRadius: 18, background: PM.coral, color: '#FFF',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255,0,131,0.32)',
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14"><circle cx="7" cy="7" r="4" fill="currentColor"/></svg>
          </button>
        }
      />

      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: PM.white, borderRadius: 16, border: `1px solid ${PM.line}` }}>
          {filters.map(f => (
            <button key={f} onClick={() => setSeg(f)} style={{
              flex: 1, height: 34, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: seg === f ? PM.night : 'transparent',
              color:      seg === f ? PM.cream : PM.inkSoft,
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
            }}>{f} · {counts[f]}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 110px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map(n => <NoteRow key={n.id} note={n} onClick={() => goto('noteReview', { id: n.id })}/>)}
      </div>

      <VetTabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function NoteRow({ note, onClick }) {
  const s = NOTE_STATUS[note.status] || NOTE_STATUS.Draft;
  return (
    <button onClick={onClick} style={{
      display: 'flex', gap: 14, padding: 14, borderRadius: 18,
      background: PM.white, border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 1px 2px rgba(20,20,40,0.03), 0 6px 18px rgba(20,20,40,0.04)',
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12, flexShrink: 0,
        background: `${PM.violet}15`, color: PM.violet,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 3 L 14 3 L 17 6 L 17 17 L 4 17 Z" stroke="currentColor" strokeWidth="1.6" fill="none"/>
          <path d="M14 3 L 14 6 L 17 6" stroke="currentColor" strokeWidth="1.6" fill="none"/>
          <path d="M7 10 L 13 10 M 7 13 L 11 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 700, color: PM.night }}>
            {note.patient}
            <span style={{ color: PM.inkFaint, fontWeight: 500 }}> · {note.owner}</span>
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.4 }}>{note.age}</div>
        </div>
        <div style={{ marginTop: 3, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>{note.visitType}</div>
        <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '3px 8px', borderRadius: 8,
            background: s.bg, color: s.fg,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 700,
          }}>{note.status}</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.3 }}>{note.duration} session</span>
        </div>
      </div>
    </button>
  );
}

// ─── New note: pick a patient ──────────────────────────────

function VetNoteNewScreen({ onBack, goto }) {
  const [picked, setPicked] = React.useState(null);
  const candidates = APPOINTMENTS.slice(0, 5);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="New recording" onBack={onBack}/>
      <div style={{ flex: 1, padding: '4px 22px 22px', overflow: 'auto' }}>
        <h2 style={{ margin: '0 0 6px', fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400, color: PM.night, letterSpacing: -0.4 }}>
          Who's in the exam room?
        </h2>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 18 }}>
          Pick today's patient to pre-fill the AI prompt.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {candidates.map(c => {
            const on = picked === c.id;
            return (
              <button key={c.id} onClick={() => setPicked(c.id)} style={{
                padding: 14, borderRadius: 16, textAlign: 'left',
                background: on ? PM.night : PM.white, color: on ? PM.cream : PM.ink,
                border: on ? 'none' : `1.5px solid ${PM.line}`, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: on ? 'rgba(255,255,255,0.18)' : `${PM.coral}15`,
                  color: on ? '#FFF' : PM.coral,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONT_DISPLAY, fontSize: 14,
                }}>{c.patient.slice(0, 2)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 700 }}>{c.patient}</div>
                  <div style={{ marginTop: 2, fontFamily: FONT_BODY, fontSize: 11, opacity: 0.75 }}>{c.visitType} · {c.time}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>
          Quick intake
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['🎤 Voice', '📸 Photo', '🩻 X-ray', '⚖️ Weight', '💉 Vaccine'].map(c => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 20px 28px', background: '#FFFFFFF2',
        borderTop: `1px solid ${PM.line}`,
      }}>
        <button
          disabled={!picked}
          onClick={() => goto('noteRecording')}
          style={{
            width: '100%', height: 54, borderRadius: 27,
            background: picked ? PM.coral : '#FFB8DA', color: '#FFF', border: 'none',
            fontFamily: FONT_BODY, fontSize: 16, fontWeight: 600,
            cursor: picked ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: picked ? '0 6px 18px rgba(255,0,131,0.4)' : 'none',
          }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="4" fill="currentColor"/></svg>
          Start recording
        </button>
      </div>
    </div>
  );
}

// ─── Active recording — live transcript appearing ─────────

function VetNoteRecordingScreen({ onBack, onDone }) {
  const [seconds, setSeconds] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const lines = [
    "Patient is a 2-year-old female golden retriever mix, recently adopted.",
    "Owner reports normal energy and appetite. No prior records on file.",
    "Bright, alert, responsive. Mucous membranes pink, CRT under 2 seconds.",
    "Auscultation no significant findings. Abdomen soft and non-painful.",
    "Plan: DHPP booster, Bordetella intranasal, 4Dx parasite screen.",
  ];
  const [shown, setShown] = React.useState(0);

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [paused]);

  React.useEffect(() => {
    if (paused) return;
    if (shown >= lines.length) return;
    const t = setTimeout(() => setShown(s => s + 1), 1800);
    return () => clearTimeout(t);
  }, [shown, paused]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.night, color: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 56, paddingLeft: 20, paddingRight: 20, paddingBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 2 L 12 12 M 12 2 L 2 12" stroke={PM.cream} strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: PM.coralSoft, letterSpacing: 1.4, textTransform: 'uppercase' }}>
          {paused ? 'Paused' : 'Recording'}
        </div>
        <div style={{ width: 36 }}/>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px' }}>
        {/* pulsing mic */}
        <div style={{
          width: 140, height: 140, borderRadius: 70,
          background: paused ? 'rgba(255,0,131,0.25)' : PM.coral,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 20, marginBottom: 16,
          animation: paused ? 'none' : 'rec-pulse 1.6s ease-out infinite',
        }}>
          <style>{`
            @keyframes rec-pulse {
              0%   { box-shadow: 0 0 0 0    rgba(255,0,131,0.6); }
              70%  { box-shadow: 0 0 0 22px rgba(255,0,131,0);   }
              100% { box-shadow: 0 0 0 0    rgba(255,0,131,0);   }
            }
            @keyframes line-in {
              from { opacity: 0; transform: translateY(6px); }
              to   { opacity: 1; transform: translateY(0);    }
            }
          `}</style>
          <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
            <rect x="17" y="8" width="16" height="30" rx="8" fill="#FFF"/>
            <path d="M10 30 Q 10 42, 25 42 Q 40 42, 40 30" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M25 42 L 25 52" stroke="#FFF" strokeWidth="3" strokeLinecap="round"/>
            <path d="M18 52 L 32 52" stroke="#FFF" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>

        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 44, color: PM.cream, letterSpacing: -1, marginBottom: 4 }}>
          {fmt(seconds)}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: 'rgba(252,246,236,0.55)', marginBottom: 24 }}>
          Poppy · Sarah Chen · Exam 2
        </div>

        {/* live transcript */}
        <div style={{
          width: '100%', flex: 1, overflow: 'auto',
          background: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: 14,
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: PM.coralSoft, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
            Live transcript · auto-SOAP draft in progress
          </div>
          {lines.slice(0, shown).map((t, i) => (
            <div key={i} style={{
              fontFamily: FONT_BODY, fontSize: 13, color: PM.cream, marginBottom: 8, lineHeight: 1.5,
              animation: 'line-in 0.3s ease-out',
            }}>
              {t}
            </div>
          ))}
          {!paused && shown < lines.length && (
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: 3, background: PM.coralSoft,
                  animation: `rec-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}/>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{
        padding: '12px 20px 28px', background: 'rgba(0,0,0,0.4)',
        display: 'flex', gap: 8,
      }}>
        <button onClick={() => setPaused(p => !p)} style={{
          flex: 1, height: 50, borderRadius: 25,
          background: 'rgba(255,255,255,0.12)', color: PM.cream, border: 'none',
          fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>{paused ? 'Resume' : 'Pause'}</button>
        <button onClick={onDone} style={{
          flex: 1.6, height: 50, borderRadius: 25,
          background: PM.coral, color: '#FFF', border: 'none',
          fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(255,0,131,0.32)',
        }}>Stop & generate SOAP →</button>
      </div>
    </div>
  );
}

// ─── SOAP review ───────────────────────────────────────────

function VetNoteReviewScreen({ note, onBack, onSign }) {
  if (!note) {
    return <div style={{ position: 'absolute', inset: 0, background: PM.cream, padding: 40 }}>
      Note not found. <button onClick={onBack}>Back</button>
    </div>;
  }
  const totalCharge = note.plan.reduce((a, b) => a + b.charge, 0);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Note review" onBack={onBack}
        right={<div style={{
          padding: '4px 10px', borderRadius: 11, background: NOTE_STATUS.Draft.bg, color: NOTE_STATUS.Draft.fg,
          fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700,
        }}>Draft</div>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 120px' }}>
        <div style={{
          padding: 14, borderRadius: 16, background: `${PM.violet}10`, borderLeft: `3px solid ${PM.violet}`,
          marginBottom: 18, fontFamily: FONT_BODY, fontSize: 12, color: PM.ink, lineHeight: 1.5,
        }}>
          <strong>AI draft</strong> · {note.generated}. Review every field — what you sign goes on the medical record.
        </div>

        {/* Patient header */}
        <div style={{
          padding: 14, borderRadius: 16, background: PM.white, marginBottom: 12, boxShadow: '0 1px 3px rgba(20,20,40,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: PM.night, letterSpacing: -0.4, lineHeight: 1 }}>
              {note.patient.name}
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>· {note.patient.age}</div>
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
            {note.patient.breed} · {note.patient.sex} · {note.patient.weight} lb · chip {note.patient.microchip}
          </div>
          <div style={{ marginTop: 6, fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.4 }}>
            {note.visit.date} · {note.visit.time} · {note.visit.clinician} · {note.visit.room}
          </div>
        </div>

        {/* S */}
        <SOAPSection letter="S" title="Subjective">
          <FieldRow label="Chief complaint" value={note.subjective.chiefComplaint}/>
          <FieldRow label="History"          value={note.subjective.history}/>
          <FieldRow label="Diet"             value={note.subjective.diet} last/>
        </SOAPSection>

        {/* O */}
        <SOAPSection letter="O" title="Objective">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
            <Vital label="Temp °F" value={note.objective.vitals.temp}/>
            <Vital label="HR"      value={note.objective.vitals.hr}/>
            <Vital label="RR"      value={note.objective.vitals.rr}/>
            <Vital label="Weight"  value={`${note.objective.vitals.weight} lb`}/>
            <Vital label="BCS"     value={note.objective.vitals.bcs}/>
          </div>
          <FieldRow label="Physical exam" value={note.objective.physical} last/>
        </SOAPSection>

        {/* A */}
        <SOAPSection letter="A" title="Assessment">
          {note.assessment.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
              borderBottom: i === note.assessment.length - 1 ? 'none' : `1px solid ${PM.lineSoft}` }}>
              <span style={{
                padding: '3px 8px', borderRadius: 8,
                background: `${PM.violet}22`, color: PM.violet,
                fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
              }}>{a.code}</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink }}>{a.label}</span>
            </div>
          ))}
        </SOAPSection>

        {/* P */}
        <SOAPSection letter="P" title="Plan" hint="Insurance-ready">
          {note.plan.map((p, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', padding: '8px 0',
              borderBottom: i === note.plan.length - 1 ? 'none' : `1px solid ${PM.lineSoft}`,
            }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink }}>{p.line}</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: PM.ink, fontWeight: 600 }}>${p.charge.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1.5px solid ${PM.night}`,
            display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: PM.night }}>Total</span>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.coral, fontStyle: 'italic' }}>${totalCharge.toFixed(2)}</span>
          </div>
        </SOAPSection>

        {/* Follow-up */}
        <SOAPSection letter="F" title="Follow-up">
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.5 }}>
            {note.followUp}
          </div>
        </SOAPSection>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 20px 28px', background: '#FFFFFFF2',
        borderTop: `1px solid ${PM.line}`,
        display: 'flex', gap: 8,
      }}>
        <button onClick={onBack} style={{
          flex: 1, height: 50, borderRadius: 25,
          background: 'transparent', color: PM.inkSoft, border: `1.5px solid ${PM.line}`,
          fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>Edit</button>
        <button onClick={onSign} style={{
          flex: 1.8, height: 50, borderRadius: 25,
          background: PM.coral, color: '#FFF', border: 'none',
          fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(255,0,131,0.32)',
        }}>Approve & sign · file claim →</button>
      </div>
    </div>
  );
}

function SOAPSection({ letter, title, hint, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 11, background: PM.coral, color: '#FFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT_DISPLAY, fontSize: 12,
          }}>{letter}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 700 }}>{title}</div>
        </div>
        {hint && <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.mint, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>{hint}</div>}
      </div>
      <div style={{ background: PM.white, borderRadius: 14, padding: 14, boxShadow: '0 1px 3px rgba(20,20,40,0.04)' }}>{children}</div>
    </div>
  );
}

function FieldRow({ label, value, last }) {
  return (
    <div style={{ padding: '6px 0', borderBottom: last ? 'none' : `1px solid ${PM.lineSoft}` }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: PM.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function Vital({ label, value }) {
  return (
    <div style={{ padding: 8, borderRadius: 10, background: PM.creamDark, textAlign: 'center' }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: PM.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ marginTop: 2, fontFamily: FONT_DISPLAY, fontSize: 16, color: PM.night, letterSpacing: -0.3 }}>{value}</div>
    </div>
  );
}

Object.assign(window, { VetNotesScreen, VetNoteNewScreen, VetNoteRecordingScreen, VetNoteReviewScreen });
