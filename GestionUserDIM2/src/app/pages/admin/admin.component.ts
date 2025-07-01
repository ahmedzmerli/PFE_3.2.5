
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Permission } from 'src/app/models/permission.model';
import { PermissionList } from 'src/app/models/permission-list.model';
import { Role } from 'src/app/models/role.model';
import { PermissionService } from 'src/app/services/permission.service';
import { PermissionListService } from 'src/app/services/permission-list.service';
import { RoleService } from 'src/app/services/role.service';
import { PermissionModalService } from 'src/app/services/serviceModals/PermissionModalService';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  // Forms
  permissionForm: FormGroup;
  permissionListForm: FormGroup;
  roleForm: FormGroup;

  // Data
  permissions: Permission[] = [];
  permissionLists: PermissionList[] = [];
  roles: Role[] = [];

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private permissionListService: PermissionListService,
    private roleService: RoleService,
    private permissionModalService: PermissionModalService,
  ) {
    this.permissionForm = this.fb.group({
      feature: ['', Validators.required],
      action: ['', Validators.required],
    });

    this.permissionListForm = this.fb.group({
      name: ['', Validators.required],
      permissionIds: [[], Validators.required],
    });

    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      permissionListIds: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    // this.permissionModalService.showModal$.subscribe(state => {
    //   this.showPermissionModal = state;
    // });

    this.permissionModalService.showModal$.subscribe(state => {
      this.showPermissionModal = state;
    });
    this.permissionModalService.showListModal$.subscribe(state => {
      this.showPermissionListModal = state;
    });
    this.loadPermissions();
    this.loadPermissionLists();
    this.loadRoles();
  }

  showPermissionModal = false;
  loadPermissions(): void {
    this.permissionService.getAll().subscribe(data => this.permissions = data);
  }


  createPermission(): void {
    const { feature, action } = this.permissionForm.value;
    this.permissionService.create({ feature, action }).subscribe(() => {
      this.permissionForm.reset();
      this.loadPermissions();
    });
  }

  showPermissionListModal = false;
  loadPermissionLists(): void {
    this.permissionListService.getAll().subscribe(data => this.permissionLists = data);
  }



  createPermissionList(): void {
    const { name, permissionIds } = this.permissionListForm.value;
    this.permissionListService.create(name, permissionIds).subscribe(() => {
      this.permissionListForm.reset();
      this.loadPermissionLists();
    });
  }

  showRoleModal = false;
  loadRoles(): void {
    this.roleService.getAll().subscribe(data => this.roles = data);
  }

  // assignPermissionListsToRole(): void {
  //   const { roleName, permissionListIds } = this.roleForm.value;
  //   this.roleService.assignPermissionLists(roleName, permissionListIds).subscribe(() => {
  //     this.roleForm.reset();
  //     this.loadRoles();
  //   });
  // }

  getUniquePermissionLists(lists: any[]): any[] {
    const seen = new Set();
    return lists.filter(list => {
      const name = list.name;
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });
  }

}
