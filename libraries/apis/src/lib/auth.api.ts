import { ApiInterface, Post, Path } from '@webpieces/http-api';

// ============================================================================
// REQUEST/RESPONSE DTOs
// ============================================================================

export class LoginRequest {
  username?: string;
  password?: string;
}

export class LoginResponse {
  success?: boolean;
  token?: string;
  message?: string;
  user?: {
    id?: number;
    username?: string;
    email?: string;
  };
}

// ============================================================================
// PART 1: API INTERFACE (Pure TypeScript contract)
// ============================================================================

export abstract class LoginApi {
  abstract login(request: LoginRequest): Promise<LoginResponse>;
}

// ============================================================================
// PART 2: API PROTOTYPE (Abstract class with routing decorators)
// ============================================================================

@ApiInterface()
export abstract class LoginApiPrototype implements LoginApi {
  @Post()
  @Path('/api/auth/login')
  login(_request: LoginRequest): Promise<LoginResponse> {
    throw new Error('Method login() must be implemented by subclass');
  }
}
