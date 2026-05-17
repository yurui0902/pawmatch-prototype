// screens-shelter-auth.jsx — Splash + Register + Login for the shelter app.
// Splash keeps the same Gemini hero illustration as the adopter side for
// brand consistency, with shelter-specific copy.

const SPLASH_HERO_DATA_URL_SHELTER = window.__PAWMATCH_SPLASH_HERO__ || 'assets/splash-hero.jpg';

function ShelterSplashScreen({ onContinue }) {
  const [zooming, setZooming] = React.useState(false);

  const handleCTA = (route) => {
    setZooming(true);
    setTimeout(() => onContinue(route), 480);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#FFFFFF',
      overflow: 'hidden', color: PM.night,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '62%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FFFFFF',
        transform: zooming ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.5s ease',
        overflow: 'hidden',
      }}>
        <img
          src={SPLASH_HERO_DATA_URL_SHELTER}
          alt="PawMatch for Shelters"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 38%',
            display: 'block',
          }}
        />
        {/* shelter badge floats top-left */}
        <div style={{
          position: 'absolute', top: 56, left: 18,
          padding: '6px 12px', borderRadius: 14,
          background: PM.night, color: '#FFF',
          fontFamily: FONT_MONO, fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 4px 12px rgba(0,0,0,0.24)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: PM.coral }}/>
          For shelters
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        padding: '20px 20px 44px',
        opacity: zooming ? 0 : 1, transform: zooming ? 'translateY(40px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.4s ease',
      }}>
        <div style={{
          background: '#FCF6EC', padding: 26,
          borderRadius: 28,
          boxShadow: '0 -8px 30px rgba(20,20,40,0.10), 0 20px 40px rgba(20,20,40,0.06)',
        }}>
          <h1 style={{
            margin: 0,
            fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400,
            letterSpacing: -0.8, lineHeight: 1.02, color: '#1F1F3A',
          }}>
            More homes,<br/>
            <em style={{ color: '#FF4FA0' }}>less paperwork</em>.
          </h1>
          <div style={{
            marginTop: 12, fontFamily: FONT_BODY, fontSize: 14, color: '#5F5F7A', lineHeight: 1.4,
          }}>
            One inbox for applications, AI-verified forms, and a direct line to every adopter.
          </div>
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => handleCTA('register')} style={{
              height: 54, background: '#FF4FA0', color: '#FFF', border: 'none', cursor: 'pointer',
              fontFamily: FONT_BODY, fontSize: 16, fontWeight: 600,
              borderRadius: 27,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 6px 18px rgba(255,79,160,0.4)',
            }}>
              Register your shelter →
            </button>
            <button onClick={() => handleCTA('login')} style={{
              height: 44, background: 'transparent', color: '#1F1F3A', border: 'none', cursor: 'pointer',
              fontFamily: FONT_BODY, fontSize: 14, fontWeight: 500,
            }}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShelterRegisterScreen({ onBack, onContinue }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Register shelter" onBack={onBack}/>
      <div style={{ flex: 1, padding: '8px 24px 24px', overflow: 'auto' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: PM.violet, textTransform: 'uppercase' }}>New here</div>
        <h1 style={{
          margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 400,
          letterSpacing: -0.8, lineHeight: 1.02, color: PM.night,
        }}>
          Set up your <em style={{ color: PM.coral }}>shelter</em><br/>in 2 minutes.
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft, marginBottom: 26 }}>
          We'll verify your 501(c)(3) or breeder license after sign-up. Listings can go live as drafts immediately.
        </div>

        <ShelterInput label="Organization name" placeholder="Willow Creek Rescue"/>
        <div style={{ height: 12 }}/>
        <ShelterInput label="Operator name" placeholder="Meadow Park"/>
        <div style={{ height: 12 }}/>
        <ShelterInput label="Work email" placeholder="meadow@willowcreek.org"/>
        <div style={{ height: 12 }}/>
        <ShelterInput label="Password" placeholder="At least 12 characters" type="password"/>

        <div style={{ marginTop: 14, padding: 14, borderRadius: 18, background: `${PM.violet}12`,
          fontFamily: FONT_BODY, fontSize: 12, color: PM.ink, lineHeight: 1.5, borderLeft: `3px solid ${PM.violet}`,
        }}>
          <strong>Why we ask:</strong> verified shelters get a badge and priority in adopter search results.
        </div>

        <div style={{ marginTop: 22 }}>
          <PMButton onClick={() => onContinue('home')} variant="primary">Create shelter account →</PMButton>
        </div>

        <div style={{ marginTop: 18, textAlign: 'center', fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft }}>
          Already registered? <span style={{ color: PM.coral, fontWeight: 600, cursor: 'pointer' }} onClick={() => onContinue('login')}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

function ShelterLoginScreen({ onBack, onContinue }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Sign in" onBack={onBack}/>
      <div style={{ flex: 1, padding: '8px 24px 24px', overflow: 'auto' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: PM.violet, textTransform: 'uppercase' }}>Welcome back</div>
        <h1 style={{
          margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 400,
          letterSpacing: -0.8, lineHeight: 1.02, color: PM.night,
        }}>
          Good to see you,<br/><em style={{ color: PM.coral }}>{SHELTER.operator.split(' ')[0]}</em>.
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft, marginBottom: 26 }}>
          {SHELTER.name} · {SHELTER_STATS.pendingApplications} pending applications.
        </div>

        <ShelterInput label="Email" placeholder="meadow@willowcreek.org" prefill="meadow@willowcreek.org"/>
        <div style={{ height: 12 }}/>
        <ShelterInput label="Password" placeholder="••••••••" type="password" prefill="········"/>
        <div style={{ textAlign: 'right', marginTop: 6, fontFamily: FONT_BODY, fontSize: 13, color: PM.coral, fontWeight: 500 }}>Forgot?</div>

        <div style={{ marginTop: 24 }}>
          <PMButton onClick={() => onContinue('home')} variant="primary">Sign in</PMButton>
        </div>
      </div>
    </div>
  );
}

function ShelterInput({ label, placeholder, type = 'text', prefill }) {
  const [val, setVal] = React.useState(prefill || '');
  const [focus, setFocus] = React.useState(false);
  return (
    <div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginBottom: 6, fontWeight: 500, letterSpacing: 0.2 }}>{label}</div>
      <input
        type={type} value={val} onChange={e => setVal(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        placeholder={placeholder}
        style={{
          width: '100%', height: 52, padding: '0 18px', boxSizing: 'border-box',
          background: PM.white, border: `1.5px solid ${focus ? PM.night : PM.line}`,
          borderRadius: 18, fontFamily: FONT_BODY, fontSize: 16, color: PM.night,
          outline: 'none', transition: 'border-color 0.15s',
        }}
      />
    </div>
  );
}

Object.assign(window, { ShelterSplashScreen, ShelterRegisterScreen, ShelterLoginScreen });
