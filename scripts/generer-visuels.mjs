// Génère les visuels produits illustrés (portraits officiels) en SVG.
// Usage : node scripts/generer-visuels.mjs
// Sortie : public/images/produits/[slug]-1.svg (face), -2.svg (pose), -3.svg (détail)
//          public/images/occasions/[occasion].svg
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
const N = '#1E1430';
const SW = 7; // contour noir épais
const S = `stroke="${N}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
const s2 = (w) => `stroke="${N}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

const FOND = { bordeaux: '#6B1E3F', rose: '#FF4F9A', jaune: '#FFC93C', bleu: '#3DB8F5', orange: '#FF6B4A', vert: '#2BC48A' };
const FOND_CLAIR = { bordeaux: '#8E3A5E', rose: '#FF8DBE', jaune: '#FFDB7A', bleu: '#86D4F9', orange: '#FF9C85', vert: '#6FDBB0' };

/* ------------------------------------------------------------------ */
/* Races (têtes et pelages)                                            */
/* ------------------------------------------------------------------ */
const RACES = {
  carlin: { pelage: '#E7BE8A', ombre: '#C9975F', masque: '#3A2A2A', oreilles: 'repliees', museau: 'plat' },
  dogue: { pelage: '#C98B4E', ombre: '#A86E36', masque: '#5A3A28', oreilles: 'repliees', museau: 'large' },
  bouledogue: { pelage: '#E9CFAE', ombre: '#CFAE88', masque: '#8B6E58', oreilles: 'chauve-souris', museau: 'plat' },
  berger: { pelage: '#B9BEC9', ombre: '#8D93A1', masque: '#FFFFFF', taches: '#4B4F5C', oreilles: 'pliees', museau: 'long' },
  teckel: { pelage: '#A9582A', ombre: '#7E3D18', masque: '#C8743F', oreilles: 'tombantes-longues', museau: 'long' },
  golden: { pelage: '#E6AE5E', ombre: '#C68B3E', masque: '#F2C98C', oreilles: 'tombantes', museau: 'moyen' },
  whippet: { pelage: '#D9D2CC', ombre: '#B5ACA4', masque: '#FFFFFF', oreilles: 'rose', museau: 'fin' },
  chihuahua: { pelage: '#E2B47A', ombre: '#C49058', masque: '#F4D7AE', oreilles: 'dressees', museau: 'court' },
  afghan: { pelage: '#EAD3A6', ombre: '#CDB07C', masque: '#F5E6C6', oreilles: 'poils-longs', museau: 'fin' },
  bouvier: { pelage: '#2A2230', ombre: '#151019', masque: '#FFFFFF', joues: '#B5652B', oreilles: 'tombantes', museau: 'moyen' },
  caniche: { pelage: '#F2E7DA', ombre: '#D8C9B6', masque: '#FFFFFF', oreilles: 'pompons', museau: 'moyen' },
};

/* ------------------------------------------------------------------ */
/* Catalogue des visuels : race, tenue, couleurs, accessoire de tête    */
/* ------------------------------------------------------------------ */
const P = [
  { slug: 'le-smoking-baron', fond: 'bleu', race: 'carlin', tenue: 'smoking', c: '#6B1E3F', revers: '#1E1430', noeud: '#FF4F9A' },
  { slug: 'le-smoking-minuit', fond: 'jaune', race: 'dogue', tenue: 'smoking', c: '#231B2E', revers: '#463A55', noeud: '#1E1430', col: 'chale' },
  { slug: 'le-smoking-piscine', fond: 'rose', race: 'bouledogue', tenue: 'smoking', c: '#3DB8F5', revers: '#FF4F9A', noeud: '#FF4F9A' },
  { slug: 'la-queue-de-pie-tonnerre', fond: 'bleu', race: 'berger', tenue: 'jaquette', c: '#8C8FA0', gilet: '#FFC93C', noeud: '#6B1E3F' },
  { slug: 'le-costume-communion', fond: 'jaune', race: 'teckel', tenue: 'costume', c: '#F4EAD5', noeud: '#86D4F9' },
  { slug: 'la-robe-meringue', fond: 'rose', race: 'golden', tenue: 'robe-mariee', c: '#FBF6EC', tete: 'voile' },
  { slug: 'la-robe-praline', fond: 'jaune', race: 'whippet', tenue: 'robe', c: '#FF8DBE', noeud: '#FF4F9A', dosNoeud: true },
  { slug: 'la-robe-croquette', fond: 'bleu', race: 'chihuahua', tenue: 'robe-pois', c: '#FFC93C', pois: '#FFFFFF' },
  { slug: 'la-cape-royale-duchesse', fond: 'jaune', race: 'afghan', tenue: 'cape', c: '#6B1E3F', doublure: '#4A1029', col: 'hermine', tete: 'couronne' },
  { slug: 'la-cape-tapis-rouge', fond: 'orange', race: 'chihuahua', tenue: 'cape', c: '#D9AE3A', doublure: '#FF4F9A', col: 'satin' },
  { slug: 'le-manteau-grand-hall', fond: 'vert', race: 'bouvier', tenue: 'manteau', c: '#C9A227' },
  { slug: 'le-gilet-sommelier', fond: 'jaune', race: 'teckel', tenue: 'gilet', c: '#1F8F63', noeud: '#6B1E3F' },
  { slug: 'la-chemise-flamant', fond: 'bleu', race: 'bouledogue', tenue: 'chemise-flamant', c: '#FFFFFF' },
  { slug: 'le-pull-de-fete-biscotte', fond: 'vert', race: 'bouvier', tenue: 'pull', c: '#D7263D' },
  { slug: 'le-noeud-pap-velours', fond: 'rose', race: 'carlin', tenue: 'aucune', noeud: '#6B1E3F', accessoire: 'noeud' },
  { slug: 'la-couronne-champetre', fond: 'vert', race: 'golden', tenue: 'aucune', tete: 'fleurs', accessoire: 'fleurs' },
  { slug: 'le-porte-alliances-coussin', fond: 'bordeaux', race: 'berger', tenue: 'aucune', accessoire: 'coussin' },
  { slug: 'le-collier-de-perles-lady', fond: 'rose', race: 'whippet', tenue: 'aucune', accessoire: 'perles' },
  { slug: 'le-mini-haut-de-forme', fond: 'jaune', race: 'carlin', tenue: 'aucune', tete: 'haut-de-forme', accessoire: 'chapeau', noeud: '#1E1430' },
  { slug: 'les-lunettes-star', fond: 'orange', race: 'chihuahua', tenue: 'aucune', tete: 'lunettes', accessoire: 'lunettes' },
];

/* ------------------------------------------------------------------ */
/* Décor                                                               */
/* ------------------------------------------------------------------ */
function decor(fond, w = 600, h = 600) {
  const c = FOND[fond], cl = FOND_CLAIR[fond];
  const cx = w / 2, cy = h * 0.42;
  let rayons = '';
  for (let i = 0; i < 18; i++) {
    const a = (i * 20 * Math.PI) / 180, b = ((i * 20 + 9) * Math.PI) / 180, R = Math.max(w, h);
    rayons += `<path d="M${cx} ${cy} L${cx + R * Math.cos(a)} ${cy + R * Math.sin(a)} L${cx + R * Math.cos(b)} ${cy + R * Math.sin(b)}Z" fill="${cl}" opacity=".45"/>`;
  }
  return `<rect width="${w}" height="${h}" fill="${c}"/>${rayons}
  <ellipse cx="${cx}" cy="${h - 10}" rx="${w * 0.42}" ry="${h * 0.09}" fill="${N}" opacity=".18"/>`;
}

/* ------------------------------------------------------------------ */
/* Corps (assis, de face)                                              */
/* ------------------------------------------------------------------ */
const TORSE = 'M210 330 C200 330 186 350 180 380 C166 450 150 530 146 640 L454 640 C450 530 434 450 420 380 C414 350 400 330 390 330 Z';

function corps(r, dos) {
  const R = RACES[r];
  return `
  <path d="${TORSE}" fill="${R.pelage}" ${S}/>
  ${!dos ? `<path d="M250 360 C270 420 330 420 350 360 C346 420 330 470 300 480 C270 470 254 420 250 360Z" fill="${R.masque === '#3A2A2A' || R.masque === '#5A3A28' ? R.ombre : R.masque}" opacity=".85"/>` : ''}
  <!-- pattes avant -->
  <rect x="222" y="470" width="58" height="150" rx="28" fill="${R.pelage}" ${S}/>
  <rect x="320" y="470" width="58" height="150" rx="28" fill="${R.pelage}" ${S}/>
  <ellipse cx="251" cy="592" rx="36" ry="20" fill="${R.masque === '#3A2A2A' ? R.pelage : R.masque}" ${S}/>
  <ellipse cx="349" cy="592" rx="36" ry="20" fill="${R.masque === '#3A2A2A' ? R.pelage : R.masque}" ${S}/>
  <path d="M240 600 v-10 M262 600 v-10 M338 600 v-10 M360 600 v-10" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`;
}

/* ------------------------------------------------------------------ */
/* Tenues                                                              */
/* ------------------------------------------------------------------ */
function noeudPap(x, y, c, t = 1) {
  return `<g transform="translate(${x} ${y}) scale(${t})">
    <path d="M0 0 L-42 -24 Q-50 0 -42 24Z" fill="${c}" ${S}/>
    <path d="M0 0 L42 -24 Q50 0 42 24Z" fill="${c}" ${S}/>
    <path d="M-30 -12 Q-26 0 -30 12 M30 -12 Q26 0 30 12" stroke="#fff" stroke-width="4" opacity=".35" fill="none"/>
    <rect x="-12" y="-14" width="24" height="28" rx="8" fill="${c}" ${S}/>
  </g>`;
}

function tenue(p, dos) {
  const clip = `<clipPath id="torse"><path d="${TORSE}"/></clipPath>`;
  const plein = (fill, extra = '') => `<path d="${TORSE}" fill="${fill}" ${S}/>${extra}`;
  const dans = (contenu) => `<g clip-path="url(#torse)">${contenu}</g>`;
  const boutons = (x, ys, c = '#C9A227') => ys.map((y) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}" ${s2(4)}/>`).join('');
  let avant = '', arriere = '';

  switch (p.tenue) {
    case 'smoking': {
      avant = plein(p.c) + dans(`
        <path d="M255 330 L300 470 L345 330Z" fill="#FFFFFF" ${S}/>
        <path d="M300 360 v90" stroke="${N}" stroke-width="3" stroke-dasharray="2 14"/>
        ${p.col === 'chale'
          ? `<path d="M242 332 Q262 430 300 478 Q270 420 268 332Z" fill="${p.revers}" ${S}/><path d="M358 332 Q338 430 300 478 Q330 420 332 332Z" fill="${p.revers}" ${S}/>`
          : `<path d="M240 332 L300 478 L262 392 L284 372 L258 332Z" fill="${p.revers}" ${S}/><path d="M360 332 L300 478 L338 392 L316 372 L342 332Z" fill="${p.revers}" ${S}/>`}
        ${boutons(300, [500, 540])}
        <path d="M188 420 Q220 410 236 430" stroke="#ffffff" stroke-width="6" opacity=".18" fill="none"/>`) + noeudPap(300, 350, p.noeud);
      arriere = plein(p.c) + dans(`<path d="M300 330 V640" stroke="${N}" stroke-width="5"/><path d="M230 520 H370" stroke="#fff" stroke-width="5" opacity=".15"/>`);
      break;
    }
    case 'jaquette': {
      const rayures = `<pattern id="rayures" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="${p.c}"/><rect width="5" height="18" fill="#6C6F82"/></pattern>`;
      avant = `<defs>${rayures}</defs>
        <path d="M180 470 Q150 560 160 650 L215 650 Q205 560 230 470Z" fill="url(#rayures)" ${S}/>
        <path d="M420 470 Q450 560 440 650 L385 650 Q395 560 370 470Z" fill="url(#rayures)" ${S}/>` +
        plein('url(#rayures)') + dans(`
        <path d="M245 330 L300 500 L355 330Z" fill="${p.gilet}" ${S}/>
        <path d="M265 332 L300 420 L335 332Z" fill="#FFFFFF" ${S}/>
        ${boutons(300, [450, 480], '#FFFFFF')}
        <path d="M236 332 L292 500 L250 410 L270 380Z" fill="#5E6174" ${S}/><path d="M364 332 L308 500 L350 410 L330 380Z" fill="#5E6174" ${S}/>`) + noeudPap(300, 352, p.noeud, 0.8);
      arriere = `<defs>${rayures}</defs>` + plein('url(#rayures)') + `
        <path d="M250 520 Q240 600 230 650 L298 650 L300 520Z" fill="url(#rayures)" ${S}/><path d="M350 520 Q360 600 370 650 L302 650 L300 520Z" fill="url(#rayures)" ${S}/>
        ${boutons(270, [515])}${boutons(330, [515])}`;
      break;
    }
    case 'costume': {
      avant = plein(p.c) + dans(`
        <path d="M262 330 L300 440 L338 330Z" fill="#FFFFFF" ${S}/>
        <path d="M246 332 L298 470 L262 392 L280 372 L262 332Z" fill="#E6D8BC" ${S}/><path d="M354 332 L302 470 L338 392 L320 372 L338 332Z" fill="#E6D8BC" ${S}/>
        ${boutons(300, [490, 530], '#E6D8BC')}
        <path d="M200 380 L230 600 M400 380 L370 600" stroke="#E6D8BC" stroke-width="4"/>`) + noeudPap(300, 348, p.noeud, 0.9);
      arriere = plein(p.c) + dans(`<path d="M300 330 V640" stroke="#E6D8BC" stroke-width="5"/>`);
      break;
    }
    case 'robe-mariee': {
      const tulle = (y, rx, o) => `<ellipse cx="300" cy="${y}" rx="${rx}" ry="${rx * 0.32}" fill="#FFFFFF" opacity="${o}" ${s2(5)}/>`;
      avant = tulle(625, 250, 0.9) + tulle(585, 225, 0.92) + tulle(545, 195, 0.95) + plein(p.c) + dans(`
        <path d="M200 360 Q230 330 260 360 Q290 330 300 360 Q310 330 340 360 Q370 330 400 360" fill="none" ${s2(5)}/>
        ${[260, 300, 340].map((x) => `<circle cx="${x}" cy="400" r="6" fill="#F0DCC0" ${s2(3)}/>`).join('')}
        <path d="M200 470 Q300 500 400 470" fill="none" stroke="#E9DCC4" stroke-width="6"/>`);
      arriere = tulle(640, 280, 0.9) + tulle(600, 250, 0.9) + plein(p.c) + dans(`
        ${[370, 410, 450].map((y) => `<circle cx="300" cy="${y}" r="7" fill="#F0DCC0" ${s2(3)}/>`).join('')}`) +
        `<path d="M300 480 Q200 560 120 650 L480 650 Q400 560 300 480Z" fill="#FFFFFF" opacity=".85" ${s2(5)}/>`;
      break;
    }
    case 'robe': {
      avant = `<path d="M190 470 Q140 560 150 650 L450 650 Q460 560 410 470Z" fill="${p.c}" ${S}/>` + plein(p.c) + dans(`
        <path d="M200 360 Q300 400 400 360" fill="none" stroke="#FFFFFF" stroke-width="6" opacity=".5"/>
        <path d="M230 470 Q300 490 370 470" fill="none" stroke="${p.noeud}" stroke-width="16"/>`);
      arriere = `<path d="M190 470 Q140 560 150 650 L450 650 Q460 560 410 470Z" fill="${p.c}" ${S}/>` + plein(p.c) +
        `<g transform="translate(300 470)"><path d="M0 0 L-90 -50 Q-104 0 -90 50Z" fill="${p.noeud}" ${S}/><path d="M0 0 L90 -50 Q104 0 90 50Z" fill="${p.noeud}" ${S}/>
         <path d="M-10 10 L-50 120 L-20 110Z M10 10 L50 120 L20 110Z" fill="${p.noeud}" ${S}/><rect x="-18" y="-22" width="36" height="44" rx="12" fill="${p.noeud}" ${S}/></g>`;
      break;
    }
    case 'robe-pois': {
      const pois = `<pattern id="pois" width="34" height="34" patternUnits="userSpaceOnUse"><rect width="34" height="34" fill="${p.c}"/><circle cx="8" cy="8" r="6" fill="${p.pois}"/><circle cx="25" cy="25" r="6" fill="${p.pois}"/></pattern>`;
      const jupon = `<path d="M175 480 Q130 560 140 610 Q200 640 300 640 Q400 640 460 610 Q470 560 425 480Z" fill="#FFFFFF" opacity=".8" ${s2(5)}/>`;
      avant = `<defs>${pois}</defs>${jupon}` + plein('url(#pois)') + dans(`<path d="M220 350 Q300 380 380 350" fill="none" ${s2(5)}/>`);
      arriere = `<defs>${pois}</defs>${jupon}` + plein('url(#pois)') + noeudPap(300, 470, '#FFFFFF', 0.9);
      break;
    }
    case 'cape': {
      const col = p.col === 'hermine'
        ? `<path d="M196 340 Q300 410 404 340 Q412 380 400 400 Q300 450 200 400 Q188 380 196 340Z" fill="#FFFFFF" ${S}/>${[[240, 385], [300, 405], [360, 385], [270, 372], [330, 372]].map(([x, y]) => `<path d="M${x} ${y} l-5 12 l5 -4 l5 4z" fill="${N}"/>`).join('')}`
        : `<path d="M200 340 Q300 400 400 340 Q404 368 396 380 Q300 420 204 380 Q196 368 200 340Z" fill="${p.doublure}" ${S}/>`;
      avant = `<path d="M196 340 Q120 470 100 650 L500 650 Q480 470 404 340Z" fill="${p.c}" ${S}/>
        <path d="M200 345 Q170 480 190 650 L230 650 Q215 480 238 360Z" fill="${p.doublure}" ${S}/>
        <path d="M400 345 Q430 480 410 650 L370 650 Q385 480 362 360Z" fill="${p.doublure}" ${S}/>
        ${p.col === 'satin' ? `<path d="M150 470 Q170 560 160 640 M450 470 Q430 560 440 640" stroke="#FFF3C4" stroke-width="8" opacity=".6" fill="none"/>` : ''}
        ${col}
        <circle cx="300" cy="420" r="14" fill="#C9A227" ${s2(5)}/>`;
      arriere = `<path d="M196 340 Q110 470 90 650 L510 650 Q490 470 404 340Z" fill="${p.c}" ${S}/>
        <path d="M300 360 Q290 500 300 650" stroke="${p.doublure}" stroke-width="8" fill="none" opacity=".6"/>${col}`;
      break;
    }
    case 'manteau': {
      const brocart = `<pattern id="brocart" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="${p.c}"/><path d="M20 4 L32 20 L20 36 L8 20Z" fill="#E7C65A" stroke="#9C7A12" stroke-width="2"/><circle cx="20" cy="20" r="4" fill="#9C7A12"/></pattern>`;
      avant = `<defs>${brocart}</defs>` + plein('url(#brocart)') + dans(`
        <path d="M300 330 V640" stroke="${N}" stroke-width="5"/>
        <path d="M200 340 Q300 380 400 340 L400 360 Q300 400 200 360Z" fill="#6B1E3F" ${s2(5)}/>
        ${[420, 470, 520, 570].map((y) => `<g><circle cx="276" cy="${y}" r="10" fill="#3DB8F5" ${s2(4)}/><circle cx="324" cy="${y}" r="10" fill="#FF4F9A" ${s2(4)}/></g>`).join('')}`);
      arriere = `<defs>${brocart}</defs>` + plein('url(#brocart)') + dans(`<path d="M200 340 Q300 380 400 340 L400 360 Q300 400 200 360Z" fill="#6B1E3F" ${s2(5)}/><path d="M300 380 V640" stroke="${N}" stroke-width="5"/>`);
      break;
    }
    case 'gilet': {
      avant = plein('#FFFFFF') + dans(`
        <path d="M150 340 L262 340 L300 520 L338 340 L450 340 L450 650 L150 650Z" fill="${p.c}" ${S}/>
        ${boutons(300, [540, 580], '#C9A227')}
        <path d="M225 470 Q260 520 300 500" fill="none" stroke="#C9A227" stroke-width="6" stroke-dasharray="6 6"/>
        <circle cx="222" cy="466" r="12" fill="#C9A227" ${s2(4)}/>`) + noeudPap(300, 350, p.noeud, 0.85);
      arriere = plein(p.c) + dans(`<rect x="210" y="430" width="180" height="40" rx="8" fill="#145E41" ${s2(5)}/><circle cx="300" cy="450" r="8" fill="#C9A227"/>`);
      break;
    }
    case 'chemise-flamant': {
      const fl = `<pattern id="flamants" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#FFFFFF"/><g transform="translate(14 12)"><ellipse cx="10" cy="14" rx="9" ry="6" fill="#FF8DBE"/><path d="M14 10 Q22 0 16 -4" stroke="#FF8DBE" stroke-width="3" fill="none"/><path d="M8 20 V30 M12 20 V30" stroke="#FF4F9A" stroke-width="2"/><path d="M4 12 L16 12 L10 18Z" fill="${N}"/></g><g transform="translate(42 40) scale(.7)"><ellipse cx="10" cy="14" rx="9" ry="6" fill="#FF8DBE"/><path d="M14 10 Q22 0 16 -4" stroke="#FF8DBE" stroke-width="3" fill="none"/></g></pattern>`;
      avant = `<defs>${fl}</defs>` + plein('url(#flamants)') + dans(`
        <path d="M250 330 L300 380 L350 330 L360 345 L300 400 L240 345Z" fill="#FFFFFF" ${s2(5)}/>
        ${[400, 435, 470].map((y, i) => `<path d="M${270 - i * 4} ${y} Q300 ${y + 22} ${330 + i * 4} ${y}" fill="#FFFFFF" ${s2(5)}/>`).join('')}
        ${boutons(300, [520, 560], '#FF4F9A')}`);
      arriere = `<defs>${fl}</defs>` + plein('url(#flamants)') + dans(`<path d="M200 360 Q300 390 400 360" fill="none" ${s2(5)}/>`);
      break;
    }
    case 'pull': {
      const teckel = (x, y) => `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="34" height="12" rx="6" fill="#FFFFFF"/><circle cx="36" cy="2" r="7" fill="#FFFFFF"/><path d="M4 12 v6 M28 12 v6" stroke="#FFFFFF" stroke-width="4"/></g>`;
      const tricot = `<pattern id="tricot" width="44" height="30" patternUnits="userSpaceOnUse"><rect width="44" height="30" fill="${p.c}"/><path d="M11 0 Q4 7 11 15 Q18 22 11 30 M33 0 Q26 7 33 15 Q40 22 33 30" stroke="#A8152A" stroke-width="5" fill="none"/></pattern>`;
      avant = `<defs>${tricot}</defs>` + plein('url(#tricot)') + dans(`
        <rect x="140" y="440" width="320" height="58" fill="#FFFFFF" opacity=".95"/>
        ${teckel(178, 458)}${teckel(260, 458)}${teckel(342, 458)}
        <rect x="140" y="440" width="320" height="58" fill="none" ${s2(5)}/>
        <path d="M200 338 Q300 372 400 338 L404 362 Q300 400 196 362Z" fill="#A8152A" ${s2(5)}/>`);
      arriere = `<defs>${tricot}</defs>` + plein('url(#tricot)') + dans(`<rect x="140" y="440" width="320" height="58" fill="#FFFFFF"/>${teckel(210, 458)}${teckel(310, 458)}<rect x="140" y="440" width="320" height="58" fill="none" ${s2(5)}/>`);
      break;
    }
    default: break;
  }
  return { defs: clip, avant, arriere };
}

/* ------------------------------------------------------------------ */
/* Accessoires de cou                                                  */
/* ------------------------------------------------------------------ */
function accessoireCou(p, dos) {
  if (p.accessoire === 'noeud') return dos ? `<path d="M210 340 Q300 380 390 340" fill="none" stroke="${p.noeud}" stroke-width="16"/>` : `<path d="M210 340 Q300 380 390 340" fill="none" stroke="#C9A227" stroke-width="10"/>` + noeudPap(300, 362, p.noeud, 1.2);
  if (p.accessoire === 'perles') {
    let o = '';
    [[352, 120, 16], [372, 105, 15], [392, 90, 14]].forEach(([y, rx, r]) => {
      for (let i = 0; i <= 10; i++) { const a = Math.PI * (i / 10); o += `<circle cx="${300 - rx * Math.cos(a)}" cy="${y + (dos ? -10 : 1) * 0.35 * rx * Math.sin(a) * (dos ? 0.2 : 1)}" r="${r * 0.6}" fill="#FFFDF6" ${s2(3)}/>`; }
    });
    return o;
  }
  if (p.accessoire === 'coussin') {
    if (dos) return `<path d="M200 380 Q300 420 400 380" fill="none" stroke="#6B1E3F" stroke-width="18"/>`;
    return `<path d="M200 380 Q300 420 400 380" fill="none" stroke="#6B1E3F" stroke-width="18"/>
      <rect x="236" y="400" width="128" height="96" rx="22" fill="#F4EAD5" ${S}/>
      <path d="M252 404 L300 450 L348 404 M252 492 L300 450 L348 492" stroke="#6B1E3F" stroke-width="7" fill="none"/>
      <circle cx="288" cy="446" r="16" fill="none" stroke="#C9A227" stroke-width="7"/><circle cx="312" cy="446" r="16" fill="none" stroke="#E0E0E0" stroke-width="7"/>`;
  }
  if (p.accessoire === 'chapeau' || p.accessoire === 'lunettes' || p.accessoire === 'fleurs') {
    return `<path d="M210 340 Q300 378 390 340" fill="none" stroke="${p.accessoire === 'lunettes' ? '#FF4F9A' : '#6B1E3F'}" stroke-width="14"/><circle cx="300" cy="368" r="10" fill="#C9A227" ${s2(4)}/>`;
  }
  return '';
}

/* ------------------------------------------------------------------ */
/* Têtes                                                               */
/* ------------------------------------------------------------------ */
function oreilles(R, dos) {
  const o = R.ombre, p = R.pelage;
  switch (R.oreilles) {
    case 'repliees': return `<path d="M200 170 Q170 160 176 200 Q196 196 214 186Z" fill="${R.masque === '#3A2A2A' ? '#3A2A2A' : o}" ${S}/><path d="M400 170 Q430 160 424 200 Q404 196 386 186Z" fill="${R.masque === '#3A2A2A' ? '#3A2A2A' : o}" ${S}/>`;
    case 'chauve-souris': return `<path d="M215 175 L190 70 Q240 90 255 145Z" fill="${p}" ${S}/><path d="M209 160 L198 96 Q228 112 238 146Z" fill="#F7B3C8"/><path d="M385 175 L410 70 Q360 90 345 145Z" fill="${p}" ${S}/><path d="M391 160 L402 96 Q372 112 362 146Z" fill="#F7B3C8"/>`;
    case 'dressees': return `<path d="M215 170 L170 60 Q240 80 262 140Z" fill="${p}" ${S}/><path d="M210 152 L186 86 Q228 100 240 140Z" fill="#F7C8B0"/><path d="M385 170 L430 60 Q360 80 338 140Z" fill="${p}" ${S}/><path d="M390 152 L414 86 Q372 100 360 140Z" fill="#F7C8B0"/>`;
    case 'pliees': return `<path d="M210 160 L196 100 Q240 104 258 140Z" fill="${R.taches || o}" ${S}/><path d="M390 160 L404 100 Q360 104 342 140Z" fill="${R.taches || o}" ${S}/>`;
    case 'rose': return `<path d="M215 150 Q190 120 220 110 Q246 120 250 140Z" fill="${o}" ${S}/><path d="M385 150 Q410 120 380 110 Q354 120 350 140Z" fill="${o}" ${S}/>`;
    case 'tombantes': return `<path d="M212 150 Q160 160 162 250 Q172 290 206 270 Q222 210 230 160Z" fill="${o}" ${S}/><path d="M388 150 Q440 160 438 250 Q428 290 394 270 Q378 210 370 160Z" fill="${o}" ${S}/>`;
    case 'tombantes-longues': return `<path d="M214 150 Q150 170 158 300 Q172 340 212 312 Q226 220 236 160Z" fill="${o}" ${S}/><path d="M386 150 Q450 170 442 300 Q428 340 388 312 Q374 220 364 160Z" fill="${o}" ${S}/>`;
    case 'poils-longs': return `<path d="M222 120 Q140 150 140 330 Q150 380 196 360 Q214 260 240 150Z" fill="${o}" ${S}/><path d="M378 120 Q460 150 460 330 Q450 380 404 360 Q386 260 360 150Z" fill="${o}" ${S}/><path d="M168 220 Q160 280 172 330 M432 220 Q440 280 428 330" stroke="#fff" stroke-width="5" opacity=".4" fill="none"/>`;
    case 'pompons': return `${[[196, 170], [184, 214], [196, 256]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="30" fill="${p}" ${S}/>`).join('')}${[[404, 170], [416, 214], [404, 256]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="30" fill="${p}" ${S}/>`).join('')}`;
    default: return '';
  }
}

function tete(R, dos, p, clin = false) {
  const largeur = R.museau === 'fin' ? 92 : R.museau === 'large' ? 120 : 108;
  const forme = `<ellipse cx="300" cy="215" rx="${largeur}" ry="${R.museau === 'fin' ? 112 : 104}" fill="${R.pelage}" ${S}/>`;
  if (dos) {
    return `${oreilles(R, true)}${forme}<path d="M240 140 Q300 120 360 140" fill="none" stroke="${R.ombre}" stroke-width="8" opacity=".6"/>`;
  }
  const yeuxY = 205;
  const yeux = [258, 342].map((x, i) => clin && i === 0 ? `<path d="M${x - 16} ${yeuxY} Q${x} ${yeuxY + 14} ${x + 16} ${yeuxY}" fill="none" ${s2(6)}/>` : `<ellipse cx="${x}" cy="${yeuxY}" rx="15" ry="18" fill="${N}"/><circle cx="${x + 5}" cy="${yeuxY - 6}" r="5" fill="#FFFFFF"/>`).join('');
  const sourcils = `<path d="M242 176 Q258 168 272 176 M328 176 Q342 168 358 176" fill="none" ${s2(5)}/>`;
  let museau = '';
  if (R.museau === 'plat') {
    museau = `<ellipse cx="300" cy="262" rx="66" ry="48" fill="${R.masque}" ${S}/>
      <path d="M262 236 Q300 226 338 236" stroke="${R.ombre}" stroke-width="5" fill="none" opacity=".8"/>
      <ellipse cx="300" cy="248" rx="22" ry="15" fill="${N}"/>
      <path d="M300 262 V276 M276 282 Q300 300 324 282" fill="none" stroke="${R.masque === '#3A2A2A' ? '#F2E4CF' : N}" stroke-width="5" stroke-linecap="round"/>`;
  } else {
    const ry = R.museau === 'long' || R.museau === 'fin' ? 56 : 46;
    museau = `<ellipse cx="300" cy="${268}" rx="${R.museau === 'large' ? 74 : 56}" ry="${ry}" fill="${R.masque}" ${S}/>
      <ellipse cx="300" cy="${246}" rx="22" ry="15" fill="${N}"/>
      <path d="M300 260 V280 M274 286 Q300 306 326 286" fill="none" ${s2(5)}/>
      ${R.museau === 'large' ? `<path d="M240 290 Q244 330 280 322 M360 290 Q356 330 320 322" fill="none" stroke="${R.ombre}" stroke-width="6"/>` : ''}`;
  }
  const joues = R.joues ? `<circle cx="236" cy="252" r="20" fill="${R.joues}"/><circle cx="364" cy="252" r="20" fill="${R.joues}"/>` : '';
  const liste = R.masque === '#FFFFFF' && R.pelage !== '#D9D2CC' ? `<path d="M286 120 Q300 110 314 120 L312 220 L288 220Z" fill="#FFFFFF"/>` : '';
  const taches = R.taches ? `<path d="M210 170 Q230 140 262 160 Q250 196 220 196Z" fill="${R.taches}"/><path d="M360 230 Q392 220 396 252 Q370 262 356 250Z" fill="${R.taches}" opacity=".8"/>` : '';
  const rougeurs = `<ellipse cx="236" cy="246" rx="16" ry="9" fill="#FF4F9A" opacity=".35"/><ellipse cx="364" cy="246" rx="16" ry="9" fill="#FF4F9A" opacity=".35"/>`;
  const touffe = R.oreilles === 'pompons' ? `<circle cx="270" cy="112" r="34" fill="${R.pelage}" ${S}/><circle cx="330" cy="112" r="34" fill="${R.pelage}" ${S}/><circle cx="300" cy="96" r="38" fill="${R.pelage}" ${S}/>` : '';
  return `${oreilles(R, false)}${forme}${touffe}${taches}${liste}${joues}${rougeurs}${sourcils}${yeux}${museau}`;
}

/* ------------------------------------------------------------------ */
/* Accessoires de tête                                                 */
/* ------------------------------------------------------------------ */
function accessoireTete(p, dos) {
  switch (p.tete) {
    case 'couronne': return `<path d="M246 112 L238 56 L270 84 L300 46 L330 84 L362 56 L354 112Z" fill="#C9A227" ${S}/><circle cx="300" cy="70" r="8" fill="#FF4F9A" ${s2(4)}/><path d="M246 112 H354" ${S}/>`;
    case 'haut-de-forme': return `<g transform="rotate(-8 300 110)"><rect x="252" y="20" width="96" height="92" rx="6" fill="${N}" ${S}/><rect x="252" y="80" width="96" height="16" fill="#6B1E3F"/><ellipse cx="300" cy="112" rx="78" ry="16" fill="${N}" ${S}/></g><path d="M220 140 Q300 120 380 140" fill="none" stroke="${N}" stroke-width="5" opacity=".6"/>`;
    case 'fleurs': {
      const fleur = (x, y, c) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-12" rx="9" ry="13" fill="${c}" transform="rotate(${a})" ${s2(3)}/>`).join('')}<circle r="7" fill="#FFC93C" ${s2(3)}/></g>`;
      return `<path d="M200 140 Q300 80 400 140" fill="none" stroke="#2BC48A" stroke-width="10"/>${fleur(210, 132, '#FFC4DD')}${fleur(250, 108, '#FFFFFF')}${fleur(300, 98, '#C8F0E0')}${fleur(350, 108, '#FFE7A8')}${fleur(390, 132, '#FFC4DD')}`;
    }
    case 'voile': return dos
      ? `<path d="M236 120 Q300 90 364 120 Q430 300 420 460 Q300 500 180 460 Q170 300 236 120Z" fill="#FFFFFF" opacity=".55" ${s2(4)}/>`
      : `<path d="M226 130 Q300 92 374 130 Q440 260 448 420 Q420 430 404 410 Q392 260 360 150 Q300 130 240 150 Q208 260 196 410 Q180 430 152 420 Q160 260 226 130Z" fill="#FFFFFF" opacity=".7" ${s2(4)}/><g transform="translate(300 116)">${[-40, -20, 0, 20, 40].map((x) => `<circle cx="${x}" cy="${-Math.abs(x) * 0.2}" r="9" fill="#FFFFFF" ${s2(3)}/>`).join('')}</g>`;
    case 'lunettes': return dos ? `<path d="M196 206 H404" stroke="#FF4F9A" stroke-width="10"/>` : `<g><path d="M258 186 C238 162 208 182 220 206 L258 242 L296 206 C306 182 278 162 258 186Z" fill="#FF4F9A" ${S}/><path d="M342 186 C322 162 294 182 304 206 L342 242 L380 206 C392 182 362 162 342 186Z" fill="#FF4F9A" ${S}/><path d="M296 200 H304 M220 200 L196 194 M380 200 L404 194" ${S}/><path d="M232 192 L244 200" stroke="#fff" stroke-width="5" opacity=".7"/></g>`;
    default: return '';
  }
}

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */
function portrait(p, vue) {
  const R = RACES[p.race];
  const pose = vue === 2;
  const t = tenue(p, false);
  const fondPose = pose ? `<rect width="600" height="600" fill="${FOND_CLAIR[p.fond]}"/>` : '';
  const contenu = `${decor(p.fond)}${fondPose}
    <defs>${t.defs}</defs>
    ${corps(p.race, false)}
    ${t.avant}
    ${accessoireCou(p, false)}
    <path d="M250 300 Q300 350 350 300 L350 340 Q300 360 250 340Z" fill="${R.pelage}"/>
    <g ${pose ? 'transform="rotate(9 300 300)"' : ''}>
      ${tete(R, false, p, pose)}
      ${accessoireTete(p, false)}
    </g>
    ${pose ? `<g transform="translate(500 90) rotate(12)"><path d="M0 -26 L7 -8 L26 -8 L11 4 L17 23 L0 12 L-17 23 L-11 4 L-26 -8 L-7 -8Z" fill="#FFFFFF" ${s2(5)}/></g>` : ''}`;
  // Vue 3 : détail (zoom sur la tête pour les accessoires de tête, sur la tenue sinon)
  const zoomTete = ['couronne', 'haut-de-forme', 'fleurs', 'lunettes', 'voile'].includes(p.tete) && p.tenue === 'aucune';
  const viewBox = vue === 3 ? (zoomTete ? '130 40 340 340' : p.accessoire === 'perles' || p.accessoire === 'coussin' || p.accessoire === 'noeud' ? '160 250 280 280' : '150 300 300 300') : '0 0 600 600';
  const fondZoom = vue === 3 ? `<rect x="-100" y="-100" width="800" height="800" fill="${FOND[p.fond]}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="1200" height="1200">${fondZoom}${contenu}</svg>`;
}

function occasion(id, slug, props) {
  const p = P.find((x) => x.slug === slug);
  const inner = portrait({ ...p }, 1).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 0 800 600" width="1200" height="900"><rect x="-100" y="0" width="800" height="600" fill="${FOND[p.fond]}"/>${inner}${props}</svg>`;
}

const etoile = (x, y, r, c) => `<path d="M${x} ${y - r} L${x + r * 0.3} ${y - r * 0.3} L${x + r} ${y} L${x + r * 0.3} ${y + r * 0.3} L${x} ${y + r} L${x - r * 0.3} ${y + r * 0.3} L${x - r} ${y} L${x - r * 0.3} ${y - r * 0.3}Z" fill="${c}" ${s2(4)}/>`;
const coeur = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 8 C-10 -6 -26 4 -16 16 L0 30 L16 16 C26 4 10 -6 0 8Z" fill="${c}" ${s2(4 / s)}/>`;
const cadeau = (x, y, w, c, r) => `<g><rect x="${x}" y="${y}" width="${w}" height="${w * 0.8}" rx="6" fill="${c}" ${s2(5)}/><rect x="${x + w / 2 - 7}" y="${y}" width="14" height="${w * 0.8}" fill="${r}"/><path d="M${x + w / 2} ${y} q-24 -26 -30 -4 q14 6 30 4 q24 -26 30 -4 q-14 6 -30 4" fill="${r}" ${s2(4)}/></g>`;

/* ------------------------------------------------------------------ */
/* Écriture des fichiers                                               */
/* ------------------------------------------------------------------ */
mkdirSync(join(RACINE, 'produits'), { recursive: true });
mkdirSync(join(RACINE, 'occasions'), { recursive: true });
let n = 0;
for (const p of P) for (const v of [1, 2, 3]) { writeFileSync(join(RACINE, 'produits', `${p.slug}-${v}.svg`), portrait(p, v)); n++; }

const OCC = {
  mariage: occasion('mariage', 'la-robe-meringue', [coeur(-40, 80, 1.6, '#FFFFFF'), coeur(600, 120, 1.3, '#FF8DBE'), coeur(-20, 420, 1.1, '#FFC4DD'), coeur(620, 440, 1.5, '#FFFFFF')].join('')),
  gala: occasion('gala', 'le-smoking-baron', [etoile(-30, 90, 30, '#FFC93C'), etoile(620, 140, 24, '#FFFFFF'), etoile(-10, 400, 20, '#FFFFFF'), etoile(640, 420, 32, '#FFC93C')].join('')),
  bapteme: occasion('bapteme', 'le-costume-communion', [etoile(-30, 120, 22, '#FFFFFF'), etoile(630, 100, 26, '#FFFFFF'), coeur(620, 420, 1.2, '#86D4F9')].join('')),
  noel: occasion('noel', 'le-pull-de-fete-biscotte', [cadeau(-80, 470, 120, '#D7263D', '#FFC93C'), cadeau(560, 450, 140, '#FFC93C', '#D7263D'), etoile(-30, 90, 26, '#FFFFFF'), etoile(630, 110, 30, '#FFC93C')].join('')),
  anniversaire: occasion('anniversaire', 'les-lunettes-star', [`<path d="M-60 60 l30 70 l-60 0z" fill="#3DB8F5" ${s2(5)}/>`, `<path d="M630 40 l34 80 l-68 0z" fill="#FFC93C" ${s2(5)}/>`, coeur(600, 440, 1.3, '#FFFFFF'), etoile(-20, 420, 24, '#FFFFFF')].join('')),
  shooting: occasion('shooting', 'la-cape-tapis-rouge', [`<path d="M-100 0 L120 0 L300 600 L-100 600Z" fill="#FFFFFF" opacity=".12"/>`, `<path d="M700 0 L480 0 L300 600 L700 600Z" fill="#FFFFFF" opacity=".12"/>`, etoile(-20, 120, 28, '#FFFFFF'), etoile(630, 160, 22, '#FFFFFF')].join('')),
};
for (const [k, v] of Object.entries(OCC)) { writeFileSync(join(RACINE, 'occasions', `${k}.svg`), v); n++; }
console.log(`${n} visuels générés dans public/images`);
