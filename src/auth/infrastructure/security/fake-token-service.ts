import { TokenService } from '../../domain/services/token-service';

export class FakeTokenService implements TokenService {
  async sign(userId: string): Promise<string> {
    // Simula la firma de un token usando el userId
    return `signed-token-for-${userId}`;
  }

  async verify(token: string): Promise<{ userId: string; }> {
    // Simula la verificación extrayendo el userId del token
    const match = token.match(/(?:token-for-|signed-token-for-)(.+)/);
    if (match && match[1]) {
      return { userId: match[1] };
    }
    throw new Error('Invalid token');
  }
  async generate(userId: string): Promise<string> {
    return `token-for-${userId}`;
  }
}
