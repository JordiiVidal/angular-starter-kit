import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  disabledForm!: boolean;
  private destroy$ = new Subject<void>();

  constructor(private route: Router) {}

  ngOnInit(): void {
    this.loginForm = this.getForm;
    this.disabledForm = !this.loginForm.valid;
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
        this.disabledForm = status === 'VALID';
      });
  }

  onSubmit(): void {
    this.route.navigateByUrl('/');
  }
}
