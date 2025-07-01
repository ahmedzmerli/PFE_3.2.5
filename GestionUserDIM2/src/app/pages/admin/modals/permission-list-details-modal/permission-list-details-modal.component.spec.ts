import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionListDetailsModalComponent } from './permission-list-details-modal.component';

describe('PermissionListDetailsModalComponent', () => {
  let component: PermissionListDetailsModalComponent;
  let fixture: ComponentFixture<PermissionListDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionListDetailsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionListDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
