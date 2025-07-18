import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionListManagementComponent } from './permission-list-management.component';

describe('PermissionListManagementComponent', () => {
  let component: PermissionListManagementComponent;
  let fixture: ComponentFixture<PermissionListManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionListManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionListManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
