import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role } from 'src/app/models/role.model';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-assign-single-role-modal',
  templateUrl: './assign-single-role-modal.component.html'
})
export class AssignSingleRoleModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() userId?: number;
  @Input() userName?: string;

  @Output() close = new EventEmitter<void>();
  @Output() roleAssigned = new EventEmitter<void>();

  roles: Role[] = [];
  selectedRoleId?: number;

  constructor(
    private roleService: RoleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.roleService.getAll().subscribe(roles => {
      this.roles = roles;
      console.log("📦 Rôles chargés dans le dropdown :", roles);
    });

  }

  assignRole(): void {
    console.log("🔍 Tentative d'assignation :", {
      userId: this.userId,
      selectedRoleId: this.selectedRoleId,
      roles: this.roles
    });

    if (!this.userId || !this.selectedRoleId) {
      console.error("❌ Paramètres manquants :", this.userId, this.selectedRoleId);
      return;
    }

    Swal.fire({
      title: 'Confirmer l\'assignation',
      text: 'Voulez-vous vraiment assigner ce rôle à cet utilisateur ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, assigner',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc3545'
    }).then(result => {
      if (result.isConfirmed) {
        // ⏳ Appel HTTP d'abord
        this.userService.addRole(this.userId!, this.selectedRoleId!).subscribe(() => {
          this.roleAssigned.emit();
          Swal.fire({
            icon: 'success',
            title: 'Rôle assigné avec succès',
            showConfirmButton: false,
            timer: 1500
          });

          // ✅ Ensuite, fermer proprement le modal
          this.closeModal();
        });
      }
    });
  }

  closeModal(): void {
    this.selectedRoleId = undefined;
    this.close.emit();
  }
}
