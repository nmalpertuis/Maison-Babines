import { Fragment, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { FAQ } from '@/data/faq';
import { cx } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { PageHeader } from '@/components/ui/PageHeader';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Baron } from '@/components/brand/illustrations';

const normaliser = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Surligne le mot cherché (insensible aux accents et à la casse). */
function Surligne({ texte, terme }: { texte: string; terme: string }): ReactNode {
  if (!terme) return texte;
  const n = normaliser(texte), t = normaliser(terme);
  const morceaux: ReactNode[] = [];
  let i = 0, k = n.indexOf(t);
  while (k !== -1) {
    morceaux.push(texte.slice(i, k), <mark key={k} className="rounded bg-jaune px-0.5 text-noir">{texte.slice(k, k + terme.length)}</mark>);
    i = k + terme.length;
    k = n.indexOf(t, i);
  }
  morceaux.push(texte.slice(i));
  return <>{morceaux.map((m, j) => <Fragment key={j}>{m}</Fragment>)}</>;
}

export default function Faq() {
  const [q, setQ] = useState('');
  const [theme, setTheme] = useState<string | null>(null);
  const terme = q.trim();

  const themes = useMemo(
    () => FAQ.filter((t) => !theme || t.id === theme)
      .map((t) => ({ ...t, questions: t.questions.filter((x) => !terme || normaliser(x.q + ' ' + x.r).includes(normaliser(terme))) }))
      .filter((t) => t.questions.length),
    [terme, theme],
  );
  const total = themes.reduce((s, t) => s + t.questions.length, 0);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.flatMap((t) => t.questions.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.r } }))),
  };

  return (
    <>
      <Seo titre="La Conciergerie — Questions fréquentes · Maison Babines" description="Tailles, livraison, caution, hygiène : toutes les réponses sur la location de tenues pour chien." jsonLd={jsonLd} />
      <PageHeader
        fond="bg-bleu" couleurFeston="var(--bleu)" surtitre="La Conciergerie"
        miettes={[{ label: 'Accueil', to: '/' }, { label: 'FAQ' }]}
        titre="La Conciergerie"
        sousTitre="Le Baron a réponse à tout. Ou presque."
        illustration={
          <div className="relative">
            <Baron pose="salue" className="relative z-0 w-full" />
            <svg viewBox="0 0 360 90" aria-hidden className="-mt-16 w-full"><rect x="10" y="10" width="340" height="76" rx="10" fill="#6B1E3F" stroke="#1E1430" strokeWidth="4" /><path d="M10 30 H350" stroke="#C9A227" strokeWidth="4" /><text x="180" y="66" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="900" fontSize="24" fill="#FFF6EA">Conciergerie</text></svg>
          </div>
        }
      >
        <div className="relative mt-8 max-w-xl">
          <label htmlFor="faq-q" className="sr-only">Rechercher une question</label>
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" size={22} strokeWidth={2.5} aria-hidden />
          <input id="faq-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Caution, taille, livraison…" className="champ h-14 pl-12 pr-12 text-lg shadow-dure" />
          {q && <button type="button" onClick={() => setQ('')} aria-label="Effacer la recherche" className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full hover:bg-noir/10"><X size={18} strokeWidth={2.5} /></button>}
        </div>
      </PageHeader>

      <div className="conteneur grid gap-10 pb-24 pt-20 lg:grid-cols-[260px_1fr]">
        <nav aria-label="Thèmes" className="lg:sticky lg:top-32 lg:self-start">
          <ul className="scroll-x -mx-6 flex gap-2 px-6 lg:mx-0 lg:flex-col lg:px-0">
            {[{ id: null, titre: 'Tous les thèmes' }, ...FAQ].map((t) => (
              <li key={t.titre}>
                <button type="button" aria-pressed={theme === t.id} onClick={() => setTheme(t.id)} className={cx('pastille w-full lg:justify-start', theme === t.id && 'shadow-petite')}>{t.titre}</button>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-6 font-bold" aria-live="polite">{terme ? `${total} réponse${total > 1 ? 's' : ''} pour « ${terme} »` : `${total} questions`}</p>
          <div className="flex flex-col gap-12">
            {themes.map((t) => (
              <motion.section key={t.id} id={t.id} layout className="scroll-mt-32" aria-labelledby={`t-${t.id}`}>
                <h2 id={`t-${t.id}`} className="mb-5 text-[32px] lg:text-[40px]">{t.titre}</h2>
                <Accordion
                  key={terme}
                  items={t.questions.map((x, i) => ({ id: `${t.id}-${i}`, titre: <Surligne texte={x.q} terme={terme} />, contenu: <p><Surligne texte={x.r} terme={terme} /></p> }))}
                  ouvertParDefaut={terme ? [`${t.id}-0`] : []}
                />
              </motion.section>
            ))}
            {themes.length === 0 && (
              <div className="flex flex-col items-center text-center">
                <Baron pose="loupe" className="w-72" />
                <p className="mt-4 font-titre text-2xl font-black">Même le Baron a cherché sous le tapis.</p>
              </div>
            )}
          </div>
          <Reveal className="mt-16">
            <div className="flex flex-col items-start justify-between gap-6 rounded-rayon border-[3px] border-noir bg-vert p-8 shadow-dure sm:flex-row sm:items-center">
              <p className="font-titre text-2xl font-black lg:text-3xl">Vous n'avez pas trouvé ? Écrivez à la Réception</p>
              <ButtonLink to="/contact" variante="secondaire" taille="lg">Contacter la Réception</ButtonLink>
            </div>
          </Reveal>
          <p className="sr-only"><Link to="/guide-des-tailles">Guide des tailles</Link></p>
        </div>
      </div>
    </>
  );
}
