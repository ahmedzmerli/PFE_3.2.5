import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GestionUserDIM2';

  constructor(private router: Router, private tokenService: TokenService) {
    if (!this.tokenService.isTokenValid()) {
      this.router.navigate(['/login']);
    }
  }
}
