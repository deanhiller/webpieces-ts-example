import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login.service';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-api-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './api-demo.component.html',
  styleUrl: './api-demo.component.css'
})
export class ApiDemoComponent implements OnInit {
  private loginService = inject(LoginService);
  private generalService = inject(GeneralService);

  welcomeMessage = '';
  healthStatus = '';
  loginStatus = '';
  isLoading = false;

  async ngOnInit() {
    // Automatically call APIs on component init to demonstrate they work
    await this.callWelcomeApi();
    await this.callHealthApi();
  }

  async callWelcomeApi() {
    this.isLoading = true;
    const response = await this.generalService.getWelcome();
    this.welcomeMessage = `${response.message} (${response.environment}) at ${response.timestamp}`;
    this.isLoading = false;
  }

  async callHealthApi() {
    this.isLoading = true;
    const response = await this.generalService.getHealth();
    this.healthStatus = `${response.status} - Uptime: ${response.uptime}s - ${response.timestamp}`;
    this.isLoading = false;
  }

  async testLogin() {
    this.isLoading = true;
    const response = await this.loginService.login('demo', 'password123');

    if (response.success) {
      this.loginStatus = `✓ Login successful! Token: ${response.token}, User: ${response.user?.username}`;
    } else {
      this.loginStatus = `✗ Login failed: ${response.message}`;
    }
    this.isLoading = false;
  }
}
