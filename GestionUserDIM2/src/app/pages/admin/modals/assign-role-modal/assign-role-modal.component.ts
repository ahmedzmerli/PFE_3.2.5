import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.model';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/role.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-assign-role-modal',
  templateUrl: './assign-role-modal.component.html'
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
  selectedRoleId!: number;
  searchTerm: string = '';

  constructor(private fb: FormBuilder, private userService: UserService, private roleService: RoleService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      roleId: [null, Validators.required]
    });

    this.userService.getAll().subscribe(users => {
      this.allUsers = users;
      this.filteredUsers = [...users];
    });

    this.roleService.getAll().subscribe(roles => {
      this.roles = roles;
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.selectedUserIds.length === 0) return;

    const roleId = this.form.value.roleId;

    Swal.fire({
      title: 'Confirmer l\'assignation',
      text: `Assigner ce rôle à ${this.selectedUserIds.length} utilisateur(s) ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, assigner',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc3545'
    }).then(result => {
      if (result.isConfirmed) {
        const assignTasks = this.selectedUserIds.map(userId =>
          this.userService.addRole(userId, roleId).toPromise()
        );

        Promise.all(assignTasks).then(() => {
          this.roleAssigned.emit();
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Rôles assignés',
            showConfirmButton: false,
            timer: 1500
          });
        });
      }
    });
  }

  closeModal(): void {
    this.selectedUserIds = [];
    this.searchTerm = '';
    this.form.reset();
    this.close.emit();
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
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
