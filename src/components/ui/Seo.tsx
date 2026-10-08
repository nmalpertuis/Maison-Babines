import { Helmet } from 'react-helmet-async';

export function Seo({ titre, description, image = '/images/occasions/mariage.webp', jsonLd }: { titre: string; description: string; image?: string; jsonLd?: object | object[] }) {
  return (
    <Helmet>
      <title>{titre}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={titre} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fr_FR" />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
