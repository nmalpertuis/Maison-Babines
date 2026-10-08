import type { ReactNode } from 'react';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { Seo } from '@/components/ui/Seo';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export interface Rubrique { id: string; titre: string; contenu: ReactNode }

/** Pages légales : mise en page sobre, texte sur fond crème, sommaire à gauche. */
export function LegalLayout({ titre, seo, description, intro, rubriques }: { titre: string; seo: string; description: string; intro?: ReactNode; rubriques: Rubrique[] }) {
  return (
    <>
      <Seo titre={seo} description={description} />
      <div className="conteneur pb-24 pt-10">
        <Breadcrumb miettes={[{ label: 'Accueil', to: '/' }, { label: titre }]} />
        <h1 className="mt-6 max-w-4xl text-[44px] lg:text-[72px]">{titre}</h1>
        {intro && <div className="mt-4 max-w-3xl text-lg">{intro}</div>}
        <div className="mt-12 grid gap-12 lg:grid-cols-[260px_1fr]">
          <nav aria-label="Sommaire" className="lg:sticky lg:top-32 lg:self-start">
            <p className="surtitre mb-3 text-bordeaux">Sommaire</p>
            <ol className="flex flex-col gap-1 border-l-[3px] border-noir pl-4">
              {rubriques.map((r, i) => <li key={r.id}><a href={`#${r.id}`} className="inline-flex min-h-[36px] items-center font-semibold hover:text-bordeaux hover:underline"><span className="mr-2 font-titre text-bordeaux">{String(i + 1).padStart(2, '0')}</span>{r.titre}</a></li>)}
            </ol>
          </nav>
          <div className="flex max-w-3xl flex-col gap-10 leading-relaxed">
            {rubriques.map((r, i) => (
              <section key={r.id} id={r.id} className="scroll-mt-32">
                <SplitTitle className="text-[28px] lg:text-[36px]" texte={`${String(i + 1).padStart(2, '0')} · ${r.titre}`} />
                <div className="mt-4 flex flex-col gap-3 [&_li]:ml-5 [&_li]:list-disc">{r.contenu}</div>
              </section>
            ))}
            <p className="text-sm text-noir/60">Dernière mise à jour : octobre 2026. Document établi pour un projet étudiant fictif.</p>
          </div>
        </div>
      </div>
    </>
  );
}
