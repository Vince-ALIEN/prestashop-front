'use client';
import Link from "next/link";
import { ShoppingBag, User, Search, Globe } from "lucide-react";
import { useCart } from "@/app/hooks/useCart";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Calcul du nombre total d'articles avec types explicites
  const cartItemCount = cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="shrink-0">
          <Link href="/" className="text-2xl font-extrabold text-gray-800">
            Mon<span className="text-blue-600 font-light">Shop</span>
          </Link>
        </div>

        {/* Menu de navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/products"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Produits
          </Link>
          <Link
            href="/categories"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Catégories
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            À propos
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Barre de recherche et icônes */}
        <div className="flex items-center space-x-4">
          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>

          {/* Icônes utilisateur */}
          <div className="flex space-x-1">
            {/* Compte utilisateur */}
            <button
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => router.push('/account')}
            >
              <User className="h-6 w-6" />
            </button>

            {/* Sélection de langue */}
            <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Globe className="h-6 w-6" />
            </button>

            {/* Panier avec badge dynamique */}
            <Link
              href="/cart"
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Menu mobile (hamburger) */}
          <div className="md:hidden">
            <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <div className="md:hidden px-4 pb-2">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
