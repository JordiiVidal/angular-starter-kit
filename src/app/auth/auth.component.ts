import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: `
    <section class="auth-bg">
      <div class="auth-content">
        <h1>Login</h1>
        <router-outlet></router-outlet>
      </div>
    </section>
  `,
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {}
