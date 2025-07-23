import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-register-modal',
  templateUrl: './user-register-modal.component.html',
  styleUrls: ['./user-register-modal.component.scss']
})
export class UserRegisterModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<void>();
  @Input() visible: boolean = false;


  submitted = false;
  error = '';

  registerForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  get firstname() { return this.registerForm.get('firstname')!; }
  get lastname() { return this.registerForm.get('lastname')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }

  onSubmit(): void {
    this.registerForm.markAllAsTouched(); // ⬅️ ceci force l'affichage des erreurs

    if (this.registerForm.invalid) return;

    const firstname = this.firstname.value!;
    const lastname = this.lastname.value!;
    const email = this.email.value!;
    const password = this.password.value!;

    this.authService.register({ firstname, lastname, email, password }).subscribe({
      next: () => {
        this.submitted = true;
        this.error = '';
        localStorage.setItem('activationEmail', email);
        localStorage.setItem('adminActivation', 'true');
        this.router.navigate(['/activate-account']);
        this.userCreated.emit();
        this.close.emit();
      },
      error: (err: any) => {
        this.submitted = false;
        this.error = err.error?.message || 'Erreur lors de l’inscription';
      }
    });
  }

  onCancel(): void {
    this.close.emit();
  }

  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}
