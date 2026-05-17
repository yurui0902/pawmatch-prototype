// screens-matches.jsx — Matches list, Chat, simple placeholders for other tabs

function MatchesScreen({ goto, tab, setTab, matches: matchesProp }) {
  const [seg, setSeg] = React.useState('all');
  const matches = matchesProp || [
    { petKey: 'poppy',  met: 5, total: 6, status: 'incomplete', age: '2h' },
    { petKey: 'miso',   met: 6, total: 6, status: 'ready',      age: '5h' },
    { petKey: 'clover', met: 5, total: 5, status: 'submitted',  age: '3d' },
    { petKey: 'olive',  met: 3, total: 6, status: 'incomplete', age: '4d' },
  ];
  const counts = {
    all: matches.length,
    needs: matches.filter(m => m.status === 'incomplete').length,
    submitted: matches.filter(m => m.status === 'submitted').length,
  };
  const segments = [
    ['all',       `All ${counts.all}`],
    ['needs',     `Needs info · ${counts.needs}`],
    ['submitted', `Submitted · ${counts.submitted}`],
  ];
  const filtered = matches.filter(m =>
    seg === 'all' ? true :
    seg === 'needs' ? m.status === 'incomplete' :
    seg === 'submitted' ? m.status === 'submitted' : true
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title="Matches" large
        subtitle={`Your starred pets — ${counts.all} total`}
        right={typeof ResetDemoButton === 'function' ? <ResetDemoButton/> : null}
      />
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: PM.white, borderRadius: 16, border: `1px solid ${PM.line}` }}>
          {segments.map(([k,l]) => (
            <button key={k} onClick={() => setSeg(k)} style={{
              flex: 1, height: 34, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: seg===k ? PM.night : 'transparent',
              color: seg===k ? PM.cream : PM.inkSoft,
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, letterSpacing: 0.1,
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 110px' }}>
        {filtered.length === 0 ? (
          <EmptyState
            title={matches.length === 0 ? "No matches yet" : "Nothing in this view"}
            sub={matches.length === 0
              ? "Swipe right on pets you love — they'll show up here, ready to apply."
              : "Try a different filter, or head back to Discover for more pets."}
            cta="Back to Discover"
            onCta={() => setTab('pets')}
          />
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(m => <MatchRow key={m.petKey} {...m} onClick={() => m.status === 'incomplete' ? goto('matchCheck', { pet: m.petKey }) : goto('chat', { pet: m.petKey })}/>)}
            </div>

            <div style={{
              marginTop: 16, padding: 16, borderRadius: 22, background: `${PM.violet}15`,
              borderLeft: `3px solid ${PM.violet}`, display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: PM.violet, fontStyle: 'italic', lineHeight: 0.8 }}>✦</div>
              <div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: PM.night }}>One form, every shelter.</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginTop: 2 }}>Answers reuse across applications — fill once, applies everywhere.</div>
              </div>
            </div>
          </>
        )}
      </div>

      <TabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function MatchRow({ petKey, met, total, status, age, onClick }) {
  const pet = PETS[petKey];
  const Art = pet.Art;

  // local submit animation state. Used only when status === 'ready'.
  // idle → submitting (shrink to pink circle + check) → done (pretend status is 'submitted')
  const [phase, setPhase] = React.useState('idle');
  const isReady = status === 'ready';
  const effective = (isReady && phase === 'done') ? 'submitted' : status;

  // Cross-end demo: surface shelter activity on Poppy's row.
  const demoState = (typeof useDemoState === 'function') ? useDemoState() : null;
  const isPoppy = petKey === 'poppy';
  const shelterReplied   = !!(demoState && demoState.shelterMessaged && isPoppy);
  const meetingTime      = (demoState && isPoppy) ? demoState.meetingTime : null;
  const meetingAccepted  = !!(demoState && isPoppy && demoState.meetingAccepted);

  // Reset local Submit animation state when the demo is reset, so Poppy's
  // row returns to its initial "Ready to submit" appearance on the next render.
  React.useEffect(() => {
    if (demoState && !demoState.sarahSubmitted && phase === 'done') {
      setPhase('idle');
    }
  }, [demoState ? demoState.sarahSubmitted : null]);

  let submittedTag, submittedColor;
  if (meetingTime && meetingAccepted) {
    submittedTag = '● Meeting confirmed';                       submittedColor = PM.mint;
  } else if (meetingTime) {
    submittedTag = '📅 Meeting proposed · tap Accept →';        submittedColor = PM.coral;
  } else if (shelterReplied) {
    submittedTag = '● Shelter replied · open conversation';     submittedColor = PM.mint;
  } else {
    submittedTag = phase === 'done' ? 'Just submitted · awaiting' : `Submitted ${age} · awaiting`;
    submittedColor = PM.violet;
  }

  const config = {
    incomplete: { tag: `${total - met} fields missing`, tagColor: PM.gold,   cta: 'Continue', variant: 'outline' },
    ready:      { tag: 'Ready to submit',               tagColor: PM.mint,   cta: 'Submit',   variant: 'dark'    },
    submitted:  { tag: submittedTag,                    tagColor: submittedColor,
                                                                              cta: 'Chat',     variant: 'coral'   },
  }[effective];

  const handleClick = (e) => {
    if (phase === 'submitting') { e.preventDefault(); return; }
    if (isReady && phase === 'idle') {
      e.preventDefault();
      setPhase('submitting');
      setTimeout(() => {
        setPhase('done');
        // Demo trigger: only Poppy's submit drives the cross-end story.
        if (petKey === 'poppy' && window.__pmDemoActions) {
          window.__pmDemoActions.submitPoppy();
        }
      }, 900);
      return;
    }
    onClick();
  };

  // Build the CTA's style based on phase. CSS transitions on the inline styles
  // animate the morph: pill → circle → pill ("Chat").
  const submitting = phase === 'submitting';
  const ctaVariantStyle =
    config.variant === 'dark'    ? { background: PM.night,   color: PM.cream, border: 'none' } :
    config.variant === 'coral'   ? { background: '#FF0083',  color: '#FFF',   border: 'none' } :
                                   { background: 'transparent', color: PM.night, border: `1.5px solid ${PM.ink}` };

  const baseCtaStyle = submitting ? {
    width: 36, height: 36, padding: 0, borderRadius: 18,
    background: '#FF0083', color: '#FFF', border: 'none',
  } : {
    padding: '8px 14px', borderRadius: 14,
    ...ctaVariantStyle,
  };

  return (
    <button onClick={handleClick} className="pm-match-card" style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 22,
      background: PM.white, border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 1px 2px rgba(20,20,40,0.03), 0 6px 18px rgba(20,20,40,0.04)',
    }}>
      <style>{`
        .pm-match-card .pm-cta { transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1); }
        .pm-match-card:not(.pm-submitting):active .pm-cta { transform: scale(0.96); }
        .pm-match-card:not(.pm-submitting):active { background: #FFF1F7 !important; }
        @keyframes pm-check-pop {
          0%   { transform: scale(0)   rotate(-12deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(0deg);   opacity: 1; }
          100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
        }
        @keyframes pm-circle-pulse {
          0%, 100% { box-shadow: 0 0 0 0    rgba(255,0,131,0.45); }
          70%      { box-shadow: 0 0 0 12px rgba(255,0,131,0); }
        }
        .pm-cta-submitting { animation: pm-circle-pulse 0.9s ease-out; }
        .pm-check { animation: pm-check-pop 0.36s cubic-bezier(0.34, 1.56, 0.64, 1) 0.18s both; }
      `}</style>
      <div style={{
        width: 64, height: 64, borderRadius: 18, flexShrink: 0,
        background: `radial-gradient(ellipse at 50% 100%, ${pet.accent}55 0%, ${pet.color} 70%)`,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden',
      }}>
        <Art size={62}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: PM.night, letterSpacing: -0.3, lineHeight: 1 }}>{pet.name}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkFaint }}>· {pet.shortBreed}</div>
        </div>
        <div style={{ marginTop: 4, fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft }}>{pet.shelter}</div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            padding: '3px 8px', borderRadius: 8,
            background: config.tagColor + '22', color: config.tagColor,
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600,
            transition: 'all 0.32s',
          }}>{met}/{total}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: PM.inkSoft }}>{config.tag}</div>
        </div>
      </div>
      {meetingTime && !meetingAccepted && !submitting ? (
        // Accept-the-meeting affordance — replaces the right CTA while the
        // adopter hasn't responded yet. Uses a span so we don't nest <button>.
        <span
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            if (window.__pmDemoActions) window.__pmDemoActions.acceptMeeting();
          }}
          style={{
            padding: '8px 14px', borderRadius: 14, flexShrink: 0,
            background: PM.coral, color: '#FFF',
            fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            boxShadow: '0 4px 10px rgba(255,0,131,0.32)',
          }}
        >Accept ✓</span>
      ) : (
        <div className={`pm-cta ${submitting ? 'pm-cta-submitting' : ''}`} style={{
          ...baseCtaStyle,
          fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', whiteSpace: 'nowrap',
        }}>
          {submitting ? (
            <svg className="pm-check" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9 L 7.5 13 L 15 5" stroke="#FFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : config.cta}
        </div>
      )}
    </button>
  );
}

// ─── Chat list ─────────────────────────────────────────────

function ChatScreen({ goto, tab, setTab }) {
  const [seg, setSeg] = React.useState('shelters');
  const conversations = [
    { who: 'Willow Creek Rescue', sub: 'About Poppy 🐕', petKey: 'poppy', preview: "Great — we'd love to meet you Saturday 2pm.", age: '2h', unread: 1 },
    { who: 'Rose City Cat Rescue', sub: 'About Miso 🐈', petKey: 'miso', preview: 'Could you share a photo of your home?', age: '1d', unread: 0 },
    { who: 'Pearl District', sub: 'About Olive 🐕', petKey: 'olive', preview: 'Thanks for your application.', age: '3d', unread: 0 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Chat" large subtitle="Conversations with shelters & vets"/>

      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: PM.white, borderRadius: 16, border: `1px solid ${PM.line}` }}>
          {[['shelters','Shelters · 3'],['vets','Vets · 1']].map(([k,l]) => (
            <button key={k} onClick={() => setSeg(k)} style={{
              flex: 1, height: 34, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: seg===k ? PM.night : 'transparent',
              color: seg===k ? PM.cream : PM.inkSoft,
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 0 110px' }}>
        {(() => {
          const rows = seg === 'shelters'
            ? conversations
            : [{ who: 'Forest Park Veterinary', sub: 'Wellness booking', petKey: 'poppy', preview: 'See you tomorrow at 9:30.', age: '12h', unread: 0 }];
          if (rows.length === 0) {
            return (
              <EmptyState
                title="No conversations yet"
                sub="Once a shelter or vet replies to your application, your chat with them will land here."
                cta="Find a pet to apply to"
                onCta={() => setTab('pets')}
              />
            );
          }
          return rows.map((c, i) => (
            <ChatRow key={i} {...c} onClick={() => goto('chatThread', { pet: c.petKey, who: c.who })}/>
          ));
        })()}
      </div>
      <TabBar active={tab} onChange={setTab}/>
    </div>
  );
}

function ChatRow({ who, sub, preview, age, unread, petKey, onClick }) {
  const pet = PETS[petKey];
  const Art = pet?.Art;
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', gap: 12, padding: '12px 20px', alignItems: 'center',
      background: 'transparent', border: 'none', borderBottom: `1px solid ${PM.lineSoft}`,
      cursor: 'pointer', textAlign: 'left',
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: 25, flexShrink: 0,
        background: `radial-gradient(circle at 50% 100%, ${pet?.accent}55 0%, ${pet?.color || PM.creamDark} 70%)`,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden',
      }}>
        {Art && <Art size={50}/>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: PM.night }}>{who}</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 0.3 }}>{age}</div>
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkFaint, marginTop: 2 }}>{sub}</div>
        <div style={{
          marginTop: 4, fontFamily: FONT_BODY, fontSize: 13, color: unread ? PM.night : PM.inkSoft,
          fontWeight: unread ? 600 : 400,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{preview}</div>
      </div>
      {unread > 0 && (
        <div style={{
          width: 8, height: 8, borderRadius: 4, background: PM.coral, flexShrink: 0,
        }}/>
      )}
    </button>
  );
}

// ─── Chat thread ───────────────────────────────────────────

function ChatThreadScreen({ goto, params }) {
  const pet = PETS[params.pet || 'poppy'];
  const Art = pet.Art;
  const messages = [
    { from: 'them', text: `Hi Sarah! Thanks for your interest in ${pet.name}. We reviewed your pre-application and we love what we see.`, time: '10:14' },
    { from: 'them', text: `${pet.name} is great with kids and currently up-to-date on shots. Would you like to come meet her this weekend?`, time: '10:14' },
    { from: 'me',   text: `Yes please! Saturday afternoon works for us.`, time: '10:32' },
    { from: 'them', text: `Great — we'd love to meet you Saturday 2pm at the shelter. Bring the family! 🌿`, time: '11:02' },
    { from: 'them', kind: 'booking', booking: { when: 'Sat Apr 19 · 2:00 PM', where: 'Willow Creek Rescue · 1842 NE 23rd' }, time: '11:02' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: PM.cream, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 56, paddingBottom: 12, paddingLeft: 16, paddingRight: 16,
        background: PM.cream, borderBottom: `1px solid ${PM.lineSoft}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={() => goto('chat')} style={{
          width: 36, height: 36, borderRadius: 18, border: 'none', background: PM.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13"><path d="M8 1 L 3 6.5 L 8 12" stroke={PM.night} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{
          width: 38, height: 38, borderRadius: 19, overflow: 'hidden',
          background: `radial-gradient(circle at 50% 100%, ${pet.accent}55 0%, ${pet.color} 70%)`,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <Art size={38}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: PM.night }}>Willow Creek Rescue</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: PM.mint, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: PM.mint, display: 'inline-block' }}/>
            Online · about {pet.name}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ textAlign: 'center', fontFamily: FONT_MONO, fontSize: 10, color: PM.inkFaint, letterSpacing: 1, textTransform: 'uppercase' }}>Today</div>
        {messages.map((m, i) => (
          m.kind === 'booking' ? <BookingBubble key={i} booking={m.booking}/> :
          <Bubble key={i} from={m.from} text={m.text} time={m.time}/>
        ))}
      </div>

      <div style={{ padding: '10px 16px 30px', background: PM.cream, borderTop: `1px solid ${PM.lineSoft}` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={{
            width: 40, height: 40, borderRadius: 20, background: PM.white, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1 L 7 13 M 1 7 L 13 7" stroke={PM.night} strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div style={{
            flex: 1, height: 40, borderRadius: 20, background: PM.white, border: `1px solid ${PM.line}`,
            display: 'flex', alignItems: 'center', padding: '0 14px',
            fontFamily: FONT_BODY, fontSize: 14, color: PM.inkFaint,
          }}>Message…</div>
          <button style={{
            width: 40, height: 40, borderRadius: 20, background: PM.coral, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 7 L 13 1 L 8 13 L 7 8 Z" fill={PM.cream}/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, text, time }) {
  const me = from === 'me';
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: '78%',
        padding: '10px 14px',
        background: me ? PM.night : PM.white,
        color: me ? PM.cream : PM.ink,
        borderRadius: me ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
        fontFamily: FONT_BODY, fontSize: 14, lineHeight: 1.4,
        boxShadow: me ? 'none' : '0 1px 3px rgba(20,20,40,0.04)',
      }}>
        {text}
        <div style={{ marginTop: 4, fontFamily: FONT_MONO, fontSize: 9, opacity: 0.55, textAlign: 'right' }}>{time}</div>
      </div>
    </div>
  );
}

function BookingBubble({ booking }) {
  const [status, setStatus] = React.useState('pending'); // pending | confirmed | rescheduling
  const [when, setWhen] = React.useState(booking.when);
  const slots = ['Sat Apr 12 · 2:00 PM', 'Sun Apr 13 · 11:00 AM', 'Wed Apr 16 · 5:30 PM', 'Sat Apr 19 · 2:00 PM'];

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{
        maxWidth: '80%', padding: 14, background: PM.cream, border: `1.5px solid ${PM.night}`,
        borderRadius: '20px 20px 20px 4px',
        transition: 'all 0.2s',
      }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: status === 'confirmed' ? PM.mint : PM.coral, letterSpacing: 1, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
          <StarBurst size={10} color={status === 'confirmed' ? PM.mint : PM.coral}/>
          {status === 'confirmed' ? 'Confirmed' : 'Meet & Greet'}
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: PM.night, marginTop: 4, letterSpacing: -0.3 }}>{when}</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: PM.inkSoft, marginTop: 2 }}>{booking.where}</div>

        {status === 'pending' && (
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button onClick={() => setStatus('confirmed')} style={{
              flex: 1, height: 36, borderRadius: 14, background: PM.night, color: PM.cream, border: 'none',
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseDown={e => { e.currentTarget.style.background = '#FF0083'; e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={e => { e.currentTarget.style.background = PM.night; e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = PM.night; e.currentTarget.style.transform = 'scale(1)'; }}
            >Confirm</button>
            <button onClick={() => setStatus('rescheduling')} style={{
              flex: 1, height: 36, borderRadius: 14, background: 'transparent', color: PM.night, border: `1.5px solid ${PM.line}`,
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseDown={e => { e.currentTarget.style.background = '#FFF1F7'; e.currentTarget.style.borderColor = '#FF0083'; e.currentTarget.style.color = '#FF0083'; }}
              onMouseUp={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = PM.line; e.currentTarget.style.color = PM.night; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = PM.line; e.currentTarget.style.color = PM.night; }}
            >Reschedule</button>
          </div>
        )}

        {status === 'rescheduling' && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: PM.inkSoft, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>Pick a new time</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {slots.map(s => (
                <button key={s} onClick={() => { setWhen(s); setStatus('confirmed'); }} style={{
                  padding: '8px 12px', borderRadius: 12, textAlign: 'left',
                  background: PM.white, border: `1px solid ${PM.line}`,
                  fontFamily: FONT_BODY, fontSize: 13, color: PM.night, cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseDown={e => { e.currentTarget.style.background = '#FF0083'; e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#FF0083'; }}
                >{s}</button>
              ))}
            </div>
            <button onClick={() => setStatus('pending')} style={{
              marginTop: 8, width: '100%', height: 30, borderRadius: 10, background: 'transparent',
              border: 'none', color: PM.inkSoft, fontFamily: FONT_BODY, fontSize: 11, cursor: 'pointer',
            }}>Cancel</button>
          </div>
        )}

        {status === 'confirmed' && (
          <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              flex: 1, height: 36, borderRadius: 14, background: PM.mint + '22', color: PM.mint,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6 L 5 9 L 10 3" stroke={PM.mint} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              You're going!
            </div>
            <button onClick={() => setStatus('rescheduling')} style={{
              height: 36, padding: '0 12px', borderRadius: 14, background: 'transparent',
              color: PM.inkSoft, border: `1px solid ${PM.line}`,
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 500, cursor: 'pointer',
            }}>Change</button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { MatchesScreen, MatchRow, ChatScreen, ChatThreadScreen });
