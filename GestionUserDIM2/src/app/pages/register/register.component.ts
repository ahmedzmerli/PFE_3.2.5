import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  error = '';
  submitted = false;

  registerForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  get firstname() { return this.registerForm.get('firstname')!; }
  get lastname() { return this.registerForm.get('lastname')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { firstname, lastname, email, password } = this.registerForm.value as {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
    };
    

    this.authService.register({ firstname, lastname, email, password }).subscribe({
      next: () => {
        this.submitted = true;
        this.error = '';
        localStorage.setItem('activationEmail', email);
        this.router.navigate(['/activate-account'], { queryParams: { justRegistered: 'true' } });
      },
      error: (err: any) => {
        this.submitted = false;
        this.error = err.error?.message || 'Erreur lors de l’inscription';
      }
    });
  }
}
