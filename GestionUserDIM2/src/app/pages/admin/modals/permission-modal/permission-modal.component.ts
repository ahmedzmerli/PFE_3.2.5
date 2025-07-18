import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/models/permission.model';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-permission-modal',
  templateUrl: './permission-modal.component.html',
})
export class PermissionModalComponent implements OnInit {
  permissions: Permission[] = [];
  newPermission: Permission = { feature: '', action: '' };
  features: string[] = [];
  actions: string[] = [];

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.loadPermissions();
    this.loadDistinctValues();
  }

  loadPermissions() {
    this.permissionService.getAll().subscribe(data => {
      this.permissions = data;
    });
  }

  loadDistinctValues() {
    this.permissionService.getDistinctValues().subscribe(data => {
      this.features = data.features;
      this.actions = data.actions;
    });
  }

  addPermission() {
    if (!this.newPermission.feature || !this.newPermission.action) return;

    this.permissionService.create(this.newPermission).subscribe(() => {
      this.newPermission = { feature: '', action: '' };
      this.loadPermissions();
      this.loadDistinctValues();
    });
  }

  deletePermission(id: number) {
    this.permissionService.delete(id).subscribe(() => {
      this.loadPermissions();
      this.loadDistinctValues();
    });
  }

  searchTerm: string = '';

get filteredPermissions(): Permission[] {
  if (!this.searchTerm) return this.permissions;

  const term = this.searchTerm.toLowerCase();
  return this.permissions.filter(p =>
    p.feature.toLowerCase().includes(term) ||
    p.action.toLowerCase().includes(term)
  );
}


}
