import {Component, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  showPasswordModal = false;
  oldPassword = '';
  newPassword = '';
  loading = false;
  constructor(private router: Router, public tokenService: TokenService , public authService: AuthService) {}

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

openPasswordModal() {
    this.oldPassword = '';
    this.newPassword = '';
    this.showPasswordModal = true;
  }

  
  submitPasswordChange() {
    this.loading = true;
    this.authService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.showPasswordModal = false;
        Swal.fire('Succès', 'Mot de passe changé avec succès', 'success');
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Erreur', err.error.message || 'Erreur lors du changement de mot de passe', 'error');
      }
    });
  }


}


