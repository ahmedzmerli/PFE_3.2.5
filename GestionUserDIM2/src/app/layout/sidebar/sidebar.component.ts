// import { Component, OnInit } from '@angular/core';
// import { PermissionModalService } from 'src/app/services/serviceModals/PermissionModalService';
//
// interface RouteInfo {
//   path: string;
//   title: string;
//   icon: string;
//   class: string;
// }
//
// export const ROUTES: RouteInfo[] = [
//
//   // { path: '/register', title: 'Créer un compte', icon: 'unarchive', class: 'active-pro' },
// ];
//
// @Component({
//   selector: 'app-sidebar',
//   templateUrl: './sidebar.component.html',
//   standalone: true
// })
// export class SidebarComponent implements OnInit {
//   menuItems: RouteInfo[] = [];
//
//   constructor(private modalService: PermissionModalService) {}
//
//   ngOnInit(): void {
//     this.menuItems = ROUTES.filter(route => !!route);
//   }
//
//   isMobileMenu(): boolean {
//     return window.innerWidth <= 991;
//   }
//
//   // openPermissionModal(): void {
//   //   this.permissionModalService.openModal();
//   // }
//
//   openPermissionListModal() {
//     this.modalService.openPermissionListModal();
//   }
//
//   openRoleModal() {
//     this.modalService.openRoleModal();
//   }
//
// }
