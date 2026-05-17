// screens-vet-appointments.jsx — Day/Week/Month + Detail + New + Reschedule.

function VetAppointmentsScreen({ view, goto, tab, setTab }) {
  const [v, setV] = React.useState(view || 'day');
  const today = APPOINTMENTS;

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Appointments" large subtitle={`${today.length} today · ${WEEK_VIEW.reduce((a, b) => a + b.count, 0)} this week`}
        right={
          <button onClick={() => goto('appointmentNew')} style={{
            width: 36, height: 36, borderRadius: 18, background: PM.coral, color: '#FFF',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255,0,131,0.32)',
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14"><path d="M7 1 L 7 13 M 1 7 L 13 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>
          </button>
        }
      />

      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: PM.white, borderRadius: 16, border: `1px solid ${PM.line}` }}>
          {[['day','Day'],['week','Week'],['month','Month']].map(([k,l]) => (
            <button key={k} onClick={() => setV(k)} style={{
              flex: 1, height: 34, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: v===k ? PM.night : 'transparent',
              color:      v===k ? PM.cream : PM.inkSoft,
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 110px' }}>
        {v === 'day'   && <DayList apts={today} goto={goto}/>}
        {v === 'week'  && <WeekGrid/>}
        {v === 'month' && <MonthGrid/>}
      </div>

      <VetTabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function DayList({ apts, goto }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        padding: '8px 12px', borderRadius: 12, background: PM.white, border: `1px solid ${PM.line}`,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase',
      }}>
        <span>Wed · Apr 16, 2026</span>
        <span>{apts.length} visits</span>
      </div>
      {apts.map(a => <DayApt key={a.id} apt={a} onClick={() => goto('appointmentDetail', { id: a.id })}/>)}
    </div>
  );
}

function DayApt({ apt, onClick }) {
  const isNew = apt.status === 'NEW';
  const inNet = apt.insurance && apt.insurance.inNetwork;
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', gap: 12, padding: 14, borderRadius: 18,
      background: PM.white, border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 1px 3px rgba(20,20,40,0.04), 0 6px 18px rgba(20,20,40,0.04)',
    }}>
      <div style={{
        width: 64, flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '6px 0', background: `${PM.coral}10`, borderRadius: 12,
      }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: PM.coral, letterSpacing: -0.3, lineHeight: 1 }}>{apt.time}</div>
        <div style={{ marginTop: 3, fontFamily: FONT_MONO, fontSize: 9, color: PM.inkSoft }}>{apt.duration}m</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: PM.night, letterSpacing: -0.3, lineHeight: 1 }}>{apt.patient}</div>
          <span style={{
            padding: '2px 6px', borderRadius: 6,
            background: isNew ? PM.coral : `${PM.violet}22`,
            color: isNew ? '#FFF' : PM.violet,
            fontFamily: FONT_MONO, fontSize: 9, fontWeight: 700, letterSpacing: 0.4,
          }}>{apt.status}</span>
        </div>
        <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
          {apt.breed} · {apt.owner}
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            padding: '3px 8px', borderRadius: 8,
            background: PM.creamDark, color: PM.ink,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.4, fontWeight: 600,
          }}>{apt.visitType}</span>
          {apt.insurance && (
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: inNet ? PM.mint : PM.inkSoft, fontWeight: 700, letterSpacing: 0.4 }}>
              {inNet ? '● ' : ''}{apt.insurance.provider}
            </span>
          )}
        </div>
        <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 11, color: PM.inkFaint }}>
          {apt.room} · {apt.clinician}
        </div>
      </div>
    </button>
  );
}

function WeekGrid() {
  const max = Math.max(...WEEK_VIEW.map(d => d.count));
  return (
    <div style={{ padding: 18, borderRadius: 22, background: PM.white, boxShadow: '0 1px 3px rgba(20,20,40,0.04)' }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 }}>
        Week of Apr 13–19
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 6, height: 200 }}>
        {WEEK_VIEW.map(d => (
          <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
              <div style={{
                width: '100%',
                height: d.closed ? 6 : `${(d.count / max) * 100}%`,
                minHeight: 6,
                background: d.today ? PM.coral : d.closed ? PM.line : PM.night,
                borderRadius: 6,
                transition: 'height 0.3s',
              }}/>
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: PM.inkSoft, fontWeight: 700 }}>{d.dow}</div>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 11, color: d.today ? PM.coral : PM.night, fontWeight: d.today ? 700 : 500,
            }}>{d.date.split(' ')[1]}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: PM.inkFaint }}>{d.closed ? '—' : d.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthGrid() {
  const dows = ['S','M','T','W','T','F','S'];
  return (
    <div style={{ padding: 18, borderRadius: 22, background: PM.white, boxShadow: '0 1px 3px rgba(20,20,40,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.night, letterSpacing: -0.3 }}>April 2026</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.4 }}>156 total</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {dows.map((d, i) => (
          <div key={i} style={{
            textAlign: 'center', fontFamily: FONT_MONO, fontSize: 9, color: PM.inkSoft, letterSpacing: 0.6,
            padding: '4px 0',
          }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {MONTH_VIEW_DATES.map((d, i) => {
          if (d.blank) return <div key={i}/>;
          const bg = d.today ? PM.coral :
                     d.closed ? 'transparent' :
                     d.density === 3 ? `${PM.coral}AA` :
                     d.density === 2 ? `${PM.coral}66` :
                     d.density === 1 ? `${PM.coral}24` :
                     'transparent';
          const fg = d.today ? '#FFF' : d.closed ? PM.inkFaint : PM.night;
          return (
            <div key={i} style={{
              aspectRatio: '1 / 1', borderRadius: 8, background: bg,
              border: d.today ? `1.5px solid ${PM.coral}` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: d.today ? 700 : 500, color: fg,
            }}>{d.day}</div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft }}>
        <DensityLegend label="Light"  pct={0.24}/>
        <DensityLegend label="Medium" pct={0.66}/>
        <DensityLegend label="Heavy"  pct={1.00}/>
      </div>
    </div>
  );
}

function DensityLegend({ label, pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 12, height: 12, borderRadius: 3, background: `${PM.coral}${Math.round(pct * 255).toString(16).padStart(2, '0').toUpperCase()}` }}/>
      <span>{label}</span>
    </div>
  );
}

// ─── Appointment detail ────────────────────────────────────

function VetAppointmentDetailScreen({ apt, onBack, goto }) {
  if (!apt) {
    return <div style={{ position: 'absolute', inset: 0, background: PM.cream, padding: 40 }}>
      Not found. <button onClick={onBack}>Back</button>
    </div>;
  }
  const inNet = apt.insurance && apt.insurance.inNetwork;

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
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
            {apt.day} · {apt.time}
          </div>
          <div style={{ width: 36 }}/>
        </div>
        <h1 style={{ margin: '14px 0 4px', fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 400, color: PM.cream, letterSpacing: -0.6, lineHeight: 1 }}>
          {apt.patient}
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: 'rgba(252,246,236,0.7)', marginTop: 4 }}>
          {apt.breed} · {apt.age} · {apt.sex} · {apt.weight} lb
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 20px 120px' }}>
        <Section title="Visit">
          <Fact label="Type"      value={apt.visitType}/>
          <Fact label="Clinician" value={apt.clinician}/>
          <Fact label="Room"      value={apt.room}/>
          <Fact label="Status"    value={apt.status === 'NEW' ? 'New patient' : 'Returning'} last/>
        </Section>

        {apt.chiefComplaint && (
          <Section title="Chief complaint">
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.5 }}>
              {apt.chiefComplaint}
            </div>
          </Section>
        )}

        {apt.history && (
          <Section title="History">
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, lineHeight: 1.5 }}>
              {apt.history}
            </div>
          </Section>
        )}

        <Section title="Owner">
          <Fact label="Name" value={apt.owner} last/>
        </Section>

        {apt.insurance && (
          <Section title="Insurance" hint={inNet ? 'In-network' : 'Out-of-net'}>
            <Fact label="Provider" value={apt.insurance.provider}/>
            <Fact label="Plan"     value={apt.insurance.plan}/>
            <Fact label="Copay"    value={apt.insurance.copay ? `$${apt.insurance.copay}` : '—'}/>
            <Fact label="Status"   value={apt.insurance.status} last/>
          </Section>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <PMButton variant="light" onClick={() => goto('appointmentReschedule', { id: apt.id })}>Reschedule</PMButton>
          <PMButton variant="primary" onClick={() => goto('noteRecording')}>Start visit →</PMButton>
        </div>
      </div>
    </div>
  );
}

function Section({ title, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 700 }}>{title}</div>
        {hint && <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase' }}>{hint}</div>}
      </div>
      <div style={{ background: PM.white, borderRadius: 16, padding: 14, boxShadow: '0 1px 3px rgba(20,20,40,0.04)' }}>{children}</div>
    </div>
  );
}

function Fact({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', gap: 14, padding: '8px 0',
      borderBottom: last ? 'none' : `1px solid ${PM.lineSoft}`,
    }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, fontWeight: 500, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

// ─── New appointment (wizard) ──────────────────────────────

function VetAppointmentNewScreen({ onBack, onDone }) {
  const [step, setStep] = React.useState(1);
  const [patient, setPatient] = React.useState('');
  const [date, setDate] = React.useState('Apr 17');
  const [time, setTime] = React.useState('10:30a');
  const [reason, setReason] = React.useState('Wellness');

  const patients = ['Poppy (Sarah Chen)', 'Mochi (David Liu)', 'Bruno (Priya Raman)', '+ New patient'];
  const dates = ['Apr 16','Apr 17','Apr 18','Apr 20','Apr 21'];
  const times = ['8:30a','9:30a','10:30a','11:00a','1:15p','3:00p','4:45p'];
  const reasons = ['Wellness','Vaccines','Dental','Spay/neuter','Sick visit','Follow-up'];

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="New appointment" onBack={onBack}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 22px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 18 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              width: i === step ? 22 : 8, height: 4, borderRadius: 2,
              background: i <= step ? PM.night : PM.line, transition: 'width 0.3s',
            }}/>
          ))}
          <span style={{ marginLeft: 8, fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.6 }}>
            Step {step} of 3
          </span>
        </div>

        {step === 1 && (
          <>
            <h2 style={{ margin: '0 0 6px', fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400, color: PM.night, letterSpacing: -0.4 }}>
              Who's coming in?
            </h2>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 18 }}>
              Pick an existing patient or create a new chart.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {patients.map(p => {
                const on = patient === p;
                return (
                  <button key={p} onClick={() => setPatient(p)} style={{
                    padding: 14, borderRadius: 16, textAlign: 'left',
                    background: on ? PM.night : PM.white, color: on ? PM.cream : PM.ink,
                    border: on ? 'none' : `1.5px solid ${PM.line}`, cursor: 'pointer',
                    fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
                  }}>{p}</button>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ margin: '0 0 6px', fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400, color: PM.night, letterSpacing: -0.4 }}>
              Pick a slot.
            </h2>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 18 }}>
              For {patient || 'patient'} · April 2026
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, fontWeight: 600, marginBottom: 8 }}>Date</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
              {dates.map(d => <Chip key={d} selected={date === d} onClick={() => setDate(d)}>{d}</Chip>)}
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, fontWeight: 600, marginBottom: 8 }}>Time</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {times.map(t => (
                <button key={t} onClick={() => setTime(t)} style={{
                  height: 44, borderRadius: 14, border: t===time ? 'none' : `1.5px solid ${PM.line}`, cursor: 'pointer',
                  background: t===time ? PM.coral : PM.white, color: t===time ? PM.cream : PM.ink,
                  fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
                }}>{t}</button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ margin: '0 0 6px', fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400, color: PM.night, letterSpacing: -0.4 }}>
              Visit reason.
            </h2>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, marginBottom: 18 }}>
              Helps the team prepare the room.
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              {reasons.map(r => <Chip key={r} selected={reason === r} onClick={() => setReason(r)}>{r}</Chip>)}
            </div>
            <div style={{ padding: 14, borderRadius: 18, background: PM.night, color: PM.cream }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.coralSoft, letterSpacing: 1, textTransform: 'uppercase' }}>Confirm</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, marginTop: 4, letterSpacing: -0.3 }}>{patient || '—'}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 12, opacity: 0.75, marginTop: 2 }}>
                {date} · {time} · {reason}
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 20px 28px', background: '#FFFFFFF2',
        borderTop: `1px solid ${PM.line}`,
        display: 'flex', gap: 8,
      }}>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            flex: 1, height: 50, borderRadius: 25,
            background: 'transparent', color: PM.inkSoft, border: `1.5px solid ${PM.line}`,
            fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Back</button>
        )}
        <button
          disabled={step === 1 && !patient}
          onClick={() => step < 3 ? setStep(s => s + 1) : onDone()}
          style={{
            flex: 1.6, height: 50, borderRadius: 25,
            background: (step === 1 && !patient) ? '#FFB8DA' : PM.coral, color: '#FFF', border: 'none',
            fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
            cursor: (step === 1 && !patient) ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 16px rgba(255,0,131,0.32)',
          }}>{step < 3 ? 'Next →' : 'Confirm & book'}</button>
      </div>
    </div>
  );
}

// ─── Reschedule ────────────────────────────────────────────

function VetAppointmentRescheduleScreen({ apt, onBack }) {
  const [slot, setSlot] = React.useState(null);
  const [notified, setNotified] = React.useState(false);
  const slots = ['Thu Apr 17 · 9:30a','Thu Apr 17 · 2:00p','Fri Apr 18 · 11:00a','Sat Apr 19 · 10:30a'];

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Reschedule" onBack={onBack}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 22px 22px' }}>
        <div style={{
          padding: 14, borderRadius: 16, background: `${PM.violet}12`, borderLeft: `3px solid ${PM.violet}`,
          marginBottom: 18,
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.violet, letterSpacing: 1, textTransform: 'uppercase' }}>Currently</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: PM.night, marginTop: 4, letterSpacing: -0.3 }}>
            {apt.patient} · {apt.day} · {apt.time}
          </div>
          <div style={{ marginTop: 2, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>
            {apt.visitType} · {apt.clinician}
          </div>
        </div>

        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.night, fontWeight: 700, marginBottom: 10 }}>
          Pick a new slot
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {slots.map(s => {
            const on = slot === s;
            return (
              <button key={s} onClick={() => setSlot(s)} style={{
                padding: 14, borderRadius: 16, textAlign: 'left',
                background: on ? PM.night : PM.white, color: on ? PM.cream : PM.ink,
                border: on ? 'none' : `1.5px solid ${PM.line}`, cursor: 'pointer',
                fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
              }}>{s}</button>
            );
          })}
        </div>

        <div style={{
          padding: 14, borderRadius: 16, background: PM.white, border: `1px solid ${PM.line}`,
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase' }}>
            We'll send {apt.owner}
          </div>
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['SMS · "Your appointment moved to…"', 'Email · re-confirmation link'].map(l => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT_BODY, fontSize: 12, color: PM.ink }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 8, background: PM.mint, color: '#FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                }}>✓</span>
                {l}
              </div>
            ))}
          </div>
        </div>

        {notified && (
          <div style={{
            marginTop: 16, padding: 14, borderRadius: 16,
            background: '#E6F8EF', borderLeft: `3px solid ${PM.mint}`,
            fontFamily: FONT_BODY, fontSize: 13, color: PM.ink,
          }}>
            <strong>Done.</strong> {apt.owner} has been notified — you'll see their confirmation in Chat.
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '12px 20px 28px', background: '#FFFFFFF2',
        borderTop: `1px solid ${PM.line}`,
      }}>
        <button
          disabled={!slot}
          onClick={() => setNotified(true)}
          style={{
            width: '100%', height: 50, borderRadius: 25,
            background: slot ? PM.coral : '#FFB8DA', color: '#FFF', border: 'none',
            fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
            cursor: slot ? 'pointer' : 'not-allowed',
            boxShadow: slot ? '0 6px 16px rgba(255,0,131,0.32)' : 'none',
          }}>Confirm new slot</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  VetAppointmentsScreen, VetAppointmentDetailScreen,
  VetAppointmentNewScreen, VetAppointmentRescheduleScreen,
});
