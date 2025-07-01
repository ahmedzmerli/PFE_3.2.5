// import { Component, OnInit, ElementRef } from '@angular/core';
// import { ROUTES } from '../sidebar/sidebar.component';
// import { Location } from '@angular/common';
// import { Router, Event } from '@angular/router';
// import { AuthService } from 'src/app/services/auth.service';
// import { ConfirmationService } from 'primeng/api';
// import { TokenService } from 'src/app/services/token.service';
//
// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//
// })
// export class NavbarComponent implements OnInit {
//   listTitles: any[] = [];
//   location: Location;
//   mobile_menu_visible = 0;
//   private toggleButton: any;
//   private sidebarVisible = false;
//   userName: string | null = null;
//
//   constructor(private authService: AuthService , location: Location, private element: ElementRef, private router: Router,
//     private confirmationService: ConfirmationService, private tokenService: TokenService,
//   ) {
//     this.location = location;
//
//   }
//
//   ngOnInit(): void {
//     this.userName = this.tokenService.getFullName();
//     this.listTitles = ROUTES.filter(listTitle => listTitle);
//     const navbar: HTMLElement = this.element.nativeElement;
//     this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
//
//     this.router.events.subscribe((event: Event) => {
//       this.sidebarClose();
//       const layers = document.getElementsByClassName('close-layer');
//       if (layers.length > 0) {
//         layers[0].remove();
//         this.mobile_menu_visible = 0;
//       }
//     });
//   }
//
//   sidebarOpen(): void {
//     const body = document.getElementsByTagName('body')[0];
//     setTimeout(() => {
//       this.toggleButton?.classList.add('toggled');
//     }, 500);
//
//     body.classList.add('nav-open');
//     this.sidebarVisible = true;
//   }
//
//   sidebarClose(): void {
//     const body = document.getElementsByTagName('body')[0];
//     this.toggleButton?.classList.remove('toggled');
//     body.classList.remove('nav-open');
//     this.sidebarVisible = false;
//   }
//
//   sidebarToggle(): void {
//     const body = document.getElementsByTagName('body')[0];
//     const toggle = document.getElementsByClassName('navbar-toggler')[0];
//
//     if (this.sidebarVisible === false) {
//       this.sidebarOpen();
//     } else {
//       this.sidebarClose();
//     }
//
//     if (this.mobile_menu_visible === 1) {
//       body.classList.remove('nav-open');
//       const layers = document.getElementsByClassName('close-layer');
//       if (layers.length > 0) {
//         layers[0].remove();
//       }
//
//       setTimeout(() => {
//         toggle.classList.remove('toggled');
//       }, 400);
//
//       this.mobile_menu_visible = 0;
//     } else {
//       setTimeout(() => {
//         toggle.classList.add('toggled');
//       }, 430);
//
//       const layer = document.createElement('div');
//       layer.setAttribute('class', 'close-layer');
//
//       const mainPanel = document.getElementsByClassName('main-panel');
//       if (mainPanel.length > 0) {
//         mainPanel[0].appendChild(layer);
//       } else {
//         const wrapper = document.getElementsByClassName('wrapper-full-page');
//         if (wrapper.length > 0) {
//           wrapper[0].appendChild(layer);
//         }
//       }
//
//       setTimeout(() => {
//         layer.classList.add('visible');
//       }, 100);
//
//       layer.onclick = () => {
//         body.classList.remove('nav-open');
//         this.mobile_menu_visible = 0;
//         layer.classList.remove('visible');
//         setTimeout(() => {
//           layer.remove();
//           toggle.classList.remove('toggled');
//         }, 400);
//       };
//
//       body.classList.add('nav-open');
//       this.mobile_menu_visible = 1;
//     }
//   }
//
//   getTitle(): string {
//     let title = this.location.prepareExternalUrl(this.location.path());
//     if (title.charAt(0) === '#') {
//       title = title.slice(1);
//     }
//
//     for (let item = 0; item < this.listTitles.length; item++) {
//       if (this.listTitles[item].path === title) {
//         return this.listTitles[item].title;
//       }
//     }
//     return 'Dashboard';
//   }
//
//
//   confirmLogout(): void {
//     this.confirmationService.confirm({
//       message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
//       header: 'Déconnexion',
//       icon: 'pi pi-exclamation-triangle',
//       acceptLabel: 'Oui',
//       rejectLabel: 'Non',
//       acceptButtonStyleClass: 'p-button-danger',
//       accept: () => this.logout()
//     });
//   }
//
//
//   logout(): void {
//          // Nettoie le token
//     this.tokenService.logout();     // Double sécurité
//     this.router.navigate(['/login']).then(() => {
//       window.location.reload();     // Rechargement propre
//     });
//   }
//
//
//
//
//
// }
