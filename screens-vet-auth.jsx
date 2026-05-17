// screens-vet-auth.jsx — Splash + Register + Login for the vet-clinic app.

const SPLASH_HERO_DATA_URL_VET = window.__PAWMATCH_SPLASH_HERO__ || 'assets/splash-hero.jpg';

function VetSplashScreen({ onContinue }) {
  const [zooming, setZooming] = React.useState(false);
  const handleCTA = (route) => {
    setZooming(true);
    setTimeout(() => onContinue(route), 480);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#FFFFFF',
      overflow: 'hidden', color: PM.night, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '62%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FFFFFF',
        transform: zooming ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.5s ease', overflow: 'hidden',
      }}>
        <img src={SPLASH_HERO_DATA_URL_VET} alt="PawMatch for Vets" style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 38%', display: 'block',
        }}/>
        <div style={{
          position: 'absolute', top: 56, left: 18,
          padding: '6px 12px', borderRadius: 14,
          background: PM.night, color: '#FFF',
          fontFamily: FONT_MONO, fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 4px 12px rgba(0,0,0,0.24)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: PM.violet }}/>
          For vet clinics
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
            margin: 0, fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 400,
            letterSpacing: -0.8, lineHeight: 1.02, color: '#1F1F3A',
          }}>
            AI notes,<br/>
            <em style={{ color: '#FF4FA0' }}>instant claims</em>.
          </h1>
          <div style={{
            marginTop: 12, fontFamily: FONT_BODY, fontSize: 14, color: '#5F5F7A', lineHeight: 1.4,
          }}>
            Record a visit. We draft the SOAP note and file the insurance claim in one tap.
          </div>
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => handleCTA('register')} style={{
              height: 54, background: '#FF4FA0', color: '#FFF', border: 'none', cursor: 'pointer',
              fontFamily: FONT_BODY, fontSize: 16, fontWeight: 600, borderRadius: 27,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 6px 18px rgba(255,79,160,0.4)',
            }}>Register your clinic →</button>
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

function VetRegisterScreen({ onBack, onContinue }) {
  const [acctType, setAcctType] = React.useState('admin');
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Register clinic" onBack={onBack}/>
      <div style={{ flex: 1, padding: '8px 24px 24px', overflow: 'auto' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: PM.violet, textTransform: 'uppercase' }}>New here</div>
        <h1 style={{ margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 400, letterSpacing: -0.8, lineHeight: 1.02, color: PM.night }}>
          Less paperwork,<br/><em style={{ color: PM.coral }}>more patients</em>.
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft, marginBottom: 22 }}>
          AI-drafted SOAP notes, automatic insurance claims, and a single inbox for adopters.
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {[['admin','Clinic admin'],['vet','Individual vet']].map(([k,l]) => {
            const on = acctType === k;
            return (
              <button key={k} onClick={() => setAcctType(k)} style={{
                flex: 1, padding: 14, borderRadius: 16,
                background: on ? PM.night : PM.white, color: on ? PM.cream : PM.ink,
                border: on ? 'none' : `1.5px solid ${PM.line}`, cursor: 'pointer',
                fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600,
              }}>{l}</button>
            );
          })}
        </div>

        <VetInput label="Clinic name" placeholder="Forest Park Veterinary"/>
        <div style={{ height: 10 }}/>
        <VetInput label="Your name"   placeholder="Dr. Anjali Patel"/>
        <div style={{ height: 10 }}/>
        <VetInput label="Work email"  placeholder="anjali@forestparkvet.com"/>
        <div style={{ height: 10 }}/>
        <VetInput label="License #"   placeholder="OR-VET-…"/>
        <div style={{ height: 10 }}/>
        <VetInput label="Password"    placeholder="At least 12 characters" type="password"/>

        <div style={{ marginTop: 14, padding: 14, borderRadius: 18, background: `${PM.violet}12`,
          fontFamily: FONT_BODY, fontSize: 12, color: PM.ink, lineHeight: 1.5, borderLeft: `3px solid ${PM.violet}`,
        }}>
          <strong>License verification:</strong> we cross-check your state board within 24 hrs. You can start drafting notes immediately.
        </div>

        <div style={{ marginTop: 22 }}>
          <PMButton onClick={() => onContinue('home')} variant="primary">Create clinic account →</PMButton>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center', fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft }}>
          Already registered? <span style={{ color: PM.coral, fontWeight: 600, cursor: 'pointer' }} onClick={() => onContinue('login')}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

function VetLoginScreen({ onBack, onContinue }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Sign in" onBack={onBack}/>
      <div style={{ flex: 1, padding: '8px 24px 24px', overflow: 'auto' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: PM.violet, textTransform: 'uppercase' }}>Welcome back</div>
        <h1 style={{ margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 400, letterSpacing: -0.8, lineHeight: 1.02, color: PM.night }}>
          Hi <em style={{ color: PM.coral }}>{CLINIC.lead.split(' ').slice(-1)[0]}</em>.
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft, marginBottom: 26 }}>
          {CLINIC.name} · {VET_STATS.todayAppointments} appointments today, {VET_STATS.draftNotes} notes to sign.
        </div>

        <VetInput label="Email" placeholder="anjali@forestparkvet.com" prefill="anjali@forestparkvet.com"/>
        <div style={{ height: 12 }}/>
        <VetInput label="Password" placeholder="••••••••" type="password" prefill="········"/>
        <div style={{ textAlign: 'right', marginTop: 6, fontFamily: FONT_BODY, fontSize: 13, color: PM.coral, fontWeight: 500 }}>Forgot?</div>

        <div style={{ marginTop: 24 }}>
          <PMButton onClick={() => onContinue('home')} variant="primary">Sign in</PMButton>
        </div>
      </div>
    </div>
  );
}

function VetInput({ label, placeholder, type = 'text', prefill }) {
  const [val, setVal] = React.useState(prefill || '');
  const [focus, setFocus] = React.useState(false);
  return (
    <div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginBottom: 6, fontWeight: 500 }}>{label}</div>
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

Object.assign(window, { VetSplashScreen, VetRegisterScreen, VetLoginScreen });
