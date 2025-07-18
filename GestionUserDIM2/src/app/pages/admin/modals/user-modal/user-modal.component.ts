import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html'
})
export class UserModalComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstname: [this.user?.firstname || '', Validators.required],
      lastname: [this.user?.lastname || '', Validators.required],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      // add more fields if needed
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const updatedUser: User = {
        ...this.user,
        ...this.form.value
      };
      this.save.emit(updatedUser);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
