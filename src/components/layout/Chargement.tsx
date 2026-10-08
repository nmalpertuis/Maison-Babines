import { BaronHead } from '@/components/brand/illustrations';

export function Chargement() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <BaronHead className="h-24 w-24 animate-bounce" />
        <p className="font-titre text-xl italic">On repasse le nœud pap'…</p>
      </div>
    </div>
  );
}
