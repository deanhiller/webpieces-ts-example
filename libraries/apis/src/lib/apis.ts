// Shared API interfaces between client and server

export interface WelcomeResponse {
  message: string;
  timestamp: string;
  environment: string;
}

export interface HealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
}

export interface HelloResponse {
  message: string;
  framework: string;
  version: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}
