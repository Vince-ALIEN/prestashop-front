interface PrestashopConfig {
  baseURL: string;
  clientId: string;
  clientSecret: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class PrestashopClient {
  private config: PrestashopConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: PrestashopConfig) {
    this.config = config;
  }

  /**
   * Obtenir un access token via OAuth2 (côté serveur uniquement)
   */
  private async getAccessToken(): Promise<string> {
    // Vérifier si le token est encore valide (avec 1 min de marge)
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch(`${this.config.baseURL}/admin-api/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        scope: 'product_read category_read',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
    }

    const data: TokenResponse = await response.json();
    this.accessToken = data.access_token;
    // Expire 1 minute avant l'expiration réelle pour éviter les erreurs
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;

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

    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.config.baseURL}/admin-api${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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

  post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Validation des variables d'environnement
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Instance unique (singleton) - NE JAMAIS importer côté client
export const prestashopClient = new PrestashopClient({
  baseURL: getEnvVar('PRESTASHOP_API_URL'),
  clientId: getEnvVar('PRESTASHOP_CLIENT_ID'),
  clientSecret: getEnvVar('PRESTASHOP_CLIENT_SECRET'),
});

export type { PrestashopConfig };
