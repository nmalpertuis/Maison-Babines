import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { AlertCircle, CheckCircle2, Upload, X } from 'lucide-react';
import { cx } from '@/lib/format';

interface Base { label: ReactNode; erreur?: string | null; aide?: ReactNode; succes?: boolean; obligatoire?: boolean; className?: string }

function Enveloppe({ id, label, erreur, aide, succes, obligatoire, className, children }: Base & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="etiquette">
        {label} {obligatoire && <span aria-hidden className="text-bordeaux">*</span>}
        {obligatoire && <span className="sr-only">(obligatoire)</span>}
      </label>
      <div className="relative">
        {children}
        {succes && !erreur && <CheckCircle2 aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-vert" size={20} strokeWidth={2.5} />}
      </div>
      {aide && !erreur && <p id={`${id}-aide`} className="mt-1.5 text-sm text-noir/70">{aide}</p>}
      <p id={`${id}-err`} aria-live="polite" className={cx('flex items-center gap-1.5 text-sm font-bold text-bordeaux', erreur ? 'mt-1.5' : 'sr-only')}>
        {erreur && <><AlertCircle size={16} strokeWidth={2.5} aria-hidden /> {erreur}</>}
      </p>
    </div>
  );
}

const desc = (id: string, erreur?: string | null, aide?: ReactNode) => cx(erreur ? `${id}-err` : '', aide ? `${id}-aide` : '') || undefined;

export function Input({ label, erreur, aide, succes, obligatoire, className, id: idProp, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId(); const id = idProp ?? auto;
  return (
    <Enveloppe {...{ id, label, erreur, aide, succes, obligatoire, className }}>
      <input id={id} className="champ" aria-invalid={!!erreur} aria-required={obligatoire} aria-describedby={desc(id, erreur, aide)} {...rest} />
    </Enveloppe>
  );
}

export function Select({ label, erreur, aide, succes, obligatoire, className, id: idProp, children, ...rest }: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  const auto = useId(); const id = idProp ?? auto;
  return (
    <Enveloppe {...{ id, label, erreur, aide, succes, obligatoire, className }}>
      <select id={id} className="champ appearance-none bg-[length:20px] bg-[right_14px_center] bg-no-repeat pr-11" style={{ backgroundImage: CHEVRON }} aria-invalid={!!erreur} aria-required={obligatoire} aria-describedby={desc(id, erreur, aide)} {...rest}>
        {children}
      </select>
    </Enveloppe>
  );
}

export const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231E1430' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

export function Textarea({ label, erreur, aide, succes, obligatoire, className, id: idProp, maxLength, value, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId(); const id = idProp ?? auto;
  const n = typeof value === 'string' ? value.length : 0;
  return (
    <Enveloppe {...{ id, label, erreur, aide, succes, obligatoire, className }}>
      <textarea id={id} className="champ min-h-[150px] resize-y" maxLength={maxLength} value={value} aria-invalid={!!erreur} aria-required={obligatoire} aria-describedby={desc(id, erreur, aide)} {...rest} />
      {maxLength && <span className="pointer-events-none absolute bottom-3 right-4 text-xs font-bold text-noir/60" aria-live="off">{n}/{maxLength}</span>}
    </Enveloppe>
  );
}

export function Checkbox({ label, erreur, checked, onChange, id: idProp, className, obligatoire, ...rest }: Omit<Base, 'aide' | 'succes'> & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId(); const id = idProp ?? auto;
  return (
    <div className={className}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input id={id} type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" aria-invalid={!!erreur} aria-required={obligatoire} aria-describedby={erreur ? `${id}-err` : undefined} {...rest} />
        <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-[3px] border-noir bg-white transition peer-checked:bg-rose peer-focus-visible:ring-[3px] peer-focus-visible:ring-jaune">
          {checked && <svg viewBox="0 0 16 16" className="h-3.5 w-3.5"><path d="M3 8.5 6.5 12 13 4" fill="none" stroke="#1E1430" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </span>
        <span className="leading-snug">{label}</span>
      </label>
      <p id={`${id}-err`} aria-live="polite" className={cx('flex items-center gap-1.5 text-sm font-bold text-bordeaux', erreur ? 'mt-1.5' : 'sr-only')}>
        {erreur && <><AlertCircle size={16} strokeWidth={2.5} aria-hidden /> {erreur}</>}
      </p>
    </div>
  );
}

export function FileUpload({ label, onFichier, erreur, aide }: { label: string; onFichier: (f: File | null) => void; erreur?: string | null; aide?: string }) {
  const id = useId();
  const [apercu, setApercu] = useState<string | null>(null);
  const [nom, setNom] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const choisir = (f: File | null) => {
    setErr(null);
    if (f && f.size > 5 * 1024 * 1024) { setErr('Image trop lourde : 5 Mo maximum.'); onFichier(null); return; }
    if (f && !f.type.startsWith('image/')) { setErr('Merci de choisir une image.'); onFichier(null); return; }
    setNom(f?.name ?? '');
    setApercu(f ? URL.createObjectURL(f) : null);
    onFichier(f);
  };
  const e = erreur ?? err;
  return (
    <div>
      <span className="etiquette" id={`${id}-l`}>{label}</span>
      {apercu ? (
        <div className="flex items-center gap-4 rounded-[14px] border-[3px] border-noir bg-white p-3">
          <img src={apercu} alt="Aperçu de la photo du chien" className="h-16 w-16 rounded-xl border-2 border-noir object-cover" />
          <span className="flex-1 truncate text-sm font-semibold">{nom}</span>
          <button type="button" onClick={() => choisir(null)} className="grid h-11 w-11 place-items-center rounded-full border-[3px] border-noir" aria-label="Retirer la photo"><X size={18} strokeWidth={2.5} /></button>
        </div>
      ) : (
        <label htmlFor={id} className="flex min-h-[88px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[14px] border-[3px] border-dashed border-noir bg-white p-4 text-center transition hover:bg-jaune/30">
          <Upload size={22} strokeWidth={2.5} aria-hidden />
          <span className="font-bold">Choisir une photo</span>
          {aide && <span className="text-sm text-noir/70">{aide}</span>}
        </label>
      )}
      <input id={id} type="file" accept="image/*" className="sr-only" aria-labelledby={`${id}-l`} onChange={(ev) => choisir(ev.target.files?.[0] ?? null)} />
      <p aria-live="polite" className={cx('flex items-center gap-1.5 text-sm font-bold text-bordeaux', e ? 'mt-1.5' : 'sr-only')}>
        {e && <><AlertCircle size={16} strokeWidth={2.5} aria-hidden /> {e}</>}
      </p>
    </div>
  );
}
