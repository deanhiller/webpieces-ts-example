import 'reflect-metadata';
import { WebpiecesServer, WebpiecesFactory } from '@webpieces/http-server';
import { ProdServerMeta } from '../src/ProdServerMeta';
import {
  LoginApi,
  LoginApiPrototype,
  LoginRequest,
  LoginResponse,
  GeneralApi,
  GeneralApiPrototype,
  WelcomeRequest,
  WelcomeResponse,
  HealthRequest,
  HealthResponse,
} from 'apis';

/**
 * Integration tests for webpieces-ts-example server.
 *
 * These tests demonstrate:
 * 1. Creating a WebpiecesServer with ProdServerMeta (no overrides needed)
 * 2. Using createApiClient() to test APIs without HTTP
 * 3. Verifying requests flow through the full filter chain:
 *    - ContextFilter (priority 140)
 *    - JsonFilter (priority 60)
 *    - Controller logic
 *
 * This pattern avoids HTTP overhead while testing the complete stack.
 */
describe('Server Integration Tests', () => {
  let server: WebpiecesServer;

  beforeEach(async () => {
    // Create server with production configuration
    // No DI overrides needed - controllers have no external dependencies
    server = await WebpiecesFactory.create(new ProdServerMeta());
  });

  afterEach(async () => {
    if (server) {
      await server.stop();
    }
  });

  describe('LoginApi - Authentication Endpoint', () => {
    let loginApi: LoginApi;

    beforeEach(() => {
      // Create API client proxy (bypasses HTTP, goes through filters)
      loginApi = server.createApiClient<LoginApi>(LoginApiPrototype);
    });

    it('should successfully login with valid credentials', async () => {
      // Arrange
      const request: LoginRequest = {
        username: 'demo',
        password: 'password123',
      };

      // Act - Call through filter chain + controller
      const response: LoginResponse = await loginApi.login(request);

      // Assert
      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.token).toBeDefined();
      expect(response.token).toMatch(/^demo-token-\d+$/);
      expect(response.user).toBeDefined();
      expect(response.user?.id).toBe(1);
      expect(response.user?.username).toBe('demo');
      expect(response.user?.email).toBe('demo@example.com');
      expect(response.message).toBeUndefined();
    });

    it('should reject login with invalid credentials', async () => {
      // Arrange
      const request: LoginRequest = {
        username: 'wrong',
        password: 'wrong123',
      };

      // Act
      const response: LoginResponse = await loginApi.login(request);

      // Assert
      expect(response).toBeDefined();
      expect(response.success).toBe(false);
      expect(response.message).toBe('Invalid username or password');
      expect(response.token).toBeUndefined();
      expect(response.user).toBeUndefined();
    });

    it('should reject login with missing username', async () => {
      // Arrange
      const request: LoginRequest = {
        password: 'password123',
      };

      // Act
      const response: LoginResponse = await loginApi.login(request);

      // Assert
      expect(response).toBeDefined();
      expect(response.success).toBe(false);
      expect(response.message).toBe('Username and password are required');
      expect(response.token).toBeUndefined();
    });

    it('should reject login with missing password', async () => {
      // Arrange
      const request: LoginRequest = {
        username: 'demo',
      };

      // Act
      const response: LoginResponse = await loginApi.login(request);

      // Assert
      expect(response).toBeDefined();
      expect(response.success).toBe(false);
      expect(response.message).toBe('Username and password are required');
      expect(response.token).toBeUndefined();
    });

    it('should reject login with empty credentials', async () => {
      // Arrange
      const request: LoginRequest = {
        username: '',
        password: '',
      };

      // Act
      const response: LoginResponse = await loginApi.login(request);

      // Assert
      expect(response).toBeDefined();
      expect(response.success).toBe(false);
      expect(response.message).toBe('Username and password are required');
    });
  });

  describe('GeneralApi - Welcome Endpoint', () => {
    let generalApi: GeneralApi;

    beforeEach(() => {
      // Create API client proxy for GeneralApi
      generalApi = server.createApiClient<GeneralApi>(GeneralApiPrototype);
    });

    it('should return welcome message with environment info', async () => {
      // Arrange
      const request: WelcomeRequest = {};

      // Act
      const response: WelcomeResponse = await generalApi.welcome(request);

      // Assert
      expect(response).toBeDefined();
      expect(response.message).toBe('Welcome to WebPieces TypeScript Example');
      expect(response.timestamp).toBeDefined();
      expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(response.environment).toBeDefined();
      // In test environment, NODE_ENV may not be set
      expect(['development', 'test', 'production', undefined]).toContain(
        response.environment
      );
    });

    it('should return valid ISO timestamp format', async () => {
      // Arrange
      const request: WelcomeRequest = {};

      // Act
      const response: WelcomeResponse = await generalApi.welcome(request);

      // Assert - Verify timestamp is valid ISO 8601 format
      const timestamp = new Date(response.timestamp!);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });

  describe('GeneralApi - Health Check Endpoint', () => {
    let generalApi: GeneralApi;

    beforeEach(() => {
      generalApi = server.createApiClient<GeneralApi>(GeneralApiPrototype);
    });

    it('should return healthy status with uptime', async () => {
      // Arrange
      const request: HealthRequest = {};

      // Act
      const response: HealthResponse = await generalApi.health(request);

      // Assert
      expect(response).toBeDefined();
      expect(response.status).toBe('healthy');
      expect(response.uptime).toBeDefined();
      expect(typeof response.uptime).toBe('number');
      expect(response.uptime).toBeGreaterThan(0);
      expect(response.timestamp).toBeDefined();
      expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should return increasing uptime on consecutive calls', async () => {
      // Arrange
      const request: HealthRequest = {};

      // Act - Call health endpoint twice
      const response1: HealthResponse = await generalApi.health(request);

      // Wait a bit to ensure uptime increases
      await new Promise(resolve => setTimeout(resolve, 100));

      const response2: HealthResponse = await generalApi.health(request);

      // Assert - Second call should have higher uptime
      expect(response2.uptime).toBeGreaterThanOrEqual(response1.uptime!);
    });
  });

  describe('Filter Chain Verification', () => {
    it('should process multiple requests through filter chain', async () => {
      // This test verifies that filters are properly initialized
      // and can handle multiple sequential requests

      const loginApi = server.createApiClient<LoginApi>(LoginApiPrototype);
      const generalApi = server.createApiClient<GeneralApi>(GeneralApiPrototype);

      // Make multiple requests of different types
      const loginResponse = await loginApi.login({
        username: 'demo',
        password: 'password123',
      });

      const welcomeResponse = await generalApi.welcome({});
      const healthResponse = await generalApi.health({});

      // All should succeed
      expect(loginResponse.success).toBe(true);
      expect(welcomeResponse.message).toBeDefined();
      expect(healthResponse.status).toBe('healthy');
    });

    it('should have access to DI container', () => {
      // Verify we can access the container for advanced testing
      const container = server.getContainer();
      expect(container).toBeDefined();

      // Note: In future tests, you can resolve services from container
      // const someService = container.get<SomeService>(TYPES.SomeService);
    });
  });
});
