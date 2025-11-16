'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import './globals.css';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <Header />
            <main>{children}</main>
          </CartProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
