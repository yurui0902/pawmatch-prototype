// shelter-demo.jsx — cross-end presentation demo.
//
// Hosted in the adopter HTML. Defines:
//   • a tiny event-bus + hook for toggling the shelter peek state
//   • ShelterDemoToggle  — pill button that lives in the Matches header
//   • ShelterDemoView    — mini-app that renders only the shelter Forms /
//     Application Review screens (no splash / login / tab bar)
// The Stage component in PawMatch.html watches the bus and decides whether
// to render one iOS device frame or two side-by-side.

// ─── Event bus ────────────────────────────────────────────
window.__pmShelterDemo = !!window.__pmShelterDemo;
window.__pmToggleShelterDemo = function () {
  window.__pmShelterDemo = !window.__pmShelterDemo;
  window.dispatchEvent(new CustomEvent('pm-shelter-demo-changed', {
    detail: { on: window.__pmShelterDemo },
  }));
};

function useShelterDemo() {
  const [on, setOn] = React.useState(!!window.__pmShelterDemo);
  React.useEffect(() => {
    const handler = (e) => setOn(!!(e && e.detail ? e.detail.on : window.__pmShelterDemo));
    window.addEventListener('pm-shelter-demo-changed', handler);
    return () => window.removeEventListener('pm-shelter-demo-changed', handler);
  }, []);
  return on;
}

// ─── Toggle button (lives in Matches header right slot) ───

function ShelterDemoToggle() {
  const on = useShelterDemo();
  return (
    <button onClick={() => window.__pmToggleShelterDemo()} style={{
      height: 36, padding: '0 12px', borderRadius: 18,
      background: on ? '#FFF' : PM.violet,
      color:      on ? PM.violet : '#FFF',
      border:     on ? `1.5px solid ${PM.violet}` : 'none',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
      boxShadow: on ? 'none' : '0 4px 12px rgba(0,52,255,0.30)',
      transition: 'all 0.18s',
      whiteSpace: 'nowrap',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="0.5" y="1.5" width="5" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        <rect x="8.5" y="1.5" width="5" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        <path d="M6 7 L 8 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      {on ? 'Hide shelter' : 'Show shelter view'}
    </button>
  );
}

// ─── Demo phone (right side) ──────────────────────────────

function ShelterDemoView() {
  // Local route stack — starts on Forms with Pre-app focused on Sarah Chen.
  const [stack, setStack] = React.useState([{ name: 'forms', params: {} }]);
  const current = stack[stack.length - 1];

  const goto = (name, params = {}) => setStack(s => [...s, { name, params }]);
  const back = () => setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  const noop = () => {};

  let screen;
  switch (current.name) {
    case 'forms':
      screen = (
        <ShelterFormsScreen
          goto={goto} tab="forms" setTab={noop}
          initialSeg="pre-app" hideTabBar
        />
      );
      break;
    case 'appReview': {
      const app = (APPLICATIONS || []).find(a => a.id === current.params?.id) || APPLICATIONS[0];
      screen = (
        <ShelterAppReviewScreen
          app={app}
          onBack={back}
          goto={(n, p) => p ? goto(n, p) : goto(n)}
          setTab={noop}
        />
      );
      break;
    }
    default:
      screen = (
        <div style={{ padding: 40, fontFamily: FONT_BODY }}>
          Demo route not found: {current.name}
        </div>
      );
  }
  return screen;
}

Object.assign(window, { useShelterDemo, ShelterDemoToggle, ShelterDemoView });
