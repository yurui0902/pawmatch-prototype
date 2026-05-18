// app-vet.jsx — Vet clinic app shell.

function VetTabBar({ active, onChange }) {
  const tabs = [
    { id: 'home',     label: 'Home',     icon: 'home'  },
    { id: 'calendar', label: 'Calendar', icon: 'cal'   },
    { id: 'record',   label: 'Notetaker', icon: 'rec'  },
    { id: 'claims',   label: 'Claims',   icon: 'dollar'},
    { id: 'me',       label: 'Me',       icon: 'me'    },
  ];
  const Icon = ({ name, on }) => {
    const c = on ? PM.night : PM.inkFaint;
    const sw = 1.8;
    switch (name) {
      case 'home': return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M3 10 L 11 3 L 19 10 L 19 19 L 13 19 L 13 13 L 9 13 L 9 19 L 3 19 Z"
                stroke={c} strokeWidth={sw} fill="none" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      );
      case 'cal': return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="5" width="16" height="14" rx="2" stroke={c} strokeWidth={sw} fill="none"/>
          <path d="M3 9 L 19 9" stroke={c} strokeWidth={sw}/>
          <path d="M7 3 L 7 6 M 15 3 L 15 6" stroke={c} strokeWidth={sw} strokeLinecap="round"/>
        </svg>
      );
      case 'rec': return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke={c} strokeWidth={sw} fill={on ? PM.coralSoft : 'none'}/>
          <circle cx="11" cy="11" r="3.6" fill={on ? PM.coral : c}/>
        </svg>
      );
      case 'dollar': return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 3 L 11 19" stroke={c} strokeWidth={sw} strokeLinecap="round"/>
          <path d="M15 7 Q 14 5, 11 5 Q 7 5, 7 8 Q 7 10, 11 11 Q 15 12, 15 14 Q 15 17, 11 17 Q 8 17, 7 15"
                stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
      case 'me': return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="8" r="3.5" stroke={c} strokeWidth={sw} fill="none"/>
          <path d="M4 19 Q 4 13, 11 13 Q 18 13, 18 19" stroke={c} strokeWidth={sw} fill="none" strokeLinecap="round"/>
        </svg>
      );
      default: return null;
    }
  };
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 22, paddingTop: 8,
      background: PM.paper, borderTop: `1px solid ${PM.line}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', zIndex: 30,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 8px',
        }}>
          <Icon name={t.icon} on={active === t.id}/>
          <span style={{
            fontFamily: FONT_BODY, fontSize: 10,
            color: active === t.id ? PM.night : PM.inkFaint,
            fontWeight: active === t.id ? 600 : 500, letterSpacing: 0.2,
          }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function VetApp() {
  const [stack, setStack] = React.useState([{ name: 'splash', params: {} }]);
  const [tab, setTab] = React.useState('home');
  const current = stack[stack.length - 1];

  const goto    = React.useCallback((name, params = {}) => setStack(s => [...s, { name, params }]), []);
  const replace = React.useCallback((name, params = {}) => setStack(s => [...s.slice(0, -1), { name, params }]), []);
  const back    = React.useCallback(() => setStack(s => s.length > 1 ? s.slice(0, -1) : s), []);

  const onTabChange = (id) => {
    setTab(id);
    const home = {
      home: 'home', calendar: 'appointmentsDay', record: 'notes', claims: 'claims', me: 'me',
    }[id];
    setStack([{ name: home, params: {} }]);
  };

  let screen;
  switch (current.name) {
    case 'splash':           screen = <VetSplashScreen onContinue={(go) => replace(go)}/>; break;
    case 'register':         screen = <VetRegisterScreen onBack={back} onContinue={(go) => { setTab('home'); replace(go); }}/>; break;
    case 'login':            screen = <VetLoginScreen onBack={back} onContinue={(go) => { setTab('home'); replace(go); }}/>; break;

    case 'home':             screen = <VetHomeScreen goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;

    case 'appointmentsDay':  screen = <VetAppointmentsScreen view="day"   goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;
    case 'appointmentsWeek': screen = <VetAppointmentsScreen view="week"  goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;
    case 'appointmentsMonth':screen = <VetAppointmentsScreen view="month" goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;
    case 'appointmentDetail': {
      const apt = (APPOINTMENTS || []).find(a => a.id === current.params?.id) || APPOINTMENTS[0];
      screen = <VetAppointmentDetailScreen apt={apt} onBack={back} goto={(n,p)=>goto(n,p)}/>; break;
    }
    case 'appointmentNew':   screen = <VetAppointmentNewScreen onBack={back} onDone={() => { setTab('calendar'); setStack([{ name: 'appointmentsDay', params: {} }]); }}/>; break;
    case 'appointmentReschedule': {
      const apt = (APPOINTMENTS || []).find(a => a.id === current.params?.id) || APPOINTMENTS[0];
      screen = <VetAppointmentRescheduleScreen apt={apt} onBack={back}/>; break;
    }

    case 'notes':            screen = <VetNotesScreen goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;
    case 'noteNew':          screen = <VetNoteNewScreen onBack={back} goto={(n,p)=>goto(n,p)}/>; break;
    case 'noteRecording':    screen = <VetNoteRecordingScreen onBack={back} onDone={() => replace('noteReview', { id: SOAP_DRAFT.noteId })}/>; break;
    case 'noteReview': {
      screen = <VetNoteReviewScreen note={SOAP_DRAFT} onBack={back} onSign={() => { setTab('claims'); setStack([{ name: 'claims', params: {} }]); }}/>; break;
    }

    case 'claims':           screen = <VetClaimsScreen goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;
    case 'claimPreview': {
      const c = (CLAIMS || []).find(x => x.id === current.params?.id) || CLAIMS[0];
      screen = <VetClaimPreviewScreen claim={c} onBack={back} goto={(n,p)=>goto(n,p)}/>; break;
    }
    case 'claimTimeline': {
      const c = (CLAIMS || []).find(x => x.id === current.params?.id) || CLAIMS[1];
      screen = <VetClaimTimelineScreen claim={c} onBack={back}/>; break;
    }

    case 'documents':        screen = <VetDocumentsScreen onBack={back}/>; break;
    case 'me':               screen = <VetMeScreen goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;

    default: screen = <div style={{ padding: 40, fontFamily: FONT_BODY }}>Unknown: {current.name}</div>;
  }
  return screen;
}

Object.assign(window, { VetApp, VetTabBar });
