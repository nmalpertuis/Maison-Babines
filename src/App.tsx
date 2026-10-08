import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastProvider } from './components/ui/Toast';
import { router } from './router';

export default function App() {
  return (
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <CartProvider>
          <FavoritesProvider>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </FavoritesProvider>
        </CartProvider>
      </MotionConfig>
    </HelmetProvider>
  );
}
