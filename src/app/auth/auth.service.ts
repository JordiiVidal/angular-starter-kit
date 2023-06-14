import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  of,
  from,
  map,
  concat,
  catchError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly token$: Observable<string>;
  private readonly tokenSubject: BehaviorSubject<string>;

  constructor(private jwtHelper: JwtHelperService, private http: HttpClient) {
    this.tokenSubject = new BehaviorSubject<string>('');
    this.token$ = this.tokenSubject.asObservable();
    this.initToken();
  }

  initToken() {
    from(this.jwtHelper.tokenGetter()).subscribe((token) => {
      if (typeof token === 'string') {
        this.tokenSubject.next(token);
      }
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.token$.pipe(
      map((token) => token !== null && !this.jwtHelper.isTokenExpired(token))
    );
  }

  login(email: string, password: string): Observable<boolean> {
    const loginData = { email, password };
    return this.http.post<any>('http://localhost:3000/login', loginData).pipe(
      map((response) => {
        const token = response.token;

        if (token) {
          localStorage.setItem('access_token', token);
          this.tokenSubject.next(token);
          return true;
        } else {
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error en el inicio de sesión:', error);
        return of(false);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.tokenSubject.next('');
  }
}
