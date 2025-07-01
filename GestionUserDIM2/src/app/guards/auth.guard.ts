import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.tokenService.isTokenValid()) {
      return true;
    }
  
    this.tokenService.logout();  // Nettoyer le token au cas où
    return this.router.parseUrl('/login');
  }
  
}
