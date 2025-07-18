import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from './service/layout.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-floating-configurator',
  standalone: true,
  imports: [ButtonModule, StyleClassModule, AppConfigurator],
  template: `
    <div class="fixed flex gap-4 top-8 right-8">
      <p-button type="button"
                (onClick)="toggleDarkMode()"
                [icon]="darkTheme ? 'pi pi-moon' : 'pi pi-sun'"
                [styleClass]="'p-button-rounded'"
                severity="secondary">
      </p-button>

      <div class="relative">
        <p-button icon="pi pi-palette"
                  pStyleClass="@next"
                  enterFromClass="hidden"
                  enterActiveClass="animate-scalein"
                  leaveToClass="hidden"
                  leaveActiveClass="animate-fadeout"
                  [hideOnOutsideClick]="true"
                  type="button"
                  [styleClass]="'p-button-rounded'">
        </p-button>
        <app-configurator/>
      </div>
    </div>
  `
})
export class AppFloatingConfigurator {
  layoutService = inject(LayoutService);
  darkTheme = false;

  ngOnInit() {
    this.layoutService.isDarkTheme$().pipe(take(1)).subscribe(val => this.darkTheme = val);
  }

  toggleDarkMode() {
    this.layoutService.updateConfig({ darkTheme: !this.darkTheme });
    this.darkTheme = !this.darkTheme;
  }
}
