import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegisterModalComponent } from './user-register-modal.component';

describe('UserRegisterModalComponent', () => {
  let component: UserRegisterModalComponent;
  let fixture: ComponentFixture<UserRegisterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRegisterModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
