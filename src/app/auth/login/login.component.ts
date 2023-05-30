import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isValidForm!: boolean;
  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.loginForm = this.getForm;
    this.isValidForm = this.loginForm.valid;
    this.formStatusChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get getForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  formStatusChange(): void {
    this.loginForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isValidForm = status === 'VALID';
      });
  }

  onSubmit(): void {
    console.log(this.loginForm);
  }
}
