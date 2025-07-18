import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDetailsModalComponent } from './role-details-modal.component';

describe('RoleDetailsModalComponent', () => {
  let component: RoleDetailsModalComponent;
  let fixture: ComponentFixture<RoleDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleDetailsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
