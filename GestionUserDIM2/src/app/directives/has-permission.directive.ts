
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { TokenService } from '../services/token.service';

@Directive({
  standalone: true,
  selector: '[hasPermission]'
})
export class HasPermissionDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private tokenService: TokenService
  ) {}

  @Input() set hasPermission(permission: string) {
    if (this.tokenService.getAuthorities().includes(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
