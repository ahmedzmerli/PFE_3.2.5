import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    if (this.tokenService.isTokenValid() && this.tokenService.hasRole('ADMIN')) {
      return true;
    }

    this.router.navigate(['/forbidden']); // ou '/login'
    return false;
  }
}
