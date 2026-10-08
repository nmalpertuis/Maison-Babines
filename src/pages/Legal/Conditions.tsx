import { Link } from 'react-router-dom';
import { LegalLayout } from './LegalLayout';

export default function Conditions() {
  return (
    <LegalLayout
      titre="Conditions de location" seo="Conditions générales de location · Maison Babines" description="Réservation, caution, livraison, retour, annulation, taille garantie : les règles de location Maison Babines."
      intro={<p>Les présentes conditions générales de location (CGL) encadrent la location de tenues de cérémonie pour chiens proposée par Maison Babines (projet fictif). Tous les prix sont fictifs.</p>}
      rubriques={[
        { id: 'objet', titre: 'Objet', contenu: <p>Maison Babines met à disposition, pour une durée limitée, des tenues et accessoires de cérémonie pour chiens. La tenue reste la propriété de Maison Babines pendant toute la durée de la location.</p> },
        { id: 'reservation', titre: 'Réservation', contenu: <ul><li>Réservation possible jusqu'à 6 mois à l'avance, au plus tard 3 jours avant l'événement (1 jour avec la livraison express, commande avant 12 h).</li><li>Une location dure 4 jours : livraison la veille ou l'avant-veille, retour le lendemain de l'événement.</li><li>Des jours supplémentaires peuvent être ajoutés (12 € par jour).</li></ul> },
        { id: 'prix', titre: 'Prix', contenu: <><p>Les prix de location (de 19 à 189 € selon la gamme) incluent le nettoyage et le retour. Options : assurance "Pattes de velours" 9 €, deuxième taille "au cas où" 10 €, retouche express 15 €, kit de mesure offert.</p><p>Livraison standard (J-3) : 9,90 €, offerte dès 120 € d'achat. Livraison express (J-1) : 19,90 €.</p></> },
        { id: 'caution', titre: 'Caution', contenu: <p>La caution (50 € à 350 € selon la gamme) est une simple empreinte bancaire, non débitée, libérée sous 72 h après contrôle du retour.</p> },
        { id: 'livraison', titre: 'Livraison', contenu: <p>Livraison en France métropolitaine à domicile, en point relais ou sur le lieu de l'événement si quelqu'un peut réceptionner le colis. La tenue est livrée dans sa boîte à chapeau avec une carte d'invitation au nom du chien.</p> },
        { id: 'utilisation', titre: 'Utilisation de la tenue', contenu: <p>Nous conseillons des séances de 2 heures maximum, avec des pauses, de l'eau, et jamais sans surveillance. Par forte chaleur, préférez les pièces légères.</p> },
        { id: 'retour', titre: 'Retour', contenu: <p>Retour sans lavage : on s'occupe du nettoyage. Merci de ne pas laver la tenue vous-même. Remettez-la dans sa boîte à chapeau, collez l'étiquette prépayée et déposez le colis en point relais le lendemain de l'événement. Le retour est gratuit.</p> },
        { id: 'retard', titre: 'Retard', contenu: <p>Retard de retour : 12 € par jour.</p> },
        { id: 'dommages', titre: 'Dommages et assurance', contenu: <p>Les petites traces de fête sont normales et incluses. L'assurance "Pattes de velours" (9 €) couvre les taches tenaces, petits accrocs et griffures. Sans assurance, la réparation est déduite de la caution, sur devis ; un accessoire perdu ou avalé est facturé à son prix de remplacement.</p> },
        { id: 'annulation', titre: 'Annulation', contenu: <p>Annulation gratuite jusqu'à 7 jours avant la date de livraison ; ensuite, avoir de la valeur de la commande, valable un an.</p> },
        { id: 'taille', titre: 'Taille garantie', contenu: <p>Si la tenue ne va pas, échange express offert sous réserve de disponibilité. Consultez le <Link to="/guide-des-tailles" className="lien">guide des tailles</Link> avant de réserver.</p> },
        { id: 'reclamations', titre: 'Réclamations', contenu: <p>Toute réclamation est à adresser à bonjour@maisonbabines.fr ou via la <Link to="/contact" className="lien">page Contact</Link>. Ligne SOS Tenue le vendredi et le samedi jusqu'à 21 h : 04 00 00 00 01.</p> },
      ]}
    />
  );
}
