import {Component, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  constructor(private router: Router, public tokenService: TokenService) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    // Exemple si tu as un TokenService :
    localStorage.clear(); // ou this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }

  confirmLogout() {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Voulez-vous vraiment vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, se déconnecter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tokenService.logout();
        this.router.navigate(['/login']);
        Swal.fire({
          icon: 'success',
          title: 'Déconnecté',
          text: 'Vous avez été déconnecté avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
}
