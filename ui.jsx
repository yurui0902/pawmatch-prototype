// ui.jsx — design system: colors, typography, shared UI primitives

const PM = {
  // CONSTRUCTIVIST palette — Lemonade-aligned: white paper, hot pink, ink black
  // White paper is the foundation; black + pink do the heavy lifting.
  cream: '#FFFFFF',
  creamDark: '#F2F2F2',
  night: '#000000',
  nightSoft: '#1A1A1A',
  // Hot pink primary (Lemonade signature)
  coral: '#FF0083',
  coralSoft: '#FFD6E8',
  // Constructivist secondary accents — sharp cobalt + sunburst gold
  violet: '#0034FF',
  violetSoft: '#B8C6FF',
  gold: '#FFD400',
  mint: '#00C46A',
  // Text
  ink: '#000000',
  inkSoft: '#4A4A4A',
  inkFaint: '#9A9A9A',
  // Lines — crisp gray, not warm
  line: '#E5E5E5',
  lineSoft: '#F0F0F0',
  // Surfaces
  white: '#FFFFFF',
  paper: '#FFFFFF',
};

// font stacks — constructivist: heavy black display + clean grotesque
const FONT_DISPLAY = `'Archivo Black', 'Arial Black', sans-serif`;
const FONT_SERIF = `'Instrument Serif', 'Times New Roman', serif`;
const FONT_BODY = `'Archivo', 'Geist', -apple-system, system-ui, sans-serif`;
const FONT_MONO = `'Geist Mono', ui-monospace, monospace`;

// ─── Buttons ───────────────────────────────────────────────

function PMButton({ children, onClick, variant = 'primary', size = 'lg', style, full = true, icon }) {
  const variants = {
    primary: { bg: PM.night, fg: PM.cream, border: 'none' },
    coral:   { bg: PM.coral, fg: PM.cream, border: 'none' },
    light:   { bg: 'transparent', fg: PM.night, border: `1.5px solid ${PM.ink}` },
    ghost:   { bg: 'transparent', fg: PM.inkSoft, border: 'none' },
    cream:   { bg: PM.cream, fg: PM.night, border: 'none' },
  };
  const sizes = {
    lg: { h: 56, fs: 17, px: 28, r: 28 },
    md: { h: 44, fs: 15, px: 20, r: 22 },
    sm: { h: 34, fs: 13, px: 14, r: 17 },
  };
  const v = variants[variant];
  const s = sizes[size];
  return (
    <button onClick={onClick} style={{
      width: full ? '100%' : 'auto',
      height: s.h, padding: `0 ${s.px}px`, borderRadius: s.r,
      background: v.bg, color: v.fg, border: v.border,
      fontFamily: FONT_BODY, fontSize: s.fs, fontWeight: 500, letterSpacing: -0.1,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: 'pointer', transition: 'transform 0.1s, opacity 0.15s',
      ...style,
    }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {icon}{children}
    </button>
  );
}

// ─── Chip / Pill ───────────────────────────────────────────

function Chip({ children, selected = false, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      height: 36, padding: '0 14px', borderRadius: 18,
      background: selected ? PM.night : 'transparent',
      color: selected ? PM.cream : PM.ink,
      border: selected ? 'none' : `1px solid ${PM.line}`,
      fontFamily: FONT_BODY, fontSize: 14, fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      cursor: 'pointer', transition: 'all 0.15s',
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</button>
  );
}

// ─── Surface / Card ────────────────────────────────────────

function Surface({ children, dark = false, style }) {
  return (
    <div style={{
      background: dark ? PM.night : PM.white,
      borderRadius: 28,
      padding: 20,
      boxShadow: dark
        ? '0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 36px rgba(20,20,40,0.18)'
        : '0 1px 2px rgba(20,20,40,0.04), 0 8px 28px rgba(20,20,40,0.05)',
      ...style,
    }}>{children}</div>
  );
}

// ─── Pet illustration "photo" — bg + line drawing ─────────

function PetPortrait({ petKey, size = 280, rounded = 36, showCorner = true }) {
  const p = PETS[petKey];
  if (!p) return null;
  const Art = p.Art;
  return (
    <div style={{
      width: size, height: size,
      borderRadius: rounded,
      background: `radial-gradient(ellipse 100% 70% at 50% 100%, ${p.accent}33 0%, ${p.color} 60%)`,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      {/* sun/halo */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%',
        width: '60%', height: '60%', borderRadius: '50%',
        background: `radial-gradient(circle, ${p.accent}55 0%, transparent 70%)`,
      }}/>
      {/* tiny stars */}
      <TinyStar size={8} color={PM.night} style={{ position: 'absolute', top: '12%', left: '14%', opacity: 0.4 }}/>
      <TinyStar size={6} color={PM.night} style={{ position: 'absolute', top: '22%', right: '22%', opacity: 0.35 }}/>
      <TinyStar size={5} color={PM.night} style={{ position: 'absolute', top: '38%', left: '20%', opacity: 0.3 }}/>
      <div style={{ width: '95%', height: '95%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <Art size={size * 0.88}/>
      </div>
      {showCorner && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          padding: '6px 10px', borderRadius: 14,
          background: 'rgba(252,246,236,0.9)',
          fontFamily: FONT_MONO, fontSize: 11, color: PM.night,
          letterSpacing: 0.4, textTransform: 'uppercase',
        }}>{p.shortBreed}</div>
      )}
    </div>
  );
}

// ─── Bottom tab bar ────────────────────────────────────────

function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'pets',    label: 'Discover', icon: 'paw' },
    { id: 'matches', label: 'Matches',  icon: 'spark' },
    { id: 'chat',    label: 'Chat',     icon: 'chat' },
    { id: 'petCare', label: 'Pet care', icon: 'cross' },
    { id: 'me',      label: 'Me',       icon: 'me' },
  ];

  // Cross-end demo: subscribe to the shared demo state so Chat shows an
  // unread dot the moment the shelter side hits Message.
  const demoState = (typeof useDemoState === 'function') ? useDemoState() : null;
  const chatUnread = !!(demoState && demoState.shelterMessaged);
  const Icon = ({ name, on }) => {
    const c = on ? PM.night : PM.inkFaint;
    const sw = 1.8;
    switch (name) {
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
      case 'spark': return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2 L12.5 9 L19 11 L12.5 13 L11 20 L9.5 13 L3 11 L9.5 9 Z" fill={on ? PM.coral : 'none'} stroke={c} strokeWidth={sw} strokeLinejoin="round"/>
        </svg>
      );
      case 'chat': return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 6 Q 4 4, 6 4 L 16 4 Q 18 4, 18 6 L 18 13 Q 18 15, 16 15 L 9 15 L 5 18 L 5 15 Q 4 15, 4 13 Z" stroke={c} strokeWidth={sw} fill="none" strokeLinejoin="round"/>
        </svg>
      );
      case 'cross': return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="3" width="16" height="16" rx="4" stroke={c} strokeWidth={sw} fill="none"/>
          <path d="M11 7 L 11 15 M 7 11 L 15 11" stroke={c} strokeWidth={sw} strokeLinecap="round"/>
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
      background: PM.paper,
      borderTop: `1px solid ${PM.line}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
      zIndex: 30,
    }}>
      {tabs.map(t => {
        const showUnread = t.id === 'chat' && chatUnread;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '4px 8px', position: 'relative',
          }}>
            <div style={{ position: 'relative' }}>
              <Icon name={t.icon} on={active === t.id}/>
              {showUnread && (
                <span style={{
                  position: 'absolute', top: -2, right: -4,
                  width: 9, height: 9, borderRadius: 5,
                  background: PM.coral,
                  boxShadow: `0 0 0 2px ${PM.paper}`,
                }}/>
              )}
            </div>
            <span style={{
              fontFamily: FONT_BODY, fontSize: 10,
              color: active === t.id ? PM.night : PM.inkFaint,
              fontWeight: active === t.id ? 600 : 500,
              letterSpacing: 0.2,
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Top app bar (cream variant) ──────────────────────────

function TopBar({ title, onBack, right, dark = false, large = false, subtitle }) {
  const fg = dark ? PM.cream : PM.night;
  return (
    <div style={{
      paddingTop: 60, paddingLeft: 20, paddingRight: 20, paddingBottom: large ? 16 : 12,
      background: dark ? PM.night : 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 36 }}>
        {onBack ? (
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: 18,
            background: dark ? 'rgba(255,255,255,0.08)' : PM.white,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: dark ? 'none' : '0 1px 3px rgba(20,20,40,0.06)',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2 L 3 7 L 9 12" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : <div style={{ width: 36 }}/>}
        {!large && <div style={{ fontFamily: FONT_BODY, fontSize: 15, fontWeight: 600, color: fg }}>{title}</div>}
        <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
      </div>
      {large && (
        <div style={{ marginTop: 14 }}>
          <h1 style={{
            margin: 0, fontFamily: FONT_DISPLAY, fontSize: 38, fontWeight: 400,
            color: fg, letterSpacing: -0.8, lineHeight: 1.05,
          }}>{title}</h1>
          {subtitle && <div style={{ marginTop: 6, fontFamily: FONT_BODY, fontSize: 14, color: dark ? 'rgba(252,246,236,0.6)' : PM.inkSoft }}>{subtitle}</div>}
        </div>
      )}
    </div>
  );
}

// ─── PetPhotoSlot — blank constructivist placeholder ─────
// Replaces the cartoon illustration. User will upload real photos later.

function PetPhotoSlot({ petKey, label = "PHOTO", size = "100%", bg = "#F2F2F2", color = "#000000", showCross = true, hint = "Upload photo →", style }) {
  return (
    <div style={{
      width: size === "100%" ? '100%' : size,
      height: size === "100%" ? '100%' : size,
      background: bg, color: color,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...style,
    }}>
      {/* constructivist crossing diagonals */}
      {showCross && (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
          <line x1="0" y1="0" x2="100" y2="100" stroke={color} strokeWidth="0.4"/>
          <line x1="100" y1="0" x2="0" y2="100" stroke={color} strokeWidth="0.4"/>
        </svg>
      )}
      {/* center stamp */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          border: `2.5px solid ${color}`, margin: '0 auto 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
            <path d="M2 5 L7 5 L9 2 L13 2 L15 5 L20 5 L20 17 L2 17 Z" stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"/>
            <circle cx="11" cy="11" r="3.5" stroke={color} strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 18, color: color,
          letterSpacing: 3, textTransform: 'uppercase',
        }}>{label}</div>
        {hint && (
          <div style={{
            marginTop: 4, fontFamily: FONT_MONO, fontSize: 10,
            color: color, opacity: 0.55, letterSpacing: 1, textTransform: 'uppercase',
          }}>{hint}</div>
        )}
      </div>
    </div>
  );
}

// ─── Pet avatar (photo or illustration fallback) ──────────
// Used everywhere a pet's face appears.  Prefers the real photo baked into
// window.__pmPetPhotos; falls back to the hand-drawn SVG in PETS if no
// photo is registered for that key.

function PetAvatar({ petKey, size = 60, rounded = 16, accent }) {
  const pet = (typeof PETS !== 'undefined' && PETS[petKey]) || null;
  const photo = (window.__pmPetPhotos && window.__pmPetPhotos[petKey]) || (pet && pet.photo);
  const radius = (typeof rounded === 'number') ? rounded : rounded;
  if (photo) {
    return (
      <div style={{
        width: size, height: size, borderRadius: radius,
        flexShrink: 0, overflow: 'hidden',
        background: '#F3F3F3',
      }}>
        <img src={photo} alt={pet ? pet.name : ''} style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }}/>
      </div>
    );
  }
  // Illustration fallback — keeps the colored gradient backdrop.
  if (!pet) return null;
  const Art = pet.Art;
  const bg = accent || pet.color || '#FFE3B0';
  const accentColor = pet.accent || '#FF8466';
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      flexShrink: 0, overflow: 'hidden',
      background: `radial-gradient(ellipse at 50% 100%, ${accentColor}55 0%, ${bg} 70%)`,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      {Art && <Art size={size}/>}
    </div>
  );
}

// ─── Splash animation FX ───────────────────────────────────
// Floating hearts + twinkling sparkles + gentle bob, layered over the splash
// hero image. The image itself is a flat JPEG, so we keep the motion in cute
// overlay elements that read as "alive" without overdoing it.

function SplashFX() {
  return (
    <>
      <style>{`
        @keyframes pm-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes pm-heart-float {
          0%   { transform: translateY(24px) scale(0.55) rotate(-6deg); opacity: 0; }
          14%  { opacity: 0.95; }
          100% { transform: translateY(-200px) scale(1.05) rotate(8deg); opacity: 0; }
        }
        @keyframes pm-twinkle {
          0%, 100% { transform: scale(0.35) rotate(0deg);   opacity: 0; }
          50%      { transform: scale(1.05) rotate(180deg); opacity: 1; }
        }
        @keyframes pm-headline-pop {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.045); }
        }
        .pm-hero-img      { animation: pm-bob 5.4s ease-in-out infinite; }
        .pm-fx            { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .pm-fx .pm-heart  { position: absolute; top: 70%; font-size: 18px; color: #FF4FA0;
                            text-shadow: 0 2px 8px rgba(255,79,160,0.42);
                            opacity: 0; animation: pm-heart-float 4.6s ease-in-out infinite; }
        .pm-fx .pm-spark  { position: absolute; font-size: 16px; color: #FFB800;
                            text-shadow: 0 1px 4px rgba(255,184,0,0.35);
                            opacity: 0; animation: pm-twinkle 2.6s ease-in-out infinite; }
        .pm-headline-pop  { display: inline-block; animation: pm-headline-pop 3.4s ease-in-out infinite;
                            transform-origin: center; }
      `}</style>
      <div className="pm-fx">
        <span className="pm-heart" style={{ left: '18%', animationDelay: '0s'   }}>♥</span>
        <span className="pm-heart" style={{ left: '50%', animationDelay: '1.6s' }}>♥</span>
        <span className="pm-heart" style={{ left: '78%', animationDelay: '3.2s' }}>♥</span>

        <span className="pm-spark" style={{ left:  '8%', top: '10%', animationDelay: '0s'   }}>✦</span>
        <span className="pm-spark" style={{ left: '88%', top: '14%', animationDelay: '0.7s' }}>✦</span>
        <span className="pm-spark" style={{ left: '14%', top: '48%', animationDelay: '1.4s' }}>✦</span>
        <span className="pm-spark" style={{ left: '84%', top: '52%', animationDelay: '2.1s' }}>✦</span>
      </div>
    </>
  );
}

// ─── Empty state ───────────────────────────────────────────

function EmptyState({ title, sub, cta, onCta, icon }) {
  return (
    <div style={{
      width: '100%', padding: '48px 28px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 36,
        background: '#FFF1F7', color: PM.coral,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
      }}>
        {icon || (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="9" cy="11" r="2.4" fill="currentColor"/>
            <circle cx="16" cy="8" r="2.7" fill="currentColor"/>
            <circle cx="23" cy="11" r="2.4" fill="currentColor"/>
            <circle cx="24.5" cy="17" r="2" fill="currentColor"/>
            <circle cx="7.5" cy="17" r="2" fill="currentColor"/>
            <path d="M16 14 C 11 14, 9 18.5, 10.5 22 C 12 25.5, 14 27, 16 27 C 18 27, 20 25.5, 21.5 22 C 23 18.5, 21 14, 16 14 Z" fill="currentColor"/>
          </svg>
        )}
      </div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 400, color: PM.night,
        letterSpacing: -0.4, lineHeight: 1.1, marginBottom: 8,
      }}>{title}</div>
      {sub && (
        <div style={{
          fontFamily: FONT_BODY, fontSize: 13, color: PM.inkSoft, lineHeight: 1.5,
          maxWidth: 280, marginBottom: 22,
        }}>{sub}</div>
      )}
      {cta && onCta && (
        <button onClick={onCta} style={{
          padding: '12px 22px', borderRadius: 22, background: PM.coral, color: '#FFF',
          border: 'none', cursor: 'pointer',
          fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
          boxShadow: '0 6px 16px rgba(255,0,131,0.32)',
        }}>{cta}</button>
      )}
    </div>
  );
}

Object.assign(window, {
  PM, FONT_DISPLAY, FONT_SERIF, FONT_BODY, FONT_MONO,
  PMButton, Chip, Surface, PetPortrait, PetPhotoSlot, TabBar, TopBar, EmptyState, SplashFX, PetAvatar,
});
