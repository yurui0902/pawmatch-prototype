// pet-art.jsx — hand-drawn line illustrations of pets + cosmic decorations
// Each pet has a `colorway` (warm pastel bg) and a single-weight line drawing.
// Style: friendly but tasteful; single stroke weight; minimal anatomical detail.

const STROKE = "#0E0E10";
const STROKE_W = 2.2;

// ─── Pets ────────────────────────────────────────────────────

// Poppy — Dalmatian × Setter mix (dog, sitting, floppy ears, spots)
function Pet_Poppy({ size = 280 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" fill="none">
      {/* body */}
      <path d="M90 200 C 90 150, 110 130, 140 130 C 175 130, 195 155, 195 195 C 195 215, 188 225, 175 230 L 115 232 C 98 228, 90 218, 90 200 Z"
        stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#FFF7EE"/>
      {/* front legs */}
      <path d="M115 215 L 115 245 M 130 220 L 130 248" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round"/>
      <path d="M108 246 Q 115 252 124 246" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" fill="none"/>
      <path d="M122 248 Q 130 254 138 248" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" fill="none"/>
      {/* tail */}
      <path d="M192 200 Q 215 195 218 175" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" fill="none"/>
      {/* head */}
      <ellipse cx="158" cy="115" rx="42" ry="40" stroke={STROKE} strokeWidth={STROKE_W} fill="#FFF7EE"/>
      {/* ears — long floppy */}
      <path d="M125 92 Q 108 100 110 130 Q 115 145 130 142" stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#1F1F3A" fillOpacity="0.85"/>
      <path d="M188 92 Q 205 100 203 130 Q 198 145 184 142" stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#FFF7EE"/>
      {/* eyes */}
      <circle cx="146" cy="115" r="3" fill={STROKE}/>
      <circle cx="172" cy="115" r="3" fill={STROKE}/>
      {/* snout */}
      <path d="M150 128 Q 158 138 166 128" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" fill="none"/>
      <ellipse cx="158" cy="128" rx="4.5" ry="3" fill={STROKE}/>
      {/* spots */}
      <circle cx="142" cy="180" r="6" fill={STROKE} fillOpacity="0.9"/>
      <circle cx="165" cy="195" r="4.5" fill={STROKE} fillOpacity="0.9"/>
      <circle cx="178" cy="170" r="5" fill={STROKE} fillOpacity="0.9"/>
      <circle cx="125" cy="195" r="4" fill={STROKE} fillOpacity="0.9"/>
      <circle cx="190" cy="118" r="3" fill={STROKE} fillOpacity="0.9"/>
    </svg>
  );
}

// Miso — Longhair cat
function Pet_Miso({ size = 280 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" fill="none">
      {/* body — fluffy oval */}
      <path d="M85 215 C 80 165, 105 130, 140 130 C 175 130, 200 165, 195 215 C 192 230, 175 235, 140 235 C 105 235, 88 230, 85 215 Z"
        stroke={STROKE} strokeWidth={STROKE_W} fill="#FFF7EE"/>
      {/* fluff tufts on body sides */}
      <path d="M85 195 Q 75 200 78 215 M 195 195 Q 205 200 202 215" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" fill="none"/>
      {/* tail — curled */}
      <path d="M195 200 Q 230 195 235 165 Q 235 145 220 145" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" fill="none"/>
      {/* head */}
      <path d="M104 95 L 115 130 L 165 130 L 176 95 L 158 105 L 122 105 Z"
        stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#FFF7EE"/>
      <ellipse cx="140" cy="115" rx="38" ry="32" stroke={STROKE} strokeWidth={STROKE_W} fill="#FFF7EE"/>
      {/* inner ears */}
      <path d="M118 100 L 124 112 L 128 102" stroke={STROKE} strokeWidth="1.5" fill={STROKE} fillOpacity="0.3"/>
      <path d="M162 100 L 156 112 L 152 102" stroke={STROKE} strokeWidth="1.5" fill={STROKE} fillOpacity="0.3"/>
      {/* eyes — almond */}
      <path d="M124 116 Q 130 110 136 116 Q 130 122 124 116 Z" fill={STROKE}/>
      <path d="M144 116 Q 150 110 156 116 Q 150 122 144 116 Z" fill={STROKE}/>
      {/* nose */}
      <path d="M137 128 L 143 128 L 140 132 Z" fill={STROKE}/>
      {/* whiskers */}
      <path d="M115 132 L 130 134 M 115 138 L 130 138 M 165 132 L 150 134 M 165 138 L 150 138" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round"/>
      {/* paws */}
      <path d="M120 235 Q 128 240 135 235 M 145 235 Q 152 240 160 235" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// Clover — rabbit
function Pet_Clover({ size = 280 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" fill="none">
      {/* body */}
      <ellipse cx="140" cy="195" rx="55" ry="48" stroke={STROKE} strokeWidth={STROKE_W} fill="#FFF7EE"/>
      {/* head */}
      <ellipse cx="140" cy="135" rx="35" ry="32" stroke={STROKE} strokeWidth={STROKE_W} fill="#FFF7EE"/>
      {/* ears — long upright */}
      <path d="M125 110 Q 118 60 128 50 Q 138 60 132 110" stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#FFF7EE"/>
      <path d="M155 110 Q 162 60 152 50 Q 142 60 148 110" stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#FFF7EE"/>
      <path d="M127 95 Q 125 75 130 65" stroke={STROKE} strokeWidth="1.5" fill="none"/>
      <path d="M153 95 Q 155 75 150 65" stroke={STROKE} strokeWidth="1.5" fill="none"/>
      {/* eyes */}
      <circle cx="128" cy="135" r="3" fill={STROKE}/>
      <circle cx="152" cy="135" r="3" fill={STROKE}/>
      {/* nose + mouth */}
      <path d="M137 146 L 143 146 L 140 150 Z" fill={STROKE}/>
      <path d="M140 150 L 140 155 M 140 155 Q 135 158 132 155 M 140 155 Q 145 158 148 155" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* feet */}
      <ellipse cx="115" cy="235" rx="14" ry="8" stroke={STROKE} strokeWidth={STROKE_W} fill="#FFF7EE"/>
      <ellipse cx="165" cy="235" rx="14" ry="8" stroke={STROKE} strokeWidth={STROKE_W} fill="#FFF7EE"/>
      {/* tail — fluffy */}
      <circle cx="192" cy="200" r="10" stroke={STROKE} strokeWidth={STROKE_W} fill="#FFF7EE"/>
    </svg>
  );
}

// Olive — Beagle mix
function Pet_Olive({ size = 280 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" fill="none">
      {/* body */}
      <path d="M75 190 C 75 165, 95 150, 130 150 L 195 150 C 215 150, 220 165, 220 185 C 220 200, 212 210, 200 210 L 100 210 C 85 210, 75 205, 75 190 Z"
        stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#FFF7EE"/>
      {/* legs */}
      <path d="M95 210 L 92 248 M 115 210 L 115 248 M 180 210 L 180 248 M 200 210 L 203 248" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round"/>
      <path d="M86 248 Q 92 254 100 248 M 108 248 Q 115 254 122 248 M 173 248 Q 180 254 188 248 M 196 248 Q 203 254 210 248" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" fill="none"/>
      {/* tail up */}
      <path d="M218 162 Q 232 145 228 125" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" fill="none"/>
      {/* head — left side */}
      <ellipse cx="75" cy="150" rx="32" ry="30" stroke={STROKE} strokeWidth={STROKE_W} fill="#FFF7EE"/>
      {/* snout */}
      <path d="M50 155 L 38 158 L 38 168 L 55 168" stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#FFF7EE"/>
      <ellipse cx="40" cy="163" rx="3.5" ry="2.5" fill={STROKE}/>
      {/* ear — long floppy */}
      <path d="M65 130 Q 50 130 45 165 Q 48 178 60 175" stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill={STROKE} fillOpacity="0.85"/>
      {/* eye */}
      <circle cx="80" cy="148" r="3" fill={STROKE}/>
      {/* patch on body */}
      <path d="M120 165 Q 145 158 170 168 Q 165 185 140 188 Q 120 185 120 165 Z" fill={STROKE} fillOpacity="0.85"/>
    </svg>
  );
}

// Pepper — older shaggy dog
function Pet_Pepper({ size = 280 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" fill="none">
      {/* body — shaggy with wavy bottom */}
      <path d="M80 200 C 80 165, 105 145, 140 145 C 175 145, 200 165, 200 200 Q 195 215, 188 220 Q 180 235, 168 225 Q 155 235, 145 225 Q 132 235, 122 225 Q 110 235, 100 225 Q 88 230, 80 200 Z"
        stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#FFF7EE"/>
      {/* head */}
      <path d="M105 110 Q 105 80, 140 80 Q 175 80, 175 110 L 175 135 Q 158 145, 140 145 Q 122 145, 105 135 Z"
        stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#FFF7EE"/>
      {/* shaggy top */}
      <path d="M108 95 Q 115 80, 125 90 Q 135 80, 145 90 Q 155 80, 165 90 Q 172 80, 175 95" stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="none"/>
      {/* fringe over eyes */}
      <path d="M115 115 Q 130 125, 145 115 Q 158 125, 170 115" stroke={STROKE} strokeWidth={STROKE_W} fill="none"/>
      {/* eyes peeking */}
      <circle cx="128" cy="120" r="2.5" fill={STROKE}/>
      <circle cx="152" cy="120" r="2.5" fill={STROKE}/>
      {/* nose */}
      <ellipse cx="140" cy="135" rx="5" ry="3.5" fill={STROKE}/>
      {/* tongue */}
      <path d="M140 138 L 140 148 Q 137 152 134 148" stroke={STROKE} strokeWidth="1.5" fill={STROKE} fillOpacity="0.3"/>
      {/* gray patches showing age */}
      <path d="M110 100 Q 115 105 112 112" stroke={STROKE} strokeWidth="1.2" fill="none" opacity="0.5"/>
      <path d="M170 100 Q 165 105 168 112" stroke={STROKE} strokeWidth="1.2" fill="none" opacity="0.5"/>
    </svg>
  );
}

// Max — Labrador, profile
function Pet_Max({ size = 280 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 280 280" fill="none">
      {/* body */}
      <path d="M70 195 C 70 170, 90 155, 125 155 L 200 155 C 220 155, 225 170, 222 190 C 220 205, 210 215, 195 215 L 95 215 C 80 215, 70 208, 70 195 Z"
        stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#FFF7EE"/>
      {/* head */}
      <ellipse cx="75" cy="145" rx="35" ry="32" stroke={STROKE} strokeWidth={STROKE_W} fill="#FFF7EE"/>
      {/* snout */}
      <path d="M50 148 Q 35 150, 35 162 Q 35 172, 52 172 L 60 172" stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill="#FFF7EE"/>
      <ellipse cx="38" cy="158" rx="3.5" ry="2.8" fill={STROKE}/>
      {/* ear */}
      <path d="M65 122 Q 55 125, 52 155 Q 55 168, 68 165" stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" fill={STROKE} fillOpacity="0.85"/>
      {/* eye */}
      <circle cx="80" cy="143" r="3" fill={STROKE}/>
      {/* mouth open + tongue */}
      <path d="M48 167 Q 55 175 65 170" stroke={STROKE} strokeWidth={STROKE_W} fill="none"/>
      <path d="M52 170 L 52 178 Q 55 182 58 178 L 58 170" stroke={STROKE} strokeWidth="1.5" fill={STROKE} fillOpacity="0.3"/>
      {/* legs */}
      <path d="M90 215 L 90 250 M 115 215 L 115 250 M 175 215 L 175 250 M 200 215 L 200 250" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round"/>
      <path d="M82 250 Q 90 256 100 250 M 107 250 Q 115 256 124 250 M 167 250 Q 175 256 184 250 M 192 250 Q 200 256 209 250" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" fill="none"/>
      {/* tail */}
      <path d="M222 175 Q 240 160 245 138" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// Photo aliasing: the FEED/SHELTER data still uses legacy keys
// (miso / clover / olive / max) for stability, but the actual photo files
// are named after the new pets (satoru / hope / may / bear).  Map legacy
// keys to the correct photo so direct __pmPetPhotos[key] lookups work
// from anywhere — PetAvatar, hero banners, etc.
if (typeof window !== 'undefined' && window.__pmPetPhotos) {
  const _p = window.__pmPetPhotos;
  if (_p.satoru && !_p.miso)   _p.miso   = _p.satoru;
  if (_p.hope   && !_p.clover) _p.clover = _p.hope;
  if (_p.may    && !_p.olive)  _p.olive  = _p.may;
  if (_p.bear   && !_p.max)    _p.max    = _p.bear;
}

// Keys preserved (poppy/miso/clover/olive/max/pepper) so existing references
// don't break, but every pet's name + breed + kind + photo has been remapped
// to the real adoption photos the user provided.
const PETS = {
  poppy:  { name: 'Poppy',  breed: 'Dalmatian / English Setter Mix', shortBreed: 'Mix', age: '2y',
            gender: 'F', weight: '38 lb', dist: '1.2 mi', fee: 250,
            shelter: 'Willow Creek Rescue', kind: 'dog',
            color: '#FFD6B5', accent: '#FF8466', Art: Pet_Poppy,
            photo: (window.__pmPetPhotos && window.__pmPetPhotos.poppy) || null,
            bio: "A spotty whirlwind who loves long hikes and short naps. House-trained, kid-tested, snore-certified.",
            traits: ['Energetic', 'Kid-safe', 'House-trained', 'Loves walks'] },
  miso:   { name: 'Satoru', breed: 'Long-haired Tabby', shortBreed: 'Tabby', age: '4y',
            gender: 'M', weight: '11 lb', dist: '2.8 mi', fee: 110,
            shelter: 'Rose City Cat Rescue', kind: 'cat',
            color: '#F2D5B0', accent: '#E8A47C', Art: Pet_Miso,
            photo: (window.__pmPetPhotos && window.__pmPetPhotos.satoru) || null,
            bio: "Self-appointed window supervisor. Will rotate between four favorite sunbeams and judge them gently. Bow-tie included.",
            traits: ['Calm', 'Lap cat', 'Indoor', 'Vaccinated'] },
  clover: { name: 'Hope',   breed: 'Boxer Mix', shortBreed: 'Boxer', age: '7y',
            gender: 'F', weight: '52 lb', dist: '3.5 mi', fee: 185,
            shelter: 'Rose Rescue', kind: 'dog',
            color: '#FFE0C2', accent: '#E8A47C', Art: Pet_Clover,
            photo: (window.__pmPetPhotos && window.__pmPetPhotos.hope) || null,
            bio: "Senior boxer with retired-athlete vibes. Wants the comfy chair, polite walks, and to be told she's a good girl about ten times a day.",
            traits: ['Calm', 'Senior-friendly', 'House-trained', 'Loves naps'] },
  olive:  { name: 'May',    breed: 'Domestic Tabby', shortBreed: 'Tabby', age: '3y',
            gender: 'F', weight: '9 lb', dist: '2.8 mi', fee: 110,
            shelter: 'Pearl Cats', kind: 'cat',
            color: '#D4E4C4', accent: '#7BA66B', Art: Pet_Olive,
            photo: (window.__pmPetPhotos && window.__pmPetPhotos.may) || null,
            bio: "Big personality in a small package. Will tell you exactly what she thinks of dinner timing. Bow-tie not optional.",
            traits: ['Playful', 'Vocal', 'Indoor', 'Bow-tie certified'] },
  pepper: { name: 'Pepper', breed: 'Mixed', shortBreed: 'Mix', age: '5y',
            gender: 'M', weight: '24 lb', dist: '4.8 mi', fee: 150,
            shelter: 'Willow Creek Rescue', kind: 'dog',
            color: '#D6DCEA', accent: '#6E7FB0', Art: Pet_Pepper,
            photo: null,
            bio: "Senior gentleman seeking quiet afternoons, soft blankets, and someone to share the couch with.",
            traits: ['Senior', 'Mellow', 'House-trained', 'Velcro dog'] },
  max:    { name: 'Bear',   breed: 'Black Labrador Puppy', shortBreed: 'Lab', age: '6mo',
            gender: 'M', weight: '24 lb', dist: '1.2 mi', fee: 220,
            shelter: 'Willow Creek Rescue', kind: 'dog',
            color: '#E8E0CC', accent: '#4A4A4A', Art: Pet_Max,
            photo: (window.__pmPetPhotos && window.__pmPetPhotos.bear) || null,
            bio: "Puppy energy in a velvet coat. Loves chew toys, ear scritches, and learning his name (we're getting there).",
            traits: ['Puppy', 'Crate-training', 'Loves chews', 'Big eyes'] },
};

// ─── Cosmic decor ──────────────────────────────────────────

function StarBurst({ size = 16, color = '#F5C26B', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={style}>
      <path d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z" fill={color}/>
    </svg>
  );
}

function TinyStar({ size = 6, color = '#F5C26B', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 6 6" style={style}>
      <path d="M3 0 L3.5 2.5 L6 3 L3.5 3.5 L3 6 L2.5 3.5 L0 3 L2.5 2.5 Z" fill={color}/>
    </svg>
  );
}

// Planet with ring — small decorative
function Planet({ size = 60, color = '#FF8466', ringColor = '#5B4FE5', style }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 60 42" style={style}>
      <ellipse cx="30" cy="21" rx="28" ry="6" stroke={ringColor} strokeWidth="1.5" fill="none" opacity="0.7"/>
      <circle cx="30" cy="21" r="14" fill={color}/>
      <ellipse cx="30" cy="21" rx="28" ry="6" stroke={ringColor} strokeWidth="1.5" fill="none" opacity="0.7"
        strokeDasharray="0 50 50 100"/>
    </svg>
  );
}

// Constellation — connected stars for "match" graphics
function Constellation({ width = 200, height = 120, color = '#F5C26B', style }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 120" style={style}>
      <path d="M20 90 L 60 50 L 100 70 L 140 30 L 180 60"
        stroke={color} strokeWidth="1" fill="none" opacity="0.45" strokeDasharray="2 3"/>
      <circle cx="20" cy="90" r="2.5" fill={color}/>
      <circle cx="60" cy="50" r="3.5" fill={color}/>
      <circle cx="100" cy="70" r="2.5" fill={color}/>
      <circle cx="140" cy="30" r="3.5" fill={color}/>
      <circle cx="180" cy="60" r="2.5" fill={color}/>
    </svg>
  );
}

// Scattered stars background (subtle)
function StarField({ count = 30, color = '#F5C26B', opacity = 0.5, seed = 1 }) {
  // deterministic positions
  const rand = (i) => {
    const x = Math.sin(i * 9301 + seed * 49297) * 233280;
    return x - Math.floor(x);
  };
  const stars = Array.from({ length: count }, (_, i) => ({
    x: rand(i) * 100,
    y: rand(i + 100) * 100,
    r: 0.6 + rand(i + 200) * 1.3,
  }));
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.3} fill={color} opacity={opacity}/>
      ))}
    </svg>
  );
}

// Orbit ring — large decorative
function Orbit({ size = 200, color = '#5B4FE5', strokeWidth = 1, opacity = 0.3, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style}>
      <ellipse cx="100" cy="100" rx="98" ry="40" stroke={color} strokeWidth={strokeWidth} fill="none" opacity={opacity}/>
    </svg>
  );
}

// PawMatch wordmark with constellation dot over the 'i' impossible (no 'i')
// Use an icon: paw + small constellation
function Logo({ size = 28, color = '#15163A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28">
      <circle cx="8" cy="9" r="2.5" fill={color}/>
      <circle cx="14" cy="6" r="2.8" fill={color}/>
      <circle cx="20" cy="9" r="2.5" fill={color}/>
      <circle cx="22" cy="15" r="2.2" fill={color}/>
      <circle cx="6" cy="15" r="2.2" fill={color}/>
      <path d="M14 12 C 9 12, 7 16, 8 19 C 9 23, 12 24, 14 24 C 16 24, 19 23, 20 19 C 21 16, 19 12, 14 12 Z" fill={color}/>
    </svg>
  );
}

Object.assign(window, {
  Pet_Poppy, Pet_Miso, Pet_Clover, Pet_Olive, Pet_Pepper, Pet_Max,
  PETS,
  StarBurst, TinyStar, Planet, Constellation, StarField, Orbit, Logo,
});
