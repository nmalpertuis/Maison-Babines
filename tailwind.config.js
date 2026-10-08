/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1440px' },
    extend: {
      colors: {
        creme: 'var(--creme)',
        noir: 'var(--noir)',
        bordeaux: 'var(--bordeaux)',
        rose: 'var(--rose)',
        jaune: 'var(--jaune)',
        bleu: 'var(--bleu)',
        orange: 'var(--orange)',
        vert: 'var(--vert)',
        or: 'var(--or)',
      },
      fontFamily: {
        titre: ['Fraunces', 'Georgia', 'serif'],
        accent: ['Shrikhand', 'cursive'],
        texte: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { rayon: '24px', pilule: '999px' },
      boxShadow: {
        dure: '6px 6px 0 var(--noir)',
        survol: '10px 10px 0 var(--noir)',
        petite: '3px 3px 0 var(--noir)',
      },
      maxWidth: { contenu: '1280px' },
    },
  },
  plugins: [],
};
