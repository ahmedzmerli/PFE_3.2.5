import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent {
  userEmail: string | null = localStorage.getItem('activationEmail');
  activationForm = this.fb.group({
    token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  message = '';
  error = '';
  loading = false;

  cooldown = 30; // secondes
  canResend = true;
  intervalId: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  get token() {
    return this.activationForm.get('token')!;
  }

  onSubmit(): void {
    if (this.activationForm.invalid) return;

    const token = this.token.value!;
    this.loading = true;

    this.authService.activateAccount(token).subscribe({
      next: () => {
        this.message = '✅ Activation réussie. Redirection vers la page d\'administration...';
        this.error = '';
        const isAdminActivation = localStorage.getItem('adminActivation') === 'true';
setTimeout(() => {
  if (isAdminActivation) {
    this.router.navigate(['/admin/users']);
    localStorage.removeItem('adminActivation');
  } else {
    this.router.navigate(['/login']);
  }
}, 3000);

      },
      error: (err) => {
        this.loading = false;
        this.message = '';
        this.error =
          err.error?.businessErrorDescription ||
          err.error?.error ||
          '❌ Erreur lors de l’activation.';
      },
    });
  }

  resendCode(): void {
    if (!this.userEmail) {
      this.error = 'Email manquant. Merci de vous réinscrire.';
      return;
    }

    this.loading = true;

    this.authService.resendToken(this.userEmail).subscribe({
      next: () => {
        this.message = '📧 Code renvoyé avec succès à votre adresse email.';
        this.error = '';
        this.loading = false;
        this.startCooldown();
      },
      error: (err) => {
        this.message = '';
        this.loading = false;
        this.error =
          err.error?.businessErrorDescription ||
          err.error?.error ||
          '❌ Erreur lors du renvoi du code.';
      }
    });
  }

  startCooldown(): void {
    this.canResend = false;
    this.cooldown = 30;

    this.intervalId = setInterval(() => {
      this.cooldown--;

      if (this.cooldown <= 0) {
        this.canResend = true;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }
}
