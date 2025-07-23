import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [CommonModule],
    template: `
    <div class="layout-footer">
        <div class="footer-content">
            <div class="footer-left">
                <div class="footer-logo">
                    <img src="assets/img/ooredoo-logo.png" alt="Ooredoo" class="footer-logo-img" />
                </div>
                <div class="footer-info">
                    <p class="copyright">&copy; {{ currentYear }} Ooredoo Tunisie</p>
                    <p class="platform-name">Plateforme de gestion centralisée</p>
                </div>
            </div>
            
            <div class="footer-center">
                <div class="footer-links">
                    <a href="#" class="footer-link">Copyright 2025</a>
                    
                    
                </div>
            </div>
            
            <div class="footer-right">
               
            </div>
        </div>
    </div>`
})
export class AppFooter {
    currentYear = new Date().getFullYear();
}

