import { useId, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { inscrireNewsletter } from '@/lib/crm';
import { cx } from '@/lib/format';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm({ source, clair, bouton = "Je m'abonne" }: { source: string; clair?: boolean; bouton?: string }) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [etat, setEtat] = useState<'idle' | 'envoi' | 'ok'>('idle');
  const [erreur, setErreur] = useState<string | null>(null);

  const envoyer = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email)) { setErreur('Il manque un petit quelque chose ici.'); return; }
    setErreur(null); setEtat('envoi');
    try {
      await Promise.all([inscrireNewsletter(email, source), new Promise((r) => setTimeout(r, 900))]);
      setEtat('ok');
    } catch {
      setEtat('idle'); setErreur('Le pigeon voyageur s\'est égaré. Réessayez dans un instant.');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {etat === 'ok' ? (
        <motion.p key="ok" role="status" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={cx('flex items-center gap-2 rounded-2xl border-[3px] px-4 py-3 font-bold', clair ? 'border-creme' : 'border-noir bg-creme')}>
          <CheckCircle2 strokeWidth={2.5} aria-hidden className="shrink-0" /> Bienvenue dans la Gazette ! Premier numéro (et -10 %) en route.
        </motion.p>
      ) : (
        <motion.form key="form" onSubmit={envoyer} noValidate className="w-full" exit={{ opacity: 0 }}>
          <label htmlFor={id} className="sr-only">Votre adresse e-mail</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id={id} type="email" autoComplete="email" placeholder="votre@email.fr" value={email}
              onChange={(e) => setEmail(e.target.value)} aria-invalid={!!erreur} aria-describedby={`${id}-e`}
              className="champ flex-1 text-noir"
            />
            <button type="submit" disabled={etat === 'envoi'} className="inline-flex min-h-[48px] items-center justify-center rounded-pilule border-[3px] border-noir bg-jaune px-6 font-extrabold text-noir shadow-dure transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-60">
              {etat === 'envoi' ? 'On repasse le nœud pap\'…' : bouton}
            </button>
          </div>
          <p id={`${id}-e`} aria-live="polite" className={cx('flex items-center gap-1.5 text-sm font-bold', erreur ? 'mt-2' : 'sr-only')}>
            {erreur && <><AlertCircle size={16} strokeWidth={2.5} aria-hidden />{erreur}</>}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
