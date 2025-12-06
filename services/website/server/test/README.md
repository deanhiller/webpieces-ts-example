# Server Integration Tests

This directory contains integration tests for the webpieces-ts-example server.

## Test Philosophy

These are **integration tests**, not unit tests. They:
- Start a real WebpiecesServer instance
- Execute requests through the full filter chain (ContextFilter → JsonFilter → Controller)
- Test business logic end-to-end WITHOUT HTTP overhead
- Use `server.createApiClient<T>()` to bypass HTTP layer

## Running Tests

```bash
# Run all server tests
npx nx test server

# Run tests in watch mode
npx nx test server --watch

# Run with coverage
npx nx test server --coverage

# Run specific test file
npx nx test server --testPathPattern=Integration.spec.ts

# Run single test
npx nx test server --testNamePattern="should successfully login"
```

## Test Structure

```
test/
├── setup/
│   └── testSetup.ts          # Global test setup (reflect-metadata, timeouts)
├── Integration.spec.ts        # Main integration test suite
└── README.md                  # This file
```

## Current Test Coverage

The Integration.spec.ts suite includes 11 tests:

### LoginApi Tests (5 tests)
- ✓ Valid credentials → Success with token and user data
- ✓ Invalid credentials → Failure with error message
- ✓ Missing username → Validation error
- ✓ Missing password → Validation error
- ✓ Empty credentials → Validation error

### GeneralApi Tests (4 tests)
- ✓ Welcome endpoint → Returns message and timestamp
- ✓ Welcome timestamp → Valid ISO 8601 format
- ✓ Health endpoint → Returns status and uptime
- ✓ Health uptime → Increases on consecutive calls

### Filter Chain Tests (2 tests)
- ✓ Multiple requests → All process through filter chain
- ✓ DI container access → Available for advanced testing

## Writing New Tests

### Template: Testing a New API

```typescript
import 'reflect-metadata';
import { WebpiecesServer, WebpiecesFactory } from '@webpieces/server';
import { ProdServerMeta } from '../src/ProdServerMeta';
import {
  YourApi,
  YourApiPrototype,
  YourRequest,
  YourResponse,
} from 'apis';

describe('YourApi Tests', () => {
  let server: WebpiecesServer;
  let yourApi: YourApi;

  beforeEach(async () => {
    // Create server
    server = await WebpiecesFactory.create(new ProdServerMeta());

    // Create API client
    yourApi = server.createApiClient<YourApi>(YourApiPrototype);
  });

  afterEach(async () => {
    if (server) {
      await server.stop();
    }
  });

  it('should do something', async () => {
    // Arrange
    const request: YourRequest = { /* ... */ };

    // Act
    const response: YourResponse = await yourApi.yourMethod(request);

    // Assert
    expect(response).toBeDefined();
    // Add your assertions...
  });
});
```

### Testing with Mocked Dependencies

If your controller has external dependencies (databases, APIs, etc.), use DI overrides:

```typescript
import { ContainerModule } from 'inversify';
import { TYPES } from '../src/types'; // Your DI types

describe('API with Mocked Dependency', () => {
  let server: WebpiecesServer;
  let mockService: MockServiceType;

  beforeEach(async () => {
    // Create mock
    mockService = {
      someMethod: jest.fn().mockResolvedValue({ data: 'mocked' }),
    };

    // Create override module
    const overrides = new ContainerModule(async (options) => {
      const { rebind } = options;
      (await rebind<ServiceInterface>(TYPES.Service))
        .toConstantValue(mockService);
    });

    // Create server with overrides
    server = await WebpiecesFactory.create(new ProdServerMeta(), overrides);
  });

  // ... rest of tests
});
```

## Best Practices

### 1. Arrange-Act-Assert Pattern
Always structure tests in three clear phases:
```typescript
// Arrange: Set up request data
const request: LoginRequest = { username: 'demo', password: 'password123' };

// Act: Call API method
const response: LoginResponse = await loginApi.login(request);

// Assert: Verify response
expect(response.success).toBe(true);
```

### 2. Test One Thing Per Test
Each test should verify one specific behavior:
- ✅ Good: "should reject login with invalid credentials"
- ❌ Bad: "should handle login scenarios" (too vague)

### 3. Clean Up Resources
Always call `server.stop()` in `afterEach`:
```typescript
afterEach(async () => {
  if (server) {
    await server.stop();
  }
});
```
This prevents port conflicts and memory leaks.

### 4. Use Realistic Test Data
- Test with data that mimics real-world scenarios
- Include edge cases (empty strings, null, undefined)
- Test boundary conditions

### 5. Verify Filter Chain Execution
Remember: requests go through the complete filter pipeline:
1. **ContextFilter** (priority 140) - Sets up request context
2. **JsonFilter** (priority 60) - Handles JSON serialization
3. **Controller** - Your business logic

## Debugging Tests

### Run Single Test
```bash
npx nx test server --testNamePattern="should successfully login"
```

### Enable Verbose Output
```bash
npx nx test server --verbose
```

### Debug with Node Inspector
```bash
node --inspect-brk node_modules/.bin/jest --config services/website/server/jest.config.ts --runInBand
```

Then open Chrome DevTools: `chrome://inspect`

### Common Issues

**Problem:** Tests timeout
**Solution:** Increase timeout in testSetup.ts:
```typescript
jest.setTimeout(60000); // 60 seconds
```

**Problem:** `Cannot find module 'apis'`
**Solution:** Check moduleNameMapper in jest.config.ts

**Problem:** `reflect-metadata` errors
**Solution:** Ensure `import 'reflect-metadata'` is at top of test file

**Problem:** Port conflicts
**Solution:** Ensure `afterEach` calls `server.stop()`

## CI/CD Integration

Tests run automatically in CI:
```bash
npx nx test server --configuration=ci
```

This enables:
- Code coverage reporting
- CI-specific timeouts
- JUnit XML output (for CI dashboards)

## Performance Expectations

**Test Execution Time:**
- Single test: ~50-100ms
- Full suite (11 tests): ~1-2 seconds
- With coverage: ~3-4 seconds

**Server Startup:**
- First test: ~200-500ms (DI container initialization)
- Subsequent tests: ~50-100ms (container reuse)

## Next Steps

To add more test coverage:

1. **Add API endpoint tests** as new endpoints are created
2. **Test error handling** for edge cases
3. **Add performance tests** for slow operations
4. **Test filter behavior** explicitly if needed
5. **Mock external services** when dependencies are added

## References

- WebPieces Integration Test Template: `/Users/deanhiller/workspace/personal/webpieces-ts/apps/example-app/test/Integration.spec.ts`
- Jest Documentation: https://jestjs.io/
- NX Testing: https://nx.dev/recipes/jest
