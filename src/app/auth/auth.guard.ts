import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService
    .isLoggedIn()
    .pipe(map((isAuth) => (Boolean(isAuth) ? false : true)));
};
