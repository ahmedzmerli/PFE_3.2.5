import { Component, OnInit , ChangeDetectorRef  } from '@angular/core';
import { Role } from 'src/app/models/role.model';
import { RoleService } from 'src/app/services/role.service';
import { ConfirmationService } from 'primeng/api';
import { PermissionModalService } from 'src/app/services/serviceModals/PermissionModalService';
import {PermissionList} from "../../../models/permission-list.model";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  roles: Role[] = [];
  filteredRoles: Role[] = [];

  searchTerm: string = '';
  filterMinPermissionLists: number = 0;

  showDetailsDialog: boolean = false;
  detailedPermissionLists: PermissionList[] = [];

  sortField: 'name' | 'permissionLists' | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  resetFilters(): void {
  this.searchTerm = '';
  this.filterMinPermissionLists = 0;
  this.applyFilter();
}



  constructor(
    private roleService: RoleService,
    private confirmationService: ConfirmationService,
    public permissionModalService: PermissionModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: (data) => {
        this.roles = data;
        this.applyFilter();
      },
      error: (err) => console.error('Erreur de chargement des rôles', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRoles = this.roles.filter(role =>
      role.name.toLowerCase().includes(term) &&
      (role.permissionLists?.length || 0) >= this.filterMinPermissionLists
    );
    this.currentPage = 0;
    if (this.sortField) {
      this.filteredRoles.sort((a: any, b: any) => {
        let valA: any, valB: any;

        if (this.sortField === 'permissionLists') {
          valA = a.permissionLists?.length || 0;
          valB = b.permissionLists?.length || 0;
        } else {
          valA = (a[this.sortField] || '').toLowerCase();
          valB = (b[this.sortField] || '').toLowerCase();
        }

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

  }

  deleteRole(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera définitivement ce rôle.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // 🔴 rouge
      cancelButtonColor: '#6c757d', // ⚪ gris
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.delete(id).subscribe(() => {
          this.loadRoles();
          Swal.fire({
            title: 'Supprimé',
            text: 'Le rôle a été supprimé avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }


  createNewRole(): void {
    const layout = (document.querySelector('app-admin-layout') as any)?.component;
    layout?.setRoleModalData(false);
  }

  editRole(role: Role): void {
    const layout = (document.querySelector('app-admin-layout') as any)?.component;
    layout?.setRoleModalData(true, role);
  }

  currentPage = 0;
  itemsPerPage = 5;

  get paginatedRoles(): Role[] {
    const start = this.currentPage * this.itemsPerPage;
    return this.filteredRoles.slice(start, start + this.itemsPerPage);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
  }

  showRolePermissionLists(role: Role): void {
    this.detailedPermissionLists = role.permissionLists || [];
    this.showDetailsDialog = true;
    this.cdr.detectChanges(); // 🔁 force le rendu du dialog
  }


  sortBy(field: 'name' | 'permissionLists'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilter(); // relancer le tri
  }
}
