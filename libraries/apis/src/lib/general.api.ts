import { ApiInterface, Post, Path } from '@webpieces/http-api';

// ============================================================================
// REQUEST/RESPONSE DTOs
// ============================================================================

export class WelcomeResponse {
  message?: string;
  timestamp?: string;
  environment?: string;
}

export class HealthResponse {
  status?: string;
  uptime?: number;
  timestamp?: string;
}

export class WelcomeRequest {
  // No parameters needed for welcome endpoint
}

export class HealthRequest {
  // No parameters needed for health check
}

// ============================================================================
// PART 1: API INTERFACE (Pure TypeScript contract)
// ============================================================================

export abstract class GeneralApi {
  abstract welcome(request: WelcomeRequest): Promise<WelcomeResponse>;
  abstract health(request: HealthRequest): Promise<HealthResponse>;
}

// ============================================================================
// PART 2: API PROTOTYPE (Abstract class with routing decorators)
// ============================================================================

@ApiInterface()
export abstract class GeneralApiPrototype extends GeneralApi {
  @Post()
  @Path('/welcome')
  welcome(_request: WelcomeRequest): Promise<WelcomeResponse> {
    throw new Error('Method welcome() must be implemented by subclass');
  }

  @Post()
  @Path('/api/health')
  health(_request: HealthRequest): Promise<HealthResponse> {
    throw new Error('Method health() must be implemented by subclass');
  }
}
