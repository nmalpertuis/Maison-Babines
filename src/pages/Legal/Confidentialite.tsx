import { LegalLayout } from './LegalLayout';
import { ouvrirCookies } from '@/components/layout/CookieBanner';

export default function Confidentialite() {
  return (
    <LegalLayout
      titre="Confidentialité et cookies" seo="Confidentialité et cookies · Maison Babines" description="Données collectées, finalités, durée de conservation, droits RGPD et cookies du site Maison Babines."
      rubriques={[
        { id: 'donnees', titre: 'Données collectées', contenu: <ul><li>Formulaires : prénom, nom, e-mail, téléphone, nom et race du chien, date de l'événement, message, photo facultative.</li><li>Réservation : coordonnées de livraison, articles choisis.</li><li>Newsletter : adresse e-mail.</li><li>Malle et favoris : stockés uniquement dans votre navigateur.</li></ul> },
        { id: 'finalites', titre: 'Finalités', contenu: <p>Traiter vos demandes et réservations, vous conseiller sur la taille, envoyer la Gazette du Grand Hôtel si vous y êtes abonné. Aucune donnée n'est vendue ni cédée.</p> },
        { id: 'duree', titre: 'Durée de conservation', contenu: <p>Demandes de contact : 3 ans après le dernier échange. Réservations : durée légale de conservation des pièces comptables. Newsletter : jusqu'à désinscription.</p> },
        { id: 'droits', titre: 'Vos droits (RGPD)', contenu: <p>Vous disposez d'un droit d'accès, de rectification, de suppression, d'opposition et de portabilité de vos données. Vous pouvez également introduire une réclamation auprès de la CNIL.</p> },
        { id: 'contact', titre: 'Contact', contenu: <p>Pour exercer vos droits : bonjour@maisonbabines.fr (adresse fictive).</p> },
        { id: 'cookies', titre: 'Cookies', contenu: <><p>Aucun cookie tiers. Le site utilise uniquement le stockage local de votre navigateur pour la malle, les favoris et votre choix concernant les cookies.</p><p><button type="button" onClick={ouvrirCookies} className="lien">Gérer les cookies</button></p></> },
      ]}
    />
  );
}
