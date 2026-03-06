// ═══════════════════════════════════════════════════════════
//  CuteDino.jsx — 7 unique dinosaur species for Dragon Egg game
//  Edit this file to tweak dinosaur designs without touching Course1.jsx
// ═══════════════════════════════════════════════════════════

const DARK = "#1D2B3A";

const lighten = (hex, amt) => {
  const c = hex.replace("#", "");
  const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  return "#" + [r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt].map(v => Math.min(255, Math.round(v)).toString(16).padStart(2, "0")).join("");
};
const darken = (hex, amt) => {
  const c = hex.replace("#", "");
  const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  return "#" + [r * (1 - amt), g * (1 - amt), b * (1 - amt)].map(v => Math.max(0, Math.round(v)).toString(16).padStart(2, "0")).join("");
};

// ─── Reusable stumpy foot for quadrupeds ───
function DinoFootStumpy({ cx, cy, color, clawColor, scale = 1 }) {
  const s = scale;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${s}, ${s})`}>
      <ellipse cx="0" cy="2" rx="10" ry="5" fill={color} />
      <circle cx="-6" cy="-2" r="3.5" fill={color} />
      <circle cx="0" cy="-3" r="3.5" fill={color} />
      <circle cx="6" cy="-2" r="3.5" fill={color} />
      <ellipse cx="-7" cy="-5" rx="1.5" ry="2" fill={clawColor} />
      <ellipse cx="0" cy="-6" rx="1.5" ry="2" fill={clawColor} />
      <ellipse cx="7" cy="-5" rx="1.5" ry="2" fill={clawColor} />
    </g>
  );
}

// ═══════════════════════════════════════════
// 1. T-REX (Green) — Massive skull, tiny arms, bipedal
// ═══════════════════════════════════════════
function TRex({ color, size }) {
  const belly = lighten(color, 0.5);
  const dark = darken(color, 0.15);
  const claw = darken(color, 0.3);
  return (
    <svg width={size} height={size} viewBox="-5 0 120 120" fill="none">
      {/* Tail */}
      <path d="M26 74 Q10 66 4 60 Q2 56 6 54" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="44" cy="66" rx="20" ry="26" fill={color} transform="rotate(15 44 66)" />
      <ellipse cx="44" cy="48" rx="16" ry="4" fill={dark} opacity="0.2" />
      <ellipse cx="48" cy="74" rx="12" ry="14" fill={belly} transform="rotate(15 48 74)" />
      {/* Head */}
      <rect x="54" y="18" rx="14" ry="14" width="42" height="36" fill={color} />
      {/* Lower jaw — rounded, natural */}
      <rect x="70" y="46" rx="6" ry="6" width="22" height="8" fill={darken(color, 0.05)} />
      {/* Jaw line */}
      <path d="M72 50 L90 50" stroke={dark} strokeWidth="1" opacity="0.3" />
      {/* Teeth — 3, hanging from jaw edge */}
      <path d="M76 50 L77 54 L78 50" fill="white" />
      <path d="M81 50 L82 54 L83 50" fill="white" />
      <path d="M86 50 L87 54 L88 50" fill="white" />
      {/* Brow ridge */}
      <path d="M58 24 Q76 18 94 24" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="72" cy="30" r="7" fill="white" />
      <circle cx="74" cy="29" r="4.5" fill={DARK} />
      <circle cx="76" cy="27" r="2" fill="white" />
      {/* Nostril */}
      <circle cx="94" cy="28" r="2" fill={dark} opacity="0.4" />
      {/* Cheek */}
      <circle cx="68" cy="40" r="4" fill={lighten(color, 0.4)} opacity="0.4" />
      {/* Tiny arms — two, pointing downward */}
      <path d="M64 60 Q70 64 76 62" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M76 62 L79 62" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M76 62 L79 68" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M64 66 Q70 70 76 68" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M76 68 L79 68" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M76 68 L79 74" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Left leg: thigh → knee → shin → foot */}
      <path d="M40 84 L36 96" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M36 96 L42 108" stroke={darken(color, 0.05)} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M42 108 L40 114" stroke={darken(color, 0.08)} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Left toes */}
      <path d="M36 116 L40 114 L44 116" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="36" cy="116.5" rx="2" ry="1.5" fill={claw} />
      <ellipse cx="40" cy="117" rx="2" ry="1.5" fill={claw} />
      <ellipse cx="44" cy="116.5" rx="2" ry="1.5" fill={claw} />

      {/* Right leg: thigh → knee → shin → foot */}
      <path d="M54 82 L52 94" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M52 94 L58 106" stroke={darken(color, 0.05)} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M58 106 L56 112" stroke={darken(color, 0.08)} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Right toes */}
      <path d="M52 114 L56 112 L60 114" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="52" cy="114.5" rx="2" ry="1.5" fill={claw} />
      <ellipse cx="56" cy="115" rx="2" ry="1.5" fill={claw} />
      <ellipse cx="60" cy="114.5" rx="2" ry="1.5" fill={claw} />
    </svg>
  );
}

// ═══════════════════════════════════════════
// 2. PLESIOSAUR (Blue) — Long neck, small head, turtle body, flippers
// ═══════════════════════════════════════════
function Plesiosaur({ color, size }) {
  const belly = lighten(color, 0.5);
  const dark = darken(color, 0.12);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M14 70 Q6 66 4 60 Q3 56 8 58" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="45" cy="72" rx="34" ry="18" fill={color} />
      <ellipse cx="45" cy="62" rx="26" ry="6" fill={lighten(color, 0.15)} opacity="0.4" />
      <ellipse cx="45" cy="78" rx="24" ry="10" fill={belly} />
      <path d="M70 66 C76 58, 78 42, 82 30 C84 22, 86 14, 88 10" stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M74 66 C80 56, 82 40, 86 28 C88 20, 89 14, 91 10" stroke={belly} strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="90" cy="8" rx="11" ry="8" fill={color} transform="rotate(15 90 8)" />
      <circle cx="94" cy="5" r="4" fill="white" />
      <circle cx="95.5" cy="4" r="2.5" fill={DARK} />
      <circle cx="96.5" cy="3" r="1" fill="white" />
      <path d="M96 10 Q100 13 103 10" stroke={dark} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="98" cy="8" r="2.5" fill={lighten(color, 0.4)} opacity="0.4" />
      <path d="M66 72 Q76 82 84 88 Q80 90 72 84 Q68 80 64 76" fill={dark} />
      <path d="M24 72 Q14 82 6 88 Q10 90 18 84 Q22 80 26 76" fill={dark} />
      <path d="M58 78 Q64 88 70 94 Q66 94 62 88 Q60 84 58 80" fill={darken(color, 0.18)} />
      <path d="M32 78 Q26 88 20 94 Q24 94 28 88 Q30 84 32 80" fill={darken(color, 0.18)} />
      <circle cx="100" cy="16" r="1.5" fill={lighten(color, 0.5)} opacity="0.5" />
      <circle cx="104" cy="10" r="1" fill={lighten(color, 0.5)} opacity="0.4" />
      <circle cx="70" cy="6" r="1.5" fill={lighten(color, 0.5)} opacity="0.5" />
    </svg>
  );
}

// ═══════════════════════════════════════════
// 3. PTERODACTYL (Yellow) — Bat-membrane wings, head crest, beak
// ═══════════════════════════════════════════
function Pterodactyl({ color, size }) {
  const dark = darken(color, 0.15);
  const belly = lighten(color, 0.45);
  const membrane = darken(color, 0.04);
  const membraneDark = darken(color, 0.12);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M52 48 L40 36 L22 24 L10 18 Q8 24 14 30 L8 28 Q6 34 14 36 L22 38 Q34 44 46 50 L46 62 Q36 58 28 56 Q18 54 10 50 Q14 56 22 58 Q30 60 42 62 L48 64"
        fill={membrane} stroke={membraneDark} strokeWidth="0.8" />
      <path d="M52 48 L40 36 L22 24 L10 18" stroke={dark} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M68 48 L80 36 L98 24 L110 18 Q112 24 106 30 L112 28 Q114 34 106 36 L98 38 Q86 44 74 50 L74 62 Q84 58 92 56 Q102 54 110 50 Q106 56 98 58 Q90 60 78 62 L72 64"
        fill={membrane} stroke={membraneDark} strokeWidth="0.8" />
      <path d="M68 48 L80 36 L98 24 L110 18" stroke={dark} strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="60" rx="14" ry="14" fill={color} />
      <ellipse cx="60" cy="64" rx="9" ry="9" fill={belly} />
      <ellipse cx="60" cy="40" rx="10" ry="9" fill={color} />
      <path d="M54 34 Q44 18 38 12" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M54 34 Q44 18 38 12" stroke={dark} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.2" />
      <path d="M68 38 L82 34 L68 42" fill={darken(color, 0.2)} />
      <path d="M68 40 L80 36" stroke={darken(color, 0.25)} strokeWidth="0.8" fill="none" />
      <circle cx="64" cy="36" r="5" fill="white" />
      <circle cx="65.5" cy="35" r="3.2" fill={DARK} />
      <circle cx="67" cy="33.5" r="1.3" fill="white" />
      <circle cx="68" cy="42" r="3" fill={lighten(color, 0.35)} opacity="0.4" />
      <path d="M54 74 L52 82" stroke={dark} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M66 74 L68 82" stroke={dark} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M49 82 Q52 80 52 83" stroke={dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M52 82 L52 86" stroke={dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M55 82 Q52 80 52 83" stroke={dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M65 82 Q68 80 68 83" stroke={dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M68 82 L68 86" stroke={dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M71 82 Q68 80 68 83" stroke={dark} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════
// 4. TRICERATOPS (Red) — Frill, 3 horns, beak, quadruped
// ═══════════════════════════════════════════
function Triceratops({ color, size }) {
  const belly = lighten(color, 0.5);
  const dark = darken(color, 0.15);
  const bone = lighten(color, 0.6);
  const claw = darken(color, 0.3);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M10 62 Q4 58 2 52" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Legs behind body */}
      <rect x="16" y="72" rx="6" ry="4" width="14" height="22" fill={darken(color, 0.08)} />
      <rect x="34" y="72" rx="6" ry="4" width="14" height="22" fill={darken(color, 0.08)} />
      <rect x="54" y="68" rx="6" ry="4" width="13" height="24" fill={darken(color, 0.1)} />
      <rect x="70" y="66" rx="6" ry="4" width="13" height="24" fill={darken(color, 0.1)} />
      <DinoFootStumpy cx={23} cy={96} color={dark} clawColor={claw} scale={0.65} />
      <DinoFootStumpy cx={41} cy={96} color={dark} clawColor={claw} scale={0.65} />
      <DinoFootStumpy cx={60} cy={94} color={dark} clawColor={claw} scale={0.6} />
      <DinoFootStumpy cx={76} cy={92} color={dark} clawColor={claw} scale={0.6} />
      {/* Body on top */}
      <ellipse cx="44" cy="62" rx="32" ry="22" fill={color} />
      <ellipse cx="46" cy="70" rx="20" ry="12" fill={belly} />
      {/* Frill */}
      <path d="M72 28 Q62 6 74 2 Q82 0 90 2 Q98 4 104 10 Q110 18 108 30 Q106 24 100 18 Q92 12 84 12 Q76 14 74 22" fill={darken(color, 0.1)} stroke={dark} strokeWidth="2" />
      <circle cx="78" cy="6" r="3.5" fill={bone} opacity="0.5" />
      <circle cx="88" cy="4" r="3.5" fill={bone} opacity="0.5" />
      <circle cx="98" cy="8" r="3.5" fill={bone} opacity="0.5" />
      <circle cx="104" cy="16" r="3" fill={bone} opacity="0.5" />
      {/* Head */}
      <ellipse cx="84" cy="42" rx="18" ry="16" fill={color} />
      <path d="M98 42 Q106 38 108 42 Q106 46 98 44" fill={darken(color, 0.25)} />
      {/* Three horns */}
      <path d="M100 36 L106 30 L102 38" fill={bone} stroke={darken(color, 0.1)} strokeWidth="1" />
      <path d="M82 32 L76 12 L86 30" fill={bone} stroke={darken(color, 0.1)} strokeWidth="1" />
      <path d="M92 30 L96 10 L96 28" fill={bone} stroke={darken(color, 0.1)} strokeWidth="1" />
      {/* Eye */}
      <circle cx="86" cy="38" r="5.5" fill="white" />
      <circle cx="87.5" cy="37" r="3.5" fill={DARK} />
      <circle cx="89" cy="35.5" r="1.5" fill="white" />
      <circle cx="94" cy="46" r="3.5" fill={lighten(color, 0.4)} opacity="0.4" />
      <path d="M96 48 Q100 52 104 49" stroke={dark} strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════
// 5. STEGOSAURUS (Purple) — Wide plates, thagomizer, tiny head
// ═══════════════════════════════════════════
function Stegosaurus({ color, size }) {
  const belly = lighten(color, 0.5);
  const dark = darken(color, 0.15);
  const plate = lighten(color, 0.2);
  const claw = darken(color, 0.3);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Tail angled up */}
      <path d="M26 64 Q14 56 6 48" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Thagomizer — 2 pairs */}
      <path d="M8 48 L-2 34 L12 44" fill={lighten(color, 0.45)} stroke={dark} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 46 L2 30 L10 42" fill={lighten(color, 0.45)} stroke={dark} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 52 L-4 56 L8 50" fill={lighten(color, 0.45)} stroke={dark} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M8 50 L0 58 L10 52" fill={lighten(color, 0.45)} stroke={dark} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Back plates — wide pentagons */}
      <path d="M28 52 L30 38 L34 28 L38 38 L40 52" fill={plate} stroke={dark} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M38 48 L41 32 L46 20 L51 32 L54 48" fill={darken(plate, 0.04)} stroke={dark} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M50 46 L53 30 L58 18 L63 30 L66 46" fill={plate} stroke={dark} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M60 48 L63 36 L67 26 L71 36 L74 48" fill={darken(plate, 0.04)} stroke={dark} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Back legs — angled backward */}
      <path d="M30 76 Q26 84 28 94" stroke={darken(color, 0.07)} strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M46 76 Q42 84 44 94" stroke={darken(color, 0.07)} strokeWidth="11" fill="none" strokeLinecap="round" />
      {/* Front legs — angled forward, longer */}
      <path d="M64 72 Q68 82 66 94" stroke={darken(color, 0.1)} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M78 70 Q82 80 80 92" stroke={darken(color, 0.1)} strokeWidth="8" fill="none" strokeLinecap="round" />
      <DinoFootStumpy cx={28} cy={96} color={dark} clawColor={claw} scale={0.58} />
      <DinoFootStumpy cx={44} cy={96} color={dark} clawColor={claw} scale={0.58} />
      <DinoFootStumpy cx={66} cy={96} color={dark} clawColor={claw} scale={0.48} />
      <DinoFootStumpy cx={80} cy={94} color={dark} clawColor={claw} scale={0.45} />
      {/* Body on top */}
      <ellipse cx="54" cy="66" rx="30" ry="20" fill={color} />
      <ellipse cx="54" cy="74" rx="20" ry="10" fill={belly} />
      {/* Head — tiny */}
      <ellipse cx="92" cy="62" rx="10" ry="8" fill={color} />
      <path d="M80 62 Q86 58 90 60" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" />
      <circle cx="96" cy="58" r="4" fill="white" />
      <circle cx="97" cy="57" r="2.5" fill={DARK} />
      <circle cx="98" cy="56" r="1" fill="white" />
      <path d="M98 64 Q102 67 104 64" stroke={dark} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="62" r="2.5" fill={lighten(color, 0.4)} opacity="0.4" />
    </svg>
  );
}

// ═══════════════════════════════════════════
// 6. VELOCIRAPTOR (Orange) — Feathered, sickle claw, lean runner
// ═══════════════════════════════════════════
function Velociraptor({ color, size }) {
  const belly = lighten(color, 0.5);
  const dark = darken(color, 0.15);
  const feather = darken(color, 0.1);
  const claw = darken(color, 0.3);
  return (
<svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* ═══ TAIL ═══ */}
      <path d="M24 42 L4 34" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      
      {/* ═══ TAIL FEATHERS ═══ */}
      <path d="M8 34 L2 28 L6 32" fill={feather} />
      <path d="M6 36 L0 32 L4 34" fill={feather} />
      <path d="M8 32 L4 26 L8 30" fill={darken(color, 0.18)} />
      
      {/* ═══ BODY ═══ */}
      <ellipse cx="44" cy="48" rx="20" ry="16" fill={color} transform="rotate(-20 44 48)" />
      {/* ═══ BELLY ═══ */}
      <ellipse cx="48" cy="54" rx="12" ry="10" fill={belly} transform="rotate(-15 48 54)" />
      
{/* ═══ TINY ARMS — two, pointing downward ═══ */}
      <path d="M58 42 Q64 46 70 44" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M70 44 L73 44" stroke={dark} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M70 44 L73 50" stroke={dark} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M58 48 Q64 52 70 50" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M70 50 L73 50" stroke={dark} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M70 50 L73 56" stroke={dark} strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* ═══ HEAD ═══ */}
      <ellipse cx="72" cy="28" rx="14" ry="11" fill={color} transform="rotate(-10 72 28)" />
      {/* ═══ SNOUT ═══ */}
      <ellipse cx="86" cy="28" rx="8" ry="5" fill={darken(color, 0.04)} transform="rotate(-5 86 28)" />
      {/* ═══ NECK ═══ */}
      <path d="M58 40 Q64 32 68 28" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
      
      {/* ═══ EYE ═══ */}
      <circle cx="74" cy="24" r="5" fill="white" />
      <circle cx="75.5" cy="23" r="3.2" fill={DARK} />
      <circle cx="77" cy="21.5" r="1.3" fill="white" />
      {/* ═══ SLIT PUPIL ═══ */}
      <ellipse cx="75.5" cy="23" rx="1.2" ry="3" fill="#111" />
      
      {/* ═══ TEETH ═══ */}
      <path d="M86 30 L87 33 L88 30" fill="white" />
      <path d="M90 30 L91 32 L92 30" fill="white" />
      
      {/* ═══ HEAD FEATHERS ═══ */}
      <path d="M68 18 L64 8 L70 16" fill={feather} />
      <path d="M72 16 L70 6 L74 14" fill={darken(color, 0.18)} />
      <path d="M76 18 L76 10 L78 16" fill={feather} />
      
      {/* ═══ LEFT LEG: thigh → knee → shin ═══ */}
      <path d="M38 60 L34 72" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M34 72 L40 84" stroke={darken(color, 0.05)} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M40 84 L38 90" stroke={darken(color, 0.08)} strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* ═══ RIGHT LEG: thigh → knee → shin ═══ */}
      <path d="M50 58 L48 70" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M48 70 L54 82" stroke={darken(color, 0.05)} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M54 82 L52 88" stroke={darken(color, 0.08)} strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* ═══ LEFT TOES ═══ */}
      <path d="M34 92 L38 90 L42 92" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="34" cy="92.5" rx="2" ry="1.5" fill={claw} />
      <ellipse cx="38" cy="93" rx="2" ry="1.5" fill={claw} />
      <ellipse cx="42" cy="92.5" rx="2" ry="1.5" fill={claw} />
      {/* ═══ LEFT SICKLE CLAW ═══ */}
      <path d="M35 90 Q32 84 36 82" stroke={claw} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      
      {/* ═══ RIGHT TOES ═══ */}
      <path d="M48 90 L52 88 L56 90" stroke={dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="48" cy="90.5" rx="2" ry="1.5" fill={claw} />
      <ellipse cx="52" cy="91" rx="2" ry="1.5" fill={claw} />
      <ellipse cx="56" cy="90.5" rx="2" ry="1.5" fill={claw} />
      {/* ═══ RIGHT SICKLE CLAW ═══ */}
      <path d="M49 88 Q46 82 50 80" stroke={claw} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════
// 7. ANKYLOSAURUS (Gray) — Scale armor, side spikes, tail club, flat head
// ═══════════════════════════════════════════
function Ankylosaurus({ color, size }) {
  const belly = lighten(color, 0.45);
  const dark = darken(color, 0.15);
  const armor = darken(color, 0.12);
  const claw = darken(color, 0.3);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Tail with club */}
      <path d="M20 66 Q10 62 6 58" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
      <ellipse cx="4" cy="56" rx="10" ry="7" fill={armor} stroke={dark} strokeWidth="1.5" />
      <ellipse cx="4" cy="56" rx="6" ry="4" fill={darken(color, 0.2)} />
      {/* Legs behind body */}
      <rect x="28" y="76" rx="6" ry="4" width="14" height="16" fill={darken(color, 0.07)} />
      <rect x="48" y="76" rx="6" ry="4" width="14" height="16" fill={darken(color, 0.07)} />
      <rect x="64" y="74" rx="5" ry="4" width="12" height="16" fill={darken(color, 0.1)} />
      <rect x="78" y="72" rx="5" ry="4" width="11" height="16" fill={darken(color, 0.1)} />
      <DinoFootStumpy cx={35} cy={94} color={dark} clawColor={claw} scale={0.65} />
      <DinoFootStumpy cx={55} cy={94} color={dark} clawColor={claw} scale={0.65} />
      <DinoFootStumpy cx={70} cy={92} color={dark} clawColor={claw} scale={0.55} />
      <DinoFootStumpy cx={83} cy={90} color={dark} clawColor={claw} scale={0.55} />
      {/* Body on top */}
      <ellipse cx="54" cy="66" rx="36" ry="20" fill={color} />
      {/* Armor shell */}
      <path d="M22 54 Q54 40 86 54" fill={armor} stroke={dark} strokeWidth="1.5" />
      {/* Hexagonal scale armor */}
      <path d="M32 50 L36 46 L42 46 L46 50 L42 52 L36 52 Z" fill={darken(color, 0.16)} stroke={dark} strokeWidth="0.6" />
      <path d="M48 46 L52 42 L58 42 L62 46 L58 48 L52 48 Z" fill={darken(color, 0.16)} stroke={dark} strokeWidth="0.6" />
      <path d="M64 46 L68 42 L74 42 L78 46 L74 48 L68 48 Z" fill={darken(color, 0.16)} stroke={dark} strokeWidth="0.6" />
      <path d="M40 56 L44 52 L50 52 L54 56 L50 58 L44 58 Z" fill={darken(color, 0.14)} stroke={dark} strokeWidth="0.5" />
      <path d="M56 54 L60 50 L66 50 L70 54 L66 56 L60 56 Z" fill={darken(color, 0.14)} stroke={dark} strokeWidth="0.5" />
      {/* Side spikes */}
      <path d="M22 60 L12 52 L22 56" fill={dark} />
      <path d="M24 66 L14 62 L24 62" fill={dark} />
      <path d="M86 60 L96 52 L86 56" fill={dark} />
      <path d="M84 66 L94 62 L84 62" fill={dark} />
      {/* Belly */}
      <ellipse cx="54" cy="76" rx="26" ry="8" fill={belly} />
      {/* Head — wide, flat, dinosaur-like */}
      <path d="M82 52 L108 56 L108 64 L82 68 Q78 60 82 52" fill={color} />
      <path d="M84 52 Q94 48 106 54" fill={armor} stroke={dark} strokeWidth="1" />
      <path d="M104 52 L112 46 L106 54" fill={dark} />
      <path d="M104 68 L112 74 L106 66" fill={dark} />
      <path d="M106 56 L114 58 L114 62 L106 64" fill={darken(color, 0.2)} />
      <circle cx="96" cy="56" r="4" fill="white" />
      <circle cx="97" cy="55" r="2.5" fill={DARK} />
      <circle cx="98" cy="54" r="1" fill="white" />
      <circle cx="102" cy="62" r="2.5" fill={lighten(color, 0.35)} opacity="0.4" />
      <path d="M106 66 Q110 68 112 66" stroke={dark} strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ═══ Species list — order matches DINO_COLORS index ═══
const DINO_COMPONENTS = [TRex, Plesiosaur, Pterodactyl, Triceratops, Stegosaurus, Velociraptor, Ankylosaurus];

// ═══ EXPORTED COMPONENT ═══
// API: <CuteDino color="#2ECC71" size={100} name="Rex" delay={0.2} index={0} />
//   - color: egg/dino color
//   - size: pixel size
//   - name: optional label below
//   - delay: animation delay in seconds
//   - index: which species (0=TRex, 1=Plesiosaur, 2=Pterodactyl, 3=Triceratops, 4=Stegosaurus, 5=Velociraptor, 6=Ankylosaurus)
export default function CuteDino({ color = "#E8734A", size = 100, name = "", delay = 0, index = 0 }) {
  const DinoComponent = DINO_COMPONENTS[index] || TRex;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", animation: `dinoAppear 0.8s ease-out ${delay}s both` }}>
      <DinoComponent color={color} size={size} />
      {name && <span style={{ fontSize: 12, fontWeight: 600, color, marginTop: 4, letterSpacing: 0.5 }}>{name}</span>}
    </div>
  );
}
