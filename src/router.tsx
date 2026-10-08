import { lazy, Suspense } from 'react';
import { Chargement } from './components/layout/Chargement';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';

const Catalogue = lazy(() => import('./pages/Catalogue'));
const Product = lazy(() => import('./pages/Product'));
const Expertise = lazy(() => import('./pages/Expertise'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Faq = lazy(() => import('./pages/Faq'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const SizeGuide = lazy(() => import('./pages/SizeGuide'));
const MentionsLegales = lazy(() => import('./pages/Legal/MentionsLegales'));
const Conditions = lazy(() => import('./pages/Legal/Conditions'));
const Confidentialite = lazy(() => import('./pages/Legal/Confidentialite'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Admin = lazy(() => import('./crm/Admin'));
const Strategie = lazy(() => import('./strategie/Strategie'));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/catalogue', element: <Catalogue /> },
      { path: '/produit/:slug', element: <Product /> },
      { path: '/expertise', element: <Expertise /> },
      { path: '/avis', element: <Reviews /> },
      { path: '/faq', element: <Faq /> },
      { path: '/contact', element: <Contact /> },
      { path: '/malle', element: <Cart /> },
      { path: '/malle/reservation', element: <Checkout /> },
      { path: '/confirmation', element: <Confirmation /> },
      { path: '/guide-des-tailles', element: <SizeGuide /> },
      { path: '/mentions-legales', element: <MentionsLegales /> },
      { path: '/conditions-de-location', element: <Conditions /> },
      { path: '/confidentialite', element: <Confidentialite /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/strategie', element: <Suspense fallback={<Chargement />}><Strategie /></Suspense> },
  { path: '/admin/*', element: <Suspense fallback={<Chargement />}><Admin /></Suspense> },
]);
