import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PermissionList } from 'src/app/models/permission-list.model';
import { Role } from 'src/app/models/role.model';
import { PermissionModalService } from 'src/app/services/serviceModals/PermissionModalService';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {

  // 🔹 Permission List Modal
  showListModal$!: Observable<boolean>;
  isEditMode: boolean = false;
  selectedPermissionList?: PermissionList;
  @ViewChild('permissionListModalComponent') permissionListModalComponent: any;

  // 🔸 Role Modal
  showRoleDialog: boolean = false;
  selectedRole?: Role;
  isEditRoleMode: boolean = false;

  constructor(public permissionModalService: PermissionModalService) {}

  ngOnInit(): void {
    this.showListModal$ = this.permissionModalService.showListModal$;
  }

  ngAfterViewInit(): void {
    const native = document.querySelector('app-admin-layout');
    if (native) {
      (native as any).component = this;
    }
  }

  // ✅ Méthodes Permission List
  setPermissionListModalData(edit: boolean, data?: PermissionList): void {
    this.isEditMode = edit;
    this.selectedPermissionList = data;
  }

  onListUpdated(): void {
    this.isEditMode = false;
    this.selectedPermissionList = undefined;
  }

  get permissionListModalTitle(): string {
    return this.isEditMode
      ? 'Modifier une liste de permissions'
      : 'Créer une nouvelle liste';
  }

  // ✅ Méthodes Role
  setRoleModalData(edit: boolean, role?: Role): void {
    this.isEditRoleMode = edit;
    this.selectedRole = role;
    this.showRoleDialog = true;
  }

  onRoleUpdated(): void {
    this.showRoleDialog = false;
    this.selectedRole = undefined;
    this.isEditRoleMode = false;
  }
}
