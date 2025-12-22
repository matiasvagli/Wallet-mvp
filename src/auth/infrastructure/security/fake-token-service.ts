import { TokenService } from '../../domain/services/token-service';

export class FakeTokenService implements TokenService {
  async generate(userId: string): Promise<string> {
    return `token-for-${userId}`;
  }
}
