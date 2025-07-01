import { Component, OnInit, ViewChild , ChangeDetectorRef  } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PermissionListService } from 'src/app/services/permission-list.service';
import { PermissionModalService } from 'src/app/services/serviceModals/PermissionModalService';
import { PermissionList } from 'src/app/models/permission-list.model';
import {Permission} from "../../../models/permission.model";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permission-list-management',
  templateUrl: './permission-list-management.component.html'
})
export class PermissionListManagementComponent implements OnInit {
  permissionLists: PermissionList[] = [];
  filteredLists: PermissionList[] = [];
  selectedLists: PermissionList[] = [];

  showDetailsDialog: boolean = false;
  detailedPermissions: Permission[] = [];


  searchTerm: string = '';
  sortOrder: string = '';
  filterMinPermissions: number = 0;

  showDialog = false;
  isEditMode = false;
  selectedPermissionList?: PermissionList;
  sortField: 'name' | 'count' | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  @ViewChild('dt') dt!: Table;

  constructor(
    private service: PermissionListService,
    private confirmationService: ConfirmationService,
    public permissionModalService: PermissionModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPermissionLists();
  }

  loadPermissionLists(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        this.permissionLists = data;
        this.applyFilter();
      }
    });
  }

  applyFilter(): void {
    this.filteredLists = this.permissionLists
      .filter(list =>
        list.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        list.permissions.length >= this.filterMinPermissions
      );

    // ✅ Tri après filtrage
    if (this.sortField) {
      this.filteredLists.sort((a, b) => {
        const valA = this.sortField === 'name'
          ? a.name.toLowerCase()
          : a.permissions.length;
        const valB = this.sortField === 'name'
          ? b.name.toLowerCase()
          : b.permissions.length;

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }


  onGlobalFilter(event: Event, table: Table) {
    const input = (event.target as HTMLInputElement).value;
    table.filterGlobal(input, 'contains');
  }

  createNewPermissionList(): void {
    this.isEditMode = false;
    this.selectedPermissionList = undefined;
    this.showDialog = true;
  }

  editPermissionList(list: PermissionList): void {
    this.isEditMode = true;
    this.selectedPermissionList = list;
    this.showDialog = true;
  }

  deletePermissionList(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera définitivement cette liste de permissions.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          this.loadPermissionLists();
          Swal.fire({
            title: 'Supprimé',
            text: 'Liste supprimée avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }

  onListUpdated(): void {
    this.showDialog = false;
    this.loadPermissionLists();
  }

  showPermissionListDetails(list: PermissionList): void {
    this.detailedPermissions = list.permissions;
    this.showDetailsDialog = true;
    this.cdr.detectChanges();
  }

  sortBy(field: 'name' | 'count'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilter();
  }


}
