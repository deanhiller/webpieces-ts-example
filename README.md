# webpieces-ts-example

Example application demonstrating the use of the [WebPieces TypeScript](https://github.com/deanhiller/webpieces-ts) framework.

## Project Structure

This is an Nx monorepo with the following structure:

```
webpieces-ts-example/
├── libraries/
│   └── apis/                    # Shared API interfaces and types
├── services/
│   └── website/
│       ├── client/              # Angular frontend application
│       └── server/              # Express backend using @webpieces
```

## Dependencies on @webpieces

This example uses the following @webpieces packages:

- `@webpieces/http-server` - HTTP server framework
- `@webpieces/http-routing` - Routing functionality
- `@webpieces/http-filters` - Filter chain for request/response processing
- `@webpieces/http-client` - HTTP client for Angular
- `@webpieces/http-api` - API decorators
- `@webpieces/core-context` - Context management
- `@webpieces/core-meta` - Metadata utilities

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Run the server:

```bash
npx nx serve server
```

Run the client:

```bash
npx nx serve client
```

### Build

Build all projects:

```bash
npx nx run-many --target=build --all
```

Build specific project:

```bash
npx nx build server
npx nx build client
npx nx build apis
```

### Project Graph

View the dependency graph:

```bash
npx nx graph
```

## API Endpoints

The server provides the following endpoints:

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/hello` - Simple hello endpoint

## Architecture

### Libraries

**libraries/apis**: Contains shared TypeScript interfaces and types used by both the client and server. This ensures type safety across the full stack.

### Services

**services/website/server**: Node.js/Express backend application using the WebPieces framework. Demonstrates:
- Dependency injection with InversifyJS
- Controller pattern
- Shared API types
- Integration with @webpieces packages

**services/website/client**: Angular frontend application that consumes the backend API. Demonstrates:
- Type-safe API calls using shared types from `libraries/apis`
- Integration with @webpieces/http-client

## Technologies

- **Nx**: Monorepo management and build system
- **TypeScript**: Type-safe JavaScript
- **Angular**: Frontend framework
- **Express**: Backend web framework
- **InversifyJS**: Dependency injection container
- **WebPieces**: Core framework packages

## License

Apache-2.0
