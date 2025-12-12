import { Injectable, inject } from '@angular/core';
import { LoginApi, LoginRequest, LoginResponse } from 'apis';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private client = inject(LoginApi);

  async login(username: string, password: string): Promise<LoginResponse> {
    const request = new LoginRequest();
    request.username = username;
    request.password = password;

    // Call auto-generated client method
    // This reads @Post() @Path('/api/auth/login') from decorators
    // Makes: POST http://localhost:3000/api/auth/login
    return this.client.login(request);
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
