import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { cx } from '@/lib/format';

export interface Miette { label: string; to?: string }

/** Fil d'Ariane + données structurées BreadcrumbList. */
export function Breadcrumb({ miettes, clair }: { miettes: Miette[]; clair?: boolean }) {
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: miettes.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.label, ...(m.to ? { item: `${location.origin}${m.to}` } : {}) })),
  };
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm font-semibold">
      <Helmet><script type="application/ld+json">{JSON.stringify(jsonLd)}</script></Helmet>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {miettes.map((m, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="opacity-60">/</span>}
            {m.to ? <Link to={m.to} className={cx('underline-offset-2 hover:underline', clair ? 'text-creme' : '')}>{m.label}</Link> : <span aria-current="page" className="opacity-80">{m.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
