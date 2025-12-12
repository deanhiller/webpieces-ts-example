import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentConfig {

  /**
   * Detects if running in cloud/production environment
   * Cloud environments have hostnames like:
   * - dev1.example.com
   * - demo.example.com
   * - app.example.com
   * Local development uses localhost
   */
  isCloud(): boolean {
    return window.location.hostname !== 'localhost';
  }

  /**
   * Returns the base URL for the web client
   * Uses window.location protocol and hostname
   */
  webBaseUrl(): string {
    let fullUrl = `${window.location.protocol}//${window.location.hostname}`;
    if (window.location.port) {
      fullUrl = `${fullUrl}:${window.location.port}`;
    }
    return fullUrl;
  }

  /**
   * Returns the API base URL
   * In production: same as webBaseUrl (same origin)
   * In local dev: maps client port to backend port
   *
   * Port mapping for local development:
   * - Pattern: clientPort + 4000 = serverPort
   * - Works for ANY port number (4200→8200, 4210→8210, 4285→8285, etc.)
   */
  apiBaseUrl(): string {
    const baseUrl = this.webBaseUrl();

    // Production: same origin (Cloud Run serves both client and API)
    if (this.isCloud()) {
      return baseUrl;
    }

    // Local development: dynamically calculate backend port
    // Pattern: client port + 4000 = backend port
    const clientPort = parseInt(window.location.port) || 4200;
    const serverPort = clientPort + 4000;

    return `http://localhost:${serverPort}`;
  }
}
