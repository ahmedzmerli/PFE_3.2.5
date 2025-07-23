import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` 
    <div class="layout-sidebar">
        <div class="sidebar-header">
            <div class="logo-section">
                <div class="logo-wrapper">
                    <i class="pi pi-shield"></i>
                </div>
                <div class="brand-text">
                    <h3>CTI-TOOL</h3>
                    <span>Plateforme d'administration</span>
                </div>
            </div>
        </div>
        <div class="sidebar-content">
            <app-menu></app-menu>
        </div>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}


