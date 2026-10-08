import { Link } from 'react-router-dom';
import { LegalLayout } from './LegalLayout';

export default function MentionsLegales() {
  return (
    <LegalLayout
      titre="Mentions légales" seo="Mentions légales · Maison Babines" description="Éditeur, hébergeur, propriété intellectuelle et crédits du site Maison Babines."
      intro={<p>Maison Babines est un projet étudiant fictif. Aucune prestation réelle n'est vendue sur ce site.</p>}
      rubriques={[
        { id: 'editeur', titre: 'Éditeur', contenu: <><p>Site édité dans le cadre d'un projet étudiant fictif.</p><ul><li>École : [nom de l'école à compléter]</li><li>Étudiants : [noms à compléter]</li><li>Adresse de contact (fictive) : 12 rue des Petits-Chiens, 69002 Lyon — bonjour@maisonbabines.fr</li><li>Directeur de la publication : [à compléter]</li></ul></> },
        { id: 'hebergeur', titre: 'Hébergeur', contenu: <p>[Hébergeur à compléter, par exemple : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.]</p> },
        { id: 'nature', titre: 'Nature du projet', contenu: <><p>Ce site est une maquette fonctionnelle réalisée dans un cadre pédagogique. Les produits, prix, avis, chiffres, adresses et personnes cités sont fictifs.</p><p>Aucune commande n'est réellement passée et aucun paiement n'est encaissé : le tunnel de réservation est simulé.</p></> },
        { id: 'pi', titre: 'Propriété intellectuelle', contenu: <p>Les textes, le logo, les illustrations des personnages du Grand Hôtel Babines et la charte graphique ont été créés pour ce projet. Toute reproduction sans autorisation est interdite. Les marques citées dans le dossier de projet appartiennent à leurs propriétaires respectifs ; aucun logo, motif ou modèle de ces marques n'est repris.</p> },
        { id: 'credits', titre: 'Crédits images et ressources', contenu: <><p>Illustrations : personnages et décors dessinés en SVG pour le projet.</p><p>Visuels produits et occasions : portraits illustrés originaux créés pour le projet.</p><p>Photographies du mur #BabinesDeGala et de l'atelier : images libres de droits issues d'Unsplash (licence autorisant l'usage commercial, sans attribution obligatoire). La liste des photographes figure dans le fichier <code>public/images/CREDITS.md</code> du projet.</p><p>Polices : Fraunces, Shrikhand et Bricolage Grotesque (Google Fonts, licence SIL Open Font License). Icônes : Lucide (licence ISC).</p></> },
        { id: 'contact', titre: 'Contact', contenu: <p>Pour toute question sur ce site : bonjour@maisonbabines.fr (adresse fictive) ou la <Link to="/contact" className="lien">page Contact</Link>.</p> },
      ]}
    />
  );
}
