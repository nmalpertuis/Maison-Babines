import { Seo } from '@/components/ui/Seo';
import { PageHeader } from '@/components/ui/PageHeader';
import { SizeGuideContent } from '@/components/product/SizeGuide';
import { Praline } from '@/components/brand/illustrations';

export default function SizeGuide() {
  return (
    <>
      <Seo titre="Guide des tailles · Maison Babines" description="Tour de cou, tour de poitrine, longueur du dos : trouvez la taille idéale de votre chien en 2 minutes." />
      <PageHeader
        fond="bg-jaune" couleurFeston="var(--jaune)" surtitre="Le Salon d'essayage"
        miettes={[{ label: 'Accueil', to: '/' }, { label: 'Guide des tailles' }]}
        titre="Guide des tailles"
        sousTitre="Trois mesures, deux minutes, zéro surprise le jour J."
        illustration={<Praline pose="mesure" className="w-full" />}
      />
      <div className="conteneur pb-24 pt-20"><SizeGuideContent /></div>
    </>
  );
}
