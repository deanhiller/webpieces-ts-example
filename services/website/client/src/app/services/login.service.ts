import { Injectable } from '@angular/core';
import { LoginApi, LoginRequest, LoginResponse } from 'apis';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private client: LoginApi) {
    console.log('✅ LoginService LATEST VERSION constructor called with injected LoginApi client');
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const request = new LoginRequest();
    request.username = username;
    request.password = password;
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
