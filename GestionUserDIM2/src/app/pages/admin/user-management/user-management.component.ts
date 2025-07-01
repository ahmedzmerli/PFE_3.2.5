import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.model';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/role.service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  roles: Role[] = [];
  searchTerm: string = '';
  selectedUser: User | null = null;
  displayEditModal: boolean = false;
  //Assign role
  displayAssignModal = false;
//Assign single role
  displaySingleAssignModal = false;
selectedUserId?: number;
selectedUserName?: string;
displayRegisterModal = false;
  sortField: 'firstname' | 'lastname' | 'email' | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';




  // Filtres
  selectedRoles: Role[] = [];
  enabledFilter: string = ''; // 'true', 'false' ou ''
  lockedFilter: string = '';  // 'true', 'false' ou ''


  selectedRole: any = null;


  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data || [];
        this.applyFilter();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
      }
    });
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe(data => {
      this.roles = data;
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredUsers = this.users.filter(user => {
      const matchesSearch =
        user.firstname.toLowerCase().includes(term) ||
        user.lastname.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);

      const matchesRole = !this.selectedRole || user.roles.some(role => role.name === this.selectedRole.name);


      const matchesEnabled =
        this.enabledFilter === '' || user.enabled === (this.enabledFilter === 'true');

      const matchesLocked =
        this.lockedFilter === '' || user.accountLocked === (this.lockedFilter === 'true');

      return matchesSearch && matchesRole && matchesEnabled && matchesLocked;
    });
    this.currentPage = 0;

    // ⬇️ Tri après filtrage
    if (this.sortField) {
      this.filteredUsers.sort((a: any, b: any) => {
        const valA = (a[this.sortField] || '').toLowerCase();
        const valB = (b[this.sortField] || '').toLowerCase();

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }


  openEdit(user: User): void {
    this.selectedUser = { ...user };
    this.displayEditModal = true;
  }

  saveUser(): void {
    if (this.selectedUser && this.selectedUser.id) {
      this.userService.update(this.selectedUser.id, this.selectedUser).subscribe(() => {
        this.loadUsers();
        this.selectedUser = null;
        this.displayEditModal = false; // ✅ Fermer le modal après édition
      });
    }
  }


  deleteUser(userId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera définitivement cet utilisateur.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(userId).subscribe(() => {
          this.loadUsers();
          Swal.fire({
            title: 'Supprimé',
            text: 'Utilisateur supprimé avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }


  toggleRole(user: User, role: Role): void {
    if (this.hasRole(user, role)) {
      this.userService.removeRole(user.id!, role.id!).subscribe(() => this.loadUsers());
    } else {
      this.userService.addRole(user.id!, role.id!).subscribe(() => this.loadUsers());
    }
  }

  hasRole(user: User, role: Role): boolean {
    return !!user.roles.find(r => r.id === role.id);
  }

  resendActivation(email: string): void {
    this.userService.resendToken(email).subscribe({
      next: () => {
        localStorage.setItem('activationEmail', email);
        this.router.navigate(['/activate-account']);
      },
      error: (err) => alert('Erreur : ' + err.message)
    });
  }
  saveUserFromModal(user: User): void {
    if (user.id) {
      this.userService.update(user.id, user).subscribe(() => {
        this.loadUsers();
        this.displayEditModal = false;
        this.selectedUser = null;
      });
    }
  }

  openAssignRoleModal(user: User): void {
    this.selectedUserId = user.id!;
    this.selectedUserName = `${user.firstname} ${user.lastname}`;
    this.displaySingleAssignModal = true;
  }


  currentPage = 0;
itemsPerPage = 5;

get paginatedUsers(): User[] {
  const start = this.currentPage * this.itemsPerPage;
  return this.filteredUsers.slice(start, start + this.itemsPerPage);
}

onPageChange(event: any): void {
  this.currentPage = event.page;
}

openRegisterModal(): void {
  this.displayRegisterModal = true;
}
  removeRole(userId: number, roleId: number): void {
    Swal.fire({
      title: 'Retirer le rôle ?',
      text: 'Cette action supprimera le rôle de cet utilisateur.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, retirer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.removeRole(userId, roleId).subscribe(() => {
          this.loadUsers();
          Swal.fire({
            icon: 'success',
            title: 'Rôle retiré',
            showConfirmButton: false,
            timer: 1500
          });
        });
      }
    });
  }




  sortBy(field: 'firstname' | 'lastname' | 'email'): void {
    if (this.sortField === field) {
      // Inverse le sens
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilter();
  }


}
