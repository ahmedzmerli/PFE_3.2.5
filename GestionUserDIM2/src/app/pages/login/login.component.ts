import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']

})
export class LoginComponent {

  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  get email() { return this.form.get('email')!; }
get password() { return this.form.get('password')!; }


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid) return;

    const email = this.form.get('email')?.value || '';
    const password = this.form.get('password')?.value || '';

    this.authService.authenticate({ email, password }).subscribe({
      next: (res: any) => {
        const token = res.token;
        localStorage.setItem('token', token);

        // Décodage du token pour vérifier les rôles
        const decoded: any = jwtDecode(token);
        const roles: string[] = decoded.roles || [];
const isAdmin = roles.includes('ADMIN');
this.router.navigate([isAdmin ? '/admin' : '/home']);

      },
      error: (err: any) => {
        this.error = err.error?.message || 'Erreur d’authentification';
      }
    });
  }


  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);

    if (!control || !control.touched) return '';

    if (control.errors?.['required']) {
      return 'Ce champ est requis';
    }
    if (control.errors?.['email']) {
      return 'Email invalide';
    }
    if (control.errors?.['minlength']) {
      return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    }

    return '';
  }


}
