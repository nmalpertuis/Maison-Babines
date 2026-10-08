export type CharacterId = 'baron' | 'praline' | 'tonnerre' | 'meringue' | 'moustache';

export const CHARACTERS: { id: CharacterId; nom: string; espece: string; role: string; citation: string; couleur: string }[] = [
  { id: 'baron', nom: 'Baron Biscotte', espece: 'Teckel', role: 'Concierge, maître des lieux', citation: "Une tenue, c'est une promesse. Un nœud pap', c'est un serment.", couleur: 'var(--rose)' },
  { id: 'praline', nom: 'Mademoiselle Praline', espece: 'Caniche royal rose', role: 'Styliste en chef', citation: 'Je mesure deux fois, je couds une fois, je juge toujours.', couleur: 'var(--jaune)' },
  { id: 'tonnerre', nom: 'Monsieur Tonnerre', espece: 'Dogue allemand', role: 'Voiturier et livreur, géant très doux', citation: 'Je livre vite. Je suis grand, ça aide.', couleur: 'var(--bleu)' },
  { id: 'meringue', nom: 'Lady Meringue', espece: 'Lévrier afghan', role: 'Star du tapis rouge, cliente fidèle', citation: 'Le tapis rouge ? Je le trouvais un peu terne avant moi.', couleur: 'var(--orange)' },
  { id: 'moustache', nom: 'Duchesse Moustache', espece: 'Chatte persane', role: "Critique de mode jalouse (on n'habille pas les chats)", citation: 'Et les chats, alors ?', couleur: 'var(--vert)' },
];
