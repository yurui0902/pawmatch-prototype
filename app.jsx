// app.jsx — App shell. Manages route stack + tab state + transitions.

function App() {
  // route stack — top of stack is current screen
  const [stack, setStack] = React.useState([{ name: 'splash', params: {} }]);
  const [tab, setTab] = React.useState('pets');
  // onboarding answers, lifted up so the swipe feed can use them
  const [petTypes, setPetTypes] = React.useState(['both']);
  // user's matches — lifted so Profile can show a live count
  const [matches, setMatches] = React.useState([
    { petKey: 'poppy',  met: 6, total: 6, status: 'ready',      age: '2h' },
    { petKey: 'miso',   met: 5, total: 6, status: 'incomplete', age: '5h' },
    { petKey: 'clover', met: 5, total: 5, status: 'submitted',  age: '3d' },
    { petKey: 'olive',  met: 3, total: 6, status: 'incomplete', age: '4d' },
  ]);

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

  // Tab change resets to that tab's home screen
  const onTabChange = (id) => {
    setTab(id);
    const home = {
      pets: 'swipe',
      matches: 'matches',
      chat: 'chat',
      petCare: 'petCare',
      me: 'profile',
    }[id];
    setStack([{ name: home, params: {} }]);
  };

  // Map name → component
  let screen;
  switch (current.name) {
    case 'splash':       screen = <SplashScreen onContinue={(go) => replace(go)}/>; break;
    case 'register':     screen = <RegisterScreen onBack={back} onContinue={(go) => replace(go === 'onboarding' ? 'onboarding' : go)}/>; break;
    case 'login':        screen = <LoginScreen onBack={back} onContinue={(go) => { setTab('pets'); replace(go); }}/>; break;
    case 'onboarding':   screen = <OnboardingScreen
                                    onContinue={(types) => { setPetTypes(types && types.length ? types : ['both']); setTab('pets'); replace('swipe'); }}
                                    onSkip={() => { setPetTypes(['both']); setTab('pets'); replace('swipe'); }}
                                  />; break;

    case 'swipe':        screen = <SwipeScreen goto={(n, p) => goto(n, p)} tab={tab} setTab={onTabChange} petTypes={petTypes}/>; break;
    case 'matches':      screen = <MatchesScreen goto={(n, p) => goto(n, p)} tab={tab} setTab={onTabChange} matches={matches}/>; break;
    case 'chat':         screen = <ChatScreen goto={(n, p) => goto(n, p)} tab={tab} setTab={onTabChange}/>; break;
    case 'chatThread':   screen = <ChatThreadScreen goto={(n, p) => p ? goto(n, p) : back()} params={current.params}/>; break;

    case 'petCare':      screen = <PetCareScreen goto={(n, p) => goto(n, p)} tab={tab} setTab={onTabChange}/>; break;
    case 'vetDetail':    screen = <VetDetailScreen goto={(n, p) => goto(n, p)} onBack={back} params={current.params}/>; break;
    case 'insurance':    screen = <InsuranceScreen goto={(n, p) => goto(n, p)} onBack={back}/>; break;
    case 'checkout':     screen = <CheckoutScreen onBack={back} goto={(n, p) => goto(n, p)}/>; break;
    case 'insuranceWelcome': screen = <InsuranceWelcomeScreen onContinue={() => { setTab('petCare'); setStack([{ name: 'petCare', params: {} }]); }}/>; break;
    case 'uploadForm':   screen = <UploadFormScreen goto={(n, p) => goto(n, p)} onBack={back}/>; break;
    case 'formVerified': screen = <FormVerifiedScreen goto={(n, p) => goto(n, p)} onBack={back}/>; break;

    case 'profile':      screen = <ProfileScreen goto={(n, p) => goto(n, p)} tab={tab} setTab={onTabChange} matchCount={matches.length}/>; break;

    case 'matchCheck': {
      const petKey = current.params?.pet || 'poppy';
      const feed = (typeof FEED !== 'undefined' && FEED) || [];
      const pet = feed.find(p => p.key === petKey) || { key: petKey, name: petKey, age: '—', breed: '—', shelter: 'Shelter', dist: '—', fee: 0, traits: [], kind: 'dog', reqs: [] };
      screen = <MatchCheckOverlay key={petKey} pet={pet} onClose={back} onContinue={() => { setTab('chat'); setStack([{ name: 'chatThread', params: { pet: petKey, who: pet.shelter } }]); }}/>;
      break;
    }

    case 'detail': {
      const petKey = current.params?.pet || 'poppy';
      const feed = (typeof FEED !== 'undefined' && FEED) || [];
      const pet = feed.find(p => p.key === petKey) || { key: petKey, name: petKey, age: '—', breed: '—', shelter: 'Shelter', dist: '—', fee: 0, traits: [], kind: 'dog', reqs: [], bio: '' };
      screen = <PetDetailScreen pet={pet} onBack={back} onApply={() => replace('matchCheck', { pet: petKey })}/>;
      break;
    }

    default: screen = <div style={{ padding: 40, fontFamily: FONT_BODY }}>Unknown screen: {current.name}</div>;
  }

  return screen;
}

Object.assign(window, { App });
