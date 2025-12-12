import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <h1>WebPieces Full Integration Test</h1>
      <p class="subtitle">Testing: Angular DI → Services → API Clients → HTTP → WebPieces Server</p>

      <div class="test-grid">
        <div class="test-card">
          <h2>GET /welcome</h2>
          <p>Tests GeneralApi.welcome() via route resolver</p>
          <button (click)="navigate('/test/welcome')">Test Welcome API</button>
        </div>

        <div class="test-card">
          <h2>GET /api/health</h2>
          <p>Tests GeneralApi.health() via route resolver</p>
          <button (click)="navigate('/test/health')">Test Health API</button>
        </div>

        <div class="test-card">
          <h2>POST /api/auth/login</h2>
          <p>Tests LoginApi.login() via route resolver</p>
          <button (click)="navigate('/test/login')">Test Login API</button>
        </div>
      </div>

      <div class="architecture-info">
        <h3>Full Stack Architecture Test:</h3>
        <ol>
          <li>Click button → Navigate to route</li>
          <li>Route resolver injects service (DI)</li>
          <li>Service injects API client (DI)</li>
          <li>API client uses @webpieces/http-client</li>
          <li>HTTP call to WebPieces server</li>
          <li>Server filters → router → controller</li>
          <li>Response displayed on result page</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    h1 {
      color: #1976d2;
      margin-bottom: 10px;
    }

    .subtitle {
      color: #666;
      font-size: 18px;
      margin-bottom: 40px;
    }

    .test-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .test-card {
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .test-card h2 {
      color: #333;
      margin-top: 0;
      font-size: 20px;
    }

    .test-card p {
      color: #666;
      margin: 10px 0 20px 0;
    }

    button {
      width: 100%;
      padding: 12px 24px;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #1565c0;
    }

    .architecture-info {
      background-color: #e3f2fd;
      border-left: 4px solid #1976d2;
      padding: 20px;
      border-radius: 4px;
    }

    .architecture-info h3 {
      margin-top: 0;
      color: #1976d2;
    }

    .architecture-info ol {
      margin: 10px 0;
      padding-left: 25px;
    }

    .architecture-info li {
      margin: 8px 0;
      color: #333;
    }
  `]
})
export class HomeComponent {
  private router = inject(Router);

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
