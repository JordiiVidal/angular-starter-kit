import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject, of, from, map, concat } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenGetter$: Observable<string | null>;
  private readonly token$: Observable<string>;
  private readonly tokenSubject: BehaviorSubject<string>;

  constructor(private jwtHelper: JwtHelperService) {
    this.tokenSubject = new BehaviorSubject<string>('');
    this.tokenGetter$ = from(this.jwtHelper.tokenGetter());
    concat(this.tokenGetter$).subscribe((token) => {
      if (typeof token === 'string') {
        this.tokenSubject.next(token);
      }
    });
    this.token$ = this.tokenSubject.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.token$.pipe(
      map((token) => token !== null && !this.jwtHelper.isTokenExpired(token))
    );
  }

  login(email: string, password: string): Observable<boolean> {
    try {
      const token = jwt.sign({ email, password }, 'secretKey', {
        expiresIn: '1h',
      });
      localStorage.setItem('access_token', token);
      this.tokenSubject.next(token);
      return of(true);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      return of(false);
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    this.tokenSubject.next('');
  }
}
