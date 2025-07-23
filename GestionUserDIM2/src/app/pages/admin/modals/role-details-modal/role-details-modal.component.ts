import {Component, EventEmitter, Input, Output} from '@angular/core';
import { PermissionList } from 'src/app/models/permission-list.model';
import { Permission } from 'src/app/models/permission.model';

@Component({
  selector: 'app-role-details-modal',
  templateUrl: './role-details-modal.component.html',
  styleUrls: ['./role-details-modal.component.scss']
})
export class RoleDetailsModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() permissionLists: PermissionList[] = [];

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  get uniquePermissionLists(): PermissionList[] {
    const seen = new Set<number>();
    return this.permissionLists.filter(pl => {
      if (!pl.id) return false;
      if (seen.has(pl.id)) return false;
      seen.add(pl.id);
      return true;
    });
  }

  getTotalPermissionsCount(): number {
    return this.uniquePermissionLists.reduce((total, pl) => {
      return total + (pl.permissions?.length || 0);
    }, 0);
  }

  getPreviewPermissions(permissions: Permission[]): Permission[] {
    return permissions.slice(0, 3);
  }

  getPermissionLabel(permission: Permission): string {
    return `${permission.feature}.${permission.action}`;
  }
}

