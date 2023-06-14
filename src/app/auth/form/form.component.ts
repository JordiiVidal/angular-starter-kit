import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-auth-form',
  templateUrl: './form.component.html',
  standalone: true,
  styleUrls: ['./form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() form!: FormGroup;
  @Input() textButton: String = 'Login';
  @Output() formSubmitted = new EventEmitter<FormGroup>();
  disabledForm: boolean = false;
  private destroy$!: Subject<void>;

  constructor() {
    this.destroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.formStatusChange();
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
