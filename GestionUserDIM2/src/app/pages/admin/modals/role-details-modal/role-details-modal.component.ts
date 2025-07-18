import {Component, EventEmitter, Input, Output} from '@angular/core';
import { PermissionList } from 'src/app/models/permission-list.model';

@Component({
  selector: 'app-role-details-modal',
  templateUrl: './role-details-modal.component.html'
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

}
