import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role } from 'src/app/models/role.model';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-assign-single-role-modal',
  templateUrl: './assign-single-role-modal.component.html',
  styleUrls: ['./assign-single-role-modal.component.scss']
})
export class AssignSingleRoleModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() userId?: number;
  @Input() userName?: string;

  @Output() close = new EventEmitter<void>();
  @Output() roleAssigned = new EventEmitter<void>();

  roles: Role[] = [];
  selectedRoleId?: number;
  showValidation: boolean = false;

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
    this.showValidation = true;

    console.log("🔍 Tentative d'assignation :", {
      userId: this.userId,
      selectedRoleId: this.selectedRoleId,
      roles: this.roles
    });

    if (!this.userId || !this.selectedRoleId) {
      console.error("❌ Paramètres manquants :", this.userId, this.selectedRoleId);
      return;
    }

    const selectedRole = this.roles.find(r => r.id === this.selectedRoleId);

    Swal.fire({
      title: 'Confirmer l\'assignation',
      html: `
        <div style="text-align: left; margin: 1rem 0;">
          <p><strong>Utilisateur :</strong> ${this.userName}</p>
          <p><strong>Rôle :</strong> ${selectedRole?.name}</p>
        </div>
        <p>Voulez-vous vraiment assigner ce rôle à cet utilisateur ?</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, assigner',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#e60000',
      cancelButtonColor: '#6c757d'
    }).then(result => {
      if (result.isConfirmed) {
        // ⏳ Appel HTTP d'abord
        this.userService.addRole(this.userId!, this.selectedRoleId!).subscribe({
          next: () => {
            this.roleAssigned.emit();
            Swal.fire({
              icon: 'success',
              title: 'Rôle assigné avec succès',
              text: `Le rôle "${selectedRole?.name}" a été assigné à ${this.userName}.`,
              showConfirmButton: false,
              timer: 2000
            });

            // ✅ Ensuite, fermer proprement le modal
            this.closeModal();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de l\'assignation du rôle.',
              confirmButtonColor: '#e60000'
            });
          }
        });
      }
    });
  }

  closeModal(): void {
    this.selectedRoleId = undefined;
    this.showValidation = false;
    this.close.emit();
  }
}

