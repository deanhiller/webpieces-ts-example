import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="result-container">
      <h1>API Test Result</h1>

      <div class="result-card" [ngClass]="{'success': !error, 'error': error}">
        <h2>{{ testName }}</h2>

        <div *ngIf="!error" class="success-content">
          <h3>✓ Success!</h3>
          <pre>{{ result | json }}</pre>
        </div>

        <div *ngIf="error" class="error-content">
          <h3>✗ Error</h3>
          <pre>{{ error }}</pre>
        </div>
      </div>

      <button routerLink="/" class="back-button">← Back to Tests</button>

      <div class="flow-diagram">
        <h3>Request Flow:</h3>
        <div class="flow-step">1. Angular Route Resolver</div>
        <div class="arrow">↓</div>
        <div class="flow-step">2. Injectable Service (DI)</div>
        <div class="arrow">↓</div>
        <div class="flow-step">3. API Client (createClient with decorators)</div>
        <div class="arrow">↓</div>
        <div class="flow-step">4. HTTP Request</div>
        <div class="arrow">↓</div>
        <div class="flow-step">5. WebPieces Server (filters → router → controller)</div>
        <div class="arrow">↓</div>
        <div class="flow-step">6. Response</div>
      </div>
    </div>
  `,
  styles: [`
    .result-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    h1 {
      color: #1976d2;
      margin-bottom: 30px;
    }

    .result-card {
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .result-card.success {
      background-color: #e8f5e9;
      border: 2px solid #4caf50;
    }

    .result-card.error {
      background-color: #ffebee;
      border: 2px solid #f44336;
    }

    .result-card h2 {
      margin-top: 0;
      color: #333;
    }

    .success-content h3 {
      color: #4caf50;
      font-size: 24px;
    }

    .error-content h3 {
      color: #f44336;
      font-size: 24px;
    }

    pre {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      color: #333;
      font-size: 14px;
    }

    .back-button {
      padding: 12px 24px;
      background-color: #757575;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .back-button:hover {
      background-color: #616161;
    }

    .flow-diagram {
      margin-top: 40px;
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .flow-diagram h3 {
      margin-top: 0;
      color: #1976d2;
    }

    .flow-step {
      background-color: white;
      padding: 15px;
      margin: 10px 0;
      border-radius: 4px;
      border-left: 4px solid #1976d2;
      font-weight: 500;
    }

    .arrow {
      text-align: center;
      font-size: 24px;
      color: #1976d2;
      margin: 5px 0;
    }
  `]
})
export class TestResultComponent implements OnInit {
  private route = inject(ActivatedRoute);

  testName = '';
  result: unknown = null;
  error: string | null = null;

  ngOnInit() {
    this.route.data.subscribe(routeData => {
      const data = routeData['data'];
      this.testName = data.testName || 'API Test';
      this.result = data.result;
      this.error = data.error;
    });
  }
}
