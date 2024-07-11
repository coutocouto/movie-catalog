export interface JwtPayload {
  email: string;
}

export interface IJwtService {
  verify(token: string): Promise<any>;
  sign(payload: JwtPayload): string;
  decode(token: string): any;
}
