import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from './service/layout.service';
import { AppConfigurator } from './app.configurator';
import { TokenService } from '../services/token.service';
import Swal from 'sweetalert2';

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

      <div class="layout-topbar-center">
        <div class="welcome-section">
          <div class="welcome-text">
            <span class="greeting">Bienvenue</span>
            <span class="user-name">{{ getUserName() }}</span>
          </div>
        </div>
      </div>

      <div class="layout-topbar-actions">
        <div class="action-group">
          
          
          <div class="layout-config-menu">
            <app-configurator />
          </div>

          

          <button class="logout-btn layout-topbar-action" (click)="confirmLogout()" title="Se déconnecter">
            <i class="pi pi-sign-out"></i>
            <span class="logout-text">Déconnexion</span>
          </button>
        </div>

        <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next"
          enterFromClass="hidden" enterActiveClass="animate-scalein"
          leaveToClass="hidden" leaveActiveClass="animate-fadeout"
          [hideOnOutsideClick]="true">
          <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu hidden lg:block">
          <div class="layout-topbar-menu-content">
            
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

  getUserName(): string {
    return this.tokenService.getFullName() || 'Utilisateur';
  }

  getUserInitials(): string {
    const fullName = this.getUserName();
    return fullName.split(' ').map(name => name.charAt(0)).join('').toUpperCase().substring(0, 2);
  }

  confirmLogout() {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Voulez-vous vraiment vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e60000',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, se déconnecter',
      cancelButtonText: 'Annuler',
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.tokenService.logout();
        this.router.navigate(['/login']);
        Swal.fire({
          icon: 'success',
          title: 'Déconnecté',
          text: 'Vous avez été déconnecté avec succès.',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'custom-swal-success'
          }
        });
      }
    });
  }
}

