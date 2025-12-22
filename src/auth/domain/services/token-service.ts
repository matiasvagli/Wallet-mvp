export interface TokenService {
  generate(userId: string): Promise<string>;
}
