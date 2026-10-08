import type { SVGProps } from 'react';

/* Personnages du Grand Hôtel Babines — aplats, contours noirs épais. Décoratifs : aria-hidden. */

const N = '#1E1430';
const S = { stroke: N, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

type P = SVGProps<SVGSVGElement> & { pose?: string };

const base = (props: SVGProps<SVGSVGElement>) => ({
  'aria-hidden': true as const,
  focusable: 'false' as const,
  xmlns: 'http://www.w3.org/2000/svg',
  ...props,
});

/* ------------------------------------------------------------------ */
/* Tête du Baron (profil) — emblème, favicon, petits espaces            */
/* ------------------------------------------------------------------ */
export function BaronHead({ clin = false, ...props }: SVGProps<SVGSVGElement> & { clin?: boolean }) {
  return (
    <svg viewBox="0 0 120 110" {...base(props)}>
      {/* oreille arrière */}
      <path d="M38 30 C18 34 12 62 20 86 C24 96 38 96 42 84 C46 66 48 46 38 30Z" fill="#7A3B12" {...S} />
      {/* tête */}
      <path d="M30 38 C34 18 66 12 80 26 C88 34 92 42 104 48 C116 54 116 70 104 74 C92 78 80 76 70 80 C58 88 40 84 34 72 C28 62 28 50 30 38Z" fill="#B5652B" {...S} />
      {/* museau clair */}
      <path d="M78 52 C90 52 106 54 108 62 C110 72 94 74 82 72 C74 70 72 56 78 52Z" fill="#E9A66B" />
      <ellipse cx="108" cy="56" rx="7" ry="6" fill={N} />
      <path d="M86 70 C92 74 98 74 102 70" fill="none" {...S} />
      {/* oreille avant */}
      <path d="M44 32 C30 40 30 70 40 90 C46 100 60 96 60 84 C62 64 58 44 44 32Z" fill="#8E4517" {...S} />
      {/* œil + monocle */}
      <g className={clin ? 'oeil-clin' : undefined}>
        <ellipse cx="74" cy="40" rx="4.5" ry="5.5" fill={N} />
      </g>
      <path d="M66 30 C70 27 78 27 82 30" fill="none" {...S} />
      <g className="monocle">
        <circle cx="74" cy="40" r="11" fill="rgba(255,255,255,.25)" stroke="#C9A227" strokeWidth="3.5" />
        <path d="M74 51 C72 62 66 70 60 78" fill="none" stroke="#C9A227" strokeWidth="2" strokeDasharray="3 3" />
      </g>
      {/* nœud pap' rose */}
      <g transform="translate(62 92)">
        <path d="M0 0 L-18 -10 L-18 10Z" fill="#FF4F9A" {...S} />
        <path d="M0 0 L18 -10 L18 10Z" fill="#FF4F9A" {...S} />
        <circle r="5" fill="#FF4F9A" {...S} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Baron Biscotte — teckel en smoking bordeaux très long                */
/* poses : debout, salue, loupe, perdu, assis                          */
/* ------------------------------------------------------------------ */
export function Baron({ pose = 'debout', ...props }: P) {
  const salue = pose === 'salue';
  const loupe = pose === 'loupe';
  const perdu = pose === 'perdu';
  return (
    <svg viewBox="0 0 360 250" {...base(props)} className={`baron ${props.className ?? ''}`}>
      {/* ombre au sol */}
      <ellipse cx="180" cy="236" rx="140" ry="9" fill={N} opacity=".15" />
      {/* queue */}
      <path d="M52 128 C30 118 22 92 30 70" fill="none" stroke={N} strokeWidth="14" strokeLinecap="round" />
      <path d="M52 128 C30 118 22 92 30 70" fill="none" stroke="#B5652B" strokeWidth="8" strokeLinecap="round" />
      {/* pattes arrière */}
      <rect x="66" y="170" width="22" height="52" rx="10" fill="#8E4517" {...S} />
      <rect x="94" y="170" width="22" height="52" rx="10" fill="#B5652B" {...S} />
      <ellipse cx="80" cy="224" rx="16" ry="8" fill={N} />
      <ellipse cx="108" cy="224" rx="16" ry="8" fill={N} />
      {/* pattes avant */}
      <rect x="226" y="170" width="22" height="52" rx="10" fill="#8E4517" {...S} />
      {!salue && <rect x="254" y="170" width="22" height="52" rx="10" fill="#B5652B" {...S} />}
      <ellipse cx="240" cy="224" rx="16" ry="8" fill={N} />
      {!salue && <ellipse cx="268" cy="224" rx="16" ry="8" fill={N} />}
      {/* basques du smoking */}
      <path d="M58 132 L28 196 L70 182Z" fill="#4A1029" {...S} />
      {/* corps : smoking bordeaux très long */}
      <rect x="48" y="104" width="240" height="84" rx="42" fill="#6B1E3F" {...S} />
      {/* reflet velours */}
      <path d="M80 118 C140 110 210 110 262 118" fill="none" stroke="#8E3A5E" strokeWidth="6" strokeLinecap="round" />
      {/* boutons dorés */}
      <circle cx="200" cy="160" r="4" fill="#C9A227" stroke={N} strokeWidth="2" />
      <circle cx="176" cy="164" r="4" fill="#C9A227" stroke={N} strokeWidth="2" />
      {/* plastron + revers satin noir */}
      <path d="M244 108 L284 112 L266 168Z" fill="#FFF6EA" {...S} />
      <path d="M244 108 L262 150 L232 120Z" fill={N} />
      <path d="M284 112 L270 154 L292 130Z" fill={N} />
      {/* patte qui salue */}
      {salue && (
        <g>
          <path d="M262 150 C286 140 304 116 312 92" fill="none" stroke={N} strokeWidth="26" strokeLinecap="round" />
          <path d="M262 150 C286 140 304 116 312 92" fill="none" stroke="#6B1E3F" strokeWidth="20" strokeLinecap="round" />
          <circle cx="314" cy="86" r="13" fill="#B5652B" {...S} />
        </g>
      )}
      {/* loupe */}
      {loupe && (
        <g>
          <path d="M268 160 L314 150" stroke={N} strokeWidth="24" strokeLinecap="round" />
          <path d="M268 160 L314 150" stroke="#6B1E3F" strokeWidth="18" strokeLinecap="round" />
          <circle cx="318" cy="150" r="10" fill="#B5652B" {...S} />
          <path d="M322 146 L336 126" stroke="#7A3B12" strokeWidth="7" strokeLinecap="round" />
          <circle cx="342" cy="112" r="16" fill="rgba(61,184,245,.35)" stroke={N} strokeWidth="4" />
        </g>
      )}
      {/* plan à l'envers */}
      {perdu && (
        <g transform="rotate(-8 300 170)">
          <rect x="262" y="140" width="80" height="56" rx="4" fill="#FFF6EA" {...S} />
          <path d="M272 150 L292 186 L312 154 L332 188" fill="none" stroke="#3DB8F5" strokeWidth="3" />
          <path d="M300 178 l6 -10 l6 10" fill="#FF4F9A" stroke={N} strokeWidth="2" transform="rotate(180 306 173)" />
          <text x="302" y="194" fontSize="9" textAnchor="middle" fontWeight="800" fill={N} transform="rotate(180 302 191)">PLAN</text>
        </g>
      )}
      {/* tête */}
      <g transform="translate(222 4)">
        <BaronHeadInline perdu={perdu} />
      </g>
    </svg>
  );
}

function BaronHeadInline({ perdu }: { perdu?: boolean }) {
  return (
    <g>
      <path d="M38 50 C18 54 12 82 20 106 C24 116 38 116 42 104 C46 86 48 66 38 50Z" fill="#7A3B12" {...S} />
      <path d="M30 58 C34 38 66 32 80 46 C88 54 92 62 108 68 C122 74 122 92 108 96 C94 100 80 96 70 100 C58 108 40 104 34 92 C28 82 28 70 30 58Z" fill="#B5652B" {...S} />
      <path d="M80 72 C94 72 112 74 114 82 C116 92 98 94 84 92 C76 90 74 76 80 72Z" fill="#E9A66B" />
      <ellipse cx="114" cy="76" rx="8" ry="7" fill={N} />
      {perdu ? (
        <path d="M88 92 C94 86 102 86 106 92" fill="none" {...S} />
      ) : (
        <path d="M86 90 C94 96 102 96 108 90" fill="none" {...S} />
      )}
      <path d="M44 52 C30 60 30 90 40 110 C46 120 60 116 60 104 C62 84 58 64 44 52Z" fill="#8E4517" {...S} />
      <g className="oeil-clin">
        <ellipse cx="76" cy="60" rx="5" ry="6" fill={N} />
        <circle cx="77.5" cy="58" r="1.6" fill="#fff" />
      </g>
      <path d={perdu ? 'M66 46 C70 42 78 44 84 50' : 'M66 50 C70 47 78 47 84 50'} fill="none" {...S} />
      <g className="monocle">
        <circle cx="76" cy="60" r="12" fill="rgba(255,255,255,.25)" stroke="#C9A227" strokeWidth="4" />
        <path d="M76 72 C74 84 68 92 62 100" fill="none" stroke="#C9A227" strokeWidth="2" strokeDasharray="3 3" />
      </g>
      {perdu && <text x="96" y="30" fontSize="30" fontWeight="900" fill={N} fontFamily="Fraunces, serif">?</text>}
      <g transform="translate(66 112)">
        <path d="M0 0 L-20 -12 L-20 12Z" fill="#FF4F9A" {...S} />
        <path d="M0 0 L20 -12 L20 12Z" fill="#FF4F9A" {...S} />
        <circle r="6" fill="#FF4F9A" {...S} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Mademoiselle Praline — caniche royal rose, robe-tailleur jaune       */
/* ------------------------------------------------------------------ */
export function Praline({ pose = 'debout', ...props }: P) {
  const couture = pose === 'couture';
  const mesure = pose === 'mesure';
  return (
    <svg viewBox="0 0 240 300" {...base(props)}>
      <ellipse cx="120" cy="290" rx="80" ry="7" fill={N} opacity=".15" />
      {/* jambes à pompons */}
      <rect x="90" y="222" width="20" height="56" rx="9" fill="#FFB3D1" {...S} />
      <rect x="130" y="222" width="20" height="56" rx="9" fill="#FFB3D1" {...S} />
      <circle cx="100" cy="276" r="14" fill="#FF8DBE" {...S} />
      <circle cx="140" cy="276" r="14" fill="#FF8DBE" {...S} />
      {/* robe-tailleur jaune */}
      <path d="M78 130 C80 110 160 110 162 130 L182 236 C150 248 90 248 58 236Z" fill="#FFC93C" {...S} />
      <path d="M120 120 L120 236" stroke={N} strokeWidth="2.5" />
      <circle cx="112" cy="160" r="4" fill={N} />
      <circle cx="112" cy="190" r="4" fill={N} />
      <path d="M72 200 L168 200" stroke={N} strokeWidth="2.5" strokeDasharray="6 5" />
      {/* bras */}
      <path d={couture ? 'M80 140 C64 170 70 196 96 204' : mesure ? 'M80 140 C56 150 40 170 34 196' : 'M80 140 C64 170 64 196 74 214'} fill="none" stroke={N} strokeWidth="22" strokeLinecap="round" />
      <path d={couture ? 'M80 140 C64 170 70 196 96 204' : mesure ? 'M80 140 C56 150 40 170 34 196' : 'M80 140 C64 170 64 196 74 214'} fill="none" stroke="#FFC93C" strokeWidth="16" strokeLinecap="round" />
      <path d={couture ? 'M160 140 C176 170 170 196 144 204' : 'M160 140 C180 150 196 166 204 186'} fill="none" stroke={N} strokeWidth="22" strokeLinecap="round" />
      <path d={couture ? 'M160 140 C176 170 170 196 144 204' : 'M160 140 C180 150 196 166 204 186'} fill="none" stroke="#FFC93C" strokeWidth="16" strokeLinecap="round" />
      {!couture && <circle cx="206" cy="190" r="13" fill="#FF8DBE" {...S} />}
      {mesure ? <circle cx="32" cy="200" r="13" fill="#FF8DBE" {...S} /> : !couture && <circle cx="74" cy="216" r="13" fill="#FF8DBE" {...S} />}
      {/* mètre ruban autour du cou */}
      <path d="M88 118 C100 130 140 130 152 118" fill="none" stroke={N} strokeWidth="14" strokeLinecap="round" />
      <path d="M88 118 C100 130 140 130 152 118" fill="none" stroke="#3DB8F5" strokeWidth="9" strokeLinecap="round" />
      <path d="M150 120 C158 150 150 170 160 196" fill="none" stroke={N} strokeWidth="14" strokeLinecap="round" />
      <path d="M150 120 C158 150 150 170 160 196" fill="none" stroke="#3DB8F5" strokeWidth="9" strokeLinecap="round" strokeDasharray="2 6" />
      {mesure && (
        <g>
          <path d="M206 190 C220 230 60 240 34 200" fill="none" stroke={N} strokeWidth="10" strokeLinecap="round" />
          <path d="M206 190 C220 230 60 240 34 200" fill="none" stroke="#3DB8F5" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 5" />
        </g>
      )}
      {/* oreilles bouclées */}
      {[0, 1].map((i) => (
        <g key={i} transform={i ? 'translate(240 0) scale(-1 1)' : undefined}>
          <circle cx="64" cy="72" r="18" fill="#FF8DBE" {...S} />
          <circle cx="58" cy="96" r="17" fill="#FF8DBE" {...S} />
          <circle cx="66" cy="116" r="14" fill="#FF8DBE" {...S} />
        </g>
      ))}
      {/* visage */}
      <ellipse cx="120" cy="80" rx="40" ry="42" fill="#FFB3D1" {...S} />
      {/* pompon de tête */}
      <circle cx="96" cy="40" r="18" fill="#FF8DBE" {...S} />
      <circle cx="120" cy="30" r="20" fill="#FF8DBE" {...S} />
      <circle cx="144" cy="40" r="18" fill="#FF8DBE" {...S} />
      <path d="M90 52 C100 58 140 58 150 52" fill="#FF8DBE" />
      {/* yeux à cils */}
      <ellipse cx="104" cy="78" rx="5" ry="6" fill={N} />
      <ellipse cx="136" cy="78" rx="5" ry="6" fill={N} />
      <path d="M96 70 l-5 -4 M100 68 l-2 -6 M144 70 l5 -4 M140 68 l2 -6" {...S} />
      {/* museau */}
      <ellipse cx="120" cy="100" rx="17" ry="13" fill="#FFD3E5" {...S} />
      <ellipse cx="120" cy="94" rx="6" ry="4.5" fill={N} />
      <path d="M112 106 C116 110 124 110 128 106" fill="none" {...S} />
      {/* joues */}
      <circle cx="94" cy="96" r="6" fill="#FF4F9A" opacity=".5" />
      <circle cx="146" cy="96" r="6" fill="#FF4F9A" opacity=".5" />
      {/* machine à coudre */}
      {couture && (
        <g transform="translate(70 196)">
          <path d="M0 40 L0 10 C0 0 10 -6 20 -6 L80 -6 C92 -6 100 2 100 12 L100 22 L84 22 L84 40Z" fill="#FF4F9A" {...S} />
          <rect x="-10" y="40" width="120" height="16" rx="4" fill="#6B1E3F" {...S} />
          <path d="M90 22 L90 36" {...S} />
          <circle cx="30" cy="10" r="6" fill="#FFC93C" {...S} />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Monsieur Tonnerre — dogue allemand, uniforme de groom bleu piscine   */
/* poses : debout, court, comptoir                                     */
/* ------------------------------------------------------------------ */
export function Tonnerre({ pose = 'debout', ...props }: P) {
  const court = pose === 'court';
  const comptoir = pose === 'comptoir';
  return (
    <svg viewBox="0 0 240 320" {...base(props)}>
      <ellipse cx="120" cy="310" rx="80" ry="7" fill={N} opacity=".15" />
      <g transform={court ? 'rotate(8 120 200)' : undefined}>
        {/* jambes */}
        <path d={court ? 'M100 236 L76 300' : 'M100 236 L98 300'} stroke={N} strokeWidth="26" strokeLinecap="round" />
        <path d={court ? 'M100 236 L76 300' : 'M100 236 L98 300'} stroke="#8C8FA8" strokeWidth="20" strokeLinecap="round" />
        <path d={court ? 'M140 236 L170 290' : 'M140 236 L142 300'} stroke={N} strokeWidth="26" strokeLinecap="round" />
        <path d={court ? 'M140 236 L170 290' : 'M140 236 L142 300'} stroke="#8C8FA8" strokeWidth="20" strokeLinecap="round" />
        {/* veste de groom */}
        <path d="M74 132 C76 116 164 116 166 132 L172 244 C140 254 100 254 68 244Z" fill="#3DB8F5" {...S} />
        <path d="M120 122 L120 248" stroke={N} strokeWidth="2.5" />
        {[150, 176, 202, 228].map((y) => (
          <g key={y}>
            <circle cx="106" cy={y} r="4.5" fill="#C9A227" stroke={N} strokeWidth="2" />
            <circle cx="134" cy={y} r="4.5" fill="#C9A227" stroke={N} strokeWidth="2" />
          </g>
        ))}
        <path d="M68 238 L172 238" stroke="#C9A227" strokeWidth="4" />
        {/* bras */}
        <path d={court ? 'M76 140 C56 160 50 180 60 200' : 'M76 140 C60 170 60 200 66 220'} fill="none" stroke={N} strokeWidth="24" strokeLinecap="round" />
        <path d={court ? 'M76 140 C56 160 50 180 60 200' : 'M76 140 C60 170 60 200 66 220'} fill="none" stroke="#3DB8F5" strokeWidth="18" strokeLinecap="round" />
        <path d="M164 140 C184 160 196 170 200 196" fill="none" stroke={N} strokeWidth="24" strokeLinecap="round" />
        <path d="M164 140 C184 160 196 170 200 196" fill="none" stroke="#3DB8F5" strokeWidth="18" strokeLinecap="round" />
        {/* boîte à chapeau */}
        <g transform="translate(176 186)">
          <ellipse cx="24" cy="10" rx="30" ry="9" fill="#FF4F9A" {...S} />
          <path d="M-6 10 L-6 46 C-6 56 54 56 54 46 L54 10" fill="#FF4F9A" {...S} />
          <path d="M4 16 L4 52 M20 18 L20 55 M36 18 L36 55" stroke="#FFF6EA" strokeWidth="4" />
          <path d="M-6 10 C-6 20 54 20 54 10" fill="none" {...S} />
        </g>
        {/* cou */}
        <path d="M100 96 L100 128 L140 128 L140 96Z" fill="#8C8FA8" {...S} />
        <path d="M94 124 L146 124" stroke="#FFF6EA" strokeWidth="8" />
        {/* tête */}
        <path d="M84 50 C84 24 156 24 156 50 L160 92 C160 112 80 112 80 92Z" fill="#8C8FA8" {...S} />
        <path d="M96 78 C96 66 144 66 144 78 L146 106 C146 120 94 120 94 106Z" fill="#6C6F88" {...S} />
        <ellipse cx="120" cy="80" rx="12" ry="8" fill={N} />
        <path d="M108 104 C114 110 126 110 132 104" fill="none" {...S} />
        {/* oreilles tombantes */}
        <path d="M86 40 C64 40 60 74 70 90 C78 82 86 66 88 50Z" fill="#6C6F88" {...S} />
        <path d="M154 40 C176 40 180 74 170 90 C162 82 154 66 152 50Z" fill="#6C6F88" {...S} />
        {/* yeux doux */}
        <path d="M100 58 C103 54 109 54 112 58" fill="none" stroke={N} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M128 58 C131 54 137 54 140 58" fill="none" stroke={N} strokeWidth="3.5" strokeLinecap="round" />
        {/* casquette trop petite */}
        <g transform="rotate(-10 120 26)">
          <rect x="106" y="10" width="30" height="16" rx="3" fill="#3DB8F5" {...S} />
          <path d="M104 26 L140 26" stroke={N} strokeWidth="4" strokeLinecap="round" />
          <path d="M108 20 L134 20" stroke="#C9A227" strokeWidth="3" />
        </g>
      </g>
      {court && (
        <g stroke={N} strokeWidth="4" strokeLinecap="round">
          <path d="M20 150 L50 150" /><path d="M10 180 L44 180" /><path d="M24 210 L52 210" />
        </g>
      )}
      {comptoir && (
        <g>
          <rect x="10" y="226" width="220" height="90" rx="10" fill="#6B1E3F" {...S} />
          <path d="M10 246 L230 246" stroke="#C9A227" strokeWidth="4" />
          <g transform="translate(40 206)">
            <path d="M0 20 C0 0 36 0 36 20Z" fill="#C9A227" {...S} />
            <rect x="-4" y="18" width="44" height="6" rx="3" fill="#C9A227" {...S} />
            <circle cx="18" cy="-2" r="4" fill="#C9A227" {...S} />
          </g>
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Lady Meringue — lévrier afghan, cape en satin, lunettes de soleil    */
/* poses : debout, signe                                                */
/* ------------------------------------------------------------------ */
export function Meringue({ pose = 'debout', ...props }: P) {
  const signe = pose === 'signe';
  return (
    <svg viewBox="0 0 240 320" {...base(props)}>
      <ellipse cx="120" cy="310" rx="80" ry="7" fill={N} opacity=".15" />
      {/* longs poils + jambes */}
      <path d="M86 230 C84 260 82 290 90 302 L112 302 C110 280 110 256 112 232Z" fill="#F2D7A0" {...S} />
      <path d="M128 232 C130 256 130 280 128 302 L150 302 C158 290 156 260 154 230Z" fill="#F2D7A0" {...S} />
      {/* cape satin */}
      <path d="M70 120 C40 170 30 240 40 290 C80 300 160 300 200 290 C210 240 200 170 170 120Z" fill="#FF6B4A" {...S} />
      <path d="M70 120 C60 180 58 240 64 288" fill="none" stroke="#FF4F9A" strokeWidth="10" />
      <path d="M170 120 C180 180 182 240 176 288" fill="none" stroke="#FF4F9A" strokeWidth="10" />
      <path d="M90 150 C100 200 96 250 100 290 M140 150 C134 200 142 250 140 290" fill="none" stroke="#FF8D73" strokeWidth="5" strokeLinecap="round" />
      {/* col / fermoir */}
      <path d="M80 122 C100 136 140 136 160 122" fill="none" stroke={N} strokeWidth="12" strokeLinecap="round" />
      <path d="M80 122 C100 136 140 136 160 122" fill="none" stroke="#C9A227" strokeWidth="7" strokeLinecap="round" />
      {/* cheveux cascade */}
      <path d="M78 46 C56 70 54 120 60 168 C66 176 80 172 84 160 C88 120 92 80 96 56Z" fill="#E8C27A" {...S} />
      <path d="M162 46 C184 70 186 120 180 168 C174 176 160 172 156 160 C152 120 148 80 144 56Z" fill="#E8C27A" {...S} />
      {/* tête allongée */}
      <path d="M92 40 C96 18 144 18 148 40 L146 92 C144 114 96 114 94 92Z" fill="#F2D7A0" {...S} />
      <path d="M100 26 C110 6 130 6 140 26 C130 20 110 20 100 26Z" fill="#E8C27A" {...S} />
      <ellipse cx="120" cy="104" rx="10" ry="7" fill={N} />
      <path d="M110 114 C116 118 124 118 130 114" fill="none" {...S} />
      {/* lunettes cœur */}
      <g>
        <path d="M100 58 C92 50 82 60 90 70 L104 82 L116 70 C122 60 110 50 104 58Z" fill="#FF4F9A" {...S} transform="translate(-4 0)" />
        <path d="M136 58 C128 50 118 60 126 70 L140 82 L152 70 C158 60 146 50 140 58Z" fill="#FF4F9A" {...S} transform="translate(-6 0)" />
        <path d="M110 64 L122 64" {...S} />
        <path d="M94 62 L102 66" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
      </g>
      {/* bras + plume */}
      {signe ? (
        <g>
          <path d="M160 160 C182 180 186 200 172 214" fill="none" stroke={N} strokeWidth="22" strokeLinecap="round" />
          <path d="M160 160 C182 180 186 200 172 214" fill="none" stroke="#FF6B4A" strokeWidth="16" strokeLinecap="round" />
          <circle cx="170" cy="218" r="12" fill="#F2D7A0" {...S} />
          <path d="M168 220 C186 180 206 160 224 150 C214 170 196 196 172 222Z" fill="#FFF6EA" {...S} />
          <path d="M172 222 L214 158" stroke={N} strokeWidth="2" />
          {/* livre d'or */}
          <g transform="translate(40 216)">
            <path d="M0 0 L70 6 L140 0 L140 70 L70 76 L0 70Z" fill="#FFF6EA" {...S} />
            <path d="M70 6 L70 76" {...S} />
            <path d="M12 20 L58 22 M12 34 L50 36 M82 22 L126 20 M82 36 L118 34" stroke="#C9A227" strokeWidth="3" strokeLinecap="round" />
            <path d="M90 50 C96 44 104 56 112 48" fill="none" stroke={N} strokeWidth="2.5" />
          </g>
        </g>
      ) : (
        <g>
          <path d="M162 160 C184 140 196 120 200 100" fill="none" stroke={N} strokeWidth="22" strokeLinecap="round" />
          <path d="M162 160 C184 140 196 120 200 100" fill="none" stroke="#FF6B4A" strokeWidth="16" strokeLinecap="round" />
          <circle cx="202" cy="94" r="12" fill="#F2D7A0" {...S} />
        </g>
      )}
      {/* étincelles */}
      <path d="M30 60 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4Z" fill="#FFC93C" {...S} />
      <path d="M206 40 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3Z" fill="#FFC93C" {...S} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Duchesse Moustache — chatte persane, lorgnette, étole               */
/* ------------------------------------------------------------------ */
export function Moustache(props: P) {
  return (
    <svg viewBox="0 0 220 240" {...base(props)}>
      <ellipse cx="110" cy="232" rx="70" ry="6" fill={N} opacity=".15" />
      {/* queue */}
      <path d="M160 200 C200 190 210 150 190 130" fill="none" stroke={N} strokeWidth="26" strokeLinecap="round" />
      <path d="M160 200 C200 190 210 150 190 130" fill="none" stroke="#D9D3E2" strokeWidth="20" strokeLinecap="round" />
      {/* corps assis */}
      <path d="M56 226 C40 170 64 120 110 120 C156 120 180 170 164 226Z" fill="#D9D3E2" {...S} />
      <ellipse cx="86" cy="226" rx="18" ry="9" fill="#EDE8F2" {...S} />
      <ellipse cx="134" cy="226" rx="18" ry="9" fill="#EDE8F2" {...S} />
      {/* étole fausse fourrure */}
      <path d="M58 136 C70 160 150 160 162 136 C170 150 166 166 156 170 C130 182 90 182 64 170 C54 166 50 150 58 136Z" fill="#FFD3E5" {...S} />
      {[70, 88, 106, 124, 142].map((x) => (
        <circle key={x} cx={x + 4} cy="166" r="6" fill="#FFF6EA" stroke={N} strokeWidth="2" />
      ))}
      {/* oreilles */}
      <path d="M58 60 L64 20 L92 42Z" fill="#D9D3E2" {...S} />
      <path d="M162 60 L156 20 L128 42Z" fill="#D9D3E2" {...S} />
      <path d="M66 50 L68 32 L82 44Z" fill="#FFB3D1" />
      <path d="M154 50 L152 32 L138 44Z" fill="#FFB3D1" />
      {/* tête ronde et touffue */}
      <path d="M44 84 C40 52 70 30 110 30 C150 30 180 52 176 84 C182 98 172 110 168 116 C150 138 70 138 52 116 C48 110 38 98 44 84Z" fill="#EDE8F2" {...S} />
      {/* yeux mi-clos, hautains */}
      <path d="M72 80 C78 74 90 74 96 80" fill="#FFC93C" {...S} />
      <path d="M124 80 C130 74 142 74 148 80" fill="#FFC93C" {...S} />
      <path d="M70 80 L98 80 M122 80 L150 80" stroke={N} strokeWidth="4" strokeLinecap="round" />
      <path d="M68 68 L94 72 M152 68 L126 72" {...S} />
      {/* nez et bouche boudeuse */}
      <path d="M104 94 L116 94 L110 101Z" fill="#FF4F9A" {...S} />
      <path d="M100 112 C106 108 114 108 120 112" fill="none" {...S} />
      {/* moustaches */}
      <path d="M90 100 L50 94 M90 106 L52 110 M130 100 L170 94 M130 106 L168 110" stroke={N} strokeWidth="2" strokeLinecap="round" />
      {/* lorgnette */}
      <g>
        <path d="M168 200 L176 132" stroke="#C9A227" strokeWidth="6" strokeLinecap="round" />
        <path d="M168 200 L176 132" stroke={N} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="152" cy="82" r="18" fill="rgba(61,184,245,.25)" stroke="#C9A227" strokeWidth="5" />
        <path d="M168 92 C176 104 178 118 176 132" fill="none" stroke="#C9A227" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="168" cy="204" rx="11" ry="9" fill="#EDE8F2" {...S} />
      </g>
      {/* collier de perle */}
      <circle cx="110" cy="146" r="7" fill="#FFF6EA" {...S} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Figurants : flamant sommelier, hibou majordome, homard groom         */
/* ------------------------------------------------------------------ */
export function Flamant(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 200" {...base(props)}>
      <path d="M60 140 L56 196 M66 140 L74 196" stroke={N} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="62" cy="116" rx="34" ry="28" fill="#FF8DBE" {...S} />
      <path d="M40 104 C50 112 76 112 86 104 L84 132 C70 140 52 140 40 132Z" fill="#2BC48A" {...S} />
      <path d="M78 96 C92 70 70 50 74 30 C76 18 94 16 98 30" fill="none" stroke={N} strokeWidth="14" strokeLinecap="round" />
      <path d="M78 96 C92 70 70 50 74 30 C76 18 94 16 98 30" fill="none" stroke="#FF8DBE" strokeWidth="8" strokeLinecap="round" />
      <circle cx="88" cy="24" r="14" fill="#FF8DBE" {...S} />
      <path d="M100 22 L112 34 L100 34Z" fill={N} />
      <circle cx="90" cy="20" r="3" fill={N} />
      <path d="M84 40 L92 40" stroke={N} strokeWidth="3" />
      <path d="M86 40 L82 46 M90 40 L94 46" stroke="#FF4F9A" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function Hibou(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 150" {...base(props)}>
      <ellipse cx="60" cy="86" rx="44" ry="54" fill="#B5652B" {...S} />
      <path d="M30 70 C40 120 80 120 90 70 L92 130 C70 146 50 146 28 130Z" fill={N} />
      <path d="M50 70 L60 110 L70 70Z" fill="#FFF6EA" {...S} />
      <path d="M52 76 L60 84 L68 76" fill="#FF4F9A" {...S} />
      <circle cx="42" cy="54" r="15" fill="#FFF6EA" {...S} />
      <circle cx="78" cy="54" r="15" fill="#FFF6EA" {...S} />
      <circle cx="42" cy="56" r="6" fill={N} />
      <circle cx="78" cy="56" r="6" fill={N} />
      <path d="M56 64 L60 72 L64 64Z" fill="#FFC93C" {...S} />
      <path d="M22 34 L36 40 M98 34 L84 40" {...S} />
    </svg>
  );
}

export function Homard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 140 140" {...base(props)}>
      <ellipse cx="70" cy="86" rx="30" ry="38" fill="#FF6B4A" {...S} />
      <path d="M40 74 L18 50 C8 40 20 26 30 34 L44 50" fill="#FF6B4A" {...S} />
      <path d="M100 74 L122 50 C132 40 120 26 110 34 L96 50" fill="#FF6B4A" {...S} />
      <path d="M46 92 C56 98 84 98 94 92 L94 116 C80 124 60 124 46 116Z" fill="#3DB8F5" {...S} />
      <circle cx="62" cy="104" r="3" fill="#C9A227" /><circle cx="78" cy="104" r="3" fill="#C9A227" />
      <circle cx="60" cy="66" r="5" fill={N} /><circle cx="80" cy="66" r="5" fill={N} />
      <path d="M62 80 C66 84 74 84 78 80" fill="none" {...S} />
      <path d="M60 52 C54 30 40 20 30 16 M80 52 C86 30 100 20 110 16" fill="none" {...S} />
      <rect x="58" y="40" width="24" height="12" rx="3" fill="#3DB8F5" {...S} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Silhouette de chien — visuel de remplacement des photos             */
/* ------------------------------------------------------------------ */
export function SilhouetteChien(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" {...base(props)}>
      <path
        d="M70 180 L70 120 C56 112 50 96 54 80 L40 60 C34 44 44 30 58 36 L72 46 C84 40 116 40 128 46 L142 36 C156 30 166 44 160 60 L146 80 C150 96 144 112 130 120 L130 180Z"
        fill="currentColor"
      />
      <path d="M80 120 L100 140 L120 120 L100 150Z" fill="var(--creme)" opacity=".9" />
      <path d="M86 128 L100 134 L114 128 L114 140 L100 134 L86 140Z" fill="var(--rose)" />
    </svg>
  );
}
