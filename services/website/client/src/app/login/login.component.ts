import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';
  isLoading = false;

  constructor(private loginService: LoginService) {}

  async onSubmit() {
    this.isLoading = true;
    this.message = '';

    try {
      const response = await this.loginService.login(this.username, this.password);

      if (response.success) {
        this.message = `✓ Welcome, ${response.user?.username}!`;

        // Store token
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }

        // Could navigate to dashboard here
        console.log('Login successful, token:', response.token);
      } else {
        this.message = `✗ ${response.message || 'Login failed'}`;
      }
    } catch (error) {
      console.error('Login error:', error);
      this.message = '✗ An error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
