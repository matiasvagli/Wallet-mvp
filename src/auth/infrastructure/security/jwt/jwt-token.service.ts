import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../../domain/services/token-service';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(userId: string): Promise<string> {
    return this.jwtService.signAsync({
      sub: userId,
    });
  }

  async verify(token: string): Promise<{ userId: string }> {
    const payload = await this.jwtService.verifyAsync(token);
    return { userId: payload.sub };
  }
}
