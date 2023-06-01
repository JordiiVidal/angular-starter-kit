import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  standalone: true,
  styleUrls: ['./auth-form.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AuthFormComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() textButton: String = 'Login';
  @Output() formSubmitted = new EventEmitter<FormGroup>();
  disabledForm!: boolean;
  private destroy$!: Subject<void>;

  constructor() {}

  ngOnInit(): void {
    this.disabledForm = !this.form.valid;
    this.formStatusChange();
    console.log(this.formControls);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formStatusChange(): void {
    this.form.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => (this.disabledForm = status !== 'VALID'));
  }

  get formControls() {
    return Object.keys(this.form.controls);
  }

  getInputType(controlName: string): string {
    switch (controlName) {
      case 'password':
      case 'password2':
        return 'password';
      case 'email':
        return 'email';
      default:
        return 'text';
    }
  }

  onSubmit(): void {
    this.formSubmitted.emit(this.form);
  }
}
