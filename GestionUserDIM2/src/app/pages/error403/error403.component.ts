import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error403',
  templateUrl: './error403.component.html',
  styleUrls: ['./error403.component.scss']
})
export class Error403Component {

  constructor(
    private router: Router,
    private location: Location
  ) {}

  /**
   * Retourne l'heure actuelle formatée
   */
  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Navigue vers la page d'accueil
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Retourne à la page précédente
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Ouvre la page de contact support
   */
  contactSupport(): void {
    // Vous pouvez personnaliser cette méthode selon vos besoins
    // Par exemple, ouvrir un modal de contact ou naviguer vers une page de support
    window.open('mailto:support@ooredoo.tn?subject=Problème d\'accès - Erreur 403', '_blank');
  }
}
