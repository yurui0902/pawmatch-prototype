// shelter-demo.jsx — cross-end presentation demo.
//
// Replaces the old standalone toggle.  The demo is now driven by what the
// user does inside the apps:
//   1. Submit Poppy on adopter Matches  → shelter view slides in,
//                                          Sarah Chen's pre-app appears
//   2. Tap Sarah on shelter side        → shelter right phone shows
//                                          her Application Review
//   3. Tap Message in Application Review → shelter side opens chat with
//                                          Sarah; adopter Chat tab shows
//                                          unread; Poppy row shows
//                                          "Shelter replied"
//   4. Tap Reset demo in Matches header → everything snaps back.
//
// All state lives on `window.__pmDemoState`; subscribe with useDemoState().

// ─── State bus ────────────────────────────────────────────

if (!window.__pmDemoState) {
  window.__pmDemoState = {
    shelterVisible:  false,
    sarahSubmitted:  false,
    shelterMessaged: false,
    sarahJustArrived: false,    // transient — drives the slide-in animation
    meetingTime:     null,      // string when shelter has sent a proposed slot
    meetingAccepted: false,     // adopter has tapped Accept on their side
  };
}

function pmBroadcastDemo() {
  window.dispatchEvent(new CustomEvent('pm-demo-state-changed', {
    detail: { ...window.__pmDemoState },
  }));
}

window.__pmDemoActions = {
  submitPoppy() {
    window.__pmDemoState.shelterVisible = true;
    window.__pmDemoState.sarahSubmitted = true;
    window.__pmDemoState.sarahJustArrived = true;
    pmBroadcastDemo();
    // Clear the "just arrived" flag after the highlight animation finishes
    // so re-renders don't keep firing it.
    setTimeout(() => {
      window.__pmDemoState.sarahJustArrived = false;
      pmBroadcastDemo();
    }, 3000);
  },
  shelterMessages() {
    window.__pmDemoState.shelterMessaged = true;
    pmBroadcastDemo();
  },
  sendMeeting(time) {
    window.__pmDemoState.meetingTime = time;
    window.__pmDemoState.meetingAccepted = false;
    pmBroadcastDemo();
  },
  cancelMeeting() {
    window.__pmDemoState.meetingTime = null;
    window.__pmDemoState.meetingAccepted = false;
    pmBroadcastDemo();
  },
  acceptMeeting() {
    if (window.__pmDemoState.meetingTime) {
      window.__pmDemoState.meetingAccepted = true;
      pmBroadcastDemo();
    }
  },
  reset() {
    window.__pmDemoState = {
      shelterVisible:  false,
      sarahSubmitted:  false,
      shelterMessaged: false,
      sarahJustArrived: false,
      meetingTime:     null,
      meetingAccepted: false,
    };
    pmBroadcastDemo();
  },
};

function useDemoState() {
  const [s, setS] = React.useState({ ...window.__pmDemoState });
  React.useEffect(() => {
    const h = () => setS({ ...window.__pmDemoState });
    window.addEventListener('pm-demo-state-changed', h);
    return () => window.removeEventListener('pm-demo-state-changed', h);
  }, []);
  return s;
}

// ─── Reset button (used by Matches TopBar) ────────────────

function ResetDemoButton() {
  const s = useDemoState();
  const showing = s.shelterVisible || s.sarahSubmitted || s.shelterMessaged;
  if (!showing) return null;
  return (
    <button onClick={() => window.__pmDemoActions.reset()} style={{
      height: 36, padding: '0 12px', borderRadius: 18,
      background: '#FFF', color: PM.violet,
      border: `1.5px solid ${PM.violet}`, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
      whiteSpace: 'nowrap',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 7 Q 3 2.5, 7 2.5 Q 11 2.5, 11 7 Q 11 11.5, 7 11.5"
              stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        <path d="M3 7 L 1 5 M 3 7 L 5 5"
              stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Reset demo
    </button>
  );
}

// ─── Right-phone demo view ────────────────────────────────

function ShelterDemoView() {
  const s = useDemoState();
  const [stack, setStack] = React.useState([{ name: 'forms', params: {} }]);
  const current = stack[stack.length - 1];

  // When Sarah is unsubmitted, present a filtered application list that hides
  // her record so the Pre-app segment looks "empty (waiting)".
  const applicationsForDemo = React.useMemo(() => {
    if (s.sarahSubmitted) {
      // Reorder: put Sarah at the very top so she's visible immediately
      const sarah = (APPLICATIONS || []).filter(a => a.applicant === 'Sarah Chen');
      const rest  = (APPLICATIONS || []).filter(a => a.applicant !== 'Sarah Chen');
      return [...sarah, ...rest];
    }
    return (APPLICATIONS || []).filter(a => a.applicant !== 'Sarah Chen');
  }, [s.sarahSubmitted]);

  const goto = (name, params = {}) => setStack(st => [...st, { name, params }]);
  const back = () => setStack(st => st.length > 1 ? st.slice(0, -1) : st);

  // When the shelter clicks Message inside Application Review we want to:
  //   (a) navigate the right phone into the chat thread
  //   (b) fire the global event so the adopter chat tab shows unread
  const goFromReview = (name, params) => {
    if (name === 'chatThread') {
      window.__pmDemoActions.shelterMessages();
    }
    goto(name, params);
  };

  let screen;
  switch (current.name) {
    case 'forms':
      screen = (
        <ShelterFormsScreen
          goto={goto} tab="forms" setTab={() => {}}
          initialSeg="pre-app" hideTabBar
          apps={applicationsForDemo}
          highlightApplicant={s.sarahJustArrived ? 'Sarah Chen' : null}
        />
      );
      break;
    case 'appReview': {
      const app = applicationsForDemo.find(a => a.id === current.params?.id)
        || (APPLICATIONS || []).find(a => a.id === current.params?.id)
        || APPLICATIONS[0];
      screen = (
        <ShelterAppReviewScreen
          app={app}
          onBack={back}
          goto={goFromReview}
          setTab={() => {}}
        />
      );
      break;
    }
    case 'chatThread': {
      // Pull a conversation row matching the pet; fall back to Sarah Chen.
      const petKey = current.params?.pet || 'poppy';
      let conv = (window.SHELTER_CHATS || []).find(c => c.petKey === petKey);
      if (!conv) {
        conv = { who: 'Sarah Chen', sub: 'About Poppy', petKey, preview: '', age: 'now', unread: 0 };
      }
      screen = <ShelterChatThreadScreen conv={conv} onBack={back}/>;
      break;
    }
    default:
      screen = (
        <div style={{ padding: 40, fontFamily: FONT_BODY }}>
          Unknown demo route: {current.name}
        </div>
      );
  }
  return screen;
}

Object.assign(window, { useDemoState, ResetDemoButton, ShelterDemoView });
