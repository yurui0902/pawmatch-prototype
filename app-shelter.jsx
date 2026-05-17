// app-shelter.jsx — Shelter / breeder app shell.

function ShelterTabBar({ active, onChange }) {
  const tabs = [
    { id: 'home',  label: 'Home',  icon: 'home'  },
    { id: 'pets',  label: 'Pets',  icon: 'paw'   },
    { id: 'forms', label: 'Forms', icon: 'forms' },
    { id: 'chat',  label: 'Chat',  icon: 'chat'  },
    { id: 'me',    label: 'Me',    icon: 'me'    },
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
      case 'paw': return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="6" cy="7" r="1.8" fill={c}/>
          <circle cx="11" cy="5" r="2" fill={c}/>
          <circle cx="16" cy="7" r="1.8" fill={c}/>
          <circle cx="17.5" cy="12" r="1.5" fill={c}/>
          <circle cx="4.5" cy="12" r="1.5" fill={c}/>
          <path d="M11 9 C 7.5 9, 6 12, 7 14.5 C 8 17, 9.5 18, 11 18 C 12.5 18, 14 17, 15 14.5 C 16 12, 14.5 9, 11 9 Z" fill={c}/>
        </svg>
      );
      case 'forms': return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="4" y="3" width="14" height="16" rx="2" stroke={c} strokeWidth={sw} fill={on ? PM.coralSoft : 'none'}/>
          <path d="M7 8 L 15 8 M 7 11 L 15 11 M 7 14 L 12 14" stroke={c} strokeWidth={sw} strokeLinecap="round"/>
        </svg>
      );
      case 'chat': return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 6 Q 4 4, 6 4 L 16 4 Q 18 4, 18 6 L 18 13 Q 18 15, 16 15 L 9 15 L 5 18 L 5 15 Q 4 15, 4 13 Z" stroke={c} strokeWidth={sw} fill="none" strokeLinejoin="round"/>
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
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
      zIndex: 30,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '4px 8px',
        }}>
          <Icon name={t.icon} on={active === t.id}/>
          <span style={{
            fontFamily: FONT_BODY, fontSize: 10,
            color: active === t.id ? PM.night : PM.inkFaint,
            fontWeight: active === t.id ? 600 : 500,
            letterSpacing: 0.2,
          }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function ShelterApp() {
  const [stack, setStack] = React.useState([{ name: 'splash', params: {} }]);
  const [tab, setTab] = React.useState('home');

  const current = stack[stack.length - 1];

  const goto = React.useCallback((name, params = {}) => {
    setStack(s => [...s, { name, params }]);
  }, []);
  const replace = React.useCallback((name, params = {}) => {
    setStack(s => [...s.slice(0, -1), { name, params }]);
  }, []);
  const back = React.useCallback(() => {
    setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  }, []);

  const onTabChange = (id) => {
    setTab(id);
    const home = {
      home: 'home', pets: 'pets', forms: 'forms', chat: 'chat', me: 'me',
    }[id];
    setStack([{ name: home, params: {} }]);
  };

  let screen;
  switch (current.name) {
    case 'splash':       screen = <ShelterSplashScreen  onContinue={(go) => replace(go)}/>; break;
    case 'register':     screen = <ShelterRegisterScreen onBack={back} onContinue={(go) => { setTab('home'); replace(go); }}/>; break;
    case 'login':        screen = <ShelterLoginScreen   onBack={back} onContinue={(go) => { setTab('home'); replace(go); }}/>; break;

    case 'home':         screen = <ShelterHomeScreen    goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;
    case 'pets':         screen = <ShelterPetsScreen    goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;
    case 'petDetail': {
      const pet = (SHELTER_PETS || []).find(p => p.key === current.params?.pet);
      screen = <ShelterPetDetailScreen pet={pet} onBack={back}/>; break;
    }
    case 'addPet':       screen = <ShelterAddPetScreen onBack={back} onDone={() => back()}/>; break;
    case 'forms':        screen = <ShelterFormsScreen   goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;
    case 'appReview': {
      const app = (APPLICATIONS || []).find(a => a.id === current.params?.id);
      screen = <ShelterAppReviewScreen app={app} onBack={back} goto={(n,p)=>goto(n,p)} setTab={onTabChange}/>; break;
    }
    case 'chat':         screen = <ShelterChatScreen    goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;
    case 'chatThread': {
      const c = (SHELTER_CHATS || []).find(x => x.petKey === current.params?.pet) || SHELTER_CHATS[0];
      screen = <ShelterChatThreadScreen conv={c} onBack={back}/>; break;
    }
    case 'me':           screen = <ShelterMeScreen      goto={(n,p)=>goto(n,p)} tab={tab} setTab={onTabChange}/>; break;

    default: screen = <div style={{ padding: 40, fontFamily: FONT_BODY }}>Unknown screen: {current.name}</div>;
  }
  return screen;
}

Object.assign(window, { ShelterApp, ShelterTabBar });
