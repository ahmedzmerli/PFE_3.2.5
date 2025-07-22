import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'token';
  private readonly FULL_NAME_KEY = 'fullName';

  // 🔐 Récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ✅ Enregistrer le token et le nom complet
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.fullName) {
        localStorage.setItem(this.FULL_NAME_KEY, decoded.fullName);
      }
    } catch {
      // ignore malformed token
    }
  }

  // ❌ Supprimer le token et le nom
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
  }

  // 📆 Vérifier si le token est encore valide
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return Date.now() < decoded.exp * 1000;
    } catch (e) {
      return false;
    }
  }

  // 🔎 Récupérer les rôles (ex: ADMIN, USER)
  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded: any = jwtDecode(token);
      return decoded.roles || [];
    } catch {
      return [];
    }
  }

  hasRole(roleName: string): boolean {
    return this.getRoles().includes(roleName);
  }

  // 🔐 Récupérer les permissions (ex: users.read)
  getAuthorities(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded: any = jwtDecode(token);
      return decoded.authorities || [];
    } catch {
      return [];
    }
  }

  hasAuthority(prefix: string): boolean {
    return this.getAuthorities().some(a => a.startsWith(prefix));
  }

  // 👤 Récupérer le nom complet sauvegardé
  getFullName(): string | null {
    return localStorage.getItem(this.FULL_NAME_KEY);
  }

// 📧 Récupérer l'email de l'utilisateur depuis le JWT
getEmail(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.sub || decoded.email || null; // selon ton backend
  } catch {
    return null;
  }
}

}
