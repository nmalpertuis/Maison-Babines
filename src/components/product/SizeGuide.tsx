import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GUIDE_TAILLES, TAILLES, tailleDepuis } from '@/data/sizes';
import { Modal } from '@/components/ui/Modal';
import { classesBouton } from '@/components/ui/Button';
import { Input, Select } from '@/components/form/Field';
import { Praline } from '@/components/brand/illustrations';
import { cx } from '@/lib/format';

/** Schéma : chien avec les 3 mesures fléchées. */
function SchemaMesures() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-label="Schéma des trois mesures : tour de cou, tour de poitrine, longueur du dos">
      <g stroke="#1E1430" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M40 130 C38 100 60 84 90 84 L210 84 C230 84 240 70 244 56 L250 36 C254 26 272 24 280 34 L300 52 C306 60 300 70 290 70 L270 72 C266 96 262 110 250 124 L250 176 L232 176 L230 140 L110 140 L106 176 L88 176 L86 140 C60 140 42 140 40 130Z" fill="#FFB3D1" />
        <path d="M40 112 C24 106 16 92 20 76" fill="none" />
        <path d="M262 30 C254 46 254 60 262 66" fill="#FF8DBE" />
      </g>
      <circle cx="282" cy="46" r="4" fill="#1E1430" />
      {/* cou */}
      <ellipse cx="248" cy="78" rx="12" ry="22" fill="none" stroke="#FF4F9A" strokeWidth="5" strokeDasharray="6 4" />
      <text x="228" y="18" fontSize="14" fontWeight="800" fill="#1E1430">1 · cou</text>
      {/* poitrine */}
      <ellipse cx="214" cy="112" rx="14" ry="30" fill="none" stroke="#3DB8F5" strokeWidth="5" strokeDasharray="6 4" />
      <text x="168" y="196" fontSize="14" fontWeight="800" fill="#1E1430">2 · poitrine</text>
      {/* dos */}
      <path d="M232 70 L60 80" stroke="#2BC48A" strokeWidth="5" strokeDasharray="6 4" />
      <path d="M60 80 l10 -6 M60 80 l10 6 M232 70 l-10 -6 M232 70 l-10 6" stroke="#2BC48A" strokeWidth="4" strokeLinecap="round" />
      <text x="90" y="64" fontSize="14" fontWeight="800" fill="#1E1430">3 · longueur du dos</text>
    </svg>
  );
}

export function SizeCalculator({ onVoir }: { onVoir?: () => void }) {
  const [cou, setCou] = useState('');
  const [poitrine, setPoitrine] = useState('');
  const [dos, setDos] = useState('');
  const [morpho, setMorpho] = useState('standard');

  const res = useMemo(() => {
    const p = tailleDepuis('poitrine', Number(poitrine));
    if (!p) return null;
    const autres = [tailleDepuis('cou', Number(cou)), tailleDepuis('dos', Number(dos))].filter(Boolean);
    const entreDeux = autres.some((t) => t !== p);
    const plusGrande = [p, ...autres].reduce((a, b) => (TAILLES.indexOf(b!) > TAILLES.indexOf(a!) ? b : a), p)!;
    return { taille: p, entreDeux, plusGrande };
  }, [cou, poitrine, dos]);

  return (
    <div className="rounded-rayon border-[3px] border-noir bg-jaune p-6 shadow-dure lg:p-8">
      <h3 className="text-[28px] lg:text-[32px]">Calculateur de taille</h3>
      <p className="mt-1 text-noir/80">Entrez les mesures de votre chien en centimètres.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input label="Tour de cou (cm)" type="number" inputMode="decimal" min={0} value={cou} onChange={(e) => setCou(e.target.value)} />
        <Input label="Tour de poitrine (cm)" type="number" inputMode="decimal" min={0} value={poitrine} onChange={(e) => setPoitrine(e.target.value)} obligatoire />
        <Input label="Longueur du dos (cm)" type="number" inputMode="decimal" min={0} value={dos} onChange={(e) => setDos(e.target.value)} />
        <Select label="Morphologie" value={morpho} onChange={(e) => setMorpho(e.target.value)}>
          <option value="standard">Standard</option>
          <option value="dos-long">Dos long</option>
          <option value="torse-large">Torse large</option>
          <option value="fin">Fin et élancé</option>
        </Select>
      </div>
      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {res ? (
            <motion.div key={res.taille + res.entreDeux + morpho} initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="mt-6 rounded-2xl border-[3px] border-noir bg-creme p-5">
              <p className="font-titre text-3xl font-black">Taille conseillée : <span className="text-bordeaux">{res.taille}</span></p>
              {res.entreDeux && <p className="mt-2 font-semibold">Entre deux tailles : prenez la plus grande, ou ajoutez l'option deuxième taille.</p>}
              {morpho === 'dos-long' && <p className="mt-2 font-semibold">Dos long détecté : demandez une retouche express (15 €).</p>}
              <Link
                to={`/catalogue?taille=${(res.entreDeux ? res.plusGrande : res.taille).toLowerCase()}`}
                onClick={onVoir}
                className={cx(classesBouton('primaire'), 'mt-4')}
              >
                Voir les tenues dans ma taille
              </Link>
            </motion.div>
          ) : (
            <p key="vide" className="mt-6 text-sm font-semibold">Le tour de poitrine suffit pour une première estimation.</p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function SizeGuideContent({ dansModale, onVoir }: { dansModale?: boolean; onVoir?: () => void }) {
  const H = dansModale ? 'h3' : 'h2';
  return (
    <div className="flex flex-col gap-10">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
        <div className="relative mx-auto w-full max-w-sm">
          <Praline pose="mesure" className="w-full" />
        </div>
        <div>
          <H className={dansModale ? 'text-[28px]' : ''}>Comment mesurer</H>
          <div className="mt-4 rounded-rayon border-[3px] border-noir bg-white p-4"><SchemaMesures /></div>
          <ol className="mt-5 flex flex-col gap-3">
            {[
              ['Tour de cou', 'là où se pose le collier.', 'bg-rose'],
              ['Tour de poitrine', 'à l\'endroit le plus large, juste derrière les pattes avant.', 'bg-bleu'],
              ['Longueur du dos', 'de la base du cou à la naissance de la queue.', 'bg-vert'],
            ].map(([t, d, c], i) => (
              <li key={t} className="flex items-start gap-3">
                <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-noir font-titre font-black', c)}>{i + 1}</span>
                <span className="pt-1"><strong>{t}</strong>, {d}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-2xl border-[3px] border-noir bg-jaune/40 px-4 py-3 text-sm font-semibold">Mesurez votre chien debout, sans serrer, glissez deux doigts sous le mètre ruban.</p>
        </div>
      </div>

      <div>
        <H className={dansModale ? 'text-[28px]' : ''}>Tableau des tailles</H>
        <div className="scroll-x mt-4 rounded-rayon border-[3px] border-noir bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm lg:text-base">
            <caption className="sr-only">Correspondance des tailles selon les mesures du chien</caption>
            <thead className="bg-bordeaux text-creme">
              <tr>
                {['Taille', 'Tour de cou (cm)', 'Tour de poitrine (cm)', 'Longueur de dos (cm)', 'Poids indicatif', 'Exemples de races'].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-extrabold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GUIDE_TAILLES.map((l, i) => (
                <tr key={l.taille} className={cx('border-t-2 border-noir/15', i % 2 ? 'bg-creme' : 'bg-white')}>
                  <th scope="row" className="px-4 py-3 font-titre text-lg font-black">{l.taille}</th>
                  <td className="px-4 py-3">{l.cou.join('-')}</td>
                  <td className="px-4 py-3 font-bold">{l.poitrine.join('-')}</td>
                  <td className="px-4 py-3">{l.dos.join('-')}</td>
                  <td className="px-4 py-3">{l.poids}</td>
                  <td className="px-4 py-3">{l.races}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-noir/60">Tableau fictif établi pour le projet. Accessoires : tailles S, M, L.</p>
      </div>

      <SizeCalculator onVoir={onVoir} />
    </div>
  );
}

export function SizeGuideModal({ ouvert, fermer }: { ouvert: boolean; fermer: () => void }) {
  return (
    <Modal ouvert={ouvert} fermer={fermer} titre="Guide des tailles" large>
      <div className="p-6 pt-16 lg:p-10">
        <p className="surtitre text-bordeaux">Le Salon d'essayage</p>
        <h2 className="mb-8 mt-2 text-[36px] lg:text-[48px]">Guide des tailles</h2>
        <SizeGuideContent dansModale onVoir={fermer} />
      </div>
    </Modal>
  );
}
