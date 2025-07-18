import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from './service/layout.service';
import { AppConfigurator } from './app.configurator';
import { TokenService } from '../services/token.service'; // 👉 adapter selon ton chemin
import Swal from 'sweetalert2'; // 👉 SweetAlert2

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
  template: `
    <div class="layout-topbar">
      <div class="layout-topbar-logo-container">
        <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
          <i class="pi pi-bars"></i>
        </button>
        <a class="layout-topbar-logo" routerLink="/">
          <img src="assets/img/ooredoo-logo.png" alt="Ooredoo" width="130" height="40" />
        </a>
      </div>

      <div class="layout-topbar-actions">
        <div class="layout-config-menu">
          <div class="relative">
            <app-configurator />
          </div>
        </div>

        <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next"
          enterFromClass="hidden" enterActiveClass="animate-scalein"
          leaveToClass="hidden" leaveActiveClass="animate-fadeout"
          [hideOnOutsideClick]="true">
          <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu hidden lg:block">
          <div class="layout-topbar-menu-content">
            <button type="button" class="layout-topbar-action" (click)="confirmLogout()">
              <i class="pi pi-sign-out"></i>


            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppTopbar {
  items!: MenuItem[];

  constructor(
    public layoutService: LayoutService,
    private tokenService: TokenService,
    private router: Router
  ) {}

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
