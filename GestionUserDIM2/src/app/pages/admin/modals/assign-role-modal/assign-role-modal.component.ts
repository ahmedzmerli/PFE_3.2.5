import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.model';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/role.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-assign-role-modal',
  templateUrl: './assign-role-modal.component.html',
  styleUrls: ['./assign-role-modal.component.scss']
})
export class AssignRoleModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() roleAssigned = new EventEmitter<void>();

  form!: FormGroup;
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  selectedUserIds: number[] = [];
  roles: Role[] = [];
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      roleId: [null, Validators.required]
    });

    this.loadData();
  }

  private loadData(): void {
    this.userService.getAll().subscribe(users => {
      this.allUsers = users;
      this.filteredUsers = [...users];
    });

    this.roleService.getAll().subscribe(roles => {
      this.roles = roles;
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    
    if (this.form.invalid || this.selectedUserIds.length === 0) {
      return;
    }

    const roleId = this.form.value.roleId;
    const selectedRole = this.roles.find(r => r.id === roleId);

    Swal.fire({
      title: 'Confirmer l\'assignation',
      html: `
        <div style="text-align: left; margin: 1rem 0;">
          <p><strong>Rôle :</strong> ${selectedRole?.name}</p>
          <p><strong>Utilisateurs :</strong> ${this.selectedUserIds.length}</p>
        </div>
        <p>Voulez-vous vraiment assigner ce rôle à ces utilisateurs ?</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, assigner',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#e60000',
      cancelButtonColor: '#6c757d'
    }).then(result => {
      if (result.isConfirmed) {
        this.performAssignment(roleId);
      }
    });
  }

  private performAssignment(roleId: number): void {
    const assignTasks = this.selectedUserIds.map(userId =>
      this.userService.addRole(userId, roleId).toPromise()
    );

    Promise.all(assignTasks).then(() => {
      this.roleAssigned.emit();
      this.closeModal();
      Swal.fire({
        icon: 'success',
        title: 'Rôles assignés avec succès',
        text: `Le rôle a été assigné à ${this.selectedUserIds.length} utilisateur(s).`,
        showConfirmButton: false,
        timer: 2000
      });
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'assignation des rôles.',
        confirmButtonColor: '#e60000'
      });
    });
  }

  closeModal(): void {
    this.selectedUserIds = [];
    this.searchTerm = '';
    this.filteredUsers = [...this.allUsers];
    this.form.reset();
    this.close.emit();
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredUsers = [...this.allUsers];
      return;
    }

    this.filteredUsers = this.allUsers.filter(user =>
      user.firstname.toLowerCase().includes(term) ||
      user.lastname.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  selectAll(): void {
    this.selectedUserIds = this.filteredUsers.map(user => user.id!);
  }

  deselectAll(): void {
    this.selectedUserIds = [];
  }

  isSelected(id: number): boolean {
    return this.selectedUserIds.includes(id);
  }
}


