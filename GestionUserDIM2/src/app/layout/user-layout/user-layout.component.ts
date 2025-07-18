// import { Component, OnInit, ViewChild } from '@angular/core';
// import { Observable } from 'rxjs';
// import { PermissionList } from 'src/app/models/permission-list.model';
// import { PermissionModalService } from 'src/app/services/serviceModals/PermissionModalService';
//
// @Component({
//   selector: 'app-user-layout',
//   templateUrl: './user-layout.component.html',
//   styleUrls: ['./user-layout.component.scss']
// })
// export class UserLayoutComponent implements OnInit  {
//   showListModal$!: Observable<boolean>;
//   isEditMode: boolean = false;
//   selectedPermissionList?: PermissionList;
//   @ViewChild('permissionListModalComponent') permissionListModalComponent: any;
//
//
//   constructor(public permissionModalService: PermissionModalService){}
//   ngOnInit(): void {
//     this.showListModal$ = this.permissionModalService.showListModal$;
//   }
//
//
//   // Pour que les autres composants (comme permission-list-management) puissent appeler ça :
//   setPermissionListModalData(edit: boolean, data?: PermissionList) {
//     this.isEditMode = edit;
//     this.selectedPermissionList = data;
//   }
//
//   get permissionListModalTitle(): string {
//     return this.isEditMode ? 'Modifier une liste de permissions' : 'Créer une nouvelle liste';
//   }
//   onListUpdated(): void {
//     // Réinitialise le mode
//     this.isEditMode = false;
//     this.selectedPermissionList = undefined;
//   }
//
//   ngAfterViewInit(): void {
//     const native = document.querySelector('app-admin-layout');
//     if (native) {
//       (native as any).component = this;
//     }
//   }
//   onRoleUpdated(): void {
//     // On peut recharger la liste ou simplement fermer le modal
//     this.permissionModalService.closeRoleModal();
//
//     // Réinitialiser les données du rôle si en édition
//     this.isEditMode = false;
//     this.selectedPermissionList = undefined;
//   }
//
//
// }
