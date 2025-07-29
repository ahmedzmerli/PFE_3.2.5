import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <ul class="layout-menu">
      <ng-container *ngFor="let item of model; let i = index">
        <li *ngIf="!item.separator && item.visible !== false"
            app-menuitem [item]="item" [index]="i" [root]="true"></li>
        <li *ngIf="item.separator" class="menu-separator"></li>
      </ng-container>
    </ul>
  `
})
export class AppMenu implements OnInit {
  model: MenuItem[] = [];

  ngOnInit(): void {
    this.updateMenuModel();

    // 🟡 Recharger le menu si les permissions changent (ex: après login)
    window.addEventListener('permissions-updated', () => {
      this.updateMenuModel();
    });
  }

  updateMenuModel(): void {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    console.log('🔐 Permissions détectées :', permissions);

    this.model = [
      {
        items: [
          {
            label: 'Utilisateurs',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/users'],
            visible: permissions.includes('users.read')
          },
          {
            label: 'Listes de permissions',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/permission-lists'],
            visible: permissions.includes('permissionlists.read')
          },
          {
            label: 'Rôles',
            icon: 'pi pi-fw pi-id-card',
            routerLink: ['/liste-roles'],
            visible: permissions.includes('roles.read')
          },
          {
            label: 'Blacklist',
            icon: 'pi pi-fw pi-ban',
            routerLink: ['/blacklist'],
            visible: permissions.includes('blacklist.read')
          },
          {
            label: 'Historique',
            icon: 'pi pi-history',
            routerLink: ['/historique'],
            visible: permissions.includes('blhistory.read')
          },
          {
            label: 'Dashboard',
            icon: 'pi pi-chart-bar',
            routerLink: ['/dashboard'],
            visible: permissions.includes('dashboard.read')
          },
          {
            label: 'Points de vente',
            icon: 'pi pi-shop',
            routerLink: ['/pdv'],
            visible: permissions.includes('pdv.read')
          },
          {
            label: 'Historique PDV',
            icon: 'pi pi-clock',
            routerLink: ['/pdvhistory'],
            visible: permissions.includes('pdvhistory.read')
          },
          {
            label: 'Statistiques',
            icon: 'pi pi-chart-line',
            routerLink: ['/stats'],
            visible: permissions.includes('dashboard.read')
          },
          {
            label: 'Forum',
            icon: 'pi pi-chart-line',
            routerLink: ['/chat'],
            visible: permissions.includes('dashboard.read')
          }
        ]
      }
    ];

    console.log('🧭 Menu généré :', this.model);
  }
}

