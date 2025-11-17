# 📚 PrestaShop 9 REST API - Documentation Projet Headless

> Documentation complète pour l'intégration PrestaShop 9 + Next.js  
> **Projet** : UFO Agency - Frontend Headless  
> **Date** : Novembre 2025  
> **Version PrestaShop** : 9.x

---

## 🎯 Table des matières

1. [Contexte et Architecture](#contexte-et-architecture)
2. [Types d'APIs disponibles](#types-dapis-disponibles)
3. [Endpoints essentiels par priorité](#endpoints-essentiels-par-priorité)
4. [Architecture de sécurité](#architecture-de-sécurité)
5. [Implémentation recommandée](#implémentation-recommandée)
6. [Exemples de code](#exemples-de-code)
7. [Checklist d'implémentation](#checklist-dimplémentation)
8. [Problèmes connus et solutions](#problèmes-connus-et-solutions)

---

## 🏗️ Contexte et Architecture

### Objectif
Créer un frontend Next.js moderne qui consomme les données PrestaShop 9 via son API REST, permettant :
- Affichage catalogue produits
- Gestion panier visiteur
- Tunnel de commande complet
- Espace client authentifié

### Stack Technique
```
Frontend : Next.js 16 + React 19 + TypeScript
Backend : PrestaShop 9 (API REST)
Auth : OAuth2 / JWT
Hébergement : [À compléter]
```

---

## 🔐 Types d'APIs disponibles

### 1. API d'Administration (OAuth2)
**URL** : `https://votre-boutique.com/api/`  
**Auth** : OAuth2 Client Credentials  
**Usage** : Toutes les opérations CRUD sur les ressources PrestaShop

⚠️ **ATTENTION** : Cette API donne accès COMPLET au backoffice
- À utiliser **uniquement côté serveur** (API Routes Next.js)
- **JAMAIS exposer** les credentials OAuth2 côté client

**Documentation officielle** :  
https://devdocs.prestashop-project.org/9/webservice/

---

### 2. API Front-Office (publique/semi-publique)
**Statut** : ❌ **Non officiellement documentée dans PrestaShop 9**

PrestaShop 9 ne fournit pas d'API Front distincte comme Shopify ou WooCommerce.  
**Toutes les requêtes passent par l'API Admin**, même pour des données publiques.

**Solutions possibles** :
1. **Proxy via API Routes Next.js** (recommandé)
2. **Endpoints publics configurés** (si disponible)
3. **Module custom PrestaShop** (développement spécifique)

---

## 🎯 Endpoints essentiels par priorité

### 🔴 CRITIQUES (Phase 1 - MVP)

#### Products
```http
GET /api/products
GET /api/products/{id}
GET /api/products?category={id}&limit=20&page=1
GET /api/products?search={query}
```
**Données retournées** : 
- Informations produit (nom, description, prix)
- Images (principale + galerie)
- Stock disponible
- Attributs et options (taille, couleur...)
- Prix promotionnels
- Descriptions multilingues

**Usage** :
- Page listing produits
- Page détail produit
- Recherche
- Filtres

---

#### Categories
```http
GET /api/categories
GET /api/categories/{id}
GET /api/categories/{id}/products
```
**Données retournées** :
- Arborescence complète
- Nom, description, image
- Produits associés

**Usage** :
- Menu de navigation
- Pages catégories
- Breadcrumb
- Filtres

---

#### Cart
```http
POST /api/carts                          # Créer un panier
GET /api/carts/{id}                      # Récupérer le panier
PUT /api/carts/{id}                      # Mettre à jour
POST /api/carts/{id}/products            # Ajouter produit
PATCH /api/carts/{id}/products/{prod_id} # Modifier quantité
DELETE /api/carts/{id}/products/{prod_id}# Supprimer produit
```
**Gestion session** :
- Créer un panier pour visiteur anonyme
- Stocker `cart_id` en cookie/localStorage
- Associer au client lors du login

**Usage** :
- Ajouter au panier
- Page panier
- Compteur panier header
- Calcul total avec frais

---

### 🟠 IMPORTANTS (Phase 2 - E-commerce complet)

#### Customers & Authentication
```http
POST /api/customers                      # Inscription
GET /api/customers/{id}                  # Profil client
PUT /api/customers/{id}                  # Mise à jour profil
DELETE /api/customers/{id}               # Suppression compte

POST /api/auth/login                     # Login (OAuth2)
POST /api/auth/logout                    # Déconnexion
GET /api/customers/me                    # Profil client connecté
```
**Flow d'authentification** :
1. Client saisit email/password
2. Next.js API route → PrestaShop OAuth2
3. Récupération access_token + refresh_token
4. Stockage sécurisé (httpOnly cookie)
5. Utilisation token pour requêtes authentifiées

---

#### Orders
```http
POST /api/orders                         # Créer commande
GET /api/orders/{id}                     # Détails commande
GET /api/customers/{id}/orders           # Historique commandes
PUT /api/orders/{id}                     # Mettre à jour (admin)
```
**Données nécessaires** :
- `id_cart`
- `id_customer`
- `id_address_delivery`
- `id_address_invoice`
- `id_carrier`
- `payment_method`
- `total_paid`

**Usage** :
- Validation du panier
- Confirmation commande
- Page "Mes commandes"
- Tracking

---

#### Addresses
```http
GET /api/customers/{id}/addresses        # Adresses client
POST /api/addresses                      # Ajouter adresse
PUT /api/addresses/{id}                  # Modifier
DELETE /api/addresses/{id}               # Supprimer
```
**Champs requis** :
- `id_customer`
- `alias` (ex: "Domicile", "Travail")
- `firstname`, `lastname`
- `address1`, `postcode`, `city`
- `id_country`, `id_state` (optionnel)
- `phone` ou `phone_mobile`

---

#### Carriers (Transporteurs)
```http
GET /api/carriers
GET /api/carriers/{id}
GET /api/carriers?id_zone={zone_id}
```
**Données retournées** :
- Nom transporteur
- Délai livraison
- Coût (selon zone/poids)
- Logo

**Usage** :
- Sélection mode de livraison au checkout
- Calcul frais de port

---

#### Countries & States
```http
GET /api/countries
GET /api/countries/{id}
GET /api/states?id_country={id}
```
**Usage** :
- Formulaire d'adresse
- Validation code postal
- Calcul frais de port par zone

---

### 🟡 OPTIONNELS (Phase 3 - Fonctionnalités avancées)

#### Product Combinations (Variantes)
```http
GET /api/products/{id}/combinations
GET /api/combinations/{id}
```
**Usage** :
- Sélecteur taille/couleur
- Prix variant selon combinaison
- Stock par variante

---

#### Manufacturers (Marques)
```http
GET /api/manufacturers
GET /api/manufacturers/{id}
GET /api/manufacturers/{id}/products
```
**Usage** :
- Page marques
- Filtres par marque
- Logo fabricant sur fiche produit

---

#### CMS Pages
```http
GET /api/cms
GET /api/cms/{id}
```
**Usage** :
- CGV, mentions légales
- Page "À propos"
- FAQ

---

#### Product Images
```http
GET /api/products/{id}/images
GET /api/images/products/{id}/{image_id}
```
**Note** : Généralement inclus dans `GET /api/products/{id}`

---

#### Currencies (Devises)
```http
GET /api/currencies
GET /api/currencies/{id}
```
**Usage** : Site multi-devises

---

#### Languages
```http
GET /api/languages
GET /api/languages/{id}
```
**Usage** : Site multilingue (ou géré dans Next.js)

---

#### Vouchers / Cart Rules (Codes promo)
```http
GET /api/cart-rules
GET /api/cart-rules/{code}
POST /api/carts/{id}/vouchers
DELETE /api/carts/{id}/vouchers/{voucher_id}
```
**Usage** :
- Champ code promo au checkout
- Affichage réduction

---

#### Product Reviews (Avis)
```http
GET /api/products/{id}/reviews
POST /api/product-comments
PUT /api/product-comments/{id}
DELETE /api/product-comments/{id}
```
**Alternative** : Service tiers (Trustpilot, Avis Vérifiés)

---

#### Wishlists (Listes de souhaits)
```http
GET /api/customers/{id}/wishlist
POST /api/wishlists
POST /api/wishlists/{id}/products
DELETE /api/wishlists/{id}/products/{product_id}
```
**Nécessite** : Gestion auth complexe

---

## 🔒 Architecture de sécurité

### ❌ Architecture NON SÉCURISÉE (à éviter)
```
Frontend Next.js (navigateur)
    ↓ (credentials OAuth2 exposés)
PrestaShop API
```
**Problèmes** :
- Credentials OAuth2 visibles dans le code source
- Tokens accessibles via DevTools
- CORS à configurer
- Pas de rate limiting
- Pas de cache

---

### ✅ Architecture RECOMMANDÉE
```
Frontend Next.js (navigateur)
    ↓ (requêtes HTTP classiques)
API Routes Next.js (/app/api/*)
    ↓ (OAuth2 côté serveur)
PrestaShop Admin API
```

**Avantages** :
- ✅ Credentials OAuth2 **côté serveur uniquement**
- ✅ Pas de CORS (même domaine)
- ✅ Cache intégré (Next.js)
- ✅ Rate limiting possible
- ✅ Transformation des données
- ✅ Gestion d'erreurs centralisée

---

### Structure des API Routes

```
app/api/
├── products/
│   ├── route.ts              # GET /api/products
│   └── [id]/
│       └── route.ts          # GET /api/products/[id]
├── categories/
│   └── route.ts              # GET /api/categories
├── cart/
│   ├── route.ts              # POST /api/cart (create)
│   └── [id]/
│       ├── route.ts          # GET/PUT /api/cart/[id]
│       └── products/
│           └── route.ts      # POST/DELETE /api/cart/[id]/products
├── auth/
│   ├── login/
│   │   └── route.ts          # POST /api/auth/login
│   └── logout/
│       └── route.ts          # POST /api/auth/logout
├── orders/
│   └── route.ts              # POST /api/orders
└── customers/
    └── me/
        └── route.ts          # GET /api/customers/me
```

---

## 💻 Implémentation recommandée

### Configuration OAuth2 PrestaShop

**Fichier** : `.env.local`
```env
# PrestaShop API
PRESTASHOP_API_URL=https://votre-boutique.com/api
PRESTASHOP_CLIENT_ID=your_client_id
PRESTASHOP_CLIENT_SECRET=your_client_secret

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

---

### Client API PrestaShop

**Fichier** : `src/lib/prestashop/client.ts`
```typescript
interface PrestashopConfig {
  baseURL: string;
  clientId: string;
  clientSecret: string;
}

class PrestashopClient {
  private config: PrestashopConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: PrestashopConfig) {
    this.config = config;
  }

  /**
   * Obtenir un access token via OAuth2
   */
  private async getAccessToken(): Promise<string> {
    // Vérifier si le token est encore valide
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch(`${this.config.baseURL}/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 min marge

    return this.accessToken;
  }

  /**
   * Requête générique vers l'API PrestaShop
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PrestaShop API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Méthodes helper
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Instance unique (singleton)
export const prestashopClient = new PrestashopClient({
  baseURL: process.env.PRESTASHOP_API_URL!,
  clientId: process.env.PRESTASHOP_CLIENT_ID!,
  clientSecret: process.env.PRESTASHOP_CLIENT_SECRET!,
});
```

---

### Endpoints spécifiques

**Fichier** : `src/lib/prestashop/endpoints/products.ts`
```typescript
import { prestashopClient } from '../client';
import type { Product, ProductsResponse } from '../types/product.types';

export const productsAPI = {
  /**
   * Liste tous les produits
   */
  async getAll(params?: {
    category?: number;
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.category) searchParams.set('category', params.category.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return prestashopClient.get(`/products${query ? `?${query}` : ''}`);
  },

  /**
   * Récupère un produit par ID
   */
  async getById(id: number): Promise<Product> {
    return prestashopClient.get(`/products/${id}`);
  },

  /**
   * Récupère les produits d'une catégorie
   */
  async getByCategory(categoryId: number): Promise<ProductsResponse> {
    return prestashopClient.get(`/categories/${categoryId}/products`);
  },
};
```

---

### API Route Next.js (exemple)

**Fichier** : `app/api/products/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { productsAPI } from '@/lib/prestashop/endpoints/products';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const params = {
      category: searchParams.get('category') 
        ? parseInt(searchParams.get('category')!) 
        : undefined,
      limit: searchParams.get('limit') 
        ? parseInt(searchParams.get('limit')!) 
        : 20,
      page: searchParams.get('page') 
        ? parseInt(searchParams.get('page')!) 
        : 1,
      search: searchParams.get('search') || undefined,
    };

    const products = await productsAPI.getAll(params);

    // Cache pendant 5 minutes
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

---

### Utilisation côté client

**Fichier** : `app/products/page.tsx`
```typescript
'use client';

import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?limit=20');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}€</p>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ Checklist d'implémentation

### Phase 1 - MVP (2-3 semaines)
- [ ] Configuration OAuth2 PrestaShop
- [ ] Client API avec gestion tokens
- [ ] API Routes : Products (list, detail)
- [ ] API Routes : Categories
- [ ] API Routes : Cart (create, add, remove, update)
- [ ] Pages : Listing produits
- [ ] Pages : Fiche produit
- [ ] Pages : Panier
- [ ] Composant : Header avec compteur panier

### Phase 2 - E-commerce complet (2-3 semaines)
- [ ] API Routes : Auth (login, logout)
- [ ] API Routes : Customers (profile, update)
- [ ] API Routes : Addresses (CRUD)
- [ ] API Routes : Carriers (list)
- [ ] API Routes : Orders (create, list)
- [ ] Pages : Login / Inscription
- [ ] Pages : Mon compte
- [ ] Pages : Mes adresses
- [ ] Pages : Checkout (étapes)
- [ ] Pages : Confirmation commande
- [ ] Pages : Mes commandes
- [ ] Système de sessions / cookies

### Phase 3 - Optimisations (1-2 semaines)
- [ ] API Routes : CMS Pages
- [ ] API Routes : Countries / States
- [ ] Cache Redis/Vercel (produits, catégories)
- [ ] Rate limiting
- [ ] Gestion erreurs globale
- [ ] Monitoring / logs
- [ ] SEO (metadata, sitemap)
- [ ] Images optimisées (next/image)

### Phase 4 - Features bonus (optionnel)
- [ ] API Routes : Manufacturers
- [ ] API Routes : Product Reviews
- [ ] API Routes : Wishlists
- [ ] API Routes : Vouchers
- [ ] Pages : Marques
- [ ] Composant : Avis produits
- [ ] Composant : Wishlist
- [ ] Multi-devises
- [ ] Multi-langues

---

## ⚠️ Problèmes connus et solutions

### 1. PrestaShop 9 - Pas d'API Front distincte
**Problème** : Toutes les requêtes nécessitent OAuth2, même pour des données publiques.

**Solution** : Architecture avec API Routes Next.js (voir ci-dessus)

---

### 2. Gestion des sessions panier
**Problème** : Comment lier un panier visiteur anonyme à un client connecté ?

**Solution** :
1. Créer panier avec `POST /api/carts` (sans id_customer)
2. Stocker `cart_id` en cookie
3. Lors du login : `PUT /api/carts/{id}` avec `id_customer`

---

### 3. Images produits - URLs
**Problème** : URLs des images retournées par l'API peuvent être relatives ou incorrectes.

**Solution** :
```typescript
function getImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `${process.env.PRESTASHOP_BASE_URL}${imagePath}`;
}
```

---

### 4. Prix avec ou sans taxes
**Problème** : PrestaShop retourne `price` et `price_ttc`.

**Solution** : Toujours afficher `price_ttc` (avec taxes) côté client B2C.

---

### 5. Stock produit
**Problème** : Vérifier disponibilité avant ajout panier.

**Solution** :
```typescript
if (product.quantity <= 0) {
  throw new Error('Produit en rupture de stock');
}
```

---

### 6. Performances - Requêtes nombreuses
**Problème** : Une page produit peut nécessiter plusieurs appels API.

**Solution** :
- Cache Next.js (5-10 minutes pour données peu volatiles)
- Redis pour cache partagé
- Revalidation ISR pour pages statiques

---

### 7. CORS (si appel direct depuis le front)
**Problème** : Erreurs CORS si appel direct à PrestaShop.

**Solution** : Toujours passer par API Routes Next.js (même domaine).

---

### 8. Tokens expirés
**Problème** : Access token OAuth2 expire (généralement 1h).

**Solution** : Le client gère automatiquement le refresh (voir code `client.ts`).

---

## 📚 Ressources

### Documentation officielle
- **PrestaShop 9 REST API** : https://devdocs.prestashop-project.org/9/webservice/
- **OAuth2 PrestaShop** : https://devdocs.prestashop-project.org/9/webservice/authentication/
- **Next.js API Routes** : https://nextjs.org/docs/app/building-your-application/routing/route-handlers

### Modules PrestaShop utiles
- **prestashop-rest** (binshops) : ⚠️ Non recommandé en production
- **PrestaShop Webservice** (natif) : Déprécié (XML)

### Alternatives
- **Strapi** : CMS headless pour contenus marketing
- **Algolia / Meilisearch** : Recherche performante
- **Stripe / PayPal** : Paiements (intégrer directement)

---

## 📝 Notes finales

Ce document est évolutif. À mettre à jour au fur et à mesure :
- [ ] Ajouter exemples TypeScript types complets
- [ ] Documenter flow authentification détaillé
- [ ] Ajouter schémas d'architecture (diagrammes)
- [ ] Benchmarks performances
- [ ] Guide de déploiement production

---

**Dernière mise à jour** : Novembre 2025  
**Contact** : Vincent - UFO Agency
