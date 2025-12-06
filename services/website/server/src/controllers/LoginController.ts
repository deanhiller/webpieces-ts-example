import { injectable } from 'inversify';
import { Controller, provideSingleton } from '@webpieces/http-routing';
import { LoginApi, LoginRequest, LoginResponse } from 'apis';

@provideSingleton()
@Controller()
export class LoginController implements LoginApi {

  async login(request: LoginRequest): Promise<LoginResponse> {
    console.log('Login attempt:', request.username);

    // Simple validation
    if (!request.username || !request.password) {
      const response = new LoginResponse();
      response.success = false;
      response.message = 'Username and password are required';
      return response;
    }

    // Hardcoded demo credentials
    if (request.username === 'demo' && request.password === 'password123') {
      const response = new LoginResponse();
      response.success = true;
      response.token = 'demo-token-' + Date.now(); // Simple demo token
      response.user = {
        id: 1,
        username: 'demo',
        email: 'demo@example.com'
      };
      return response;
    }

    // Invalid credentials
    const response = new LoginResponse();
    response.success = false;
    response.message = 'Invalid username or password';
    return response;
  }
}
