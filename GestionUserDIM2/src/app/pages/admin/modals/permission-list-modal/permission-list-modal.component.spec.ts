import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionListModalComponent } from './permission-list-modal.component';

describe('PermissionListModalComponent', () => {
  let component: PermissionListModalComponent;
  let fixture: ComponentFixture<PermissionListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionListModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
