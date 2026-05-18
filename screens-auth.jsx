// screens-auth.jsx — Splash, Login, Register, Onboarding

// Hero illustration shown on the splash screen. base64-inlined so the
// standalone HTML works from file:// without needing the assets/ folder.
const SPLASH_HERO_DATA_URL = window.__PAWMATCH_SPLASH_HERO__ || 'assets/splash-hero.jpg';

// Tiny photo helper for onboarding cards — falls back to nothing if no photo.
function PhotoCircle({ src, size = 70 }) {
  if (!src) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden',
      background: '#F3F3F3',
      boxShadow: '0 4px 10px rgba(20,20,40,0.10)',
    }}>
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
    </div>
  );
}

// ─── Splash / Welcome ──────────────────────────────────────

function SplashScreen({ onContinue }) {
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
      {/* HERO — illustrated wordmark + scene, fills the upper portion */}
      <div style={{
        position: 'absolute', top: 50, left: 0, right: 0,
        height: 540,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        background: '#FFFFFF',
        transform: zooming ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.5s ease',
        overflow: 'hidden',
      }}>
        <img
          className="pm-hero-img"
          src={SPLASH_HERO_DATA_URL}
          alt="PawMatch"
          style={{
            width: '100%', height: 'auto',
            objectFit: 'contain', objectPosition: 'center top',
            display: 'block',
          }}
        />
        <SplashFX/>
      </div>

      {/* CTA CARD — cream card, overlaps hero from the bottom */}
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
            Find your<br/>
            <em className="pm-headline-pop" style={{ color: '#FF4FA0' }}>perfect match</em>.
          </h1>
          <div style={{
            marginTop: 12, fontFamily: FONT_BODY, fontSize: 14, color: '#5F5F7A', lineHeight: 1.4,
          }}>
            Adopt, find a vet, and protect them — all in one app.
          </div>
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => handleCTA('register')} style={{
              height: 54, background: '#FF4FA0', color: '#FFF', border: 'none', cursor: 'pointer',
              fontFamily: FONT_BODY, fontSize: 16, fontWeight: 600,
              borderRadius: 27,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 6px 18px rgba(255,79,160,0.4)',
            }}>
              Get started →
            </button>
            <button onClick={() => handleCTA('login')} style={{
              height: 44, background: 'transparent', color: '#1F1F3A', border: 'none', cursor: 'pointer',
              fontFamily: FONT_BODY, fontSize: 14, fontWeight: 500,
            }}>I already have an account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Register ──────────────────────────────────────────────

function RegisterScreen({ onBack, onContinue }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Create account" onBack={onBack}/>
      <div style={{ flex: 1, padding: '8px 24px 24px', overflow: 'auto' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: PM.violet, textTransform: 'uppercase' }}>New here</div>
        <h1 style={{
          margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 400,
          letterSpacing: -0.8, lineHeight: 1.02, color: PM.night,
        }}>
          Set up your <em style={{ color: PM.coral }}>orbit</em><br/>in 30 seconds.
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft, marginBottom: 26 }}>
          Sign up to start swiping. Your answers save to your profile and reuse across every application.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SSOButton kind="apple"/>
          <SSOButton kind="google"/>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 14px' }}>
          <div style={{ flex: 1, height: 1, background: PM.line }}/>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: PM.inkFaint, letterSpacing: 1, textTransform: 'uppercase' }}>or email</span>
          <div style={{ flex: 1, height: 1, background: PM.line }}/>
        </div>

        <InputField label="Email" placeholder="sarah@example.com"/>
        <div style={{ height: 12 }}/>
        <InputField label="Password" placeholder="At least 8 characters" type="password"/>

        <div style={{ marginTop: 24 }}>
          <PMButton onClick={() => onContinue('onboarding')} variant="primary">Create account →</PMButton>
        </div>

        <div style={{ marginTop: 18, textAlign: 'center', fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft }}>
          Already have one? <span style={{ color: PM.coral, fontWeight: 600, cursor: 'pointer' }} onClick={() => onContinue('login')}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onBack, onContinue }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Sign in" onBack={onBack}/>
      <div style={{ flex: 1, padding: '8px 24px 24px', overflow: 'auto' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: PM.violet, textTransform: 'uppercase' }}>Welcome back</div>
        <h1 style={{
          margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 400,
          letterSpacing: -0.8, lineHeight: 1.02, color: PM.night,
        }}>
          The orbit<br/>continues, <em style={{ color: PM.coral }}>Sarah</em>.
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft, marginBottom: 26 }}>
          Pick up where you left off.
        </div>

        <InputField label="Email or username" placeholder="sarah@example.com" prefill="sarah@example.com"/>
        <div style={{ height: 12 }}/>
        <InputField label="Password" placeholder="••••••••" type="password" prefill="········"/>
        <div style={{ textAlign: 'right', marginTop: 6, fontFamily: FONT_BODY, fontSize: 13, color: PM.coral, fontWeight: 500 }}>Forgot?</div>

        <div style={{ marginTop: 24 }}>
          <PMButton onClick={() => onContinue('swipe')} variant="primary">Sign in</PMButton>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 14px' }}>
          <div style={{ flex: 1, height: 1, background: PM.line }}/>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: PM.inkFaint, letterSpacing: 1, textTransform: 'uppercase' }}>or</span>
          <div style={{ flex: 1, height: 1, background: PM.line }}/>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SSOButton kind="apple"/>
          <SSOButton kind="google"/>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, type = 'text', prefill }) {
  const [val, setVal] = React.useState(prefill || '');
  const [focus, setFocus] = React.useState(false);
  return (
    <div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginBottom: 6, fontWeight: 500, letterSpacing: 0.2 }}>{label}</div>
      <input
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
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

function SSOButton({ kind }) {
  if (kind === 'apple') return (
    <button style={{
      height: 52, width: '100%', borderRadius: 26, background: PM.night, color: PM.cream,
      border: 'none', fontFamily: FONT_BODY, fontSize: 15, fontWeight: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
    }}>
      <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor"><path d="M11.5 2c0 1.5-.6 2.8-1.8 3.7-1 .8-2.4 1.5-3.5 1.3-.1-1.4.6-2.9 1.6-3.7C8.8 2.4 10.3 2 11.5 2zM14 14.5c-.5 1.1-.7 1.6-1.4 2.6-.9 1.4-2.2 3.2-3.8 3.2-1.4 0-1.8-1-3.7-1-1.9 0-2.4 1-3.8 1-1.6 0-2.8-1.6-3.7-3-2.5-3.9-2.8-8.5-1.2-10.9 1.1-1.7 2.9-2.7 4.5-2.7 1.7 0 2.7 1 4.1 1 1.3 0 2.1-1 4.1-1 1.5 0 3.1.8 4.2 2.3-3.7 2-3.1 7.3.7 8.5z"/></svg>
      Continue with Apple
    </button>
  );
  return (
    <button style={{
      height: 52, width: '100%', borderRadius: 26, background: PM.white,
      color: PM.night, border: `1.5px solid ${PM.line}`,
      fontFamily: FONT_BODY, fontSize: 15, fontWeight: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
    }}>
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8c-.2 1.1-.8 2-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z"/>
        <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3C2.4 15.9 5.5 18 9 18z"/>
        <path fill="#FBBC05" d="M3.9 10.7c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7V5H.9C.3 6.2 0 7.6 0 9s.3 2.8.9 4l3-2.3z"/>
        <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.5 1.4l2.6-2.6C13.5.9 11.4 0 9 0 5.5 0 2.4 2.1.9 5l3 2.3C4.6 5.1 6.6 3.6 9 3.6z"/>
      </svg>
      Continue with Google
    </button>
  );
}

// ─── Onboarding ────────────────────────────────────────────

function OnboardingScreen({ onContinue, onSkip }) {
  const [petTypes, setPetTypes] = React.useState(['both']);
  const [household, setHousehold] = React.useState('family');
  const [experience, setExperience] = React.useState('current');
  const [step, setStep] = React.useState(2);

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      {/* Top */}
      <div style={{ padding: '60px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                width: i === step ? 22 : 8, height: 4, borderRadius: 2,
                background: i <= step ? PM.night : PM.line, transition: 'width 0.3s',
              }}/>
            ))}
          </div>
          <button onClick={onSkip} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft, fontWeight: 500,
          }}>Skip ✕</button>
        </div>
        <div style={{ marginTop: 22, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.5, color: PM.violet, textTransform: 'uppercase' }}>
          0{step} / 03 · Preferences
        </div>
        <h1 style={{
          margin: '8px 0 6px', fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 400,
          letterSpacing: -0.8, lineHeight: 1.02, color: PM.night,
        }}>
          What are you<br/><em style={{ color: PM.coral }}>looking for</em>?
        </h1>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: PM.inkSoft }}>
          We'll shape your feed. Change anytime in Profile.
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 20px 24px' }}>
        <OBSection label="Pet type" hint="Pick one or more">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <OBCardChoice icon={<PhotoCircle key="dog" src={window.__pmPetPhotos && window.__pmPetPhotos.poppy} size={70}/>} label="Dogs"
              selected={petTypes.includes('dogs')}
              onClick={() => toggle(petTypes, setPetTypes, 'dogs')} accent={PM.coral}/>
            <OBCardChoice icon={<PhotoCircle key="cat" src={window.__pmPetPhotos && window.__pmPetPhotos.may} size={70}/>} label="Cats"
              selected={petTypes.includes('cats')}
              onClick={() => toggle(petTypes, setPetTypes, 'cats')} accent={PM.gold}/>
            <OBCardChoice
              icon={
                <div style={{
                  width: 70, height: 70, borderRadius: '50%', overflow: 'hidden',
                  background: `url("${window.__PAWMATCH_SPLASH_HERO__ || 'assets/splash-hero.jpg'}") 50% 58% / 165% auto no-repeat #FFFFFF`,
                  boxShadow: '0 4px 10px rgba(20,20,40,0.10)',
                }}/>
              }
              label="Both cats and dogs"
              selected={petTypes.includes('both')}
              onClick={() => toggle(petTypes, setPetTypes, 'both')} accent={PM.violet}
              wide
            />
          </div>
        </OBSection>

        <OBSection label="Household">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[['family','Family w/ kids'],['couple','Couple'],['single','Single'],['roomies','Roommates']].map(([k,l]) =>
              <Chip key={k} selected={household===k} onClick={() => setHousehold(k)}>{l}</Chip>
            )}
          </div>
        </OBSection>

        <OBSection label="Experience">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[['first','First-time'],['before','Owned before'],['current','Current owner']].map(([k,l]) =>
              <Chip key={k} selected={experience===k} onClick={() => setExperience(k)}>{l}</Chip>
            )}
          </div>
        </OBSection>
      </div>

      <div style={{ padding: '12px 20px 32px', background: PM.cream, borderTop: `1px solid ${PM.lineSoft}` }}>
        <PMButton onClick={() => onContinue(petTypes.length ? petTypes : ['both'])} variant="primary">Continue →</PMButton>
      </div>
    </div>
  );
}

function OBSection({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: PM.ink, fontWeight: 600, letterSpacing: 0.2 }}>{label}</div>
        {hint && <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.5, textTransform: 'uppercase' }}>{hint}</div>}
      </div>
      {children}
    </div>
  );
}

function OBCardChoice({ icon, label, selected, onClick, accent, wide }) {
  return (
    <button onClick={onClick} style={{
      gridColumn: wide ? '1 / -1' : 'auto',
      height: 130, borderRadius: 22,
      background: selected ? PM.night : PM.white,
      color: selected ? PM.cream : PM.night,
      border: 'none', cursor: 'pointer', padding: 14,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start',
      transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
      boxShadow: selected ? `0 8px 24px ${accent}33` : '0 1px 3px rgba(20,20,40,0.04)',
    }}>
      <div style={{ position: 'absolute', top: 8, right: 8, opacity: 0.85 }}>
        {icon}
      </div>
      {selected && <div style={{
        position: 'absolute', top: 12, left: 12,
        width: 22, height: 22, borderRadius: 11, background: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 6 L 4.5 8.5 L 9 3" stroke={PM.cream} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>}
      <div style={{ flex: 1 }}/>
      <div style={{ fontFamily: FONT_BODY, fontSize: 15, fontWeight: 600 }}>{label}</div>
    </button>
  );
}

Object.assign(window, { SplashScreen, RegisterScreen, LoginScreen, OnboardingScreen });
