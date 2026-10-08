import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cx } from '@/lib/format';

interface Toast { id: number; texte: string; type: 'succes' | 'erreur'; actions?: { label: string; to?: string; onClick?: () => void }[] }
const Ctx = createContext<{ notifier: (t: Omit<Toast, 'id'>) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fermer = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const notifier = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((l) => [...l.slice(-2), { ...t, id }]);
    setTimeout(() => fermer(id), 6000);
  }, [fermer]);

  return (
    <Ctx.Provider value={{ notifier }}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-24 z-[120] flex flex-col items-center gap-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end" aria-live="polite" role="status">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id} layout
              initial={{ opacity: 0, y: 40, scale: 0.9, rotate: -2 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} exit={{ opacity: 0, x: 80 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className={cx('pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-rayon border-[3px] border-noir p-4 shadow-dure', t.type === 'succes' ? 'bg-vert' : 'bg-orange')}
            >
              {t.type === 'succes' ? <CheckCircle2 className="mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden /> : <AlertCircle className="mt-0.5 shrink-0" strokeWidth={2.5} aria-hidden />}
              <div className="flex-1">
                <p className="font-bold leading-snug">{t.texte}</p>
                {t.actions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {t.actions.map((a) =>
                      a.to ? (
                        <Link key={a.label} to={a.to} onClick={() => fermer(t.id)} className="inline-flex min-h-[40px] items-center rounded-pilule border-[3px] border-noir bg-creme px-4 text-sm font-extrabold">{a.label}</Link>
                      ) : (
                        <button key={a.label} type="button" onClick={() => { a.onClick?.(); fermer(t.id); }} className="inline-flex min-h-[40px] items-center rounded-pilule border-[3px] border-noir bg-transparent px-4 text-sm font-extrabold">{a.label}</button>
                      ),
                    )}
                  </div>
                )}
              </div>
              <button type="button" onClick={() => fermer(t.id)} aria-label="Fermer la notification" className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-noir/10"><X size={18} strokeWidth={2.5} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast hors ToastProvider');
  return c;
}
