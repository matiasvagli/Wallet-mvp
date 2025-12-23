export interface TokenService {
  sign(userId: string): Promise<string>;
  verify(token: string): Promise<{ userId: string }>;
}
