import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormControlState,
  FormGroup,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  disabledForm!: boolean;
  private destroy$!: Subject<void>;

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.registerForm = this.getForm;
    this.disabledForm = !this.registerForm.valid;
    this.formStatusChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formStatusChange(): void {
    this.registerForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((s) => (this.disabledForm = s !== 'VALID'));
  }

  get getForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    this.route.navigateByUrl('/');
  }
}
